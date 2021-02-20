<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="formData.score"
        placeholder="评分分类"
        clearable
        style="width: 170px"
        size="small"
        class="input"
      >
        <el-option
          v-for="(item, index) in typeList"
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
      <el-button size="small" class="input" @click="delData()" type="danger"
        >批量删除</el-button
      >
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
      <el-table-column align="center" width="60" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="评价人（学生）" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="评分" width="170" align="center">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.score"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="评价内容" width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评价时间" width="200">
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
      >
        <template slot-scope="{ row }">
          <el-button size="mini" @click="delData(row.id)" type="danger"
            >删除</el-button
          >
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
import { getStorelist } from "@/api/shop";

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
      total: 1,
      limit: 10,
      listLoading: true,
      downloadLoading: false,
      formData: {
        score: "",
      },
      multipleSelection: [],
      typeList: [
        {
          name: "好评(4分以上)",
          id: "[4,5]",
        },
        {
          name: "中评(3分-4分)",
          id: "[3,4]",
        },
        {
          name: "差评(3分以下)",
          id: "[0,3]",
        },
      ],
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
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
      teacherComm(
        this.$qs.stringify({
          tid: this.$route.params.id,
          score: this.formData.score,
          page: page,
          limit: this.limit,
        })
      ).then((res) => {
        this.list = res.result.data;
        for (const key in this.list) {
          if (this.list.hasOwnProperty(key)) {
            this.list[key].score = parseFloat(this.list[key].score);
          }
        }
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
