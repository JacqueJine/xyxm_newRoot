<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <panel-group
      :countData="countData"
      @changenum="changenum"
      :schoolList="schoolList"
      :school_all="school_idall"
    />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" id="myCharts1" ref="myCharts1">
          <!-- <h3>昨日任务订单 <span>订单总数：0</span></h3>
          <el-table :data="orderData" border style="width: 100%" height="570">
            <el-table-column prop="order_sn" label="订单编号"></el-table-column>
            <el-table-column prop="user_name" label="姓名" width="150"></el-table-column>
            <el-table-column prop="user_phone" label="手机号" width="130"></el-table-column>
            <el-table-column prop="pay_price" label="订单金额" width="120"></el-table-column>
          </el-table> -->
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <!--  -->
        <div class="chart-wrapper">
          <div class="selDay">
            <span :class="sel == 0 ? 'act' : ''" @click="changDay(0)"
              >今日</span
            >
            <span :class="sel != 0 ? 'act' : ''" @click="changDay(1)"
              >昨日</span
            >
          </div>
          <div
            class="chart-wrapper"
            style="height: 350px"
            id="myCharts2"
            ref="myCharts2"
          ></div>

          <!-- <h3>昨日发帖 <span>发帖总数：0</span></h3>
          <el-table :data="applyData" border style="width: 100%" height="570">
            <el-table-column prop="order" label="订单编号"></el-table-column>
            <el-table-column prop="username" label="姓名" width="150"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
          </el-table> -->
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" id="myCharts3" ref="myCharts3"></div>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 32px">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <h3>待办</h3>
          <div class="selDay">
            <span
              :class="daiban == index ? 'act' : ''"
              v-for="(item, index) in daibanList"
              :key="index"
              @click="changBan(index)"
              >{{ item }}</span
            >
          </div>
          <el-table
            :data="applyData"
            border
            style="width: 100%"
            max-height="500"
            v-loading="listLoading"
          >
            <el-table-column
              prop="name"
              label="姓名"
              min-width="150"
            ></el-table-column>
            <el-table-column label="内容" min-width="300" v-if="daiban == 1">
              <template slot-scope="scope">
                {{ scope.row.text ? scope.row.text : "" }}
              </template>
            </el-table-column>
            <el-table-column label="时间" min-width="200">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <el-tooltip
                  class="item"
                  :content="
                    scope.row.create_time
                      ? scope.row.create_time
                      : scope.row.user_attestation.create_time
                      ? scope.row.user_attestation.create_time
                      : ''
                  "
                  placement="top"
                >
                  <span v-if="scope.row.create_time">
                    {{ new Date(scope.row.create_time).getTime() | changeTime }}
                  </span>
                  <span v-if="scope.row.user_attestation.create_time">
                    {{
                      new Date(scope.row.user_attestation.create_time).getTime()
                        | changeTime
                    }}
                  </span>
                </el-tooltip>
                <!-- {{
                  scope.row.create_time
                    ? scope.row.create_time
                    : scope.row.user_attestation.create_time
                    ? scope.row.user_attestation.create_time
                    : ""
                }} -->
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="130">
              <el-button size="mini" type="primary" @click="toPage"
                >更多</el-button
              >
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelGroup from "@/components/Dashboard/PanelGroup";
import PieChart from "@/components/Dashboard/PieChart";

