<template>
  <v-container
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <router-link
          to="Report"
          style="text-decoration: none;"
        >
          <base-material-stats-card
            color="red"
            icon="mdi-alert-circle"
            title="举报管理"
            value="35 新举报"
            sub-icon="mdi-clock"
            sub-text="刚刚更新"
          />
        </router-link>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <router-link
          to="Users"
          style="text-decoration: none;"
        >
          <base-material-stats-card
            color="blue"
            icon="mdi-account-group"
            title="人员管理"
            value="250 人员"
            sub-icon="mdi-update"
            sub-text="最近更新"
          />
        </router-link>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <router-link
          to="Contribute"
          style="text-decoration: none;"
        >
          <base-material-stats-card
            color="green"
            icon="mdi-file-upload"
            title="投稿管理"
            value="80 待审"
            sub-icon="mdi-clock"
            sub-text="1小时前更新"
          />
        </router-link>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <router-link
          to="Posts"
          style="text-decoration: none;"
        >
          <base-material-stats-card
            color="purple"
            icon="mdi-file-document"
            title="文章管理"
            value="150 文章"
            sub-icon="mdi-calendar"
            sub-text="今天"
          />
        </router-link>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <router-link
          to="Games"
          style="text-decoration: none;"
        >
          <base-material-stats-card
            color="orange"
            icon="mdi-gamepad-variant"
            title="游戏信息"
            value="30 更新"
            sub-icon="mdi-alert"
            sub-text="更新待确认"
          />
        </router-link>
      </v-col>

<!--      <v-col-->
<!--        cols="12"-->
<!--        sm="6"-->
<!--        md="4"-->
<!--      >-->
<!--        <router-link-->
<!--          to="ReleaseNews"-->
<!--          style="text-decoration: none;"-->
<!--        >-->
<!--          <base-material-stats-card-->
<!--            color="cyan"-->
<!--            icon="mdi-broadcast"-->
<!--            title="新闻发布"-->
<!--            value="12 草稿"-->
<!--            sub-icon="mdi-check"-->
<!--            sub-text="待发布"-->
<!--          />-->
<!--        </router-link>-->
<!--      </v-col>-->
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
      // 数据和方法可以根据实际后端接口和功能需求进行添加和修改
      }
    },
  }
</script>

<style>
/* 样式可以根据具体要求进行定制，以符合企业或应用的视觉标准 */
</style>
