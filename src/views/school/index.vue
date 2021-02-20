<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="formData.school_name"
        placeholder="学校名称"
        style="width: 200px"
        size="small"
        class="input"
        @keyup.enter.native="fetchData(1)"
      />
      <!-- <el-select
        v-model="formData.type"
        placeholder="学校模式"
        clearable
        style="width: 120px"
        size="small"
        class="input"
      >
        <el-option
          v-for="(item,index) in classType"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select> -->
      <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1)"
        >查询</el-button
      >
      <router-link :to="'/school/create'">
        <el-button size="small" class="input" type="primary" icon="el-icon-edit"
          >添加</el-button
        >
      </router-link>
      <el-button size="small" class="input" @click="delData()" type="danger"
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
      <el-table-column fixed type="selection"></el-table-column>
      <el-table-column align="center" width="60" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="学校名称" width="260">
        <template slot-scope="scope">{{ scope.row.school_name }}</template>
      </el-table-column>
      <el-table-column label="用户总数" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.user_count }}</template>
      </el-table-column>
      <el-table-column label="店铺总数" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.store_count }}</template>
      </el-table-column>
      <el-table-column label="总发布量" width="150" align="center">
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
      <el-table-column label="总接单量" width="150" align="center">
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
      <el-table-column label="总订单" width="150" align="center">
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
      <el-table-column label="总交易额" width="150" align="center">
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
      <el-table-column
        align="center"
        prop="created_at"
        label="添加时间"
        width="200"
      >
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
          <!-- <span>{{ scope.row.create_time }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="'/school/edit/' + row.id">编辑</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
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
              <span><i class="el-icon-time" /> {{
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
  </div>
</template>

<script>
import { getSchoolList, delSchool } from "@/api/school";
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
      tableLoaing: true,
      dialogTableVisible: false,
      table: null,
      total2: 1,
      tableId: null,
      tableType: null,
      total: 1,
      page: 1,
      limit: 10,
      multipleSelection: [],
      downloadLoading: false,
      formData: {
        school_name: null,
      },
    };
  },
  created() {
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
          where: { type: this.tableType, school_id: this.tableId },
          page: page,
          limit: 10,
        })
      ).then((res) => {
        this.table = res.result.data;
        this.total2 = res.result.count;
        this.tableLoaing = false;
      });
    },
    sizeChange(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 选择分类
    handleChange(value) {
      if (!value.length) {
        this.formData.type_id = "";
        this.formData.class_id = "";
      } else {
        this.formData.type_id = value[1] ? value[1] : "";
        this.formData.class_id = value[0];
      }
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
          delSchool(
            this.$qs.stringify({
              ids: ids,
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
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "学校名称",
          "一级分类",
          "二级分类",
          "学校模式",
          "试听预约",
          "任课老师",
          "价格",
          "总课时",
          "添加时间",
        ];
        const filterVal = [
          "name",
          "class_name",
          "type_name",
          "type_text",
          "state_text",
          "teacher_name",
          "price",
          "class_time",
          "create_time",
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "学校列表",
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
      getSchoolList(
        this.$qs.stringify({
          where: this.formData,
          page: page,
          limit: this.limit,
        })
      ).then((response) => {
        this.list = response.result.data;
        this.total = response.result.count;
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
