import axios from 'axios';
import { Loading, Notification } from 'element-ui';
import baseData from './helpers';
const instanceAxios = axios.create({
    baseURL: baseData.URL,
    timeout: 5000,
})
let loading = null;
// 添加请求拦截器
instanceAxios.interceptors.request.use(config => {
    loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
    })
    return config;
}, error => {
    console.log('====>', error);
    return Promise.reject(error);
});

// 添加响应拦截器
instanceAxios.interceptors.response.use(response => {
    loading.close();
    return response;
}, error => {
    loading.close();
    console.log('====>', error.response);
    if (error.response == undefined) {
        Notification.error({
            title: '错误',
            message: error
        })
    } else {
        let msg = error.response.data.msg;
        console.log('msg',error.response.data)
        Notification.error({
            title: '错误',
            message: msg
        })
    }
    return Promise.reject(error);
});


export default instanceAxios;