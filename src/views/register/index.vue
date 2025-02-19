<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerFormData" :rules="registerRules" class="register-form">
      <h3 class="title">用户注册</h3>

      <el-form-item prop="username">
        <el-input v-model="registerFormData.username" placeholder="请输入用户名" @input="updateUsername">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="registerFormData.password" type="password" placeholder="请输入密码" @input="updatePassword">
          <template #prefix>
            <el-icon>
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="realname">
        <el-input v-model="registerFormData.realname" placeholder="请输入真实姓名" @input="updateRealName">
          <template #prefix>
            <el-icon>
              <UserFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="avatarPath" label="上传头像">
        <el-upload action="/api/common/upload" list-type="picture-card" :on-success="handleAvatarSuccess"
          :on-remove="handleAvatarRemove" :file-list="registerFormData.avatarList" :limit="1" :on-exceed="handleExceed"
          class="avatar-uploader">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.prevent="handleRegister">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, UserFilled } from '@element-plus/icons-vue'
import { registerApi } from './api'
import { useRouter } from 'vue-router'
import genPassword from '@/utils/cryp'

const router = useRouter()


const loading = ref(false)

const registerFormData = reactive({
  username: '',
  pppp: '',
  realname: '',
  avatarPath: ''
})
const avatarList = ref([])
const handleExceed = () => {
  ElMessage.warning('最多只能上传一张图片')
}
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  pppp: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  realname: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  avatarPath: [
    { required: true, message: '请上传头像', trigger: 'change' }
  ]
}

const updateUsername = (event) => {
  registerFormData.username = event
}

const updatePassword = (event) => {
  registerFormData.pppp = event
}

const updateRealName = (event) => {
  registerFormData.realname = event
}

const handleAvatarSuccess = (response, file, fileList) => {
  avatarList.value = fileList
  registerFormData.avatarPath = response.data.filePath
}

const handleAvatarRemove = (file, fileList) => {
  avatarList.value = fileList
}

const handleRegister = () => {
  loading.value = true
  registerApi({ ...registerFormData, pppp: genPassword(registerFormData.pppp) }).then(res => {
    router.push('/login')
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;

  .register-form {
    width: 400px;
    padding: 25px 25px 5px 25px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title {
      text-align: center;
      margin: 0 0 30px 0;
      color: #333;
    }
  }
}
</style>
