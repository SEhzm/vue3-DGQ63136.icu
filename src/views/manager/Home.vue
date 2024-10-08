<template xmlns="http://www.w3.org/1999/html">
  <div class="home">
    <div class="card" style="line-height: 25px;margin-top: 50px;">
      <div>
        <b class="header-text">🎂🎂🎂🎂生日快乐冬瓜强🎂🎂🎂🎂
          <!--          <br>距离丢丢高考还有{{ diudiugaokao }}天-->
          <br> 距离2023年10月23日04:07分，冬瓜强自爆爆皮过长 一周年还有{{ DaoJiShi }}天，警钟长鸣！
          <img src="https://pic.imgdb.cn/item/6607ee8f9f345e8d03ae39d8.png" alt="捏狗头" class="dog_head"></b>
      </div>

    </div>
    <div class="card" style="line-height: 30px;margin-top: 10px;">
      <div><b>
          <em style="font-size: 17px;color: red;">新增时光相册2015年-2024年(可评论)，新增在线投稿弹幕(可直接查看，不用审核版)! 可以听小团体生日歌。</em></b>
      </div>
    </div>

    <div class="card" style="line-height: 30px; margin-top:8px ;">
      <p>你好，各位白字。 <br>
        这是一个收集厕所弹幕的网站: <span class="dgq63136">
          <a href="https://dgq63136.icu" style="color: red;">DGQ63136.icu
            <img src="https://pic.imgdb.cn/item/6607ee8f9f345e8d03ae393c.png" alt="鸡毙你" class="biabiabia"></a></span>
        <br>
      </p>
    </div>

    <div class="card" style="line-height: 0px; margin-top: 8px;">
      <div>
        <el-button type="primary" @click="getRandOne">点我随机一条弹幕</el-button>
        <el-table v-loading="loading" :data="data.tableData" style="font-family: 微软雅黑; font-size: 20px;"
          :header-cell-style="{ fontSize: '14px', whitespace: 'normal !important' }" :cell-style="{ cursor: 'Pointer' }"
          @row-click="copyText">
          <el-table-column prop="barrage" label="弹幕"></el-table-column>
          <el-table-column label="" align="center" width="85">
            <el-button type="primary">复制</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="card" style="line-height: 50px; margin-top: 10px; margin-bottom: 10px; min-height: 80px;">
      <div>
        <span style="position: absolute; font-size: 22px; margin-top: -20px; color: blue;">
          --------需点击右侧搜索按钮---------
        </span>
        <el-input v-model="searchQuery" :placeholder=searchBarrageMeg clearable
          style="background-color: yellow;font-size: 16px; margin-top: 30px;" @input="onSearchQueryChange">
          <template #append>
            <el-button type="primary" @click="queryBarrage"><el-icon>
                <Search />
              </el-icon></el-button>
          </template>
        </el-input>
        <el-table v-loading="loading" v-if="isInput" :data="data.filteredItems" stripe @row-click="copyText"
          style="font-size: 19px;" :cell-style="{ cursor: 'Pointer' }">
          <el-table-column prop="barrage" label="弹幕"></el-table-column>
          <el-table-column label="" align="center" width="85">
            <el-button type="primary">复制</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="card" style="margin-top: 8px; text-align: center;">

      <div class="Addform">
        <el-form :model="data" label-width="100px" :rules="rules" label-position="right">
          <el-form-item label="分栏" :label-width="100" prop="table">
            <el-select v-model="data.table" placeholder="选择上传的分栏">
              <el-option label="2022年警钟长鸣" value="dgq_J2022" />
              <el-option label="2023年警钟长鸣" value="dgq_J2023" />
              <el-option label="2024年警钟长鸣" value="dgq_J2024" />
              <el-option label="+1" value="dgq_p1" />
              <el-option label="🐘超哥🐘" value="dgq_ruibin" />
              <el-option label="小团体" value="dgq_XTT" />
              <el-option label="DGQ" value="dgq_DGQ" />
              <el-option label="白字" value="dgq_baizi" />
              <el-option label="QUQU" value="dgq_QUQU" />
            </el-select>
          </el-form-item>
          <el-form-item label="弹幕内容" prop="barrage">
            <el-input v-model="data.barrage" autocomplete="off" />
          </el-form-item>
          <el-button type="primary" @click="saveBarrage" style="font-size: 20px;">
            投稿
          </el-button>
        </el-form>
      </div>

      <el-backtop :right="50" :bottom="50" />

      <img src="https://pic.imgdb.cn/item/6607ee909f345e8d03ae3cc1.png" alt="👍👍👍" class="good">&nbsp;
    </div>
    <div class="card" style="line-height: 30px;margin-top: 10px;">
      友情链接 <a href="https://sb6657.cn" target="_blank">sb6657.cn</a>
    </div>
  </div>
  <div class="el-footer">
    基于腾讯云服务器搭建<text style="font-size: 11px">(离服务器到期还有{{ ServerDate }}天)</text>
    <text> 域名所有：<a href="https://yuba.douyu.com/user/main/lOdEpeOJzwnR"
        target="_blank">@瓜瓜的御用攻城狮</a></text>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://beian.miit.gov.cn/" target="_blank">桂ICP备2024022150号</a>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://ywtb.mps.gov.cn/newhome/templates/Zwfw_Fwmh/img/main/foot-ga.png"
        alt=""><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45040302000258" target="_blank">
        桂公网安备45040302000258号</a></text>
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import request from "@/utils/request";
import { ElMessage, ElNotification } from 'element-plus';
import autoExecPng from "@/assets/autoexec.vue";
const loading = ref(true)
const isInput = ref(false)
const data = reactive({
  getRandOne: [],
  filteredItems: [],
  tableData: [],
  table: '',
  barrage: '',
})

