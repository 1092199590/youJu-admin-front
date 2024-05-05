<template>
  <v-container id="user-management" fluid tag="section">
    <v-text-field
      v-model="searchTerm"
      label="搜索用户"
      prepend-inner-icon="mdi-magnify"
      clearable
      outlined
      dense
      hide-details
    />
    <base-material-card icon="mdi-account-multiple" title="人员管理" class="px-5 py-3">
      <v-simple-table>
        <thead>
        <tr>
          <th>头像</th>
          <th>用户名</th>
          <th>用户ID</th>
          <th>用户账号</th>
          <th>用户概要</th>
          <th>用户邮箱</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.user_id">
          <td>
            <v-avatar>
              <img :src="user.avatar" alt="Avatar" />
            </v-avatar>
          </td>
          <td>{{ user.user_nickName }}</td>
          <td>{{ user.user_id }}</td>
          <td>{{ user.user_name }}</td>
          <td>{{ user.profile }}</td>
          <td>{{ user.email }}</td>
          <td>
            <v-btn small color="error" @click="confirmDelete(user)">删除用户</v-btn>
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
          您确认要删除用户 "{{ deleteDialog.username }}" 吗?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteDialog.show = false">取消</v-btn>
          <v-btn color="error" @click="deleteUser">确认删除</v-btn>
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
      users: [],
      deleteDialog: {
        show: false,
        userId: null,
        username: '',
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      fetch('http://127.0.0.1:4523/m1/4252541-0-default/manager/GetUserDetailList/')
        .then(response => response.json())
        .then(data => {
          this.users = data;
        })
        .catch(error => console.error('Error fetching user list:', error));
    },
    confirmDelete(user) {
      this.deleteDialog.show = true;
      this.deleteDialog.userId = user.user_id;
      this.deleteDialog.username = user.user_nickName;
    },
    deleteUser() {
      const userId = this.deleteDialog.userId;
      fetch('http://127.0.0.1:4523/m1/4252541-0-default/manager/DeleteUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      })
        .then(() => {
          // 从列表中移除该用户
          this.users = this.users.filter(user => user.user_id !== userId);
          this.deleteDialog.show = false;
        })
        .catch(error => console.error('Error deleting user:', error));
    },
  },
};
</script>
