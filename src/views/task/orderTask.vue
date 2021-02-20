<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="formData.school_id"
        placeholder="请输入学校名称"
        clearable
        filterable
        remote
        reserve-keyword
        :remote-method="getSchool"
        :loading="loadings"
        style="width: 240px"
        size="small"
        class="input"
      >
        <el-option
          v-for="(item, index) in schoolList"
          :key="index"
          :label="item.school_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="formData.type"
        placeholder="任务类型"
        clearable
        style="width: 120px"
        size="small"
        class="input"
      >
        <el-option
          v-for="(item, index) in classType"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="formData.task_state"
        placeholder="任务状态"
        clearable
        style="width: 120px"
        size="small"
        class="input"
      >
        <el-option
          v-for="(item, index) in stateList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1)"
        >查询</el-button
      >
      <!-- <el-button size="small" class="input" @click="delData()" type="danger"
        >批量删除</el-button
      > -->
      <!-- <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        >导出</el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      height="650"
      fit
      @row-dblclick="toDetail"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column fixed type="selection"></el-table-column> -->
      <el-table-column align="center" width="60" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="学校" width="210" align="center">
        <template slot-scope="scope">{{
          scope.row.school.school_name
        }}</template>
      </el-table-column>
      <el-table-column label="任务标题" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="用户手机号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.user_phone }}</template>
      </el-table-column>
      <el-table-column label="任务类型" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.type == 1
                ? ''
                : scope.row.type == 2
                ? 'danger'
                : scope.row.type == 3
                ? 'success'
                : ''
            "
            size="mini"
            effect="plain"
          >
            {{
              scope.row.type == 1
                ? "快递"
                : scope.row.type == 2
                ? "跑腿"
                : scope.row.type == 3
                ? "其他"
                : ""
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="
              scope.row.task_state == 0
                ? 'danger'
                : scope.row.task_state == 1
                ? ''
                : scope.row.task_state == 2
                ? 'warning'
                : scope.row.task_state == 3
                ? 'info'
                : scope.row.task_state == 4
                ? 'success'
                : ''
            "
            >{{
              scope.row.task_state == 0
                ? "待接单"
                : scope.row.task_state == 1
                ? "进行中"
                : scope.row.task_state == 2
                ? "待结算"
                : scope.row.task_state == 3
                ? "已取消"
                : scope.row.task_state == 4
                ? "已完成"
                : ""
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="赏金" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.money }}</template>
      </el-table-column>
      <el-table-column label="加急" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.is_urgent ? scope.row.urgent_price : "不加急"
        }}</template>
      </el-table-column>
      <el-table-column label="预付" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.is_good_prepay ? scope.row.good_prepay : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="支付金额" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" width="220">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            :content="scope.row.create_time"
            placement="top"
          >
            <span><i class="el-icon-time" /> {{
              new Date(scope.row.create_time).getTime() | changeTime
            }}</span>
          </el-tooltip>
          <!-- <p>{{ scope.row.create_time }}</p> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="'/task/taskEdit/' + row.id">
                  详情</router-link
                >
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <a @click="delData(row.id)">删除</a>
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="任务详情" :visible.sync="detailBox">
      <div style="width: 100%; max-height: 500px; overflow-y: scroll">
        <el-tabs
          type="border-card"
          v-loading="formLoading"
          style="background: #f6f6f6"
        >
          <el-tab-pane label="基本信息">
            <div v-if="!formLoading">
              <div class="cards">
                <el-row style="margin-bottom: 20px">
                  <el-col :span="22" :offset="1">
                    <span class="taskType">{{
                      form.type == 1
                        ? "快递帮"
                        : form.type == 2
                        ? "校园跑腿"
                        : "其他任务"
                    }}</span>
                    <span class="school">
                      {{ form.school ? form.school.school_name : "" }}
                    </span>
                    <span class="taskLabel">状态：</span>
                    <span
                      class="status"
                      :style="{
                        color:
                          form.task_state == 0
                            ? '#3176F8'
                            : form.task_state == 1
                            ? '#FEC200'
                            : form.task_state == 2
                            ? '#3176F8'
                            : form.task_state == 3
                            ? '#FF3939'
                            : '#00C85B',
                      }"
                    >
                      {{
                        form.task_state == 0
                          ? "待接单"
                          : form.task_state == 1
                          ? "进行中"
                          : form.task_state == 2
                          ? "待结算"
                          : form.task_state == 3
                          ? "已取消"
                          : form.task_state == 4
                          ? "已完成"
                          : ""
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">发布人</div>
                  </el-col>
                  <el-col :span="22" class="taskV">
                    {{ form.user.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                      form.user.phone
                    }}
                  </el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">任务标题</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{ form.title }}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">收货人</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{ form.user_name }}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">手机号</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    form.user_phone
                  }}</el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">赏金</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{ form.money }}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">加急</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    form.is_urgent ? form.urgent_price : "不加急"
                  }}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">预付</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    form.is_good_prepay ? form.good_prepay : "无"
                  }}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">支付金额</div>
                  </el-col>
                  <el-col :span="22" class="taskV">
                    {{ form.price }}
                  </el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="2">
                    <div class="taskLabel">任务手续费</div>
                  </el-col>
                  <el-col :span="22" class="taskV">
                    {{ form.good_prepay_price ? form.good_prepay_price : "无" }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2">
                    <div class="taskLabel">手续费利率</div>
                  </el-col>
                  <el-col :span="22" class="taskV">
                    {{ form.good_prepay_rate + "%" }}
                  </el-col>
                </el-row>
              </div>
              <div class="cards">
                <el-row>
                  <el-col :span="2">
                    <div class="taskLabel">接单人</div>
                  </el-col>
                  <el-col :span="22" class="taskV"
                    >{{
                      form.task_order && form.task_order.pick_user
                        ? form.task_order.pick_user.name
                        : ""
                    }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                      form.task_order && form.task_order.pick_user
                        ? form.task_order.pick_user.phone
                        : ""
                    }}</el-col
                  >
                </el-row>
              </div>
              <div class="cards">
                <el-row class="row" v-if="form.type != 1">
                  <el-col :span="2">
                    <div class="taskLabel">取件地点</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    form.task_address
                  }}</el-col>
                </el-row>
                <el-row class="row" v-if="form.type != 1">
                  <el-col :span="2">
                    <div class="taskLabel">送件地点</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    form.destination
                  }}</el-col>
                </el-row>
                <el-row class="row" v-if="form.type != 1">
                  <el-col :span="2">
                    <div class="taskLabel">送件时间</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    "" + form.destination_time
                  }}</el-col>
                </el-row>
                <el-row class="row" v-if="form.type != 1">
                  <el-col :span="2">
                    <div class="taskLabel">任务内容</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{
                    form.express_desc
                  }}</el-col>
                </el-row>
                <el-row class="row" v-if="form.type != 3">
                  <el-col :span="2">
                    <div class="taskLabel">备注</div>
                  </el-col>
                  <el-col :span="22" class="taskV">{{ form.comment }}</el-col>
                </el-row>
                <el-row class="row" v-if="form.type != 3">
                  <el-col :span="2">
                    <div class="taskLabel">快递信息</div>
                  </el-col>
                  <el-col :span="22" class="taskV">
                    <el-table
                      :data="form.task_details"
                      border
                      style="width: 642px"
                    >
                      <el-table-column
                        prop="task_address"
                        label="取件地点"
                        width="180"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="destination"
                        label="送件地点"
                        width="180"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="express_desc"
                        label="送件信息"
                        width="280"
                      ></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="举报列表">
            <div class="cards">
              <el-row style="padding-left: 20px">
                <el-table :data="form.task_inform" style="width: 640px">
                  <el-table-column label="举报人" width="180">
                    <template slot-scope="scope">
                      {{ scope.row.user.name }}
                    </template>
                  </el-table-column>
                  <el-table-column label="举报人手机号" width="180">
                    <template slot-scope="scope">
                      {{ scope.row.user.phone }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="inform"
                    label="举报内容"
                    width="280"
                  ></el-table-column>
                </el-table>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <el-pagination
      style="padding: 32px 16px"
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 20, 50]"
      @size-change="sizeChange"
      @prev-click="fetchData"
      @current-change="fetchData"
      @next-click="fetchData"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getSchoolList } from "@/api/school";
