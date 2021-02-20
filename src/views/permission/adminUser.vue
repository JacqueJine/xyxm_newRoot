<template>
  <div class="app-container">
    <el-button type="primary" size="small" @click="handleAddRole"
      >添加管理</el-button
    >
    <el-table :data="list" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="账号" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名字" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责学校" width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.school">
            <p v-for="(item, index) in scope.row.school" :key="index">
              {{ item.school_name }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限" width="220">
        <template slot-scope="scope">
          {{ scope.row.auth ? scope.row.auth.text : "" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用" width="220">
        <template slot-scope="scope">
          {{ scope.row.status ? "启用中" : "未启用" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="220">
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
      <el-table-column align="center" label="更新时间" width="220">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            :content="scope.row.update_time"
            placement="top"
          >
            <span> <i class="el-icon-time" /> {{
              new Date(scope.row.update_time).getTime() | changeTime
            }}</span>
          </el-tooltip>
          <!-- {{ scope.row.update_time }} -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a @click="handleEdit(scope)">编辑</a>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="handleDelete(scope)">删除</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="padding: 32px 16px"
      background
      layout="total, prev, pager, next"
      :page-sizes="[10]"
      @prev-click="fetchData"
      @current-change="fetchData"
      @next-click="fetchData"
      :total="total"
    ></el-pagination>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑管理' : '添加管理'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="账号">
          <el-input v-model="role.username" size="small" placeholder="账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="role.password" size="small" placeholder="密码" />
        </el-form-item>
        <el-form-item label="负责学校">
          <el-select
            v-model="role.school_id"
            placeholder="请输入学校名称"
            clearable
            filterable
            multiple
            reserve-keyword
            :loading="loadings"
            style="width: 100%"
            size="small"
          >
            <el-option
              v-for="(item, index) in schoolList"
              :key="index"
              :label="item.school_name"
              :value="item.id + ''"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-radio-group v-model="role.auth">
            <el-radio :label="0">普通管理员</el-radio>
            <el-radio :label="1">超级管理员</el-radio>
          </el-radio-group> </el-form-item
        ><el-form-item label="名字">
          <el-input v-model="role.name" size="small" placeholder="名字" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="role.status"
            :active-value="1"
            :inactive-value="0"
            active-text="已启用"
            inactive-text="未启用"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" size="small" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          :loading="loadingBtn"
          @click="confirmRole"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSchoolList } from "@/api/school";
import { getLists, addAdmin, updateAdmin, delAdmin } from "@/api/user";

export default {
  data() {
    return {
      role: {
        username: "",
        school_id: "",
        password: "",
        auth: 0,
        name: "",
        status: 1,
      },
      list: [],
      schoolList: [],
      loadings: false,
      loadingBtn: false,
      total: 1,
      page: 1,
      limit: 10,
      editId: "",
      dialogVisible: false,
      dialogType: "new",
    };
  },
  created() {
    this.getSchool();
    this.fetchData(1);
  },
  methods: {
    fetchData(page) {
      this.listLoading = true;
      this.page = page;
      getLists(
        this.$qs.stringify({
          page: page,
          limit: this.limit,
        })
      ).then((response) => {
        this.list = response.result.list;
        this.total = response.result.count;
        this.listLoading = false;
      });
    },
    getSchool(query) {
      getSchoolList(
        this.$qs.stringify({
          where: { school_name: query },
          page: 1,
          limit: 1000,
        })
      ).then((res) => {
        this.schoolList = res.result.data;
      });
    },

    generateArr(routes) {
      let data = [];
      routes.forEach((route) => {
        data.push(route);
        if (route.children) {
          const temp = this.generateArr(route.children);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      return data;
    },
    handleAddRole() {
      this.dialogType = "new";
      this.editId = "";
      this.role = {
        username: "",
        school_id: "",
        password: "",
        auth: 0,
        name: "",
        status: 1,
      };
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.editId = scope.row.id;
      this.role.username = scope.row.username;
      this.role.school_id = scope.row.school_id;
      this.role.auth = scope.row.auth.code;
      this.role.name = scope.row.name;
      this.role.status = scope.row.status;
      this.dialogVisible = true;
    },
    handleDelete({ $index, row }) {
      this.$confirm("确认删除该角色?", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.list.splice($index, 1);
          delAdmin({ id: row.id }).then((res) => {
            this.fetchData(1);
            this.$message({
              type: "success",
              message: res.message,
            });
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    confirmRole() {
      this.loadingBtn = true;
      if (this.dialogType === "new") {
        addAdmin(this.$qs.stringify({ data: this.role })).then((res) => {
          this.$message({
            type: "success",
            message: res.message,
          });
          this.fetchData(1);
        });
      } else {
        updateAdmin(
          this.$qs.stringify({ id: this.editId, data: this.role })
        ).then((res) => {
          this.$message({
            type: "success",
            message: res.message,
          });
          this.fetchData(this.page);
        });
      }
      this.role = {
        username: "",
        school_id: "",
        password: "",
        auth: 0,
        name: "",
        status: 1,
      };
      this.dialogVisible = false;
      this.loadingBtn = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
