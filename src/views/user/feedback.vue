<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" class="input" @click="delData('')" type="danger"
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
      <el-table-column align="center" width="55" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="昵称" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.name ? scope.row.name : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="反馈建议" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.text }}</template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image
            v-for="(item, index) in scope.row.img"
            :key="index"
            @click="clickImg($event)"
            style="width: 50px; height: 50px"
            :src="IMGURL + item"
          >
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="所属学校" width="200" align="center">
        <template slot-scope="scope">{{
          scope.row.school_name ? scope.row.school_name : "无"
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
                <a @click="toReward(row.id)">奖励</a>
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
import { listTickling, dellistTickling } from "@/api/user";
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
  components: { "big-img": BigImg },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 1,
      page: 1,
      limit: 10,
      multipleSelection: [],
      downloadLoading: false,
      showImg: false,
      imgSrc: "",
    };
  },
  created() {
    this.fetchData(1);
  },
  methods: {
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
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除
    delData(id) {
      let val = this.multipleSelection;
      let ids = [];
      if (id) {
        ids.push(id);
      } else {
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
      }
      this.$confirm("请确认本次删除操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dellistTickling(
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
    // 奖励
    toReward(id) {
      this.$prompt("请输入奖励积分", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: "请输入正整数积分",
      })
        .then(({ value }) => {
          console.log(id, value);
          //   this.$message({
          //     type: 'success',
          //     message: '你的邮箱是: ' + value
          //   });
        })
        .catch(() => {});
    },
    fetchData(page) {
      this.listLoading = true;
      listTickling(
        this.$qs.stringify({
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
