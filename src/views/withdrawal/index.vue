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
      <!-- <router-link :to="'/teacher/addTeacher'">
        <el-button size="small" class="input" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link> -->
      <!-- <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button> -->
      <el-button size="small" class="input" @click="delData()" type="danger"
        >批量删除</el-button
      >
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
      <el-table-column label="用户昵称" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.user.name }}</template>
      </el-table-column>
      <el-table-column label="手机号" width="130" align="center">
        <template slot-scope="scope">{{ scope.row.user.phone }}</template>
      </el-table-column>
      <el-table-column label="提现金额" width="140" align="center">
        <template slot-scope="scope">
          <span style="color:#F56C6C">{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:#409eff">{{ scope.row.money ? scope.row.money : "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.note }}</template>
      </el-table-column>
      <el-table-column label="所属学校" width="260" align="center">
        <template slot-scope="scope">{{ scope.row.user.school_name }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="时间">
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
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/integralMall/edit/'+row.id">
            <el-button type="primary" size="mini">修改</el-button>
          </router-link>
          <el-button size="mini" type="warning" @click="upload('pwd',row.id)">上架</el-button>
          <el-button size="mini" type="danger" @click="delData(row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
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
import { getWithdraw } from "@/api/user";

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
      total: 1,
      page: 1,
      limit: 10,
      multipleSelection: [],
      downloadLoading: false,
      formData: {
        phone: "",
      },
    };
  },
  created() {
    this.fetchData(1);
  },
  methods: {
    sizeChange(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 修改
    upload(type, id) {
      let obj = {};
      this.$prompt(
        type == "pwd" ? "请输入新密码" : "请输入新手机号",
        type == "pwd" ? "修改密码" : "更换手机号",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern:
            type == "pwd" ? /^[0-9a-zA-Z]{6,12}$/ : /^1[3456789]\d{9}$/,
          inputErrorMessage:
            type == "pwd"
              ? "密码必须6到12位字母或数字，且不能出现空格"
              : "请输入正确手机号",
        }
      )
        .then(({ value }) => {
          if (type == "pwd") {
            obj.password = value;
          } else {
            obj.phone = value;
          }
          updateTeacher(
            this.$qs.stringify({
              id: id,
              data: obj,
            })
          ).then((res) => {
            this.fetchData(this.page);
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
          delteacher(
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
        const tHeader = ["姓名", "性别", "手机号", "综合评分", "添加时间"];
        const filterVal = ["name", "sex", "phone", "score", "create_time"];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "店铺列表",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "sex") {
            return v[j] == 1 ? "女" : "男";
          } else {
            return v[j];
          }
        })
      );
    },
    // 获取信息
    fetchData(page) {
      this.page = page;
      this.listLoading = true;
      getWithdraw(
        this.$qs.stringify({
          where: {
            user: {
              status: 1,
            },
            withdraws: {
              status: 1,
            },
          },
          page: page,
          limit: this.limit,
        })
      ).then((res) => {
        this.list = res.result.list;
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
</style>
