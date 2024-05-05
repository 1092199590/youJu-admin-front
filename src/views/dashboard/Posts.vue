<template>
  <v-container id="post-management" fluid tag="section">
      <v-text-field
        v-model="searchTerm"
        label="Search Posts"
        prepend-inner-icon="mdi-magnify"
        clearable
        outlined
        dense
        hide-details
      />

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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '',
      posts: [
        {
          id: 1,
          title: 'My Awesome Post',
          publishedAt: '2023-04-15T10:30:00Z',
          crawled: true,
          tags: ['vue', 'javascript', 'web-development'],
        },
        {
          id: 2,
          title: 'Another Great Post',
          publishedAt: '2023-04-20T16:45:00Z',
          crawled: false,
          tags: ['python', 'machine-learning', 'data-science', 'ai'],
        },
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
    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) =>
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  methods: {
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
      // Replace this with your actual API call
      console.log(`Deleting post with ID ${postId}`);

      // Remove the post from the list
      this.posts = this.posts.filter((post) => post.id !== postId);

      this.deleteDialog.show = false;
    },
    showAllTags(post) {
      this.tagDialog.show = true;
      this.tagDialog.tags = post.tags;
    },
  },
};
</script>
