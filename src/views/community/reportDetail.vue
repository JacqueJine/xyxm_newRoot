<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="任务标题">
        <el-input v-model="form.title" disabled />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="form.user_name" disabled />
      </el-form-item>
      <el-form-item label="用户手机号">
        <el-input v-model="form.user_phone" disabled />
      </el-form-item>
      <el-form-item label="任务类型">
        <el-radio-group v-model="form.type" disabled>
          <el-radio :label="1">快递帮</el-radio>
          <el-radio :label="2">校园跑腿</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="课程封面" prop="img">
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
        <p style="line-height: 30px; color: #f00">*建议图片尺寸 336*200 像素</p>
      </el-form-item> -->
      <el-form-item label="任务状态">
        <el-select v-model="form.type" disabled>
          <el-option label="待接单" :value="0" />
          <el-option label="进行中" :value="1" />
          <el-option label="待结算" :value="2" />
          <el-option label="已取消" :value="3" />
          <el-option label="已完成" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="取件地点">
        <el-input v-model="form.task_address" disabled />
      </el-form-item>
      <el-form-item label="送件地点">
        <el-input v-model="form.destination" disabled />
      </el-form-item>
      <el-form-item label="送件时间">
        <el-input v-model="form.destination_time" disabled />
      </el-form-item>
      <el-form-item label="任务内容" v-if="form.type != 2">
        <el-input v-model="form.express_desc" disabled />
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="form.user_name" disabled />
      </el-form-item>
      <el-form-item label="收货人手机号">
        <el-input v-model="form.user_phone" disabled />
      </el-form-item>
      <el-form-item label="备注" v-if="form.type != 3">
        <el-input v-model="form.comment" disabled />
      </el-form-item>
      <el-form-item label="赏金">
        <el-input v-model="form.money" disabled />
      </el-form-item>
      <el-form-item label="加急">
        <el-radio-group v-model="form.is_urgent" disabled>
          <el-radio :label="1">加急</el-radio>
          <el-radio :label="0">不加急</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="加急金额" v-if="form.is_urgent">
        <el-input v-model="form.urgent_price" disabled />
      </el-form-item>
      <el-form-item label="预付">
        <el-radio-group v-model="form.is_good_prepay" disabled>
          <el-radio :label="1">预付</el-radio>
          <el-radio :label="0">不预付</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预付金额" v-if="form.is_good_prepay">
        <el-input v-model="form.good_prepay" disabled />
      </el-form-item>
      <el-form-item label="支付金额">
        <el-input v-model="form.price" disabled />
      </el-form-item>
      <!-- <el-form-item label="课程详情" prop="desc">
        <tinymce v-model="form.desc" :height="300" />
      </el-form-item> -->
      <!-- <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit"
          >确定</el-button
        >
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { getInfoTask } from "@/api/school";

import Tinymce from "@/components/Tinymce";
export default {
  components: { Tinymce },
  data() {
    return {
      submitLoading: false,
      typeArr: [],
      typeList: [],
      form: {
        title: "",
        task_address: "",
        type: "",
        money: "",
        destination: "",
        destination_time: "",
        express_desc: "",
        user_name: "",
        user_phone: "",
        comment: "",
        is_urgent: "",
        is_good_prepay: "",
        urgent_price: "",
        is_urgent: "",
        good_prepay: "",
        price: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 4,
            max: 50,
            message: "长度在 4 到 50 个字符",
            trigger: "change",
          },
        ],
        img: [{ required: true, message: "请选择封面", trigger: "blur" }],
        type: [{ required: true, message: "请选择课程模式", trigger: "blur" }],
        type_id: [{ required: true, message: "请选择分类", trigger: "blur" }],
        teacher_id: [
          { required: true, message: "请选择老师", trigger: "blur" },
        ],
        class_time: [
          { required: true, message: "请填写总课时", trigger: "blur" },
        ],
        price: [{ required: true, message: "请填写价格", trigger: "blur" }],
        desc: [{ required: true, message: "请填写内容", trigger: "blur" }],
      },
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.getData(id);
  },
  methods: {
    // 获取单个
    getData(id) {
      getInfoTask(this.$qs.stringify({ id: id })).then((res) => {
        this.form.title = res.result.title;
        this.form.type = res.result.type;
        this.form.task_address = res.result.task_address;
        this.form.destination = res.result.destination;
        this.form.destination_time = res.result.destination_time;
        this.form.express_desc = res.result.express_desc;
        this.form.user_name = res.result.user_name;
        this.form.user_phone = res.result.user_phone;
        this.form.comment = res.result.comment;
        this.form.money = res.result.money;
        this.form.is_urgent = res.result.is_urgent;
        this.form.is_good_prepay = res.result.is_good_prepay;
        this.form.urgent_price = res.result.urgent_price;
        this.form.good_prepay = res.result.good_prepay;
        this.form.price = res.result.price;
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.status == 200) {
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
    handleChange(value) {
      if (!value.length) {
        this.form.type_id = "";
        this.form.class_id = "";
      } else {
        this.form.type_id = value[1] ? value[1] : "";
        this.form.class_id = value[0];
      }
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdateCourse(
            this.$qs.stringify({ id: this.$route.params.id, data: this.form })
          ).then((res) => {
            this.submitLoading = false;
            this.$message({ message: res.message, type: "success" });
            this.$router.push({ path: "/course/index" });
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

