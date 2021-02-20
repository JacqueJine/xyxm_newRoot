<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="formData.school_id"
        placeholder="请输入学校名称"
        clearable
        filterable
        remote
        reserve-keyword
        :remote-method="getSchool"
        :loading="loadings"
        style="width: 240px"
        size="small"
        class="input"
      >
        <el-option
          v-for="(item, index) in schoolList"
          :key="index"
          :label="item.school_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="formData.posts_auth"
        placeholder="权限"
        clearable
        style="width: 150px"
        size="small"
        class="input"
      >
        <el-option label="全部权限" value="" />
        <el-option label="公开" value="0" />
        <el-option label="本校" value="1" />
      </el-select>
      <el-button
        size="small"
        class="input"
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1)"
        >查询</el-button
      >
      <!-- <el-button size="small" class="input" @click="delData()" type="danger"
        >批量删除</el-button
      > -->
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
      @row-dblclick="toDetail"
      highlight-current-row
    >
      <!-- <el-table-column fixed type="selection"></el-table-column> -->
      <el-table-column align="center" width="60" fixed label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="发帖人" width="180" align="center">
        <template slot-scope="scope">{{
          scope.row.user ? scope.row.user.name : ""
        }}</template>
      </el-table-column>
      <el-table-column label="手机号" width="180" align="center">
        <template slot-scope="scope">{{
          scope.row.user ? scope.row.user.phone : ""
        }}</template>
      </el-table-column>
      <el-table-column label="权限" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.posts_auth ? scope.row.posts_auth.text : ""
        }}</template>
      </el-table-column>
      <el-table-column label="类型" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.class_name }}</template>
      </el-table-column>
      <el-table-column label="评论数" width="90" align="center">
        <template slot-scope="scope">{{ scope.row.comment_count }}</template>
      </el-table-column>
      <el-table-column label="点赞量" width="90" align="center">
        <template slot-scope="scope">{{ scope.row.praise_count }}</template>
      </el-table-column>
      <el-table-column label="分享数" width="90" align="center">
        <template slot-scope="scope">{{ scope.row.share_num }}</template>
      </el-table-column>
      <el-table-column label="学校" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.school_name }}</template>
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
                <a @click="toDetail(row)">详情</a>
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
    <el-dialog title="帖子详情" :visible.sync="detailBox">
      <div style="width: 100%; max-height: 500px; overflow-y: scroll">
        <el-tabs
          type="border-card"
          v-loading="formLoading"
          style="background: #f6f6f6"
        >
          <div v-if="!formLoading">
            <div class="cards">
              <el-row style="margin-bottom: 20px">
                <el-col :span="22" :offset="1">
                  <span class="taskType">{{
                    form.posts_auth ? form.posts_auth.text : ""
                  }}</span>
                  <span class="school">
                    {{ form.school_name ? form.school_name : "" }}
                  </span>
                  <span class="taskLabel">类型：</span>
                  <span class="status">
                    {{ form.class_name }}
                  </span>
                </el-col>
              </el-row>
              <el-row class="row">
                <el-col :span="2">
                  <div class="taskLabel">发布人</div>
                </el-col>
                <el-col :span="22" class="taskV">
                  {{ form.user ? form.user.name : "" }}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {{ form.user ? form.user.phone : "" }}
                </el-col>
              </el-row>
              <el-row class="row">
                <el-col :span="2">
                  <div class="taskLabel">数据</div>
                </el-col>
                <el-col :span="22" class="taskV"
                  >点赞:{{ form.praise_count }} &nbsp;&nbsp;&nbsp;&nbsp; 评论:{{
                    form.comment_count
                  }}
                  &nbsp;&nbsp;&nbsp;&nbsp; 分享:{{ form.share_num }}
                </el-col>
              </el-row>
              <el-row class="row">
                <el-col :span="2">
                  <div class="taskLabel">帖子内容</div>
                </el-col>
                <el-col :span="22" class="taskV">{{ form.content }}</el-col>
              </el-row>
              <el-row class="row">
                <el-col :span="2">
                  <div class="taskLabel">帖子图片</div>
                </el-col>
                <el-col :span="22" class="taskV">
                  <el-image
                    v-for="(item, index) in form.community_posts_imgs"
                    :key="index"
                    @click="clickImg($event)"
                    style="width: 70px; height: 70px; margin-right: 5px"
                    :src="IMGURL + item.path"
                  >
                  </el-image>
                </el-col>
              </el-row>
            </div>
            <div
              class="cards"
              v-if="
                form.community_posts_comment &&
                form.community_posts_comment.length
              "
            >
              <el-row
                class="row"
                v-for="(item, index) in form.community_posts_comment"
                :key="index"
              >
                <el-col :span="3">
                  <div class="taskLabel">{{ item.name }}</div>
                </el-col>
                <el-col :span="21" class="taskV">
                  <p style="margin-bottom: 10px">{{ item.content }}</p>
                  <div
                    v-if="item.community_posts_comment_imgs"
                    style="margin-bottom: 10px"
                  >
                    <el-image
                      v-for="(img, ind) in item.community_posts_comment_imgs"
                      :key="ind"
                      @click="clickImg($event)"
                      style="width: 70px; height: 70px; margin-right: 5px"
                      :src="IMGURL + img.path"
                    >
                    </el-image>
                  </div>
                  <p>{{ item.create_time }}</p>
                </el-col>
              </el-row>
            </div>
            <!-- <div class="cards">
              <el-row>
                <el-col :span="2">
                  <div class="taskLabel">接单人</div>
                </el-col>
                <el-col :span="22" class="taskV">{}</el-col>
              </el-row>
            </div> -->
          </div>
        </el-tabs>
      </div>
    </el-dialog>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import { getPostsLists, getPostsInfo, deletePosts } from "@/api/community";
