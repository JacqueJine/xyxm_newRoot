<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="图片" prop="title_img">
        <el-upload
          class="avatar-uploader"
          :action="IMGURL + '/common/upload/image.html'"
          name="file"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="form.title_img"
            :src="IMGURL + form.title_img"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">实物</el-radio>
          <el-radio :label="2">红包</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所需积分" prop="patriarch_phone">
        <el-input v-model="form.patriarch_phone" />
      </el-form-item>
      <el-form-item label="所需金额" prop="patriarch_phone">
        <el-input v-model="form.patriarch_phone" />
      </el-form-item>
      <el-form-item label="运费" prop="patriarch_phone">
        <el-input v-model="form.patriarch_phone" />
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
import { userMes, editorUser } from "@/api/user";
export default {
  data() {
    return {
      form: {
        name: "",
        patriarch_name: "",
        patriarch_relation: "",
        sex: "",
        birthday: "",
        patriarch_phone: "",
        school: "",
        student_class: "",
        address: "",
      },
      submitLoading: false,
      rules: {
        name: [{ required: true, message: "请填写学生姓名", trigger: "blur" }],
        patriarch_name: [
          { required: true, message: "请填写家长姓名", trigger: "blur" },
        ],
        patriarch_relation: [
          { required: true, message: "请填写关系", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [{ required: true, message: "请选择日期", trigger: "blur" }],
        patriarch_phone: [
          { required: true, message: "请填写家长手机号", trigger: "blur" },
        ],
        school: [
          { required: true, message: "请填写就读学院", trigger: "blur" },
        ],
        student_class: [
          { required: true, message: "请填写就读班级", trigger: "blur" },
        ],
        address: [{ required: true, message: "请填写地址", trigger: "blur" }],
      },
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.getData(id);
  },
  methods: {
    getData(id) {
      userMes(this.$qs.stringify({ id: id })).then((res) => {
        this.form.name = res.result.name;
        this.form.patriarch_name = res.result.patriarch_name;
        this.form.patriarch_relation = res.result.patriarch_relation;
        this.form.sex = res.result.sex;
        this.form.birthday = res.result.birthday;
        this.form.patriarch_phone = res.result.patriarch_phone;
        this.form.school = res.result.school;
        this.form.student_class = res.result.student_class;
        this.form.address = res.result.address;
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.status == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.form.title_img = res.result.src;
      } else {
        this.$message({
          message: res.message,
          type: "error",
        });
        this.form.title_img = "";
      }
    },
    uploadError(err, file) {
      this.form.title_img = "";
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
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          editorUser(
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
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
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

