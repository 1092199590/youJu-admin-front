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
          <th>游戏名标签</th>
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
            <v-btn small color="primary" @click="showEditDialog(game)">编辑</v-btn>
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <v-dialog v-model="editDialog.show" persistent width="100%" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <v-icon @click="editDialog.show = false">mdi-close</v-icon>
          <span>选择标签</span>

        </v-card-title>
        <v-card-text>
          <!--          <div>-->
          <!--            <span class="subtitle-1">已选择的标签:</span>-->
          <!--            <v-chip-->
          <!--              v-for="tag in editDialog.post.tags"-->
          <!--              :key="tag"-->
          <!--              class="ma-1"-->
          <!--              color="blue"-->
          <!--              text-color="white"-->
          <!--            >-->
          <!--              {{ tag }}-->
          <!--            </v-chip>-->
          <!--          </div>-->
          <!--          <v-divider></v-divider>-->
          <div class="my-2">
            <span class="subtitle-1">游戏标签:</span>
            <v-chip
              v-for="tag in editDialog.game.tags.GameTagList"
              :key="tag.tag_id"
              :value="tag.content"
              :color="tag.status===1? 'blue' : 'grey'"
              class="ma-1"
              @click="toggleTag(tag)"
              text-color="white"
            >
              <!--              {{editDialog.post.tags.TypeTagList}}-->
              {{ tag.content }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <div class="my-2">
            <span class="subtitle-1">游戏名标签:</span>
            <v-chip
              v-for="tag in editDialog.game.tags.GameNameTagList"
              :key="tag.tag_id"
              :value="tag.content"
              :color="tag.status===1? 'blue' : 'grey'"
              class="ma-1"
              @click="toggleTag(tag)"
              text-color="white"
            >
              {{ tag.content }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="saveChanges">确认添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      editDialog: {
        show: false,
        game: {
          id: 1,
          tags: {
            GameNameTagList: [],
            GameTagList: [],
          },
        },
        crawled: false
      },
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
    getGameList() {
      httpInstance.get('/manager/GetGamePreviewListAdmin/')
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
    fetchLatestGames() {
      try {
        axios.get('http://127.0.0.1:4523/m1/4252541-0-default/manager/GetCrawler/');
        // 获取最新游戏信息后，立即更新游戏列表
        this.getGameList();
      } catch (error) {
        console.error('Error fetching latest games:', error);
      }
    },
    toggleTag(tag) {
      tag.status = 1-tag.status;
    },
    showEditDialog(game) {
      httpInstance.get('/manager/GetTagsForEdit/?sign=1&id='+game.id)
        .then(response => {
          this.editDialog.game.id = game.id;
          // Assuming response.GameTagList is an array of tags
          this.editDialog.game.tags.GameTagList = response.GameTagList;
          this.editDialog.game.tags.GameNameTagList = response.GameNameTagList;
          this.editDialog.game.tags.GameNameTagList = this.editDialog.game.tags.GameNameTagList.filter(tag => tag.status === 1);

        })
        .catch(error => console.error('Error fetching tags:', error));
      this.editDialog.show = true;
    },

    saveChanges() {
      //新建一个formData对象,添加status为1的tag
      const formData = new FormData();
      const GameTagList = this.editDialog.game.tags.GameTagList.filter(tag => tag.status === 1).map(tag => tag.content);
      const selectedTagName = this.editDialog.game.tags.GameNameTagList.find(tag => tag.status === 1)?.content || '';
      formData.append("game_id",this.editDialog.game.id);
      formData.append("GameTagList", GameTagList);
      formData.append("GameNameTag", selectedTagName);
      httpInstance.post('/manager/CreateOrEditGameDetail/', formData)
        .then(response => {
          alert('保存成功');
        });
      // Then close the dialog
      this.editDialog.show = false;
    },
    saveGame(game) {
      // 实现保存游戏数据到后端的逻辑
    },
  },
};
</script>