import { HomePage, adminSchoolList } from "@/api/index";
import echarts from "echarts";
export default {
  name: "Dashboard",
  components: { PanelGroup, PieChart },
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      // school_count
      countData: {
        user_count: 0,
        club_count: 0,
        posts_count: 0,
        task_count: 0,
        user_sum_pay: 0,
      },
      listLoading: false,
      school_id: [],
      school_idall: [],
      applyData: [],
      options1: "",
      options2: "",
      options3: "",
      sel: 0,
      daiban: 0,
      // , "提现申请"
      daibanList: ["实名申请", "反馈建议"],
      myCharts1: "",
      myCharts2: "",
      myCharts3: "",
      schoolList: [],
      task_week_count: "",
      task_order_week_count: "",
      day_over_count: "",
    };
  },
  created() {},
  mounted() {
    adminSchoolList().then((res) => {
      if (res.code == 200) {
        this.schoolList = res.result;
        res.result.map((item) => {
          this.school_id.push(item.id);
          this.school_idall.push(item.id);
        });
        this.fetchData();
      }
    });
    window.onresize = () => {
      this.myCharts1.resize();
      this.myCharts2.resize();
      this.myCharts3.resize();
    };
  },
  methods: {
    toPage() {
      if (this.daiban == 0) {
        this.$router.push({ path: "/user/realNameAudit" });
      } else if (this.daiban == 1) {
        this.$router.push({ path: "/user/feedback" });
      } else if (this.daiban == 2) {
        this.$router.push({ path: "/withdrawal/audit" });
      }
    },
    changBan(index) {
      this.daiban = index;
      this.fetchData();
    },
    changDay(index) {
      this.sel = index;
      this.fetchData();
    },
    getchart() {
      // 任务
      this.myCharts1 = echarts.init(this.$refs.myCharts1);
      this.options1 = {
        title: {
          text: "任务数量",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["快递", "跑腿", "其他"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "上周日",
            "周一",
            "周二",
            "周三",
            "周四",
            "周五",
            "周六",
            "周日",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "快递",
            type: "line",
            stack: "总量",
            data: this.task_week_count.express_count,
          },
          {
            name: "跑腿",
            type: "line",
            stack: "总量",
            data: this.task_week_count.errand_count,
          },
          {
            name: "其他",
            type: "line",
            stack: "总量",
            data: this.task_week_count.else_count,
          },
        ],
      };
      this.myCharts1.setOption(this.options1);

      // 已完成任务
      this.myCharts2 = echarts.init(this.$refs.myCharts2);
      this.options2 = {
        title: {
          text: "已完成任务",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["跑腿", "快递", "其他"],
        },
        series: [
          {
            name: "总数",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.day_over_count,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.myCharts2.setOption(this.options2);
      // 交易金额
      this.myCharts3 = echarts.init(this.$refs.myCharts3);
      this.options3 = {
        title: {
          text: "交易金额",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["快递", "跑腿", "其他"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "上周日",
            "周一",
            "周二",
            "周三",
            "周四",
            "周五",
            "周六",
            "周日",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "快递",
            type: "line",
            stack: "总金额",
            data: this.task_order_week_count.express_count,
          },
          {
            name: "跑腿",
            type: "line",
            stack: "总金额",
            data: this.task_order_week_count.errand_count,
          },
          {
            name: "其他",
            type: "line",
            stack: "总金额",
            data: this.task_order_week_count.else_count,
          },
        ],
      };
      this.myCharts3.setOption(this.options3);
    },
    changenum(val) {
      this.school_id = [val];
      this.fetchData();
    },
    // 获取列表
    fetchData() {
      this.listLoading = true;
      HomePage(
        this.$qs.stringify({
          school_id: this.school_id,
          day_type: this.sel + 1,
          state: this.daiban + 1,
        })
      ).then((res) => {
        this.applyData = res.result.list.list;
        this.day_over_count = res.result.day_over_count;
        this.countData = res.result.school_count;
        this.task_week_count = res.result.task_week_count;
        this.task_order_week_count = res.result.task_order_week_count;
        this.getchart();
        this.listLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.chart-wrapper {
  padding: 25px 20px;
  height: 480px;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.selDay {
  display: flex;
  align-items: center;
}
.selDay span {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 5px 15px;
  margin: 0 20px 20px 0;
  cursor: pointer;
}
.selDay .act {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.selDay span:last-of-type {
  margin: 0 0 20px 0;
}
</style>
