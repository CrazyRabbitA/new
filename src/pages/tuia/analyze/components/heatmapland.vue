<template>
  <div >
    <time-select :isshow="false" :time-obj.sync="timeObj" :button-time="buttonTime"></time-select>
    <div class="form-filter-group widthall">
      <div class="left-ad">
        <p class="filter-label fl">广告ID：</p>
        <auto-input placeholder="请输入广告ID" :input-class="'form-control fl'"  :value.sync="advertId" ></auto-input>
      </div>
      <d-button class="searchfilter" @click="search" size="large" type="warning" >查询</d-button>
      <d-button class="searchfilter" @click="exportModal" size="large" type="warning" >导出</d-button>
    </div>
    <div class="form-filter-group cf form-group-radio widthall">
      <p class="filter-label fl filter-label-flow leftp">链接筛选：</p>
      <p class="rightp">
        <span
        v-for="(index, item) in urlData"
        :key="index">
        <input type="radio" name="urls" v-model="defaultVal" @change = "changeUrl(item.promote_urlMD5)" :value="item.promote_urlMD5">{{item.promote_url}}</span>
      </p>
    </div>
   <div class="cf">
    <table class="mytable">
      <tr>
        <th>访问PV</th>
        <th>访问UV</th>
        <th>转化PV</th>
        <th>转化UV</th>
        <th>转化率</th>
        <th>点击PV</th>
        <th>点击UV</th>
        <!-- <th>PV点击率</th> -->
        <th>UV点击率</th>
        <th class="dropradio">
          跳出用户占比 <i class="quwenicon">&#xe67f;</i>
          <span>进入到页面后没有任何点击行为用户占比</span>
        </th>
      </tr>
      <tr v-if="showTable">
        <td>{{tabelList.visit_pv}}</td>
        <td>{{tabelList.visit_uv}}</td>
        <td>{{tabelList.ef_pv}}</td>
        <td>{{tabelList.ef_uv}}</td>
        <td>{{_getPrecent(tabelList.ef_radio)}}</td>
        <td>{{tabelList.click_pv}}</td>
        <td>{{tabelList.click_uv}}</td>
        <!-- <td>{{_getPrecent(tabelList.click_pv_radio)}}</td> -->
        <td>{{_getPrecent(tabelList.click_uv_radio)}}</td>
        <td>{{_getPrecent(tabelList.drop_radio)}}</td>
      </tr>
      </table>
    </div>
    <div class="heatmap-chart2" v-show="isShowHeatMap">
      <div class="heatmapBox">
          <div :style='{backgroundImage:`url(${bgurl})`}' id="heatmapContainer3" @mousemove="showPoint($event)" @mouseleave="hidePoint($event)"  v-show="selectedPv">
          <div class="tip" id="pvtip" v-show="pvTip.pvTipShow" v-bind:style="{ left: leftSize+'px', top: topSize +'px' }">{{"点击PV："+pvTip.value}}</div>
        </div>
        <div :style='{backgroundImage:`url(${bgurl})`}'  id="heatmapContainer4"  @mousemove="showPoint($event)" @mouseleave="hidePoint($event)" v-show="selectedUv">
          <div class="tip" id="uvtip" v-show="uvTip.uvTipShow" v-bind:style="{ left: leftSize+'px', top: topSize +'px' }">{{"点击UV："+uvTip.value}}</div>
        </div>
      </div>
    </div>
    <div v-if="landPageChildPageId.length>0" class="form-filter-group cf form-group-radio widthall page">
      <p class="filter-label fl filter-label-flow">页面筛选：</p>
      <p class="tops" >
          <span v-for="(index,item) in landPageChildPageId" :key="item" track-by="$index">
           <input type="radio" name="childpage" @change="changebgtype(index)" v-model="bgtype" :value="index" />{{index === 0 ? '主页面' : `子页面${index}`}}
          </span>
        <span @click.native = "downloadImg" class="icon"><i class="quwenicon">&#xe639;</i></span>
      </p>
    </div>
    <export-modal
      @to-parent = "getemit"
      :show="showModal"></export-modal>
    <!-- <canvas v-show="true" id="canvas1" width="375" height="667"></canvas> -->
    <!-- <canvas v-show="true" id="canvas2" width="375" height="667" ></canvas> -->
    <canvas v-show="false" id="canvas" width="750" height="667" ></canvas>
  </div>
