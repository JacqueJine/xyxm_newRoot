<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-loading="loading">
      <el-form-item label="名称" prop="key">
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="form.value" />
      </el-form-item>
      <el-form-item label="备注" prop="common">
        <el-input v-model="form.common" />
      </el-form-item>
      <!-- <el-form-item label="封面" prop="title_img">
        <el-upload
          class="avatar-uploader"
          :action="IMGURL+'/common/upload/image.html'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.title_img" :src="IMGURL+form.title_img" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p style="line-height:30px;color:#f00">*建议图片尺寸 100*90 像素</p>
      </el-form-item> -->
      <!-- <el-form-item label="详情" prop="content">
        <tinymce v-model="form.content" :height="300" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { updateSystem, listSystem } from "@/api/system";

export default {
  components: { Tinymce },
  data() {
    return {
      form: {
        id: "",
        key: "",
        value: "",
        common: "",
      },
      loading:true,
      submitLoading: false,
      rules: {
        key: [{ required: true, message: "请输入内容", trigger: "blur" }],
        value: [{ required: true, message: "请输入内容", trigger: "blur" }],
        common: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.getData(id);
  },
  methods: {
    getData(id) {
      listSystem(
        this.$qs.stringify({
          where: {
            id: id,
          },
          page: 1,
          limit: 1,
        })
      ).then((res) => {
        this.loading=false;
        this.form.id = res.result.list[0].id;
        this.form.key = res.result.list[0].key;
        this.form.value = res.result.list[0].value;
        this.form.common = res.result.list[0].common;
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
          updateSystem(this.$qs.stringify({ data: this.form })).then((res) => {
            this.submitLoading = false;
            this.$message({ message: res.message, type: "success" });
            this.$router.push({ path: "/set/set" });
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

