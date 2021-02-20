<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :lg="8" :xl="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(0)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="component" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" style="width:110px">
          <div class="card-panel-text">我管理的学校</div>
          <!-- <count-to
            :start-val="0"
            :end-val="countData.student"
            :duration="1600"
            class="card-panel-num"
          /> -->
          <!-- style="width: 150px" -->
          <el-select
            v-model="school_id"
            placeholder="分类"
            clearable
            size="medium"
            class="input"
            @change="changenum"
          >
            <el-option label="全部学校" :value="school_all" />
            <el-option
              v-for="(item, index) in schoolList"
              :key="index"
              :label="item.school_name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" :xl="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/user/userList')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户总数</div>
          <count-to
            :start-val="0"
            :end-val="countData.user_count"
            :duration="2000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" :xl="4" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('/task/orderTask')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="clipboard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">任务总数</div>
          <count-to
            :start-val="0"
            :end-val="countData.task_count"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" :xl="4" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData(0)"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户总消费</div>
          <count-to
            :start-val="0"
            :end-val="countData.user_sum_pay"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" :xl="4" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('/community/post')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">帖子总数</div>
          <count-to
            :start-val="0"
            :end-val="countData.posts_count"
            :duration="2000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" :xl="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(0)">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="nested" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">社团总数</div>
          <!-- <count-to
            :start-val="0"
            :decimals="2"
            :end-val="countData.order"
            :duration="2200"
            class="card-panel-num"
          /> -->
          <count-to
            :start-val="0"
            :end-val="countData.club_count"
            :duration="2000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo,
  },
  props: {
    countData: {
      type: Object,
      default: { user_count: 0, club_count: 0, posts_count: 0, task_count: 0 },
    },
    schoolList: {
      type: Array,
      default: [],
    },
    school_all: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      school_id: "",
    };
  },
  created() {},
  mounted() {
    this.school_id = this.school_all;
  },
  methods: {
    handleSetLineChartData(type) {
      if (type == 0) {
        return false;
      }
      this.$router.push({ path: type });
      // this.$emit("handleSetLineChartData", type);
    },
    changenum(val) {
      this.$emit("changenum", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  // .card-panel-description {
  //   display: none;
  // }

  // .card-panel-icon-wrapper {
  //   float: none !important;
  //   width: 100%;
  //   height: 100%;
  //   margin: 0 !important;

  //   .svg-icon {
  //     display: block;
  //     margin: 14px auto !important;
  //     float: none !important;
  //   }
  // }
}
</style>
