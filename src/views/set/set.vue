<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link :to="'/set/create'">
        <el-button size="small" class="input" type="primary" icon="el-icon-edit"
          >添加</el-button
        >
      </router-link>
      <!-- <el-button size="small" class="input" @click="delData()" type="danger"
        >批量删除</el-button
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
      <el-table-column label="名称" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.key }}</template>
      </el-table-column>
      <el-table-column label="值" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.value }}</template>
      </el-table-column>
      <el-table-column label="备注" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.common }}</template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="220">
        <template slot-scope="scope">
          <!-- {{ scope.row.create_time }} -->
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
      <el-table-column align="center" label="修改时间" width="220">
        <template slot-scope="scope">
          <!-- {{ scope.row.update_time }} -->
          
          <el-tooltip
            class="item"
            :content="scope.row.update_time"
            placement="top"
          >
            <span><i class="el-icon-time" /> {{
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
          <router-link :to="'/set/edit/' + row.id">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <!-- <el-button size="mini" type="danger" @click="delData(row.id)"
            >删除</el-button
          > -->
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
import { listSystem } from "@/api/system";

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
      formData: { type: null, task_state: null },
      stateList: [
        { id: null, name: "全部" },
        { id: 0, name: "待接单" },
        { id: 1, name: "进行中" },
        { id: 2, name: "待结算" },
        { id: 3, name: "已取消" },
        { id: 4, name: "已完成" },
      ],
      classType: [
        { id: null, name: "全部" },
        { id: 1, name: "快递帮" },
        { id: 2, name: "校园跑腿" },
        { id: 3, name: "其他" },
      ],
      total: 1,
      limit: 10,
      listLoading: false,
      downloadLoading: false,
      multipleSelection: [],
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.formData.user_id = id;
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
          DelComment(
            this.$qs.stringify({
              data: ids,
              status: 2,
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
    // 获取列表
    fetchData(page) {
      this.listLoading = true;
      listSystem(
        this.$qs.stringify({
          where: {
            id: "",
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
