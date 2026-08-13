<template>
    <el-dialog :model-value="modelValue" append-to-body align-center draggable title="写评论" width="min(92vw, 480px)" @update:model-value="updateVisible" @closed="resetForm">
        <p class="comment-target">正在评论：{{ imageTitle }}</p>
        <el-form ref="commentFormRef" :model="commentForm" :rules="commentRules" label-position="top" @submit.prevent>
            <el-form-item label="评论内容" prop="content">
                <el-input v-model="commentForm.content" type="textarea" :rows="4" resize="vertical" placeholder="说点什么…" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updateVisible(false)">取消</el-button>
                <el-button type="primary" :loading="submitting" @click="submitComment">发表评论</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { AlbumImage } from '@/types/timeAlbum';
import { getAlbumImageTitle } from '@/utils/timeAlbum';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';

interface CommentForm {
    content: string;
}

const props = defineProps<{
    modelValue: boolean;
    image: AlbumImage | null;
    submitting: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [visible: boolean];
    closed: [];
    submit: [content: string];
}>();

const commentFormRef = ref<FormInstance>();
const commentForm = reactive<CommentForm>({ content: '' });
const imageTitle = computed(() => (props.image ? getAlbumImageTitle(props.image) : ''));
const commentRules: FormRules<CommentForm> = {
    content: [
        { required: true, message: '请输入评论', trigger: 'blur' },
        {
            validator: (_rule, value: string, callback) => {
                if (!value.trim()) {
                    callback(new Error('请输入评论'));
                    return;
                }
                callback();
            },
            trigger: 'blur',
        },
    ],
};

function updateVisible(visible: boolean) {
    emit('update:modelValue', visible);
}

function resetForm() {
    commentForm.content = '';
    commentFormRef.value?.clearValidate();
    emit('closed');
}

async function submitComment() {
    if (props.submitting) return;

    try {
        await commentFormRef.value?.validate();
    } catch {
        return;
    }

    emit('submit', commentForm.content.trim());
}
</script>

<style scoped lang="scss">
.comment-target {
    margin-bottom: 14px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
