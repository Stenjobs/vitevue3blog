<template>
    <div v-loading="loading" class="blog-list">
        <el-collapse class="search-collapse">
            <el-collapse-item name="1">
                <template #title>
                    查询
                    <el-icon class="header-icon">
                        <info-filled />
                    </el-icon>
                </template>
                <el-form label-width="auto" style="max-width: 600px">
                    <el-form-item label="标题关键词">
                        <el-input v-model="form.keyword" />
                    </el-form-item>
                </el-form>
                <el-button @click="handleSearch">查询</el-button>
            </el-collapse-item>
        </el-collapse>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>博客列表：</span>
                    <el-button @click="modalVisible = true" type="primary">新建博客</el-button>
                </div>
            </template>
            <el-empty v-if="!dataList.length" description="暂无数据" />
            <div v-else class="blog-list-item" v-for="item in dataList" :key="item.id">
                <div @click="goToDetail(item._id)" class="blog-title">{{ item.title }}</div>
                <div class="authorInfo">
                    <div class="authorInfo-item">
                        <el-icon>
                            <User />
                        </el-icon>
                        {{ item.author }}
                    </div>
                    <div class="authorInfo-item">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        {{ formatTime(item.createdAt) }}
                    </div>
                </div>
                <div class="content" v-html="item.content"></div>
            </div>
            <div class="pagination">
                <el-pagination v-model:current-page="form.page" v-model:page-size="form.pageSize" :total="total"
                    :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" background />
            </div>
        </el-card>
        <Modal :visible="modalVisible" @cancel="modalVisible = false" @confirm="submitForm(ruleFormRef)">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto"
                class="demo-ruleForm" :size="formSize" status-icon>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="ruleForm.title" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <RichEditor ref="editorRef" v-model="ruleForm.content" />
                </el-form-item>
            </el-form>
        </Modal>
    </div>
</template>

<script setup>
import { getBlogListApi, addBlogApi } from './api'
import { formatDateTime } from '@/utils/index.js'
import { useRouter } from 'vue-router'
import RichEditor from '@/components/RichEditor/index.vue'

const router = useRouter()

const dataList = ref([])
const total = ref(0)
const loading = ref(false)


const form = ref({
    keyword: '',
    page: 1,
    pageSize: 10
})

const editorRef = ref()
const getHtml = () => {
    return editorRef.value.getHtml()
}

const getBlogList = async () => {
    loading.value = true
    const res = await getBlogListApi(form.value)
    dataList.value = res.data.list
    total.value = res.data.total
    loading.value = false
}

const handleSizeChange = (pageSize) => {
    form.value.pageSize = pageSize
    getBlogList()
}

const handleCurrentChange = (page) => {
    form.value.page = page
    getBlogList()
}

const goToDetail = (id) => {
    router.push(`/blogDetail/${id}`)
}

const handleSearch = () => {
    getBlogList()
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

// 表单
const ruleFormRef = ref()
const ruleForm = reactive({
    title: "",
    content: ''
})

const rules = reactive({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ],
})

const submitForm = async (formEl) => {
    if (!formEl) return
    // ruleForm.content = getHtml() //  手动获取富文本内容
    loading.value = true
    await formEl.validate((valid, fields) => {
        if (valid) {
            addBlogApi(ruleForm).then((res) => {
                getBlogList()
                modalVisible.value = false
                ElMessage.success('添加成功')
                ruleFormRef.value.resetFields()
            })
        } else {
            console.log('error submit!', fields)
        }
    })
    loading.value = false
}

const modalVisible = ref(false)
onMounted(() => {
    getBlogList()
})
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.blog-list {
    .search-collapse {
        margin-bottom: 20px;
        background-color: white;
        padding: 20px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .blog-list-item {
        // background-color: azure;
        @include glassStyle(500px, .6);
        margin-bottom: 20px;
        border-radius: 20px;
        padding: 20px;
        // width: 500px;

        .blog-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                color: #409eff;
            }
        }

        .authorInfo {
            display: table;
            width: 100%;
            table-layout: fixed;

            /* 固定布局，平均分配宽度 */
            /* 让表格占满父元素的宽度 */
            .authorInfo-item {
                display: table-cell;
                // padding: 10px;
                /* 根据需要调整内边距 */
                // border: 1px solid #ddd;
                /* 根据需要添加边框 */
            }
        }

        .content {
            margin-top: 10px;
            font-size: 14px;
        }
    }
}
</style>