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
        <tr v-for="post in filteredPosts" :key="post.post_id">
          <td>{{ post.post_title }}</td>
          <td>{{ post.post_id }}</td>
          <td>{{ formatDate(post.post_time) }}</td>
          <td>
            <v-icon v-if="post.is_crawled" color="success">mdi-check</v-icon>
            <v-icon v-else color="error">mdi-close</v-icon>
          </td>
          <td>
            <v-btn small text color="primary" @click="showEditDialog(post)">查看和修改标签</v-btn>
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


    <v-dialog v-model="editDialog.show" persistent width="100%" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>选择标签</span>
          <v-icon @click="editDialog.show = false">mdi-close</v-icon>
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
            <span class="subtitle-1">文章类型标签:</span>
            <v-chip
              v-for="tag in editDialog.post.tags.TypeTagList"
              :key="tag.tag_id"
              :value="tag.content"
              :color="tag.status===1? 'blue' : 'grey'"
              class="ma-1"
              @click="toggleTypeTag(tag)"
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
              v-for="tag in editDialog.post.tags.GameNameTagList"
              :key="tag.tag_id"
              :value="tag.content"
              :color="tag.status===1? 'blue' : 'grey'"
              class="ma-1"
              @click="toggleGameNameTag(tag)"
              text-color="white"
            >
              {{ tag.content }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <div class="my-2">
            <span class="subtitle-1">固定的标签1:</span>
            <v-chip
              v-for="tag in editDialog.post.tags.PreDefinedTagList"
              :key="tag.content"
              :value="tag.content"
              :color="tag.status===1? 'blue' : 'grey'"
              class="ma-1"
              @click="togglePredefinedTag(tag)"
              text-color="white"
            >
              {{ tag.content }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-1">已添加的自定义标签:</span>
            <v-chip
              v-for="tag in editDialog.post.tags.SelfDefinedTagList"
              :key="tag.tag_id"
              class="ma-1"
              color="purple"
              text-color="white"
              @click="removeSelfDefinedTag(tag)"
            >
              {{ tag.content }}
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
      editDialog: {
        show: false,
        post: {
          post_id: null,
          post_title: '',
          tags: {
            TypeTagList: [],
            GameNameTagList: [],
            PreDefinedTagList: [],
            SelfDefinedTagList: [],
          }
        },
        crawled: false
      },
      newTag: '',
      tagList:{},

    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) =>
        post.post_title.toLowerCase().includes(this.searchTerm.toLowerCase())
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
      httpInstance.get('/manager/GetTagsForEdit/?sign=0&id='+post.post_id)
        .then(response => {
          this.editDialog.post = post;
          this.editDialog.post.tags.TypeTagList = response.TypeTagList;
          this.editDialog.post.tags.GameNameTagList = response.GameNameTagList;
          this.editDialog.post.tags.PreDefinedTagList = response.PreDefinedTagList;
          this.editDialog.post.tags.SelfDefinedTagList = response.SelfDefinedTagList;

          // Filter tags based on status
          if (post.is_crawled === false){
            this.editDialog.post.tags.TypeTagList = this.editDialog.post.tags.TypeTagList.filter(tag => tag.status === 1);
            this.editDialog.post.tags.GameNameTagList = this.editDialog.post.tags.GameNameTagList.filter(tag => tag.status === 1);
          }
        })
        .catch(error => console.error('Error fetching tags:', error));
      this.editDialog.show = true;
      this.editDialog.crawled = post.is_crawled;
    },

    getPosts() {
      httpInstance.get('/manager/GetPostPreviewList/')
        .then((response) => {
          this.posts = response;
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
      this.deleteDialog.postId = post.post_id;
      this.deleteDialog.title = post.post_title;
    },
    deletePost() {
      // Send a request to the backend to delete the post
      const postId = this.deleteDialog.postId;
      httpInstance.post('/manager/DeletePost/?post_id='+postId);
      console.log(`Deleting post with ID ${postId}`);

      // Remove the post from the list
      this.posts = this.posts.filter((post) => post.post_id !== postId);

      this.deleteDialog.show = false;
    },
    toggleGameNameTag(tag) {
      tag.status = 1-tag.status;
      // if (tag.selected)
      //   this.editDialog.post.tags.push(tag.name);
      // else
      //   this.editDialog.post.tags = this.editDialog.post.tags.filter(t => t !== tag.name);
    },
    togglePredefinedTag(tag) {
      tag.status = 1-tag.status;
      // if (tag.selected)
      //   this.editDialog.post.tags.push(tag.name);
      // else
      //   this.editDialog.post.tags = this.editDialog.post.tags.filter(t => t !== tag.name);
    },
    toggleTypeTag(tag) {
      tag.status = 1-tag.status;
    },
    addSelfDefinedTag() {
      if (this.newTag.trim() !== '' && !this.editDialog.post.tags.SelfDefinedTagList.includes({
        tag_id: null,
        content:this.newTag.trim()
      })) {
        this.editDialog.post.tags.SelfDefinedTagList.push({
          tag_id: null,
          content:this.newTag.trim()
        });
        this.newTag = '';
      }
    },
    removeSelfDefinedTag(tag) {
      this.editDialog.post.tags.SelfDefinedTagList = this.editDialog.post.tags.SelfDefinedTagList.filter(t => t !== tag);
    },
    saveChanges() {
      // Here you can save the changes made to the tags in the editDialog.post object
      // For example, send a request to the backend to update the post with the new tags
      //新建一个formData对象,添加status为1的tag
      const formData = new FormData();
      const PostTypeTag = this.editDialog.post.tags.TypeTagList.filter(tag => tag.status === 1).map(tag => tag.content);
      const GameNameTag = this.editDialog.post.tags.GameNameTagList.filter(tag => tag.status === 1).map(tag => tag.content);
      const PreDefinedTag = this.editDialog.post.tags.PreDefinedTagList.filter(tag => tag.status === 1).map(tag => tag.content);
      const SelfDefinedTag = this.editDialog.post.tags.SelfDefinedTagList.map(tag => tag.content);
      formData.append("post_id",this.editDialog.post.post_id);
      formData.append("PostTypeTag", PostTypeTag);
      formData.append("GameNameTag", GameNameTag);
      formData.append("PreDefinedTag", PreDefinedTag);
      formData.append("SelfDefinedTag", SelfDefinedTag);
      httpInstance.post('/manager/EditPostTags/', formData);
      // Then close the dialog
      this.editDialog.show = false;
    },
  },
};
</script>
<style>
.close-btn:hover {
  background-color: #ccc; /* 灰色圆圈背景 */
  border-radius: 50%; /* 圆角边框 */
  padding: 5px; /* 可以根据需要调整 */
}

</style>
