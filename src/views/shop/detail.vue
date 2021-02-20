<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="店铺名称" >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.sex">
          <el-radio :label="2">已封</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.linkman" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" maxlength="11" />
      </el-form-item>
      <el-form-item label="店铺头像" >
        <el-input v-model="form.header" />
      </el-form-item>
      <el-form-item label="店铺图片" >
        <el-input v-model="form.image" />
      </el-form-item>
      <el-form-item label="店铺背景图" >
        <el-input v-model="form.backimage" />
      </el-form-item>
      <el-form-item label="店铺公告" >
        <el-input v-model="form.notice" />
      </el-form-item>
      <el-form-item label="营业状态">
        <el-radio-group v-model="form.sex">
          <el-radio :label="2">未营业</el-radio>
          <el-radio :label="1">营业</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="营业时间" >
        <el-input v-model="form.start_time" />
        <el-input v-model="form.end_time" />
      </el-form-item>
      <el-form-item label="起送金额" >
        <el-input v-model="form.upsendmoney" />
      </el-form-item>
      <el-form-item label="有无配送费" >
        <el-radio-group v-model="form.send_status">
          <el-radio :label="3">满减配送</el-radio>
          <el-radio :label="2">有配送费</el-radio>
          <el-radio :label="1">无配送费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配送费" >
        <el-input v-model="form.base_send" />
      </el-form-item>
      <el-form-item label="满减金额" >
        <el-input v-model="form.discount" />
      </el-form-item>
      <el-form-item label="满减后配送费" >
        <el-input v-model="form.send_fee" />
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
import { getStorelist } from "@/api/shop";

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z]{6,12}$/.test(value)) {
        callback(new Error("密码6到12位字母或数字,且不能出现空格!"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("请填写正确手机号!"));
      } else {
        callback();
      }
    };
    return {
      submitLoading: false,
      form: {
        name: "",
        sex: 2,
        phone: "",
        password: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "长度在 2 到 8 个字符",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          editorteacher(this.$qs.stringify({ data: this.form })).then((res) => {
            this.submitLoading = false;
            this.$message({ message: res.message, type: "success" });
            this.$router.push({ path: "/teacher/teacherList" });
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

