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
        >导出</el-button
      > -->
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
      <!-- <el-table-column fixed type="selection"></el-table-column> -->
      <el-table-column align="center" width="60" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <el-image
            @click="clickImg($event)"
            style="width: 50px; height: 50px"
            :src="IMGURL + scope.row.header"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.linkman }}</template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 2" size="mini" type="success"
            >正常</el-tag
          >
          <el-tag v-if="scope.row.status == 3" size="mini" type="danger"
            >已封店</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="所属学校" width="150" align="center">
        <template slot-scope="scope">{{
          scope.row.school ? scope.row.school.school_name : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="余额" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.wallet }}</template>
      </el-table-column>
      <el-table-column label="总营业额" width="110" align="center">
        <template slot-scope="scope">{{
          scope.row.turnover ? scope.row.turnover : 0
        }}</template>
      </el-table-column>
      <el-table-column label="成交订单" width="110" align="center">
        <template slot-scope="scope">{{
          scope.row.store_order_count ? scope.row.store_order_count : 0
        }}</template>
      </el-table-column>
      <el-table-column label="上架商品" width="110" align="center">
        <template slot-scope="scope">{{
          scope.row.store_goods_count ? scope.row.store_goods_count : 0
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="200">
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
                <a v-if="auth == 1 && row.status == 2" @click="upload(row.id)"
                  >封店</a
                >
                <a v-if="auth == 1 && row.status == 3" @click="unlock(row.id)"
                  >解封</a
                >
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                <router-link :to="'/shop/detail/' + row.id"> 详情</router-link>
              </el-dropdown-item> -->
              <!-- <el-dropdown-item v-if="auth == 1">
                <a @click="delData(row.id)">删除</a>
              </el-dropdown-item> -->
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
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import { getStoreList, closeStore } from "@/api/shop";
import BigImg from "@/components/BigImg";

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
        phone: null,
        status: [2, 3],
      },
      auth: localStorage.getItem("auth"),
      showImg: false,
      imgSrc: "",
    };
  },
  created() {
    this.fetchData(1);
  },
  methods: {
    unlock(id) {
      this.$confirm("请确认进行此操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          closeStore(
            this.$qs.stringify({
              id: id,
              data: {
                fun: 2,
              },
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
    viewImg() {
      this.showImg = false;
    },
    clickImg(e) {
      this.showImg = true;
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    sizeChange(size) {
      this.limit = size;
      this.fetchData(1);
    },
    // 封店
    upload(id) {
      let obj = {};
      this.$prompt("封店原因", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "请输入封店原因",
      })
        .then(({ value }) => {
          closeStore(
            this.$qs.stringify({
              id: id,
              data: {
                fun: 3,
                note: value,
              },
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
      getStoreList(
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
