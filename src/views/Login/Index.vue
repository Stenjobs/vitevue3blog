<template>
  <div class="login-container">
    <div class="login-form">
      <Suspense>
        <template #fallback>
          <div class="loading-container">
            <el-loading></el-loading>
          </div>
        </template>
        <template #default>
          <Account />
        </template>
      </Suspense>
      <div class="register-link" style="text-align: center; margin-top: 20px;">
        <router-link to="/register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup name="login">
const Account = defineAsyncComponent(() => import('./components/Account.vue'))
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/images/1357335.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    width: 480px;
    padding: 60px;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    box-sizing: border-box;
    border-radius: 8px;
    animation: fadeUp 0.6s ease;

    .login-title {
      font-size: 24px;
      line-height: 36px;
      margin-top: 30px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 24px;
        height: 24px;
        margin-right: 20px;
      }
    }

    .copy-right {
      text-align: center;
      font-size: 14px;
      opacity: 0.3;
      margin-top: 50px;
      line-height: 18px;
    }
  }
}
</style>
