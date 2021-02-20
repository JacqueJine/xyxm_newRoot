<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="formData.phone"
        placeholder="手机号"
        style="width: 200px"
        size="small"
        class="input"
        @keyup.enter.native="fetchData(1)"
      />
      <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1)"
        >查询</el-button
      >
      <el-button
        v-if="auth == 1"
        size="small"
        class="input"
        @click="delData()"
        type="danger"
        >批量删除</el-button
      >
      <!-- <el-button
        size="small"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        >导出</el-button
      > -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      height="650"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="auth == 1"
        fixed
        type="selection"
      ></el-table-column>
      <!-- <el-table-column align="center" width="55" label="更多"  type="expand">
        <template slot-scope="scope">
          <p>性别：{{ scope.row.sex.text }}</p>
        </template>
      </el-table-column> -->
      <el-table-column align="center" width="55" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.sex.text }}</template>
      </el-table-column>
      <el-table-column label="实名" width="70" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.is_real.text }}</p>
        </template>
      </el-table-column>
      <el-table-column label="身份" width="70" align="center">
        <template slot-scope="scope">
          <p v-if="!scope.row.is_rider.code && !scope.row.is_store.code">
            <el-tag size="mini" type="info">普通</el-tag>
          </p>
          <p>
            <el-tag v-if="scope.row.is_rider.code" size="mini" type="danger">{{
              scope.row.is_rider.text
            }}</el-tag>
          </p>
          <p>
            <el-tag v-if="scope.row.is_store.code" size="mini" type="success">{{
              scope.row.is_store.text
            }}</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone ? scope.row.phone : "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          {{ scope.row.wallet }}
        </template>
      </el-table-column>
      <el-table-column label="盈利" align="center">
        <template slot-scope="scope">
          {{ scope.row.profit }}
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="scope">
          {{ scope.row.integral }}
        </template>
      </el-table-column>
      <el-table-column label="信誉" align="center">
        <template slot-scope="scope">
          {{ scope.row.credit }}
        </template>
      </el-table-column>
      <el-table-column label="订单量" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.order.count">{{ scope.row.order.count }}</span>
          <el-dropdown v-if="scope.row.order.count" trigger="click">
            <span class="el-dropdown-link">
              {{ scope.row.order.count }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in scope.row.order.list"
                :key="index"
                class="clearfix"
              >
                <span
                  v-if="item.count != 0"
                  @click="openTable(item.model, scope.row.id, item.status)"
                >
                  {{ item.name }}
                  <el-badge class="mark" :value="item.count" />
                </span>
                <span v-else>
                  {{ item.name }}
                  <el-badge class="mark" :value="item.count" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="发布量" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.release.count">{{
            scope.row.release.count
          }}</span>
          <el-dropdown v-if="scope.row.release.count" trigger="click">
            <span class="el-dropdown-link">
              {{ scope.row.release.count }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in scope.row.release.list"
                :key="index"
                class="clearfix"
              >
                <span
                  v-if="item.count != 0"
                  @click="openTable(item.model, scope.row.id, item.type)"
                >
                  {{ item.name }}
                  <el-badge class="mark" :value="item.count" />
                </span>
                <span v-else>
                  {{ item.name }}
                  <el-badge class="mark" :value="item.count" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="接单量" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.accept.count">{{
            scope.row.accept.count
          }}</span>
          <el-dropdown v-if="scope.row.accept.count" trigger="click">
            <span class="el-dropdown-link">
              {{ scope.row.accept.count }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in scope.row.accept.list"
                :key="index"
                class="clearfix"
              >
                <span
                  v-if="item.count != 0"
                  @click="openTable(item.model, scope.row.id, item.type)"
                >
                  {{ item.name }}
                  <el-badge class="mark" :value="item.count" />
                </span>
                <span v-else>
                  {{ item.name }}
                  <el-badge class="mark" :value="item.count" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="总消费" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.pays.total">{{ scope.row.pays.total }}</span>
          <el-dropdown v-if="scope.row.pays.total" trigger="click">
            <span class="el-dropdown-link">
              {{ scope.row.pays.total }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in scope.row.pays.list"
                :key="index"
                class="clearfix"
              >
                <span
                  v-if="item.total != 0"
                  @click="openTable(item.model, scope.row.id, item.status)"
                >
                  {{ item.name }}
                  <el-badge class="mark" :value="item.total" />
                </span>
                <span v-else>
                  {{ item.name }}
                  <el-badge class="mark" :value="item.total" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status.code" size="mini" type="success"
            >正常</el-tag
          >
          <el-tag v-else size="mini" type="danger">黑名单</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学校" width="180" align="center">
        <template slot-scope="scope">{{
          scope.row.school ? scope.row.school.school_name : "无"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="150">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            :content="scope.row.create_time"
            placement="top"
          >
            <span> <i class="el-icon-time" /> {{
              new Date(scope.row.create_time).getTime() | changeTime
            }}</span>
          </el-tooltip>
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
              <el-dropdown-item
                ><router-link :to="'/user/edit/' + row.id"
                  >编辑</router-link
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><a @click="showBox(row)">扣分</a>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <a @click="delData(row.id)">禁言</a>
              </el-dropdown-item> -->
              <!-- <el-dropdown-item>
                <a v-if="row.status.code == 1" @click="delData(row.id)">封号</a>
                <a v-else @click="delData(row.id)">解封</a>
              </el-dropdown-item> -->
              <el-dropdown-item v-if="auth == 1">
                <a @click="delData(row.id)">删除</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="" width="80%" :visible.sync="dialogTableVisible">
      <el-table
        :data="table"
        v-loading="tableLoaing"
        element-loading-text="Loading"
      >
        <el-table-column align="center" width="60" fixed label="ID">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="任务标题" width="250" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="用户昵称" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.user_name }}</template>
        </el-table-column>
        <el-table-column label="用户手机号" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.user_phone }}</template>
        </el-table-column>
        <el-table-column label="任务类型" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.type == 1
              ? "快递帮"
              : scope.row.type == 2
              ? "校园跑腿"
              : scope.row.type == 3
              ? "其他"
              : ""
          }}</template>
        </el-table-column>
        <el-table-column label="任务状态" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.type == 0
              ? "待接单"
              : scope.row.type == 1
              ? "进行中"
              : scope.row.type == 2
              ? "待结算"
              : scope.row.type == 3
              ? "已取消"
              : scope.row.type == 4
              ? "已完成"
              : ""
          }}</template>
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
              <span> <i class="el-icon-time" /> {{
                new Date(scope.row.create_time).getTime() | changeTime
              }}</span>
            </el-tooltip>
            <!-- {{ scope.row.create_time }} -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="padding: 32px 16px"
        background
        layout="total, prev, pager, next"
        @prev-click="getTable"
        @current-change="getTable"
        @next-click="getTable"
        :total="total2"
      ></el-pagination>
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
    <el-dialog
      :title="boxTitle"
      width="400px"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item label="分值" label-width="40px">
          <el-input
            v-model="form.point"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="40px">
          <el-input
            v-model="form.note"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="upload" :loading="boxLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, delUser, creditPoints } from "@/api/user";
