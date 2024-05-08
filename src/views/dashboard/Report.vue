<template>
  <v-container id="report-management" fluid tag="section">
    <base-material-card icon="mdi-alert-circle" title="举报管理" class="px-5 py-3">
      <v-simple-table>
        <thead>
        <tr>
          <th>举报者 ID</th>
          <th>被举报者 ID</th>
          <th>举报内容</th>
          <th>举报时间</th>
          <th>证据图片</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="report in reports" :key="report.report_id">
          <td>{{ report.reporter }}</td>
          <td>{{ report.reported_user }}</td>
          <td>{{ report.report_text }}</td>
          <td>{{ report.report_time }}</td>
          <td>
            <img :src="report.report_evidence" alt="证据图片" style="max-width: 100px; max-height: 100px;">
          </td>
          <td>
            <v-btn small color="success" @click="showReasonDialog(report, 'accept')">同意</v-btn>
            <v-btn small color="error" @click="showReasonDialog(report, 'reject')">拒绝</v-btn>
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

    <v-dialog v-model="fullReasonDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">举报原因</span>
        </v-card-title>
        <v-card-text>
          <div>举报内容：{{ fullReasonDialog.report_text }}</div>
          <div>举报时间：{{ fullReasonDialog.report_time }}</div>
          <div>证据图片：</div>
          <img :src="fullReasonDialog.report_evidence" alt="证据图片" style="max-width: 300px; max-height: 300px;">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fullReasonDialog.show = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import httpInstance from '@/utils/axios';
import axios from "axios";
export default {
  data() {
    return {
      reports: [],
      reasonDialog: {
        show: false,
        title: '',
        reason: '',
        reportId: null,
        action: '',
      },
      fullReasonDialog: {
        show: false,
        report_text: '',
        report_time: '',
        report_evidence: '',
      },
    };
  },
  created() {
    this.getReportList();
  },
  methods: {
    getReportList() {
      // 使用你的实际接口来获取举报列表数据
      httpInstance.get('/manager/GetReportList/')
        .then(response => {
          console.log(response);
          response.forEach(report => {
            this.reports.push({
              report_id: report.report_id,
              reporter: report.reporter,
              reported_user: report.reported_user,
              report_text: report.report_text,
              report_time: report.report_time,
              report_evidence: report.report_evidence.img_url,
            });
          });
        })
        .catch(error => console.error('Error fetching report list:', error));
    },
    showReasonDialog(report, action) {
      this.reasonDialog.show = true;
      this.reasonDialog.title = `${action === 'accept' ? '同意' : '拒绝'}`;
      this.reasonDialog.reason = '';
      this.reasonDialog.reportId = report.report_id;
      this.reasonDialog.action = action;
    },
    showFullReason(report) {
      this.fullReasonDialog.show = true;
      this.fullReasonDialog.report_text = report.report_text;
      this.fullReasonDialog.report_time = report.report_time;
      this.fullReasonDialog.report_evidence = report.report_evidence;
    },
    submitReason() {
      // 发送原因和操作到后端
      const report = this.reports.find(r => r.report_id === this.reasonDialog.reportId);
      const data = {
        report_id: report.report_id,
        sign: this.reasonDialog.action==='accept' ? 1 : 0,
        feedbackContent: this.reasonDialog.reason,
        user_id: report.reporter,
      };
      httpInstance.post('/manager/PostFeedbackMessage/?report_id='+data.report_id+
      '&sign='+data.sign+'&feedbackContent='+data.feedbackContent+'&user_id='+data.user_id);
      console.log('Sending data to backend:', data);

      // 从列表中移除该举报
      this.reports = this.reports.filter(r => r.report_id !== report.report_id);

      this.reasonDialog.show = false;
    },
  },
};
</script>
