<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span>管理员：{{ adminName }}</span>
          <i class="el-icon-caret-bottom" style="top: 19px" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="dialogFormVisible1 = true"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible1" center>
      <el-form v-loading="loading" label-width="80px" label-position="right">
        <el-form-item label="旧密码:" style="width: 400px; margin: 0 auto">
          <el-input
            type="password"
            v-model="old_password"
            auto-complete="off"
            class="infoname"
            size="small"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码:" style="width: 400px; margin: 0 auto">
          <el-input
            type="password"
            v-model="password"
            auto-complete="off"
            class="infoname"
            size="small"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" style="width: 400px; margin: 0 auto">
          <el-input
            type="password"
            v-model="repass"
            auto-complete="off"
            class="infoname"
            size="small"
            placeholder="请输入再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="upload">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  data() {
    return {
      adminName: localStorage.getItem("name"),
      dialogFormVisible1: false,
      password: "",
      repass: "",
      old_password: "",
      loading: false,
    };
  },
  methods: {
    upload() {
      if (this.old_password == "") {
        this.$message.error("请输入旧密码");
        return false;
      } else if (this.password == "") {
        this.$message.error("请输入新密码");
        return false;
      } else if (this.password != this.repass) {
        this.$message.error("两次密码输入不一致");
        return false;
      }
      this.loading=true;
      this.$store
        .dispatch("user/changepwd", {
          password: this.password,
          old_password: this.old_password,
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.loading=false;
          this.logout();
        })
        .catch(() => {
          this.loading=false;
        });
      // this.$prompt("请输入新密码", "修改管理员密码", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   inputPattern: /^[0-9a-zA-Z]{6,12}$/,
      //   inputErrorMessage: "密码必须6到12位字母或数字，且不能出现空格",
      // })
      //   .then(({ value }) => {
      //     this.$store
      //       .dispatch("user/changepwd", {
      //         username: "admin",
      //         password: this.password,
      //       })
      //       .then(() => {
      //         this.$message({
      //           type: "success",
      //           message: "修改成功",
      //         });
      //         this.$router.push({ path: this.redirect || "/" });
      //       })
      //       .catch(() => {});
      //   })
      //   .catch(() => {});
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      this.$store.dispatch("user/logout").then((res) => {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
