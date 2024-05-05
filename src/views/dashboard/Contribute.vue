<template>
  <v-container id="submission-management" fluid tag="section">

    <base-material-card icon="mdi-file-document" title="投稿管理" class="px-5 py-3">
      <v-simple-table>
        <thead>
        <tr>
          <th>ID</th>
          <th>内容</th>
          <th>操作</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="submission in submissions" :key="submission.id">
          <td>{{ submission.id }}</td>
          <td>
            <v-btn small text color="primary" @click="showContent(submission)">查看内容</v-btn>
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      submissions: [
        {
          id: 1,
          title: 'My Awesome Submission',
          content: '<div>\n                  <p class="text-subtitle-1 primary--text font-weight-medium">\n                    Dignissim cras tincidunt lobortis feugiat vivamus at. Amet luctus venenatis lectus magna fringilla. Nibh tellus molestie nunc non blandit.\n                    Et magnis dis parturient montes nascetur ridiculus mus mauris vitae. Amet massa vitae tortor condimentum lacinia quis vel eros. Eros\n                    in cursus turpis massa tincidunt dui ut ornare. Est ante in nibh mauris cursus mattis molestie. Nec ullamcorper sit amet risus nullam\n                    eget felis eget. Tincidunt praesent semper feugiat nibh sed. Et leo duis ut diam quam nulla pottitor massa id. Convallis convallis tellus id\n                    interdum velit laoreet id. Enim ut sem viverra aliquet eget sit. Mollis aliquam ut porttitor leo a diam. Eleifend donec pretium vulputate\n                    sapien nec sagittis aliquam. Velit egestas dui id ornares.\n                  </p>\n                </div>\n\n                <div class="py-4">\n                  <v-alert\n                    class="font-italic text-h6 text-center"\n                    border="left"\n                    colored-border\n                    color="accent"\n                  >\n                    Srem Ipsum is simply dummy text of the printing and typesetting industry. Lorem lpsum has been\n                    the industry\'s standard dummy text ever since the 1500s. Lorem Ipsum is simply .\n                  </v-alert>\n                </div>\n          <div class="text-h5 primary--text font-weight-bold">\n                  Ultricies mi quis hendrerit dolor\n                  <p class="text-subtitle-1 primary--text font-weight-medium mt-5">\n                    Quam adipiscing vitae proin sagittis nisl rhoncus. Integer vitae justo eget magna fermentum iaculis eu non. Vitae congue mauris\n                    rhoncus aenean vel elit. Nibh mauris cursus mattis molestie. Etiam sit amet nisl purus. At auctor urna nunc id cursus metus. Diam in arcu\n                    cursus euismod quis viverra nibh cras.\n                  </p>\n                </div>\n\n                <div class="my-4">\n                  <v-row>\n                    <v-col cols="6">\n                      <v-card>\n                        <v-img\n                          src="https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_1280.jpg"\n                          :aspect-ratio="16 / 9"\n                          gradient="to top, rgba(25,32,72,.4), rgba(25,32,72,.0)"\n                        ></v-img>\n                      </v-card>\n                    </v-col>\n\n                    <v-col cols="6">\n                      <v-card>\n                        <v-img\n                          src="https://cdn.pixabay.com/photo/2019/11/01/11/08/landscape-4593909_1280.jpg"\n                          :aspect-ratio="16 / 9"\n                          gradient="to top, rgba(25,32,72,.4), rgba(25,32,72,.0)"\n                        ></v-img>\n                      </v-card>\n                    </v-col>\n                  </v-row>\n                </div>\n\n                <div class="text-h5 primary--text font-weight-bold">\n                  Nibh tellus molestie nunc non blandit massa enim\n                  <div class="text-subtitle-1 primary--text font-weight-medium mt-5">\n                    <ul>\n                      <li class="my-2">\n                        Aliquam purus sit amet luctus venenatis lectus magna fringilla urna. Malesuada bibendum arcu vitae elementum curabitur vitae\n                        nunc sed. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis.\n                      </li>\n\n                      <li class="my-2">\n                        Proin libero nunc consequat interdum varius. Amet luctus venenatis lectus magna fringillal urna porttitor. Enim tortor at auctor\n                        urna nunc id cursus.\n                      </li>\n\n                      <li class="my-2">\n                        Volutpat maecenas volutpat blandit aliquam. Adipiscing enim eu turpis egestas pretium aenean pharetra magna Morbi leo\n                        urna molestie at elementum eu.\n                      </li>\n                    </ul>\n\n                    <p>\n                      Venenatis a condimentum vitae sapien pellentesque habitant morbi tristique senectus. Semper auctor neque vitae tempus. Magnis dis\n                      parturient montes nascetur ridiculus mus. A condimentum vitae sapien pellentesque habitant morbi tristique. Duis ut diam quam nulla\n                      porttitor.\n                    </p>\n                  </div>\n                </div>',
        },
        {
          id: 2,
          title: 'Another Great Submission',
          content: '<h1>Another Great Submission</h1><p>Here is the content for another submission.</p><image src="https://th.bing.com/th/id/OIP.wXlMJPAjZJ6y_TmJilB-5QHaLH?w=200&h=300&c=7&r=0&o=5&dpr=2.2&pid=1.7"></image>',
        },
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
  methods: {
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
        submissionId: submission.id,
        action: this.reasonDialog.action,
        reason: this.reasonDialog.reason,
      };
      // Replace this with your actual API call
      console.log('Sending data to backend:', data);

      // Remove the submission from the list
      this.submissions = this.submissions.filter((s) => s.id !== submission.id);

      this.reasonDialog.show = false;
    },
  },
};
</script>
