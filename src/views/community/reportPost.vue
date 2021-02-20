<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="formData.name"
        placeholder="学校名称"
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
      > -->
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
      <el-table-column label="举报人" width="160">
        <template slot-scope="scope">{{ scope.row.school_name }}</template>
      </el-table-column>
      <el-table-column label="手机号" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.user_count }}</template>
      </el-table-column>
      <el-table-column label="发帖人" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.user_count }}</template>
      </el-table-column>
      <el-table-column label="帖子标题" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.user_count }}</template>
      </el-table-column>
      <el-table-column label="举报内容" width="200" align="center">
        <template slot-scope="scope">

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
                <router-link :to="'/report/reportDetail/' + row.id">
                  详情</router-link
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="delData(row.id)">成功</a>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="delData(row.id)">失败</a>
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
import { getSchoolList } from "@/api/school";

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
      list: [{id:1}],
      listLoading: false,
      total: 1,
      page: 1,
      limit: 10,
      multipleSelection: [],
      downloadLoading: false,
      formData: {
        type: "",
        name: "",
        class_id: "",
        type_id: "",
      },
      typeArr: [],
      classType: [
        {
          name: "一对一",
          id: 1,
        },
        {
          name: "小班",
          id: 2,
        },
        {
          name: "大班",
          id: 3,
        },
      ],
    };
  },
  created() {
    // this.fetchData(1);
  },
  methods: {
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
          delCourse(
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
      getSchoolList(this.$qs.stringify({ page: page, limit: this.limit })).then(
        (response) => {
          this.list = response.result.data;
          this.total = response.result.count;
          this.listLoading = false;
        }
      );
    },
  },
};
</script>
<style scoped>
.input {
  margin-bottom: 15px;
}
.el-dropdown-link{
  cursor: pointer;
}
</style>