import { getSchoolList } from "@/api/school";
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
      listLoading: false,
      total: 1,
      page: 1,
      limit: 10,
      multipleSelection: [],
      downloadLoading: false,
      formLoading: false,
      detailBox: false,
      schoolList: [],
      loadings: false,
      formData: {
        posts_auth: "",
        school_id: "",
      },
      form: {},
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
    // 获取单个
    getData(id) {
      getPostsInfo(this.$qs.stringify({ id: id })).then((res) => {
        this.form = res.result;
        this.formLoading = false;
      });
    },
    toDetail(row, e) {
      this.form = {};
      this.formLoading = true;
      this.detailBox = true;
      this.getData(row.id);
    },
    getSchool(query) {
      if (query !== "") {
        this.loadings = true;
        getSchoolList(
          this.$qs.stringify({
            where: { school_name: query },
            page: 1,
            limit: 10,
          })
        ).then((res) => {
          this.loadings = false;
          this.schoolList = res.result.data;
        });
      } else {
        this.schoolList = [];
      }
    },
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
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePosts(
            this.$qs.stringify({
              id: id,
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
      getPostsLists(
        this.$qs.stringify({
          where: {
            community_club_id: 0,
            school_id: this.formData.school_id,
            posts_auth: this.formData.posts_auth,
          },
          page: page,
          limit: this.limit,
        })
      ).then((response) => {
        this.list = response.result.list;
        this.total = response.result.count;
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
.cards {
  padding: 20px 0;
  background: #fff;
  margin-bottom: 15px;
}
.school {
  margin: 0 20px;
  font-size: 12px;
}
.status {
  font-size: 12px;
}
.taskType {
  font-size: 12px;
  line-height: 25px;
  padding: 0 21px;
  display: inline-block;
  border-radius: 2px;
  background: #fec200;
}
.taskLabel {
  color: rgba(51, 51, 51, 0.6);
  font-size: 12px;
  text-align: right;
}
.row {
  /* height: 14px; */
  line-height: 14px;
  margin-bottom: 16px;
}
.taskV {
  padding-left: 20px;
  color: #333;
  font-size: 12px;
  font-weight: 500;
}
</style>
