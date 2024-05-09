<template>
  <v-container id="submission-management" fluid tag="section">

    <base-material-card icon="mdi-file-document" title="投稿管理" class="px-5 py-3">
      <v-simple-table>
        <thead>
        <tr>
          <th>ID</th>
          <th>内容</th>
          <th>时间</th>
          <th>标签</th>
          <th>操作</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="submission in submissions" :key="submission.id">
          <td>{{ submission.id }}</td>
          <td>
            <v-btn small text color="primary" @click="showContent(submission)">查看内容</v-btn>
          </td>
          <td>{{submission.time}}</td>
          <td>
            <v-btn small text color="primary" @click="showEditDialog(submission)">查看和修改标签</v-btn>
          </td>
          <td>
            <v-btn small color="success" @click="showReasonDialog(submission, 'accept')">通过</v-btn>
            <v-btn small color="error" @click="showReasonDialog(submission, 'reject')">打回</v-btn>
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>

    <v-dialog v-model="reasonDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">{{ reasonDialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="reasonDialog.reason" label="原因" rows="3" auto-grow></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="reasonDialog.show = false">取消</v-btn>
          <v-btn color="primary" @click="submitReason">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="contentDialog.show" max-width="800">
      <v-card>
        <v-card-title>
          <span class="headline">投稿内容</span>
        </v-card-title>
        <v-card-text>
          <div v-html="contentDialog.content"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="contentDialog.show = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <span class="subtitle-1">文章类型标签:</span>
            <v-chip
              v-for="tag in editDialog.post.tags.TypeTagList"
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
              v-for="tag in editDialog.post.tags.GameNameTagList"
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
          <v-divider></v-divider>
          <div class="my-2">
            <span class="subtitle-1">固定的标签1:</span>
            <v-chip
              v-for="tag in editDialog.post.tags.PreDefinedTagList"
              :key="tag.content"
              :value="tag.content"
              :color="tag.status===1? 'blue' : 'grey'"
              class="ma-1"
              @click="toggleTag(tag)"
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
      submissions: [
        // Add more submissions as needed
      ],
      reasonDialog: {
        show: false,
        title: '',
        reason: '',
        submissionId: null,
        action: '',
      },
      contentDialog: {
        show: false,
        content: '',
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
      },
      newTag: '',
    };
  },
  created() {
    this.getSubmissions();
  },
  methods: {
    getSubmissions() {
      httpInstance.get('/manager/GetUnauditedPostList/?i=10')
        .then((response) => {
          response.forEach((submission) => {
            this.submissions.push({
              id: submission.post_id,
              title: submission.post_title,
              content: submission.post_content,
              time: submission.post_time,
              tags: submission.tags
            });
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showEditDialog(submission) {
      httpInstance.get('/manager/GetTagsForEdit/?sign=0&id='+submission.id)
        .then(response => {
          this.editDialog.post = submission;
          this.editDialog.post.tags.TypeTagList = response.TypeTagList;
          this.editDialog.post.tags.GameNameTagList = response.GameNameTagList;
          this.editDialog.post.tags.PreDefinedTagList = response.PreDefinedTagList;
          this.editDialog.post.tags.SelfDefinedTagList = response.SelfDefinedTagList;
          this.editDialog.post.tags.TypeTagList = this.editDialog.post.tags.TypeTagList.filter(tag => tag.status === 1);
          this.editDialog.post.tags.GameNameTagList = this.editDialog.post.tags.GameNameTagList.filter(tag => tag.status === 1);
        })
        .catch(error => console.error('Error fetching tags:', error));
      this.editDialog.show = true;
    },
    closeWithoutSaving() {
      this.editDialog.show = false;
    },
    toggleTag(tag) {
      tag.status = 1-tag.status;
    },
    removeSelfDefinedTag(tag) {
      this.editDialog.post.tags.SelfDefinedTagList = this.editDialog.post.tags.SelfDefinedTagList.filter(t => t !== tag);
    },
    showReasonDialog(submission, action) {
      this.reasonDialog.show = true;
      this.reasonDialog.title = `${action === 'accept' ? '通过' : '打回'}原因`;
      this.reasonDialog.reason = '';
      this.reasonDialog.submissionId = submission.id;
      this.reasonDialog.action = action;
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
    showContent(submission) {
      this.contentDialog.show = true;
      this.contentDialog.content = submission.content;
    },
    submitReason() {
      // Send the reason and action to the backend
      const submission = this.submissions.find((s) => s.id === this.reasonDialog.submissionId);
      const data = {
        post_id: submission.id,
        sign: this.reasonDialog.action==='accept' ? 1 : 0,
      };
      httpInstance.post('/manager/PostAuditMessage/?post_id='+data.post_id+'&sign='+data.sign);
      console.log('Sending data to backend:', data);

      // Remove the submission from the list
      this.submissions = this.submissions.filter((s) => s.id !== submission.id);

      this.reasonDialog.show = false;
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
      formData.append("post_id",this.editDialog.post.id);
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
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
}
</style>
