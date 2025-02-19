<template>
    <div class="blog-detail">
        <!-- 博客详情 -->
        <el-card class="blog-card">
            <div class="blog-header">
                <h1 class="title">{{ blog.title }}</h1>
                <div class="meta-info">
                    <span class="meta-item">
                        <el-icon>
                            <User />
                        </el-icon>
                        作者: {{ blog.author }}
                    </span>
                    <span class="meta-item">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        更新时间: {{ formatTime(blog.updatedAt) }}
                    </span>
                </div>
            </div>
            <div class="blog-content" v-html="blog.content"></div>
            <el-divider border-style="dashed" />

            <!-- 博客操作 -->
            <div class="blog-actions">
                <div :class="{ 'liked': isLiked, 'animate__animated animate__bounce': animateLike && isLiked }"
                    @click="likeBlog" class="like-icon heart-icon">
                </div>
                <span>{{ likes }}</span>
                <el-icon @click="toggleCommentBox" class="comment-icon">
                    <ChatSquare />
                </el-icon>
            </div>

            <!-- 评论 -->
            <div class="comment-box">
                <el-input v-model="newComment" placeholder="添加评论..." type="textarea"></el-input>
                <el-button type="primary" style="margin-top: 10px;" @click="addComment">提交评论</el-button>
            </div>
            <div class="blog-comments">
                <h3>评论</h3>
                <ul>
                    <li v-for="comment in comments" :key="comment.id" class="comment-item">
                        <div class="comment-header">
                            <div class="comment-author-box">
                                <span class="comment-author">{{ comment.realname }}</span>
                                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                            </div>
                            <div class="reply-action-box" @click="showReplyInput(comment)">
                                <el-icon>
                                    <ChatSquare />
                                </el-icon>
                                <span>{{ activeReplyId === comment._id ? '收起' : '回复' }}</span>
                            </div>
                        </div>
                        <div class="comment-content">{{ comment.content }}</div>
                        <div v-if="activeReplyId === comment._id" class="reply-box">
                            <el-input v-model="replyComment" :placeholder="`回复${replyerInfo.realname}评论...`"
                                type="textarea"></el-input>
                            <el-button type="primary" style="margin-top: 10px;"
                                @click="addReply(comment._id)">提交回复</el-button>
                        </div>
                        <!-- 评论的回复 -->
                        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                            <span v-if="reply.replyTo" class="reply-author">{{ reply.realname }} 回复 {{ reply.replyTo
                                }}</span>
                            <span v-else class="reply-author">{{ reply.realname }}</span>
                            <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                            <div class="contentRow">
                                <div class="reply-content">{{ reply.content }}</div>
                                <div class="reply-action" @click.stop="showReplyInput(reply, reply.id)">
                                    <el-icon>
                                        <ChatSquare />
                                    </el-icon>
                                    <span>{{ activeReplyId === reply._id ? '收起' : '回复'
                                        }}</span>
                                </div>
                            </div>
                            <div v-if="activeReplyId === reply._id" class="reply-box">
                                <el-input v-model="replyComment" :placeholder="`回复${replyerInfo.realname}评论...`"
                                    type="textarea"></el-input>
                                <el-button type="primary" style="margin-top: 10px;"
                                    @click="addReply(comment._id, reply._id)">提交回复</el-button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Clock, ChatSquare } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { getBlogDetailApi, likeBlogApi, addCommentApi, replyCommentApi } from './api'
import { useUserStore } from '@/pinia/index'
import 'animate.css'

const route = useRoute()
const userStore = useUserStore()
const blog = ref({})
const likes = ref(0)
const comments = ref([
    // 示例评论数据
    { id: 1, realName: '张三', time: '2023-10-01T12:34:56', text: '这是一个评论内容。' },
    // ... 其他评论 ...
])
const newComment = ref('')
const isLiked = ref(false)
const animateLike = ref(false)
const showCommentBox = ref(false)

// 获取博客详情
const getBlogDetail = async () => {
    const res = await getBlogDetailApi({ id: route.params.id })
    blog.value = res.data
    // 假设API返回点赞数和评论
    likes.value = res.data.likes || 0
    isLiked.value = res.data.likedUsers.includes(userStore.userInfo._id)
    comments.value = res.data.comments || []
}

// 回复评论
const replyComment = ref('')
const replyerInfo = ref({})
const activeReplyId = ref(null)
const activeReplyToId = ref(null)

// 显示回复输入框
const showReplyInput = (info, replyToId = null) => {
    console.log(info, replyToId, 'showReplyInput')
    if (activeReplyId.value === info._id && activeReplyToId.value === replyToId) {
        replyerInfo.value = {}
        activeReplyId.value = null
        activeReplyToId.value = null
    } else {
        replyComment.value = ''
        replyerInfo.value = replyToId ? info.replies.find(reply => reply.id === replyToId) : info
        activeReplyId.value = info._id
        activeReplyToId.value = replyToId
    }
}

