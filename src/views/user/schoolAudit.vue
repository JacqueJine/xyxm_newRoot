<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="state"
        placeholder="权限"
        clearable
        style="width: 150px"
        size="small"
        class="input"
      >
        <el-option label="全部" value="" />
        <el-option label="待审核" value="0" />
        <el-option label="通过" value="1" />
        <el-option label="拒绝" value="1" />
      </el-select>
      <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1)"
        >查询</el-button
      >
      <!-- <el-button
        size="small"
        class="input"
        @click="passData('', 1)"
        type="success"
        >批量通过</el-button
      >
      <el-button
        size="small"
        class="input"
        @click="passData('', 0)"
        type="danger"
        >批量拒绝</el-button
      > -->
      <!-- <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>-->
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
      <el-table-column align="center" width="55" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="昵称" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.User.name }}</template>
      </el-table-column>
      <el-table-column label="手机号" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.User.phone ? scope.row.User.phone : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="所属学校" width="300" align="center">
        <template slot-scope="scope">{{
          scope.row.oldSchool.school_name ? scope.row.oldSchool.school_name : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="申请修改学校" width="300" align="center">
        <template slot-scope="scope">{{
          scope.row.newSchool.school_name ? scope.row.newSchool.school_name : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="审核状态" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.state.text
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="提交时间" width="200">
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
          <!-- <span>{{ scope.row.user_attestation.create_time }}</span> -->
        </template>
      </el-table-column>
            <el-table-column align="center" label="修改时间" width="200">
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
          
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-dropdown trigger="click" v-if="row.state.code==0">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item>
                <a @click="passData(row.id, 1)">通过</a>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="passData(row.id, 2)">拒绝</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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
import { schoolStateList, schoolState } from "@/api/user";

export default {

  data() {
    return {
      list: null,
      listLoading: true,
      total: 1,
      page: 1,
      limit: 10,
      state:"",
      multipleSelection: [],
      downloadLoading: false,
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
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量通过拒绝
    passData(id, type) {
      // let val = this.multipleSelection;
      // let ids = [];
      // if (id) {
      //   ids.push(id);
      // } else {
      //   if (!val.length) {
      //     this.$message({
      //       type: "warning",
      //       message: "请选择操作项",
      //     });
      //     return;
      //   } else {
      //     for (const key in val) {
      //       if (val.hasOwnProperty(key)) {
      //         ids.push(val[key].id);
      //       }
      //     }
      //   }
      // }
      this.$confirm("请确认本次审核操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          schoolState(
            this.$qs.stringify({
              id: id,
              state: type,
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
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    fetchData(page) {
      this.listLoading = true;
      schoolStateList(
        this.$qs.stringify({
          where: {
            state: this.state,
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
.el-dropdown-link {
  cursor: pointer;
}
</style>
