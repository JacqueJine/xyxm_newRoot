<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
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
      <el-table-column align="center" width="55" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="昵称" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="手机号" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.phone ? scope.row.phone : "无"
        }}</template>
      </el-table-column>
      <el-table-column label="身份证正面" align="center" width="120">
        <template slot-scope="scope">
          <el-image
            @click="
              clickImg($event)
            "
            style="width: 50px; height: 50px"
            :src="
              IMGURL + scope.row.user_attestation.user_attestation_info[0].img
            "
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="身份证反面" align="center" width="120">
        <template slot-scope="scope">
          <el-image
            @click="
              clickImg($event)
            "
            style="width: 50px; height: 50px"
            :src="
              IMGURL + scope.row.user_attestation.user_attestation_info[1].img
            "
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="学生证" align="center" width="120">
        <template slot-scope="scope">
          <el-image
            @click="
              clickImg($event)
            "
            style="width: 50px; height: 50px"
            :src="
              IMGURL + scope.row.user_attestation.user_attestation_info[2].img
            "
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="所属学校" width="300" align="center">
        <template slot-scope="scope">{{
          scope.row.school_name ? scope.row.school_name : "无"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="提交时间" width="200">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            :content="scope.row.user_attestation.create_time"
            placement="top"
          >
            <span> <i class="el-icon-time" /> {{
              new Date(scope.row.user_attestation.create_time).getTime() | changeTime
            }}</span>
          </el-tooltip>
          <!-- <span>{{ scope.row.user_attestation.create_time }}</span> -->
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
                <a @click="passData(row.id, 1)">通过</a>
              </el-dropdown-item>
              <el-dropdown-item>
                <a @click="passData(row.id, 0)">拒绝</a>
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
import { getIdentitys, verifyIdentitys } from "@/api/user";
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
    // 批量通过拒绝
    passData(id, type) {
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
      this.$confirm("请确认本次审核操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          verifyIdentitys(
            this.$qs.stringify({
              ids: ids,
              fun: type,
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
      getIdentitys(
        this.$qs.stringify({
          where: {
            status: 1,
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
