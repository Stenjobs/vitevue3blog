<template>
    <div class="user-setting">
        <el-card shadow="hover">
            <template #header>
                <div class="card-header">
                    <span>账户设置</span>
                </div>
            </template>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" disabled />
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="form.realname" placeholder="请输入真实姓名" />
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/common/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="form.avatarPath" :src="fullAvatarUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/pinia'
import { updateUserInfoApi } from './api'
import { setUserInfo } from '@/utils/webStorage'

const userStore = useUserStore()
const formRef = ref()

const form = ref({
    username: userStore.userInfo.username,
    realname: userStore.userInfo.realname,
    avatarPath: userStore.userInfo.avatarPath,
    _id: userStore.userInfo._id
})

const fullAvatarUrl = computed(() => {
    return location.origin + '/' + form.value.avatarPath
})

const rules = {
    realname: [
        { required: true, message: '请输入真实姓名', trigger: 'blur' }
    ]
}

const handleAvatarSuccess = (res) => {
    form.value.avatarPath = res.data.filePath
}

const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
        ElMessage.error('头像只能是 JPG/PNG 格式!')
    }
    if (!isLt2M) {
        ElMessage.error('头像大小不能超过 2MB!')
    }
    return isJPG && isLt2M
}

const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await updateUserInfoApi(form.value)
                ElMessage.success('更新成功')
                // 更新store中的用户信息
                userStore.setUserInfo({
                    ...userStore.userInfo,
                    ...form.value
                })
                setUserInfo(form.value)
                // 逐个更新属性以确保响应式更新
                userStore.$patch((state) => {
                    state.userInfo.realname = form.value.realname
                    state.userInfo.avatarPath = form.value.avatarPath
                })
            } catch (error) {
                console.error(error)
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.user-setting {
    padding: 20px;
    
    .card-header {
        font-size: 16px;
        font-weight: bold;
    }

    .avatar-uploader {
        :deep(.el-upload) {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);

            &:hover {
                border-color: var(--el-color-primary);
            }
        }
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
}
</style>
