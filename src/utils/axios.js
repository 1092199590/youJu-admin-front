import axios from 'axios';
// import store from '@/store'; // 假设你有 Vuex 存储状态

const httpInstance = axios.create({
    baseURL: 'http://114.116.197.62:80/api/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// 响应拦截器
httpInstance.interceptors.response.use(response => {
    // console.log(response.data)
    return response.data;
//     if (response.data.error !== 0) {
//         if ([4001, 4002].includes(response.data.error)) {
//             store.dispatch('dialog/openLoginDialog'); // 假设你有一个 Vuex action 来处理登录对话框
//         }
//         // store.dispatch('snackbar/showSnackbar', { // 假设你有一个 Vuex action 来显示 snackbar
//         //     message: response.data.msg,
//         //     color: 'error'
//         // });
//         return Promise.reject(new Error(response.data.msg || 'Error'));
//     } else {
//         return response.data;
//     }
// }, error => {
//     // store.dispatch('snackbar/showSnackbar', { // 显示网络错误信息
//     //     message: '网络错误',
//     //     color: 'error'
//     // });
//     return Promise.reject(error);
});

export default httpInstance;