</template>
<script>
import { getPrecent } from '../../../../components/utils/cheatDataUtils';
import timeSelect from './selectTime';
import autoInput from '../../monitor/components/autoInput';
import MessageBox from 'components/basic/MessageBox';
import _heatmap from 'components/utils/heatmap.min.js'; /* eslint-disable */
import exportModal from './exportModal';
const mapTypes = [
  {
    label:'活动页面',
    index: 0,
  },
  {
    label:'落地页',
    index: 1,
  },
  {
    label:'游戏',
    index: 2,
  },
  {
    label:'主会场',
    index: 3,
  },
  {
    label:'直投页',
    index: 4,
  },
  {
    label:'广告弹层',
    index: 5,
  }
]
const scaleArr = [
  {
    label: '25*50',
    id: 4
  },
  {
    label: '20*40',
    id: 3
  },
  {
    label: '15*30',
    id: 2
  },
  {
    label: '10*20',
    id: 1
  }
];
const quotas = [
  {
    title: '页面PV热力图',
    id: 'pvHeatMap'
  },
  {
    title: '页面UV热力图',
    id: 'uvHeatMap'
  }
];
export default {
  components: {
    timeSelect,
    autoInput,
    exportModal
  },
  data() {
    return {
      data: {},
      pointListPv: {
        min: 0,
        max: 0,
        data: []
      },
      leftSize: 0,
      topSize: 0,
      isShowHeatMap: false,
      pointListUv: {
        min: 0,
        max: 0,
        data: []
      },
      scaleArr: scaleArr,
      pvTip: {
        value: '',
        pvTipShow: false
      },
      uvTip: {
        value: '',
        uvTipShow: false
      },
      selectedUv: true,
      selected: true,
      selectedPv: true,
      heatmap: '',
      timeObj: {
        startDate: '',
        endDate: ''
      },
      params: {
        appId: '',
        pageId: '',
        slotId: '',
        pageType: 4,
        dimension: 4,
        skinId: 26
      },
      iframeurl: '',
      bgurl: '',
      quotas: quotas,
      domHeight:667,
      dimension: {
        xScale: 0,
        yScale: 0,
        radius: 0
      },
      mapTypes: mapTypes,
      curIndex:0,
      defaultVal:0,
      urlData:[],
      tabelList: {},
      showModal:false,
      advertId:'',
      pageType:4,
      landPageChildPageId:[],
      childpageId:1,
      basepv:'',
      baseuv:'',
      bgtype: 0,
      showTable:false
    };
  },
  methods: {
    getemit(msg) {
      this.showModal = msg.show;
      if(msg.data) {
        const params = {
          downloadType:msg.data,
          pageUrl:this.defaultVal,
          advertId:this.advertId ? this.advertId:'',
          beginDate:this.timeObj.startDate,
          endDate:this.timeObj.endDate
        }
        let url = `/page/heatMap/detaildatadownload?downloadType=${msg.data}&pageUrl=${this.defaultVal}&advertId=${this.advertId ? this.advertId:''}
        &beginDate=${this.timeObj.startDate}&endDate=${this.timeObj.endDate}`
        window.open(url);
      }
    },
    exportModal() {
      if(this.defaultVal === 0 || this.advertId === '') return;
      this.showModal = true;
    },
    changeType(index){
      this.curIndex = index;
      this.pageType = index;
    },
    // 获取页面id
    getLandPageChildPageId() {
      const params = {
        beginDate:this.timeObj.startDate,
        endDate:this.timeObj.endDate,
        pageId: this.advertId,
        pageType: 4,
        pageUrl: this.defaultVal
      }
      this.$http.post('/page/heatMap/getLandPageChildPageId',params).then((res) => {
        this.landPageChildPageId =JSON.parse(res.body).data.childPageIds;
      })
    },
    // 调取背景接口
    changebgtype(index = 0){

      // let urlDatas = this.urlData.slice();
      // const url = urlDatas.filter((ele) => ele.promote_urlMD5 = this.defaultVal)[0]['promote_url'];
      let urlDatas = this.urlData.slice();
      const url = this.tabelList.promote_url;
      this.childpageId = index + 1;
      const params = {
        skinId: 0,
        pageId: this.advertId,
        pageType: 4,
        childPageId: index + 1,
        pageUrl:url,
      }
      this.$http.get('/page/heatMap/preview',{params:params}).then((res) => {
        // if (res.success) {
          this.bgurl = JSON.parse(res.body).data
          this.getDataList()
        // }
      })
    },
    getDataList() {
      this.$loadingRouteData = true;
      const params = {
        beginDate:this.timeObj.startDate,
        endDate:this.timeObj.endDate,
        childPageId: this.childpageId,
        pageId: this.advertId,
        pageType: this.pageType,
        pageUrl: this.defaultVal
      }
      this.$http.post('/page/heatMap/getLandData',params).then(res => {
        this.$loadingRouteData = false;
        res = res.json();
        this.data = {};
        this.pointListPv.data = [];
        this.pointListUv.data = [];
        if (res.success) {
          this.data = res.data.axisList;
          this.isShowHeatMap = true;
          this.params.dimension = res.data.dimension;
          this.params.skinId==27?this.domHeight = 758:this.domHeight = 667;
          this.dimension = {
            xScale: 25,
            yScale: 50,
            radius: 16
          }
          if (!document.querySelector('.heatmap-canvas')) {
            this.heatmap = _heatmap.create({
              container: document.getElementById('heatmapContainer3'),
              radius: 40,
              maxOpacity: 1,
              minOpacity: 0.6,
              blur: 1,
              backgroundColor: '',
              gradient: {
                '0.01': 'blue',
                '0.03': 'green',
                '0.1': 'yellow',
                '0.2': 'orange',
                '0.4': 'red'
              }
            });
            this.heatmap1 = _heatmap.create({
              container: document.getElementById('heatmapContainer4'),
              radius: 40,
              maxOpacity: 0.9,
              minOpacity: 0.45,
              blur: 1,
              backgroundColor: '',
              gradient: {
                '0.01': 'blue',
                '0.03': 'green',
                '0.1': 'yellow',
                '0.2': 'orange',
                '0.4': 'red'
              }
            });
          }
            this.pointListPv.max = res.data.maxPv;
            this.pointListUv.max = res.data.maxUv;
            this.pointListPv.data = [];
            if (!res.data.axisList) {
              MessageBox({
                title: '暂无数据',
                type: 'error'
              });
              this.heatmap.setData(this.pointListPv);
              this.heatmap1.setData(this.pointListUv);
              return;
            } else {
              res.data.axisList.forEach(item => {
                this.pointListPv.data.push({
                  x: parseInt(
                    item.x * (100 / this.dimension.xScale) * 375 * 0.01
                  ),
                  y: parseInt(
                    item.y * (100 / this.dimension.yScale) * this.domHeight * 0.01
                  ),
                  value: item.pv
                });
                this.pointListUv.data.push({
                  x: parseInt(
                    item.x * (100 / this.dimension.xScale) * 375 * 0.01
                  ),
                  y: parseInt(
                    item.y * (100 / this.dimension.yScale) * this.domHeight * 0.01
                  ),
                  value: item.uv
                });
              });
            this.heatmap.setData(this.pointListPv);
            this.heatmap1.setData(this.pointListUv);
            // 图片合成
            setTimeout(() => {
              const nodes = document.querySelectorAll('.heatmap-canvas')
              // 第一个
              const canvas = document.getElementById('canvas');
              const ctx = canvas.getContext("2d");
              const img = new Image();
              const img1 = new Image();
              const img2 = new Image();
              img2.setAttribute("crossOrigin",'Anonymous');
              img.setAttribute("crossOrigin",'Anonymous');
              img1.setAttribute("crossOrigin",'Anonymous');
              img.src = this.bgurl;
              img.onload = () => {
                 ctx.drawImage(img, 0,0,375,667);
                 ctx.drawImage(img,375,0,375,667);
                 img1.src = nodes[0].toDataURL("image/png")
                  img1.onload = () => {
                    ctx.drawImage(img1,0,0)
                  }
                  img2.src = nodes[1].toDataURL("image/png")
                  img2.onload = () => {
                    ctx.drawImage(img2,375,0)
                  }
              }
            }, 100);
          }
        }
      })
    },
    downloadImg() {
      var type = 'png';
      var canvas = document.getElementById('canvas');
      var imgData = canvas.toDataURL(type);
      /**
      * 获取mimeType
      * @param  {String} type the old mime-type
      * @return the new mime-type
      */
      var _fixType = function(type) {
          type = type.toLowerCase().replace(/jpg/i, 'jpeg');
          var r = type.match(/png|jpeg|bmp|gif/)[0];
          return 'image/' + r;
      };

      // 加工image data，替换mime type
      imgData = imgData.replace(_fixType(type),'image/octet-stream');
      /**
      * 在本地进行文件保存
      * @param  {String} data     要保存到本地的图片数据
      * @param  {String} filename 文件名
      */
      var saveFile = function(data, filename){
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          save_link.download = filename;

          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
      };

      // 下载后的问题名
      const pagetype = this.bgtype === 0 ? '主页面' : `子页面${this.bgtype}`
      const filename = this.advertId + ' ' + pagetype + ' ' + this.timeObj.startDate + ' - ' + this.timeObj.endDate + '.' + type;
      // download
      saveFile(imgData,filename);
    },
    showPoint(e) {
      let self = this;
      let tx = parseInt((e.offsetX / 375 * this.dimension.xScale).toFixed(0));
      let ty = parseInt((e.offsetY / this.domHeight * this.dimension.yScale).toFixed(0));
      self.pvTip.pvTipShow = false;
      self.uvTip.uvTipShow = false;
      this.leftSize = e.offsetX;
      this.topSize = e.offsetY;
      this.data.forEach(item => {
        if (item.x === tx && item.y === ty) {
              self.pvTip.value = item.pv;
              self.pvTip.pvTipShow = true;
              self.uvTip.value = item.uv;
              self.uvTip.uvTipShow = true;
        }
      });
    },
    hidePoint(e) {
      this.pvTip.pvTipShow = false;
      this.uvTip.uvTipShow = false;
    },
    // 链接数据
    geturls() {
      // 重置
      this.bgtype = 0;
      const params = {
        advertId:this.advertId ? this.advertId:'',
        beginDate:this.timeObj.startDate,
        endDate:this.timeObj.endDate,
        pageType:4,
      }
      this.$http.post('/page/heatMap/getLandPageDetailData',params).then((res) => {
        if (!JSON.parse(res.body).success) {
          MessageBox({
            title: JSON.parse(res.body).desc,
            type: 'error'
          });
          return;
        };
        // 无数据处理
        if(JSON.parse(res.body).data.detail.length === 0) {
          MessageBox({
            title: '暂无数据',
            type: 'error'
          });
          return;
        };
        let data = JSON.parse(res.body).data.detail;
        this.urlData = data;
        // 默认值
        const visit_pv = this.urlData.map((ele) => ele.visit_pv);
        const maxVistPv = Math.max.apply(null,visit_pv);
        this.urlData.forEach((ele) => {
          if( ele.visit_pv === maxVistPv) {
            this.defaultVal = ele.promote_urlMD5
          }
        });
        // 浅复制一层
        const urlDatas = this.urlData;
        this.tabelList = urlDatas.filter((ele) => ele.promote_urlMD5 === this.defaultVal)[0];
        this.showTable = true;
        // 调取接口
        setTimeout(() => {
          this.changebgtype();
          this.getLandPageChildPageId();
        },200)
      })
    },
    changeUrl(val) {
      this.tabelList = this.urlData.filter((ele) => ele.promote_urlMD5 === this.defaultVal)[0];
      // 改变的时候
      this.getDataList();
    },
    search() {
      if (!this.advertId) {
        MessageBox({
          title: '广告id不能为空',
          type: 'error'
        });
      } else {
        if (Number(this.advertId).toString() === 'NaN' || Number(this.advertId) < 0) {
          MessageBox({
            title: 'id格式错误',
            type: 'error'
          });
          return;
        }
        this.geturls();
      }
    },
    _getPrecent(num) {
      return getPrecent(num)
    }
  },
};
</script>
<style lang="less">
#heatmapContainer{
  position: relative;
  .bgs{
    position: absolute;
    z-index: 100;
    width: 100%;
    height:100%
  }
  canvas{
    position:absolute;
    z-index: 0;
  }
}
.main {
  .quwenicon{
    cursor:pointer;
  }
  input[type = raido] {
    cursor:pointer;
  }
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  .heatmap-warp {
      display: inline-block;
      width:100%;
    .form-filter-group {
      margin-bottom: 18px;
      float: left;
      .filter-label {
        font-size: 14px;
        font-weight: bold;
        color: #444;
        width: 84px;
        text-align: left;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        &.long {
          width: 120px;
          text-align: left;
        }
        &.short {
          width: 16px;
          text-align: left;
        }
      }
      .form-control {
        width: 150px;
        display: inline-block;
        margin-right: 10px;
      }
      .select-group {
        width: 150px;
        margin-right: 10px;
      }
      .datepicker-input {
        width: 160px !important;
      }
      .iconhandle {
        right: 26px !important;
      }
    }
    .d-button {
      margin-left: 16px;
    }
    .mytable {
      border-radius: 2px;
      border: 1px solid #ccc;
      margin-bottom: 0px;
      width: 100%;
      th {
        font-family: HiraginoSansGB-W6;
        font-size: 14px;
        color: #444444;
        background-color: #e8e7e2;
        padding: 9px 0;
        // display: inline-block;
        &.dropradio{
          position:relative;
          span{
            position:absolute;
            display:block;
            min-width:150px;
            height:50px;
            text-align:left;
            line-height: 20px;
            top:-60px;
            display:none;
            font-weight:normal;
            border:1px solid #666;
            padding:5px 10px;
            background: #ff795c;
            color:#fff;
          }
        }
        &.dropradio:hover{
          span{
          display:block;
          }
        }
      }
      td {
        line-height: 40px;
        text-align: center;
        font-size: 13px;
        border-bottom: 1px dashed #ccc;
        div {
          text-align: center;
        }
      }
      .td-title {
        border: none;
        vertical-align: middle;
        text-align: center;
      }
    }
    .heatmap-chart2 {
      .filter-area {
        font-size: 0px;
        ul {
          font-size: 0px;
          display: inline-block;
          border-right: 0px solid #e3e3e3;
        }
        .download {
          margin-left: 20px;
          background-color: #fff;
          border: 0px;
          color: #657180 !important;
        }
        li {
          display: inline-block;
          border: 1px solid #e3e3e3;
          background-color: #f7f6f2;
          border-right: none;
          height: 34px;
          line-height: 34px;
          padding: 0 14px;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #ef6b3b;
          }
          &.active {
            background-color: #ef6b3b;
            color: #fff;
            border: 1px solid #ef6b3b;
          }
          &:nth-child(7) {
            border-right: 1px solid #e3e3e3;
          }
          .iconhandle {
            font-size: 14px;
          }
        }
        .quota {
          font-size: 14px;
          font-weight: bold;
          color: #444;
          width: 84px;
          text-align: left;
          display: inline-block;
          margin-top: 10px;
        }
      }

      .heatmapBox {
        position: relative;
        width: 100%;
        height: 667px;
        margin-top: 20px;
        margin-left: px;
        iframe {
          width: 375px;
          height: 667px;
          position: absolute;
          img {
            width: 100%;
            height: 100%;
          }
        }
        #heatmapWarp1 {
          left: 380px;
        }
        #heatmapContainer3 {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 375px;
          height: 667px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        #pvtip,
        #uvtip {
          position: absolute;
          border-style: solid;
          white-space: nowrap;
          z-index: 9999999;
          background-color: rgba(50, 50, 50, 0.7);
          border-width: 0px;
          border-color: rgb(51, 51, 51);
          border-radius: 4px;
          color: rgb(255, 255, 255);
          font-style: normal;
          font-variant: normal;
          font-weight: normal;
          font-stretch: normal;
          font-size: 14px;
          font-family: 'Microsoft YaHei';
          line-height: 21px;
          padding: 5px;
        }
        #heatmapContainer4 {
          position: absolute !important;
          top: 0;
          left: 380px;
          width: 375px;
          height: 667px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
      }
    }
  }
  .left-ad{
    float:left
  }
  .widthall{
    width:100%;
    .tops{
      margin-top:10px;
    }
    &.page{
      margin-top:20px;
      height:40px;
    }
    .icon{
      margin-left:20px;
      cursor: pointer;
    }
  }
  .leftp{
    width:200px;
    float:left;
  }
  .rightp{
    height:100%;
    float:left;
    span{
      display:block;
      height:14px;
      margin-top:10px;
    }
  }
}
.map-wrapper{
  display: inline-block;
  li{
    height:34px;
    line-height: 34px;
    float:left;
    padding:0 20px;
    border:1px solid #666;
    border-right:none;
    cursor:pointer;
    &:last-child{
      // border:none;
      border-right:1px solid #666;
    }
    &.active{
      color: #fff;
      background-color: #ef6b3b;
    }
  }
}
</style>


