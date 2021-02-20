<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="formData.type"
        placeholder="分类"
        clearable
        style="width: 150px"
        size="small"
        class="input"
      >
        <el-option label="全部分类" value="" />
        <el-option label="广告" value="1" />
        <el-option label="内部内容" value="2" />
      </el-select>
      <el-select
        v-model="formData.location"
        placeholder="位置"
        clearable
        style="width: 150px"
        size="small"
        class="input"
      >
        <el-option label="全部位置" value="" />
        <el-option label="首页" value="首页" />
        <el-option label="快递帮" value="快递帮" />
        <el-option label="校园跑腿" value="校园跑腿" />
        <el-option label="其它任务" value="其它任务" />
      </el-select>
      <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1)"
        >查询</el-button
      >
      <router-link :to="'/set/createSlide'">
        <el-button size="small" class="input" type="primary" icon="el-icon-edit"
          >添加</el-button
        >
      </router-link>
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
      <el-table-column label="标题" width="260">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="分类" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.type == 1 ? "广告" : "内部"
        }}</template>
      </el-table-column>
      <el-table-column label="广告链接" width="260">
        <template slot-scope="scope">{{
          scope.row.url ? scope.row.url : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="权重" width="100">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="位置" width="120">
        <template slot-scope="scope">{{ scope.row.location }}</template>
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
            <span>
              <i class="el-icon-time" />
              {{ new Date(scope.row.create_time).getTime() | changeTime }}</span
            >
          </el-tooltip>
          <!-- <span>{{ scope.row.create_time }}</span> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="'/set/createSlide?id=' + row.id">
                  编辑
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="delData(row.id)">删除</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="padding: 32px 16px"
      background
      :page-size="8"
      @prev-click="fetchData"
      @current-change="fetchData"
      @next-click="fetchData"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { carouselList, delCarousel } from "@/api/notice";

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
      list: [{ id: 1 }],
      total: 1,
      page: 1,
      limit: 10,
      listLoading: false,
      downloadLoading: false,
      multipleSelection: [],
      formData: {
        type: "",
        location: "",
      },
    };
  },
  created() {
    this.fetchData(1);
  },
  methods: {
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
          delCarousel(
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
      carouselList(
        this.$qs.stringify({
          where: {
            type: this.formData.type,
            location: this.formData.location,
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