import { getTaskLists } from "@/api/order";

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
      list: null,
      listLoading: false,
      limit: 10,
      total: 1,
      page: 1,
      tableLoaing: true,
      dialogTableVisible: false,
      table: null,
      total2: 1,
      tableId: null,
      tableType: null,
      multipleSelection: [],
      downloadLoading: false,
      dialogFormVisible: false,
      formData: {
        phone: null,
      },
      form: {
        user_id: null,
        point: null,
        note: null,
      },
      auth: localStorage.getItem("auth"),
      boxTitle: null,
      boxLoading: false,
    };
  },
  created() {
    this.listLoading = false;
    this.fetchData(1);
  },
  methods: {
    openTable(box, id, type) {
      this.dialogTableVisible = true;
      this.tableId = id;
      this.tableType = type;
      this.getTable(1);
    },
    getTable(page) {
      this.tableLoaing = true;
      getTaskLists(
        this.$qs.stringify({
          where: { type: this.tableType, user_id: this.tableId },
          page: page,
          limit: 10,
        })
      ).then((res) => {
        this.table = res.result.data;
        this.total2 = res.result.count;
        this.tableLoaing = false;
      });
    },
    showBox(row) {
      this.boxTitle = "扣除 [ " + row.name + " ] 信誉分";
      this.form.user_id = row.id;
      this.form.point = null;
      this.form.note = null;
      this.dialogFormVisible = true;
    },
    upload() {
      if (!/^[1-9]\d*$/.test(this.form.point) || this.form.note == null) {
        this.$message({
          type: "error",
          message: "请填写正整数且备注不为空",
        });
        return false;
      }
      this.boxLoading = true;
      creditPoints(
        this.$qs.stringify({
          data: this.form,
        })
      )
        .then((res) => {
          this.boxLoading = false;
          this.dialogFormVisible = false;
          this.fetchData(this.page);
          this.$message({
            type: "success",
            message: res.message,
          });
        })
        .catch((error) => {
          this.boxLoading = false;
        });
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
      this.$confirm("请再次确认进行此操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delUser(
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
        const tHeader = ["姓名", "家长姓名", "关系"];
        const filterVal = ["name", "patriarch_name", "patriarch_relation"];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "学生列表",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "sex") {
            return v[j] == 2 ? "女" : "男";
          } else {
            return v[j];
          }
        })
      );
    },
    fetchData(page) {
      this.listLoading = true;
      this.page = page;
      // this.formData.phone
      getUserList(
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
</style>
