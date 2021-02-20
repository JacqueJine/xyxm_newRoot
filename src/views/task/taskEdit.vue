<template>
  <div class="app-container">
    <el-tabs type="border-card" v-loading="formLoading" style="background:#f6f6f6">
      <el-tab-pane label="基本信息">
        <div v-if="!formLoading">
          <div class="cards">
            <el-row style="margin-bottom:20px;">
              <el-col :span="22" :offset="1">
                <span class="taskType">{{
                  form.type == 1
                    ? "快递帮"
                    : form.type == 2
                    ? "校园跑腿"
                    : "其他任务"
                }}</span>
                <span class="school">
                  {{ form.school.school_name }}
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
              <el-col :span="22" class="taskV">{{ form.user_phone }}</el-col>
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
                >{{ form.task_order.pick_user.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                  form.task_order.pick_user.phone
                }}</el-col
              >
            </el-row>
          </div>
          <div class="cards">
            <el-row class="row" v-if="form.type != 1">
              <el-col :span="2">
                <div class="taskLabel">取件地点</div>
              </el-col>
              <el-col :span="22" class="taskV">{{ form.task_address }}</el-col>
            </el-row>
            <el-row class="row" v-if="form.type != 1">
              <el-col :span="2">
                <div class="taskLabel">送件地点</div>
              </el-col>
              <el-col :span="22" class="taskV">{{ form.destination }}</el-col>
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
              <el-col :span="22" class="taskV">{{ form.express_desc }}</el-col>
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
                <el-table :data="form.task_details" border style="width: 642px">
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
</template>

<script>
import { getTaskInfo } from "@/api/order";

import Tinymce from "@/components/Tinymce";
export default {
  components: { Tinymce },
  data() {
    return {
      formLoading: true,
      form: {},
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.getData(id);
  },
  methods: {
    // 获取单个
    getData(id) {
      getTaskInfo(this.$qs.stringify({ id: id })).then((res) => {
        this.form = res.result;
        this.formLoading = false;
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
/deep/ .el-upload {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
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

