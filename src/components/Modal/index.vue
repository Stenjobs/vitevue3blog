<template>
    <teleport to="#modal">
        <transition name="bounce">
            <div class="modalContainer" v-if="visible">
                <div class="modalInner">
                    <div class="title">
                        {{ title }}
                    </div>
                    <div class="containerBody" style="max-height: 70vh; overflow-y: auto;">
                        <slot></slot>
                    </div>
                    <div class="modalFooter">
                        <div class="inner">
                            <el-button @click="onCancel">取消</el-button>
                            <el-button @click="onConfirm" type="primary">确定</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import useDOMCreate from "@/hooks/useDOMCreate";
defineProps({
    title: String,
    visible: {
        type: Boolean,
        default: false,
    },
})
const emiter = defineEmits(['confirm', 'cancel'])
useDOMCreate("modal");
const onConfirm = () => {
    emiter("confirm", '参数一', '参数二');
};
const onCancel = () => {
    emiter("cancel");
};


</script>

<style lang="scss">
@import "@/style/mixin.scss";
@include bounce-effect;

.modalContainer {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;

    background: {
        color: rgba($color: #000000, $alpha: 0.3);
        image: inherit;
    }

    .modalInner {
        min-width: 400px;
        max-width: 1200px;
        border-radius: 10px;
        position: relative;
        @include glassStyle(400px, .9);

        .title {
            padding: 10px 20px;
        }

        .containerBody {
            padding: 20px;
            padding-bottom: 80px;
        }

        .modalFooter {
            position: absolute;
            bottom: 20px;
            width: 100%;
            margin-top: 20px;

            .inner {
                margin: 0 auto;
                display: flex;
                width: 180px;
                justify-content: space-between;
            }
        }
    }
}
</style>