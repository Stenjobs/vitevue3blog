import request from '@/utils/request'

// 注册
export function registerApi(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}
