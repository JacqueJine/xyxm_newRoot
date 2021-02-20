<template>
  <div class="app-container">
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="标题" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="封面" prop="img">
        <el-upload
          class="avatar-uploader"
          :action="IMGURL + '/common/upload/image.html'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.img" :src="IMGURL + form.img" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p style="line-height: 30px; color: #f00">*建议图片尺寸 336*120 像素</p>
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">广告</el-radio>
          <el-radio :label="2">内部内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-radio-group v-model="form.location">
          <el-radio label="首页">首页</el-radio>
          <el-radio label="快递帮">快递帮</el-radio>
          <el-radio label="校园跑腿">校园跑腿</el-radio>
          <el-radio label="其它任务">其它任务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type == 1" label="外部链接" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-form-item label="权重" prop="name">
        <el-input v-model="form.sort" />
      </el-form-item>
      <el-form-item v-if="form.type == 2" label="详情" prop="text">
        <tinymce v-model="form.text" :height="300" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">{{
          type ? "编辑" : "添加"
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { addCarousel, carouselList, updateCarousel } from "@/api/notice";
export default {
  components: { Tinymce },
  data() {
    return {
      loading: true,
      form: {
        name: "",
        img: "",
        type: 2,
        location: "首页",
        sort: 1,
        url: "",
        text: ``,
      },
      submitLoading: false,
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "change",
          },
        ],
        img: [{ required: true, message: "请选择封面", trigger: "blur" }],
        url: [{ required: true, message: "请填写链接", trigger: "blur" }],
        type: [{ required: true, message: "请选择分类", trigger: "blur" }],
        sort: [{ required: true, message: "请填写权重", trigger: "blur" }],
        location: [{ required: true, message: "请选择位置", trigger: "blur" }],
        text: [{ required: true, message: "请填写内容", trigger: "blur" }],
      },
      type: 0, //0添加 1编辑
    };
  },
  created() {
    if (this.$route.query.id) {
      this.type = 1;
      this.getData(this.$route.query.id);
    } else {
      this.loading = false;
    }
  },
  methods: {
    getData(id) {
      carouselList(
        this.$qs.stringify({
          where: {
            id: id,
          },
          page: 1,
          limit: 1,
        })
      ).then((res) => {
        for (let i in this.form) {
          if (res.result.list[0][i]) {
            this.form[i] = res.result.list[0][i];
          }
        }
        if (res.result.list[0].CarouselInfo) {
          this.form.text = res.result.list[0].CarouselInfo.text;
        }
        this.loading = false;
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.form.img = res.result.src;
      } else {
        this.$message({
          message: res.message,
          type: "error",
        });
        this.form.img = "";
      }
    },
    uploadError(err, file) {
      this.form.img = "";
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
          // 编辑
          if (this.type) {
            let datas = this.form;
            datas.id = this.$route.query.id;
            updateCarousel(this.$qs.stringify({ data: datas })).then((res) => {
              this.submitLoading = false;
              this.$message({ message: res.message, type: "success" });
              this.$router.push({ path: "/set/slideList" });
            });
          }
          // 添加
          else {
            addCarousel(this.$qs.stringify({ data: this.form })).then((res) => {
              this.submitLoading = false;
              this.$message({ message: res.message, type: "success" });
              this.$router.push({ path: "/set/slideList" });
            });
          }
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