import { getTaskLists, getTaskInfo } from "@/api/order";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      detailBox: false,
      list: null,
      total: 1,
      limit: 10,
      formLoading: true,
      listLoading: false,
      downloadLoading: false,
      schoolList: [],
      loadings: false,
      classType: [
        { id: null, name: "全部任务" },
        { id: 1, name: "快递帮" },
        { id: 2, name: "校园跑腿" },
        { id: 3, name: "其他" },
      ],
      stateList: [
        { id: null, name: "全部状态" },
        { id: 0, name: "待接单" },
        { id: 1, name: "进行中" },
        { id: 2, name: "待结算" },
        { id: 3, name: "已取消" },
        { id: 4, name: "已完成" },
      ],
      formData: {
        type: null,
        task_state: null,
        school_id: null,
      },
      form: {},
      multipleSelection: [],
    };
  },
  created() {
    this.fetchData(1);
  },
  methods: {
    // 获取单个
    getData(id) {
      getTaskInfo(this.$qs.stringify({ id: id })).then((res) => {
        this.form = res.result;
        this.formLoading = false;
      });
    },
    toDetail(row, e) {
      this.form = {};
      this.formLoading = true;
      this.detailBox = true;
      this.getData(row.id);
    },
    getSchool(query) {
      if (query !== "") {
        this.loadings = true;
        getSchoolList(
          this.$qs.stringify({
            where: { school_name: query },
            page: 1,
            limit: 10,
          })
        ).then((res) => {
          this.loadings = false;
          this.schoolList = res.result.data;
        });
      } else {
        this.schoolList = [];
      }
    },
    sizeChange(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除
    delData(id) {
      let val = this.multipleSelection;
      let ids = [];
      // 是否单个
      if (!id) {
        if (!val.length) {
          this.$message({
            type: "warning",
            message: "请选择操作项",
          });
          return;
        } else {
          for (const key in val) {
            if (val.hasOwnProperty(key)) {
              ids.push(val[key].id);
            }
          }
        }
      } else {
        ids.push(id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delCourseOrder(
            this.$qs.stringify({
              id: ids,
            })
          ).then((res) => {
            this.fetchData(1);
            this.$message({
              type: "success",
              message: res.message,
            });
          });
        })
        .catch(() => {});
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["课程名称", "姓名", "手机号", "订单金额", "支付时间"];
        const filterVal = [
          "course_name",
          "user_name",
          "user_phone",
          "pay_price",
          "pay_time",
        ];
        const data = filterVal;
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "试听订单",
        });
        this.downloadLoading = false;
      });
    },
    // 获取列表
    fetchData(page) {
      this.listLoading = true;
      getTaskLists(
        this.$qs.stringify({
          where: this.formData,
          page: page,
          limit: this.limit,
        })
      ).then((res) => {
        this.list = res.result.data;
        this.total = res.result.count;
        this.listLoading = false;
      });
    },
  },
};
</script>
<style scoped>
.input {
  margin-bottom: 15px;
}
.el-dropdown-link {
  cursor: pointer;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.taskType {
  font-size: 12px;
  line-height: 25px;
  padding: 0 21px;
  display: inline-block;
  border-radius: 2px;
  background: #FEC200;
}
.taskLabel {
  color: rgba(51, 51, 51, 0.6);
  font-size: 12px;
  text-align: right;
}
.row {
  /* height: 14px; */
  line-height: 14px;
  margin-bottom: 16px;
}
.taskV {
  padding-left: 20px;
  color: #333;
  font-size: 12px;
  font-weight: 500;
}
.cards {
  padding: 20px 0;
  background: #fff;
  margin-bottom: 15px;
}
.school {
  margin: 0 20px;
  font-size: 12px;
}
.status {
  font-size: 12px;
}
</style>