// 添加回复
const addReply = async (commentId, replyToId = null) => {
    if (replyComment.value.trim()) {
        const res = await replyCommentApi({
            blogId: route.params.id,
            commentId: commentId,
            replyToId: replyToId,
            content: replyComment.value
        })
        if (res.code === 200) {
            const currentComment = comments.value.find(comment => comment._id === commentId)
            currentComment.replies = res.data
            replyComment.value = ''
            activeReplyId.value = null
            activeReplyToId.value = null
            replyerInfo.value = {}
        }
    } else {
        alert('回复内容不能为空！') // 提示用户回复不能为空
    }
}

// 点赞功能
const likeBlog = async () => {
    animateLike.value = true
    setTimeout(() => {
        animateLike.value = false
    }, 1000) // 动画持续时间

    const res = await likeBlogApi({ id: route.params.id, status: !isLiked.value })
    if (res.code === 200) {
        isLiked.value = !isLiked.value
        likes.value = res.data.likes
    }
}

// 添加评论功能
const addComment = async () => {
    if (newComment.value.trim()) {
        const res = await addCommentApi({ id: route.params.id, content: newComment.value })
        if (res.code === 200) {
            comments.value = res.data
            newComment.value = ''
        }
    } else {
        alert('评论内容不能为空！') // 提示用户评论不能为空
    }
}

// 格式化时间
const formatTime = (time) => {
    if (!time) return ''
    return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0]
}

onMounted(() => {
    getBlogDetail()
})
</script>

<style lang="scss" scoped>
.blog-detail {
    padding: 20px;

    .blog-card {
        .blog-header {
            border-bottom: 1px solid #ebeef5;
            padding-bottom: 20px;
            margin-bottom: 20px;

            .title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 16px;
            }

            .meta-info {
                color: #909399;
                font-size: 14px;

                .meta-item {
                    margin-right: 20px;
                    display: inline-flex;
                    align-items: center;

                    .el-icon {
                        margin-right: 4px;
                    }
                }
            }
        }

        .blog-content {
            line-height: 1.8;
            font-size: 16px;
        }

        .blog-actions {
            margin-top: 20px;
            display: flex;
            align-items: center;

            .el-button {
                margin-right: 10px;
            }
        }

        .blog-comments {
            margin-top: 20px;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;

            h3 {
                margin-bottom: 15px;
                font-size: 18px;
                color: #333;
            }

            ul {
                list-style: none;
                padding: 0;

                .comment-item {
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s;

                    &:hover {
                        transform: translateY(-2px);

                        .reply-action-box {
                            display: block;
                        }
                    }

                    .comment-header {
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 8px;
                    }

                    .comment-author {
                        font-weight: bold;
                        color: #333;
                    }

                    .comment-time {
                        font-style: italic;
                        color: #999;
                    }

                    .reply-action-box {
                        display: none;
                        cursor: pointer;
                        color: #999;

                        &:hover {
                            color: #333;
                        }
                    }

                    .comment-content {
                        font-size: 15px;
                        line-height: 1.6;
                        color: #444;
                    }

                    .reply-author {
                        color: #999;
                    }

                    .reply-time {
                        font-style: italic;
                        color: #999;
                    }

                    .reply-content {
                        font-size: 15px;
                        line-height: 1.6;
                        color: #444;
                    }

                    .contentRow {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        &:hover {
                            .reply-action {
                                display: block;
                            }
                        }

                        .reply-content {
                            flex-grow: 8;
                            color: #444;
                            font-size: 15px;
                            line-height: 1.6;
                        }

                        .reply-action {
                            text-align: right;
                            font-size: 12px;
                            flex-grow: 2;
                            display: none;
                            height: 20px;
                            cursor: pointer;
                            color: #999;

                            &:hover {
                                color: #333;
                            }
                        }
                    }
                }

                .reply-item {
                    margin-top: 10px;
                    padding: 10px;
                    border-left: 3px solid #f56c6c;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

                    .reply-author {
                        font-weight: bold;
                        color: #333;
                        font-size: 12px;
                    }

                    .reply-time {
                        font-style: italic;
                        color: #999;
                        margin-left: 10px;
                        font-size: 12px;
                    }

                    .reply-content {
                        margin-top: 5px;
                        font-size: 12px;
                        line-height: 1.6;
                        color: #444;
                    }
                }
            }

            .reply-box {
                margin-top: 10px;
            }
        }
    }

    .like-icon {
        cursor: pointer;
        color: #909399;

        &.liked {
            color: #f56c6c;
        }
    }

    .heart-icon {
        width: 15px;
        height: 15px;
        position: relative;
        display: inline-block;
        background-color: #909399;
        transform: rotate(-45deg);
        margin: 10px;
        transition: background-color 0.3s;

        &::before,
        &::after {
            content: '';
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: inherit;
        }

        &::before {
            top: -12px;
            left: 0;
        }

        &::after {
            left: 12px;
            top: 0;
        }

        &.liked {
            background-color: #f56c6c;
        }
    }

    .comment-icon {
        cursor: pointer;
        margin-left: 10px;
    }

    .comment-box {
        margin-top: 10px;
    }
}
</style>
