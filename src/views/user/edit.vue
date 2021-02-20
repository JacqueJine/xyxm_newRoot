<template>
  <div class="app-container">
    <el-form
      v-loading="loading"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="头像" prop="header">
        <el-upload
          class="avatar-uploader"
          :action="IMGURL + '/common/upload/image.html'"
          name="file"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.header" :src="IMGURL + form.header" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="骑手" prop="is_rider">
        <el-radio-group v-model="form.is_rider">
          <el-radio :label="1">骑手</el-radio>
          <el-radio :label="0">不是骑手</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="店家" prop="is_store">
        <el-radio-group v-model="form.is_store">
          <el-radio :label="1">店家</el-radio>
          <el-radio :label="0">不是店家</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="真实姓名" prop="patriarch_phone">
        <el-input v-model="form.patriarch_phone" />
      </el-form-item>
      <el-form-item label="身份证号" prop="patriarch_phone">
        <el-input v-model="form.patriarch_phone" />
      </el-form-item> -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="学校" prop="school_id">
        <p>
          {{ schoolName }} &nbsp;&nbsp;<el-button
            type="text"
            @click="showChange"
            >更改</el-button
          >
        </p>
        <el-select
          v-if="showSchool"
          v-model="schoolId"
          :placeholder="'当前为' + schoolName"
          clearable
          filterable
          remote
          reserve-keyword
          :remote-method="getSchool"
          :loading="loadings"
          @change="changeSchool"
          style="width: 340px"
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserInfo, editUserInfo } from "@/api/user";
import { getSchoolList } from "@/api/school";

export default {
  data() {
    return {
      form: {
        name: null,
        header: null,
        sex: null,
        phone: null,
        school_id: null,
        is_rider: null,
        is_store: null,
      },
      schoolName: null,
      schoolId: null,
      school_id: null,
      showSchool: false,
      schoolList: [],
      loading: true,
      loadings: false,
      submitLoading: false,
      rules: {
        name: [{ required: true, message: "请填写学生姓名", trigger: "blur" }],
        header: [{ required: true, message: "请上传图片", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phone: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        is_rider: [
          { required: true, message: "请选择是否为骑手", trigger: "blur" },
        ],
        is_store: [
          { required: true, message: "请选择是否为店家", trigger: "blur" },
        ],
        school_id: [{ required: true, message: "请填写学校", trigger: "blur" }],
      },
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.getData(id);
  },
  methods: {
    showChange() {
      this.showSchool = true;
    },
    changeSchool(val) {
      this.schoolId = val;
      if (val) {
        this.school_id = val;
      } else {
        this.school_id = this.form.school_id;
      }
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
    getData(id) {
      getUserInfo(this.$qs.stringify({ where: { id: id } })).then((res) => {
        this.form.name = res.result.name;
        this.form.header = res.result.header;
        this.form.sex = res.result.sex.code;
        this.form.phone = res.result.phone;
        if (res.result.school_id) {
          this.schoolName = res.result.school.school_name;
        }
        this.form.school_id = res.result.school_id;
        this.school_id = res.result.school_id;
        this.form.is_rider = res.result.is_rider.code;
        this.form.is_store = res.result.is_store.code;
        this.loading = false;
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.form.header = res.result.src;
      } else {
        this.$message({
          message: res.message,
          type: "error",
        });
        this.form.header = null;
      }
    },
    uploadError(err, file) {
      this.form.header = null;
      this.$message({
        message: "上传失败！",
        type: "error",
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    // 提交
    onSubmit() {
      if (!this.form.school_id) {
        this.form.school_id = this.school_id;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.school_id = this.school_id;
          this.submitLoading = true;
          editUserInfo(
            this.$qs.stringify({ id: this.$route.params.id, data: this.form })
          ).then((res) => {
            this.submitLoading = false;
            this.$message({ message: res.message, type: "success" });
            this.$router.push({ path: "/user/userList" });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
/deep/ .el-upload {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

