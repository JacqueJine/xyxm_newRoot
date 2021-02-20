<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="学校名称" prop="school_name">
        <el-input v-model="form.school_name" disabled />
      </el-form-item>
      <el-form-item label="坐标" prop="school_address">
        <el-input v-model="form.school_address" disabled />
      </el-form-item>
      <el-form-item label="地图">
        <iframe
          id="message"
          width="600px"
          height="500px"
          frameborder="0"
          src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=A3ABZ-YPBC2-3QUUO-C3F4Q-STCUO-LPB4A&referer=myapp"
        >
        </iframe>
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
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { addSchool } from "@/api/school";

export default {
  components: { Tinymce },
  data() {
    return {
      form: {
        school_name: null,
        school_address: null,
      },
      submitLoading: false,
      rules: {
        school_name: [{ required: true, message: "请在地图搜索或选择学校", trigger: "blur" }],
        school_address: [{ required: true, message: "请在地图搜索或选择学校", trigger: "blur" }],
      },
    };
  },
  created() {
    this.listen();
  },
  methods: {
    listen() {
      let _this=this
      window.addEventListener(
        "message",
        function (event) {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          var loc = event.data;
          if (loc && loc.module == "locationPicker") {
            //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            _this.form.school_name = loc.poiname;
            _this.form.school_address = loc.latlng.lng + "," + loc.latlng.lat;
          }
        },
        false
      );
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
          addSchool(this.$qs.stringify({ data: this.form })).then((res) => {
            this.submitLoading = false;
            this.$message({ message: res.message, type: "success" });
            this.$router.push({ path: "/school/index" });
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

