<template>
  <v-container id="post-management" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchTerm"
          label="Search Posts"
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
          dense
          hide-details
        />
      </v-col>
    </v-row>

    <base-material-card icon="mdi-file-document" title="文章管理" class="px-5 py-3">
      <v-simple-table>
        <thead>
        <tr>
          <th>标题</th>
          <th>ID</th>
          <th>发布时间</th>
          <th>是否为爬取</th>
          <th>标签</th>
          <th>操作</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="post in filteredPosts" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.id }}</td>
          <td>{{ formatDate(post.publishedAt) }}</td>
          <td>
            <v-icon v-if="post.crawled" color="success">mdi-check</v-icon>
            <v-icon v-else color="error">mdi-close</v-icon>
          </td>
          <td>
            <v-chip
              v-for="(tag, index) in post.tags.slice(0, 3)"
              :key="index"
              class="mr-2"
            >{{ tag }}</v-chip
            >
            <v-btn v-if="post.tags.length > 3" small text color="primary" @click="showAllTags(post)"
            >更多</v-btn
            >
          </td>
          <td>
            <v-chip v-for="(tag, index) in post.tags.slice(0, 3)" :key="index" class="mr-2">{{ tag }}</v-chip>
            <v-btn v-if="!post.crawled" small text color="primary" @click="showEditDialog(post)">修改</v-btn>
          </td>
          <td>
            <v-btn small color="error" @click="confirmDelete(post)">删除</v-btn>
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>

    <v-dialog v-model="deleteDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">确认删除</span>
        </v-card-title>
        <v-card-text>
          您确认要删除文章"{{ deleteDialog.title }}"吗?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteDialog.show = false">取消</v-btn>
          <v-btn color="error" @click="deletePost">确认删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tagDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">所有标签</span>
        </v-card-title>
        <v-card-text>
          <v-chip v-for="(tag, index) in tagDialog.tags" :key="index" class="mr-2">{{ tag }}</v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tagDialog.show = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog.show" persistent width="100%" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>选择标签</span>
          <v-btn icon @click="closeWithoutSaving">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            <span class="subtitle-1">已选择的标签:</span>
            <v-chip
              v-for="tag in editDialog.post.tags"
              :key="tag"
              class="ma-1"
              color="blue"
              text-color="white"
            >
              {{ tag }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <div class="my-2">
            <span class="subtitle-1">游戏名标签:</span>
            <v-chip
              v-for="tag in gameNameTags"
              :key="tag.name"
              :value="tag.name"
              :color="tag.selected ? 'blue' : 'grey'"
              class="ma-1"
              @click="toggleGameNameTag(tag)"
              text-color="white"
            >
              {{ tag.name }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <div class="my-2">
            <span class="subtitle-1">固定的标签1:</span>
            <v-chip
              v-for="tag in preDefinedTags"
              :key="tag.name"
              :value="tag.name"
              :color="tag.selected ? 'blue' : 'grey'"
              class="ma-1"
              @click="togglePredefinedTag(tag)"
              text-color="white"
            >
              {{ tag.name }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-1">已添加的自定义标签:</span>
            <v-chip
              v-for="tag in editDialog.post.SelfDefinedTagList"
              :key="tag"
              class="ma-1"
              color="purple"
              text-color="white"
              @click="removeSelfDefinedTag(tag)"
            >
              {{ tag }}
            </v-chip>
          </div>
          <div class="my-2">
            <v-text-field
              v-model="newTag"
              label="添加自定义标签"
              solo
              dense
              hide-details
              append-icon="mdi-plus"
              @click:append="addSelfDefinedTag"
              @keyup.enter="addSelfDefinedTag"
            ></v-text-field>
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
import httpInstance from "@/utils/axios";

export default {
  data() {
    return {
      searchTerm: '',
      posts: [
        // Add more posts as needed
      ],
      deleteDialog: {
        show: false,
        postId: null,
        title: '',
      },
      tagDialog: {
        show: false,
        tags: [],
      },
      editDialog: {
        show: false,
        post: null,
        crawled: false,
      },
      gameNameTags: [
        {name: '艾尔登法环', selected: false},
        {name: '马里奥', selected: false},
        {name: '原神', selected: false},
        {name: '塞尔达传说', selected: false},
        {name: '宝可梦', selected: false},
        {name: '魔兽世界', selected: false},
        {name: '我的世界', selected: false},
        {name: '堡垒之夜', selected: false},
        {name: '英雄联盟', selected: false},
        {name: '绝地求生', selected: false},
        {name: '荒野乱斗', selected: false},
        {name: '怪物猎人', selected: false},
        {name: '战地', selected: false},
        {name: '饥荒', selected: false},
        {name: '剑网3', selected: false},
        {name: '魔兽争霸', selected: false},
        {name: '皇室战争', selected: false},
        {name: '文明', selected: false},
        {name: '模拟人生', selected: false},
        {name: '辐射', selected: false},
        {name: '战争机器', selected: false},
        {name: '星露谷物语', selected: false},
        {name: '刺客信条', selected: false},
        {name: '使命召唤', selected: false},
        {name: '暗黑破坏神', selected: false},
        {name: '神秘海域', selected: false},
        {name: '生化奇兵', selected: false},
        {name: '怪物猎人世界', selected: false},
        {name: '荣耀战魂', selected: false},
        {name: '街头霸王', selected: false},
        {name: '真三国无双', selected: false},
        {name: '火焰纹章', selected: false},
        {name: '战神', selected: false},
        {name: '无主之地', selected: false},
        {name: '暗黑血统', selected: false},
        {name: '黑暗之魂', selected: false},
        {name: '忍者之印', selected: false},
        {name: '武士道', selected: false},
        {name: '鬼泣', selected: false},
        {name: '最终幻想', selected: false},
        {name: '巫师', selected: false},

      ],
      preDefinedTags: [
        {name: 'PS4', selected: false},
        {name: 'PS5', selected: false},
        {name: 'Xbox', selected: false},
        {name: 'Switch', selected: false},
        {name: 'PC', selected: false},
        {name: 'VR', selected: false},

      ],
      newTag:'',

    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) =>
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    closeWithoutSaving() {
      this.editDialog.show = false;
    },
    showEditDialog(post) {
      this.editDialog.show = true;
      this.editDialog.post = post;
      this.editDialog.crawled = post.crawled;
    },
    getPosts() {
      httpInstance.get('/manager/GetPostPreviewList/')
        .then((response) => {
          response.forEach((post) => {
            const tags = post.tags.TypeTagList.map(tag => tag.content);
            this.posts.push({
              id: post.post_id,
              title: post.post_title,
              publishedAt: post.post_time,
              crawled: post.is_crawled,
              tags: tags,
              TypeTagList: post.tags.TypeTagList,
              GameNameTagList:post.tags.GameNameTagList,
              GameTagList:post.tags.GameTagList,
              PreDefinedTagList:post.tags.PreDefinedTagList,
              SelfDefinedTagList:post.tags.SelfDefinedTagList,
            });
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    confirmDelete(post) {
      this.deleteDialog.show = true;
      this.deleteDialog.postId = post.id;
      this.deleteDialog.title = post.title;
    },
    deletePost() {
      // Send a request to the backend to delete the post
      const postId = this.deleteDialog.postId;
      httpInstance.post('/manager/DeletePost/?post_id='+postId);
      console.log(`Deleting post with ID ${postId}`);

      // Remove the post from the list
      this.posts = this.posts.filter((post) => post.id !== postId);

      this.deleteDialog.show = false;
    },
    showAllTags(post) {
      this.tagDialog.show = true;
      this.tagDialog.tags = post.tags;
    },
    toggleGameNameTag(tag) {
      tag.selected = !tag.selected;
    },
    togglePredefinedTag(tag) {
      tag.selected = !tag.selected;
    },
    addSelfDefinedTag() {
      if (this.newTag.trim() !== '' && !this.editDialog.post.SelfDefinedTagList.includes(this.newTag.trim())) {
        this.editDialog.post.SelfDefinedTagList.push(this.newTag.trim());
        this.newTag = '';
      }
    },
    removeSelfDefinedTag(tag) {
      this.editDialog.post.SelfDefinedTagList = this.editDialog.post.SelfDefinedTagList.filter(t => t !== tag);
    },
    saveChanges() {
      // Here you can save the changes made to the tags in the editDialog.post object
      // For example, send a request to the backend to update the post with the new tags
      console.log('Saving changes...');
      console.log(this.editDialog.post);
      // Then close the dialog
      this.editDialog.show = false;
    },
  },
};
</script>