const autoexec = () => {
  request.get("https://api.vvhan.com/api/visitor.info")
    .then(res => {
      const resData = res;
      localStorage.setItem("ip", res.ip)
      ElNotification({
        icon: autoExecPng,
        dangerouslyUseHTMLString: true,
        title: '你好',
        message:
          "<p>欢迎来自<b>" +
          resData.location +
          "</b>的厕友<br/>" +
          resData.system +
          " " +
          resData.browser +
          " <br>IP: " +
          resData.ip +
          "</p>",
        offset: 50,
        duration: 10000
      })
    })
}
autoexec()
const searchQuery = ref('');

const targetDate = new Date('2041-06-07');
const diudiugaokao = ref(0);

const DaoJiShiDate = new Date('2024-10-23');
const DaoJiShi = ref(0);

const TxServerDate = new Date('2025-02-20');
const ServerDate = ref(0);


const rules = ({
  table: [
    { required: true, message: '请选择分栏', trigger: 'blur' },
  ],
  barrage: [
    { required: true, message: '请输入弹幕', trigger: 'blur' },
  ]
})

//搜索
const queryBarrage = () => {
  console.log(searchQuery.value)
  request.post('/dgq/Query', {
    QueryBarrage: searchQuery.value
  }).then(res => {
    isInput.value = true;
    loading.value = false;
    data.filteredItems = res.data || [];
  })
}

//提交
const saveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入弹幕");
  } else {
    request.post('/dgq/addUnaudit', {
      ip: localStorage.getItem('ip'),
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      data.dialogFormVisible = false;
      data.barrage = '';
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    })
  }
}

const getRandOne = () => {
  request.get('/dgq/getRandOne')
    .then(res => {
      data.tableData = [res.data];
      // console.log(res)
      loading.value = false;
    }).catch(err => {
      console.error("随机失败")
    })
}
getRandOne();
var searchBarrageMeg = ref('搜索烂梗...');

const load = () => {
  request.get('/dgq/allBarrage/Page', {})
    .then(res => {
      // console.log(res);
      data.tableData = res.data || [];
      loading.value = false
      // console.log(data.tableData)
    })
    .catch(err => {
      console.error('加载数据失败:', err);
    });
};






const open2 = () => {
  ElMessage({
    message: '复制成功',
    type: 'success',
  })
};

const open4 = () => {
  ElMessage.error('复制失败，请检查浏览器是否禁用navigator.clipboard对象或手动复制,请勿使用夸克浏览器')
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
      table: 'allbarrage',
      id: row.id
    }).then(() => {
      console.log("复制成功")
    });
  } catch (err) {
    // 复制失败，可以显示错误信息
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput); // 清理临时元素
};

const onSearchQueryChange = () => {
  data.filteredItems = [];
  isInput.value = false;
};


const calculateCountdown = () => {
  const now = new Date();
  const diffTime1 = targetDate - now;
  const diffTime2 = DaoJiShiDate - now;
  const diffTime3 = TxServerDate - now;
  diudiugaokao.value = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));
  DaoJiShi.value = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
  ServerDate.value = Math.ceil(diffTime3 / (1000 * 60 * 60 * 24));
};


// 在组件挂载时计算倒计时
onMounted(() => {
  calculateCountdown();
  // 设置一个定时器每天更新一次倒计时
  setInterval(calculateCountdown, 1000 * 60 * 60 * 24);
});

</script>


<style>
.header-text {
  margin-left: 25px;
  font-size: 27px;
  color: red;
}

.DGjvpai {
  height: 80px;
  margin-bottom: -11px;
  display: flex;
  align-items: center;
}

.dog_head {
  margin-top: -10px;
  height: 70px;
  position: absolute;
}

.biabiabia {
  margin-top: -40px;
  height: 85px;
  position: absolute;
  margin-left: 10px;
}

.good {
  position: absolute;
  margin-top: -144px;
  height: 175px;
  margin-left: 300px;
}

.dgq63136 {
  font-size: 24px;
  font-weight: bold;
}

.Addform {
  width: 700px;
}

.footer {
  text-align: center;
  font-size: 17px;
  margin-left: -250px;
}

@media (min-width: 601px) {
  .home {
    width: 60vw;
  }

  .el-footer {
    z-index: 200;
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100% !important;
    text-align: center;
    font-family: Arial;
    font-size: 14px;
    letter-spacing: 1px;
    margin-left: -153px;
  }
}

@media (max-width: 600px) {
  .el-notification {
    width: 60%;
    height: auto;
  }

  .header-text {
    margin-left: 25px;
    font-size: 17px;
    color: red;
  }

  .DGjvpai {
    display: none;
  }

  .biabiabia {
    margin-top: -40px;
    height: 85px;
    position: absolute;
    margin-left: 10px;
  }

  .Addform {
    width: 90vw;
    padding: 0;
  }

  .good {
    position: absolute;
    margin-top: -53px;
    height: 60px;
    margin-left: 100px;
  }

  .dgq63136 {
    font-size: 17px;
    font-weight: bold;
  }

  .footer {
    margin-left: 0px;
    font-size: 14px;
  }

  .el-footer {
    text-align: center;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 0px;
    margin-left: 0px;
  }
}
</style>