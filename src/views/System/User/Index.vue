<template>
  <div class="user-page">
    <div class="search-bar">
      <el-card shadow="hover">
        <el-form :inline="true">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable>
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="searchForm.realname" placeholder="请输入真实姓名" clearable>
              <template #prefix>
                <el-icon>
                  <UserFilled />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card shadow="hover" class="table-card">
      <el-table :data="tableData" border style="width: 100%" stripe highlight-current-row v-loading="loading">
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="realname" label="真实姓名" align="center" />
        <el-table-column label="头像" width="100" align="center">
          <template #default="{ row }">
            <el-popover placement="top" :width="200" trigger="hover">
              <template #reference>
                <el-avatar :size="40" :src="fullAvatarUrl(row.avatarPath)">
                  <el-icon>
                    <UserFilled />
                  </el-icon>
                </el-avatar>
              </template>
              <div style="text-align: center">
                <el-avatar :size="100" :src="fullAvatarUrl(row.avatarPath)">
                  <el-icon>
                    <UserFilled />
                  </el-icon>
                </el-avatar>
                <div style="margin-top: 10px">
                  <div>用户名: {{ row.username }}</div>
                  <div>真实姓名: {{ row.realname }}</div>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180" align="center">
          <template #default="{ row }">
            <el-tag size="small">
              {{ dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" background />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Download, Search, Refresh } from '@element-plus/icons-vue'
import { getUserListApi, exportUserListApi } from './api'
const searchForm = reactive({
  username: '',
  realname: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const loading = ref(false)

const fullAvatarUrl = (avatarPath) => {
  return location.origin +'/' + avatarPath
}

const handleSearch = () => {
  getUserList()
}

onMounted(() => {
  getUserList()
})

const getUserList = async () => {
  try {
    loading.value = true
    const res = await getUserListApi({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    })
    tableData.value = res.data.list
    total.value = res.data.total
    loading.value = false
  } catch (error) {
    loading.value = false
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.realname = ''
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

const handleExport = async () => {
  try {
    loading.value = true
    const res = await exportUserListApi({
      ...searchForm
    })
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = `用户列表_${dayjs().format('YYYY-MM-DD')}.xlsx`
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.user-page {
  padding: 20px;

  .search-bar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
