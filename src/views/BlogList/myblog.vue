<template>
    <div v-loading="pageLoading" class="blog-list-container">
        <!-- 搜索部分 -->
        <el-card class="search-container">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-input v-model="search" placeholder="搜索博客" prefix-icon="Search" clearable />
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="getBlogList" :icon="Search" style="width: 100%">
                        搜索
                    </el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 空状态显示 -->
        <el-empty v-if="!blogList.length" description="暂无博客" style="margin-top: 20px;" />

        <!-- 列表部分 -->
        <el-card v-else style="margin-top: 20px;" v-for="blog in blogList" :key="blog._id" class="blog-item"
            shadow="hover">
            <div class="blog-header">
                <h2 class="blog-title" @click="goToDetail(blog._id)">{{ blog.title }}</h2>
                <div class="blog-meta">
                    <span class="author">
                        <el-icon>
                            <User />
                        </el-icon>
                        {{ blog.author }}
                    </span>
                    <span class="time">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        {{ formatTime(blog.createdAt) }}
                    </span>
                    <div class="blog-actions">
                        <el-button type="primary" size="small" @click.stop="openEditDialog(blog)" icon="Edit">
                            编辑
                        </el-button>
                        <el-popconfirm title="确认删除这篇博客吗?" @confirm="handleDelete(blog._id)" confirm-button-text="确认"
                            cancel-button-text="取消">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </div>
            <div class="blog-content" :title="blog.content" v-html="blog.content"></div>
        </el-card>

        <!-- 添加分页组件 -->
        <div class="pagination-container" v-if="total > 0">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50]"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next"
            />
        </div>

        <!-- 编辑弹窗 -->
        <el-dialog v-model="dialogVisible" title="编辑博客" width="50%">
            <el-form :model="editForm" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="editForm.title" />
                </el-form-item>
                <el-form-item label="内容">
                    <!-- <el-input v-model="editForm.content" type="textarea" :rows="10" /> -->
                    <RichEditor v-model="editForm.content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="handleEdit">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getMyBlogApi, editBlogApi, deleteBlogApi } from './api'
import { ref } from 'vue'
import { User, Clock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { onMounted, onActivated } from 'vue'
import { useUserStore } from '@/pinia'
import RichEditor from '@/components/RichEditor/index.vue'

const router = useRouter()
const userStore = useUserStore()

const pageLoading = ref(false)

const search = ref('')
const getBlogList = async () => {
    pageLoading.value = true
    const res = await getMyBlogApi({ 
        keyword: search.value,
        page: currentPage.value,
        pageSize: pageSize.value
    })
    blogList.value = res.data.list
    total.value = res.data.total
    pageLoading.value = false
}

/* 
ctrl+s编辑博客--开始
*/
onMounted(() => {
    // ... existing code ...
    window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});
// 添加键盘事件监听
const handleKeydown = (event) => {
    if (event.ctrlKey && event.key === 's' && dialogVisible.value) {
        event.preventDefault(); // 阻止默认保存行为
        handleEdit(); // 调用编辑操作
    }
}
/* 
ctrl+s编辑博客--结束
*/

onMounted(() => {
    if (userStore.userInfo.username) {
        getBlogList()
    }
    else {
        ElMessage.error('请先登录')
        setTimeout(() => {
            router.push('/login')
        }, 1000)
    }
})

onActivated(() => {
    getBlogList()
})

const btnLoading = ref(false)

/* 
编辑弹窗--开始
*/
const dialogVisible = ref(false)
const editForm = ref({})
const openEditDialog = (blog) => {
    dialogVisible.value = true
    editForm.value = JSON.parse(JSON.stringify(blog))
}

const handleEdit = async () => {
    try {
        console.log(editForm.value, 'editForm.value')
        btnLoading.value = true
        const res = await editBlogApi(editForm.value)
        if (res.code === 200) {
            ElMessage.success('编辑成功')
            dialogVisible.value = false
            getBlogList()
        }
        btnLoading.value = false
    }
    catch (error) {
        btnLoading.value = false
    }
}
/* 
编辑弹窗--结束
*/

const handleDelete = async (id) => {
    const res = await deleteBlogApi({ id })
    if (res.code === 200) {
        ElMessage.success('删除成功')
        getBlogList()
    }
}

const formatTime = (time) => {
    // 时间格式是这样的：2024-12-18T07:34:56.929Z
    // 需要转换为：2024-12-18 07:34:56
    // 添加空值处理
    if (!time) {
        return ''
    }
    return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0]
}

// 模拟博客数据
const blogList = ref([])

// 跳转到详情页
const goToDetail = (id) => {
    router.push(`/blogDetail/${id}`)
}

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 处理页码改变
const handleCurrentChange = (val) => {
    currentPage.value = val
    getBlogList()
}

// 处理每页条数改变
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    getBlogList()
}
</script>

<style lang="scss" scoped>
.blog-list-container {
    padding: 20px;

    .blog-item {
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .blog-header {
            margin-bottom: 10px;

            .blog-title {
                margin: 0 0 10px 0;
                font-size: 18px;
                color: #303133;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    color: #409eff;
                }
            }

            .blog-meta {
                display: flex;
                gap: 20px;
                color: #909399;
                font-size: 14px;

                .author,
                .time {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            }
        }

        .blog-content {
            color: #606266;
            font-size: 14px;
            line-height: 1.6;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
}
</style>
