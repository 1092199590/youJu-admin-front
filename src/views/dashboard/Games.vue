<template>
  <v-container id="game-management" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchTerm"
          label="Search Games"
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
          dense
          hide-details
        />
      </v-col>
    </v-row>
    <base-material-card icon="mdi-gamepad" title="游戏信息管理" class="px-5 py-3">
<!--      <v-btn color="primary" @click="goToEdit({})">新增</v-btn>-->
      <v-btn color="primary" @click="fetchLatestGames">获取最新游戏信息</v-btn>
      <v-simple-table>
        <thead>
        <tr>
          <th>ID</th>
          <th>中文名</th>
          <th>英文名</th>
          <th>价格</th>
          <th>评分</th>
          <th>平台</th>
          <th>操作</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="game in filteredGames" :key="game.id">
          <td>{{ game.id }}</td>
          <td>
            <div>{{ game.chineseName }}</div>
          </td>
          <td>
            <div>{{ game.englishName }}</div>
          </td>
          <td>
            <div>{{ game.price }}</div>
          </td>
          <td>
            <div>{{ game.rating }}</div>
          </td>
          <td>
            <div>
              <v-chip
                v-for="(platform, index) in game.platforms"
                :key="index"
                class="mr-2"
              >{{ platform }}</v-chip
              >
            </div>
          </td>
          <td>
            <v-btn small color="primary" @click="goToEdit(game)">编辑</v-btn>
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <edit-game-modal
      v-if="showEditModal"
      :game="editedGame"
      @close="showEditModal = false"
      @save="saveGame"
    />
  </v-container>
</template>

<script>
import axios from 'axios'; // 引入 Axios 库
import EditGameModal from './EditGameModal.vue';
import httpInstance from "@/utils/axios"; // 引入 EditGameModal 组件

export default {
  components: {
    EditGameModal,
  },
  data() {
    return {
      searchTerm: '',
      games: [], // 将游戏列表初始化为空数组
      editedGame: null,
      showEditModal: false,
    };
  },
  created() {
    // 页面加载时获取游戏列表数据
    this.getGameList();
  },
  computed: {
    filteredGames() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.games.filter(game =>
        game.chineseName.toLowerCase().includes(searchTerm) ||
        game.englishName.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    async getGameList() {
      await httpInstance.get('/manager/GetGamePreviewListAdmin/')
        .then(response => {
          response.forEach(game => {
            const platform=game.tags.GameTagList.map(tag => tag.content);
            this.games.push({
              id:game.game_id,
              chineseName:game.game_cn_name,
              englishName:game.game_en_name,
              price:game.price,
              rating: game.score,
              platforms:platform,
              coverImage: game.picture.img_url,
            });
          });
        })
        .catch(error => console.error('Error fetching report list:', error));
    },
    async fetchLatestGames() {
      try {
        await axios.get('http://127.0.0.1:4523/m1/4252541-0-default/manager/GetCrawler/');
        // 获取最新游戏信息后，立即更新游戏列表
        await this.getGameList();
      } catch (error) {
        console.error('Error fetching latest games:', error);
      }
    },
    goToEdit(game) {
      this.editedGame = { ...game };
      this.showEditModal = true;
    },
    saveGame(game) {
      // 实现保存游戏数据到后端的逻辑
    },
  },
};
</script>
