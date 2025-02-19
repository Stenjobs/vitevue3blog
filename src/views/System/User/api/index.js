import request from '@/utils/request'

// 获取用户列表
export function getUserListApi(params) {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
}

// 更新用户信息
export function updateUserInfoApi(data) {
    return request({
        url: '/user/update',
        method: 'post',
        data
    })
}

// 导出用户列表
export function exportUserListApi(params) {
    return request({
        url: '/user/export',
        method: 'get',
        params,
        responseType: 'blob'
    })
}

