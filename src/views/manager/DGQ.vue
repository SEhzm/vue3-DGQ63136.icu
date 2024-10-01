<template>
  <div>
    <div class="card">
      <el-button type="primary" class="handleAdd"
                 @click="handleAdd">
        投稿弹幕
      </el-button>
      <b class="copyCount">复制次数</b>
      <el-table stripe :data="data.tableData" empty-text="我还没有加载完喔~~"
                class="eldtable"
                :header-cell-style="{color: '#ff0000', fontSize: '13px',whitespace:'normal !important'}"
                :cell-style="{}" @row-click="copyText"
      >
        <el-table-column width="50" prop="id" label="序号"></el-table-column>
        <el-table-column prop="barrage" min-width="90" label="弹幕"/>
        <el-table-column label="" align="center" width="85">
            <el-button type="primary" label="操作" >复制</el-button>
        </el-table-column>
        <el-table-column prop="cnt" label="" width="65"/>
      </el-table>
    </div>

    <div class="pagination-wrapper">
      <!-- 分页 -->
      <div>
        <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="data.total"
            :pager-count=4
            :page-size="data.pageSize"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <el-dialog v-model="data.dialogFormVisible" draggable title="投稿弹幕" width="82%">
      <el-form :model="data" label-width="100px" :rules="rules" label-position="right">
        <el-form-item label="分栏" :label-width="100" prop="table">
          <el-select v-model="data.table" placeholder="选择上传的分栏">
            <el-option label="2022年警钟长鸣" value="dgq_J2022"/>
            <el-option label="2023年警钟长鸣" value="dgq_J2023"/>
            <el-option label="2024年警钟长鸣" value="dgq_J2024"/>
            <el-option label="+1" value="dgq_p1"/>
            <el-option label="🐘超哥🐘" value="dgq_ruibin"/>
            <el-option label="小团体" value="dgq_XTT"/>
            <el-option label="DGQ" value="dgq_DGQ"/>
            <el-option label="白字" value="dgq_baizi"/>
            <el-option label="QUQU" value="dgq_QUQU"/>
          </el-select>
        </el-form-item>
        <el-form-item label="弹幕内容" prop="barrage">
          <el-input v-model="data.barrage" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.dialogFormVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveBarrage">
            投稿并关闭
          </el-button>
          <el-button type="primary" @click="continuousSaveBarrage">
            连续投稿
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue'
import request from "@/utils/request";
import {ElNotification} from 'element-plus'
import autoExecPng from "@/assets/autoexec.vue";

const rules = ({
  table: [
    {required: true, message: '请选择分栏', trigger: 'blur'},
  ],
  barrage: [
    {required: true, message: '请输入弹幕', trigger: 'blur'},
  ]
})

const data = reactive({
  tableData: [],
  total: 0,
  pageSize: 15, //每页个数
  currentPage: 1, //起始页码
  dialogFormVisible: false,
  table: '',
  barrage: '',
})

const load = (pageNum = 1) => {
  request.get('/dgq/DGQ/Page', {
    params: {
      pageNum: pageNum,
      pageSize: data.pageSize
    }
  }).then(res => {
    // console.log(res)
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
    // console.log(data.tableData)
  }).catch(err => {
    console.error('加载数据失败:', err)
  })
}

load(data.currentPage)

const handlePageChange = (page) => {
  data.currentPage = page
  load(page)
}

const open2 = () => {
  ElNotification({
    message: '复制成功',
    type: 'success',
  })
};

const open4 = () => {
  ElNotification.error('复制失败，请更换浏览器或手动复制,请勿使用夸克浏览器')
};

const copyText = (row) => {
  const textToCopy = row.barrage;
  let tempInput = document.createElement('input');
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select(); // 选择对象
  try {
    document.execCommand('Copy'); // 执行浏览器复制命令
    // 复制成功，可以显示提示信息
    open2();
    console.log('内容已复制到剪贴板');
    request.post('/dgq/addCnt', {
      PageNum: data.currentPage,
      table: 'DGQ',
      id: row.id
    }).then(() => {
      setTimeout(() => load(data.currentPage), 50); // 50 毫秒后执行 load
    });
  } catch (err) {
    // 复制失败，可以显示错误信息
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput); // 清理临时元素
};




//点击新增按钮
const handleAdd = () => {
  data.table = ''
  data.barrage = ''
  data.dialogFormVisible = true
}
//提交并关闭
const saveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入弹幕");
  } else {
    request.post('/dgq/addUnaudit', {
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      load()
      data.dialogFormVisible = false;
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    })
  }
}

//连续提交
const continuousSaveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入弹幕");
  } else {
    request.post('/dgq/addUnaudit', {
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      load()
      data.barrage = ''
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    })
  }
}


</script>

<style scoped>
.eldtable {
  font-size: 18px;
  white-space: nowrap;
  overflow-x: auto;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.handleAdd {
  z-index: 100;
  position: absolute;
  font-size: 18px;
  margin-left: 150px
}
.copyCount {
  font-size: 13px;
  color: red;
  position: absolute;
  z-index: 10;
  margin-left: 55vw;
  margin-top: 5px
}

@media (min-width: 601px) {
  .card {
    width: 60vw;
  }

}


@media (max-width: 600px) {
  .copyCount {
    margin-left: 77vw;
  }
  .eldtable {
    font-size: 16px;
    white-space: nowrap;
    overflow-x: auto;
  }

  .dialogFormVisible {
    font-size: 15px;
  }

  .handleAdd {
    z-index: 100;
    position: absolute;
    font-size: 13px;
    margin-left: 150px
  }
}
</style>
