<template>
  <v-container id="submission-management" fluid tag="section">

    <base-material-card icon="mdi-file-document" title="投稿管理" class="px-5 py-3">
      <v-simple-table>
        <thead>
        <tr>
          <th>ID</th>
          <th>内容</th>
          <th>时间</th>
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
              time: submission.post_time
            });
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showReasonDialog(submission, action) {
      this.reasonDialog.show = true;
      this.reasonDialog.title = `${action === 'accept' ? '通过' : '打回'}原因`;
      this.reasonDialog.reason = '';
      this.reasonDialog.submissionId = submission.id;
      this.reasonDialog.action = action;
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
  },
};
</script>
