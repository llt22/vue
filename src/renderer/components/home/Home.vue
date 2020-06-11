<template>
  <div class="container">
    <!-- 头部card -->
    <div class="header_box">
      <el-row :gutter="20">
        <el-col :lg="4">
          <el-card class="card_header" shadow="hover">
            <div class="title">
              <img src="../../assets/icon/main_icon_001.svg" alt="" />
              <span>今日吞吐量</span>
            </div>
            <div class="number_size">
              <div class="number">27,479.44</div>
              <div class="size">(吨)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4">
          <el-card class="card_header" shadow="hover">
            <div class="title">
              <img src="../../assets/icon/main_icon_002.svg" alt="" />
              <span>本月吞吐量</span>
            </div>
            <div class="number_size">
              <div class="number">1,475,064.33</div>
              <div class="size">(吨)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4">
          <el-card class="card_header" shadow="hover">
            <div class="title">
              <img src="../../assets/icon/main_icon_003.svg" alt="" />
              <span>全年吞吐量</span>
            </div>
            <div class="number_size">
              <div class="number">3,377,785.92</div>
              <div class="size">(吨)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4">
          <el-card class="card_header" shadow="hover">
            <div class="title">
              <img src="../../assets/icon/main_icon_004.svg" alt="" />
              <span>今日自然吨</span>
            </div>
            <div class="number_size">
              <div class="number">27,740.82</div>
              <div class="size">(吨)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4">
          <el-card class="card_header" shadow="hover">
            <div class="title">
              <img src="../../assets/icon/main_icon_005.svg" alt="" />
              <span>本月自然吨</span>
            </div>
            <div class="number_size">
              <div class="number">1,555,915.2</div>
              <div class="size">(吨)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="4">
          <el-card class="card_header" shadow="hover">
            <div class="title">
              <img src="../../assets/icon/main_icon_006.svg" alt="" />
              <span>全年自然吨</span>
            </div>
            <div class="number_size">
              <div class="number">3,419,526.07</div>
              <div class="size">(吨)</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 中部 -->
    <el-row :gutter="20" style="margin-top:20px;">
      <!-- 海轮在港分布图 -->
      <el-col :lg="18">
        <el-card class="" style="height:250px" shadow="hover">
          <div class="" ref="lineMap" style="width:100%;height:250px"></div>
        </el-card>
      </el-col>
	  <!-- <div class="module-box">
		  <div @click="gotoPage()">数据测试</div>
	  </div> -->
      <!-- 快速入口 -->
      <el-col :lg="6">
        <el-card class="" style="height:250px" shadow="hover">
          <div class="ent_header">
            <h1 class="left_name">快速入口</h1>
            <div class="edit_icon">
              <img src="../../assets/icon/main_icon_007.svg" alt="" />
            </div>
          </div>
          <div class="icon_list">
            <div class="icon">
              <img src="../../assets/icon/icon1@2x.png" alt="" />
              <span>生产调度</span>
            </div>
            <div class="icon">
              <img src="../../assets/icon/icon2@2x.png" alt="" />
              <span>作业</span>
            </div>
            <div class="icon">
              <img src="../../assets/icon/icon3@2x.png" alt="" />
              <span>单证中心</span>
            </div>
            <div class="icon">
              <img src="../../assets/icon/icon4@2x.png" alt="" />
              <span>综合管理</span>
            </div>
            <div class="icon">
              <img src="../../assets/icon/icon5@2x.png" alt="" />
              <span>商财一体化</span>
            </div>
            <div class="icon">
              <img src="../../assets/icon/icon6@2x.png" alt="" />
              <span>库场管理</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 尾部 -->
    <el-row :gutter="20" style="margin-top:20px;">
      <!-- 地方船在港分布图 -->
      <el-col :lg="18">
        <el-card class="" style="height:250px" shadow="hover">
          <div class="" ref="treeMap" style="width:100%;height:250px"></div>
        </el-card>
      </el-col>
      <!-- 海轮图表区域 -->
      <el-col :lg="6">
        <el-card class="" style="height:250px" shadow="hover">
          <div
            class="seacraft"
            style="width:100%;height:150px"
            ref="seacraftMain"
          ></div>
          <div class="message_number">
            <div class="top">
              <div class="num_list">
                <span class="one"></span>
                <span class="title">预报</span>
                <span class="num">88</span>
              </div>
              <div class="num_list">
                <span class="two"></span>
                <span class="title">确报</span>
                <span class="num">88</span>
              </div>
            </div>
            <div class="btm">
              <div class="num_list">
                <span class="three"></span>
                <span class="title">靠泊</span>
                <span  class="num">1</span>
              </div>  
              <div class="num_list">
                <span class="four"></span>
                <span class="title">开工</span>
                <span  class="num">22</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入echarts
import echarts from "echarts";

export default {
  data() {
    return {}
  },
  mounted() {
    //海轮折线图
    let myChart1 = echarts.init(this.$refs.lineMap);
    let option1 = {
      title: {
        text: "海轮在港分布图",
        //主标题字体样式
        textStyle: {
          fontSize: "16",
          color: "#303133",
        },
      },
      legend: {
        right: 0,
        data: ["大港", "东港"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["预报", "到港", "停泊", "开工"],
      },
      yAxis: {
        type: "value",
        splitLine: {
          //网格线
          lineStyle: {
            type: "dashed",
            opacity: 0.5,
            //设置网格线类型 dotted：虚线   solid:实线
          },
          show: true, //隐藏或显示
        },
      },

      series: [
        {
          name: "大港",
          data: [820, 932, 300, 934],
          type: "line",
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(254, 85, 120,0.75)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(252,230,188,0.25) ",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10,
            },
          },
        },
        {
          name: "东港",
          data: [100, 900, 400, 200],
          type: "line",
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(89, 188, 251, 0.75)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(89, 188, 251, 0.25)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 100,
            },
          },
          itemStyle: {
            normal: {
              color: "rgb(0,136,212)",
              borderColor: "rgba(0,136,212,0.2)",
              borderWidth: 12,
            },
          },
        },
      ],
    };
    myChart1.setOption(option1);
    //响应式
    window.addEventListener("resize", function() {
      myChart1.resize();
    });

    // 地方船在港分布图
    let myChart2 = echarts.init(this.$refs.treeMap);
    let option2 = {
      title: {
        text: "地方船在港分布图",
        subtext: "单位：艘",
        //主标题样式
        textStyle: {
          fontSize: 16,
          color: "#303133",
        },
        //副标题样式
        suntextStyle: {
          fontSize: 12,
          color: "#6D6D6D",
        },
      },
      color: ["#2798F7", "#6C5CE7"], //树状图颜色
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "cross", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      // grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      // },
      xAxis: [
        {
          type: "category",
          data: [
            "大港分公司",
            "东港公司",
            "金港分公司",
            "其他",
            "未来分公司",
            "未来分公司",
            "未来分公司",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
              opacity: 0.5,
            },
            show: true, //隐藏或显示
          },
        },
      ],
      series: [
        {
          name: "直接访问",
          type: "bar",
          barWidth: "10%",
          data: [50, 62, 22, 45, 50, 49, 35],
          itemStyle: {
            normal: {
              //柱形图圆角，初始化效果
              barBorderRadius: [10, 10, 0, 0],
            },
          },
        },
        {
          name: "直接访问1",
          type: "bar",
          barWidth: "10%",
          data: [30, 52, 30, 35, 40, 55, 25],
          itemStyle: {
            normal: {
              //柱形图圆角，初始化效果
              barBorderRadius: [10, 10, 0, 0],
            },
          },
        },
      ],
    };
    myChart2.setOption(option2);
    //响应式
    window.addEventListener("resize", function() {
      myChart2.resize();
    });
    //海轮饼图
    let myChart3 = echarts.init(this.$refs.seacraftMain);
    let option3 = {
      title: {
        text: "海轮",
        //主标题样式
        textStyle: {
          fontSize: 16,
          color: "#303133",
        },
      },

      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      // legend: {
      //   orient: "vertical",
      //   left: 10,
      //   bottom:0,
      //   data: ["预报", "确报", "靠泊", "开工"],
      // },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: "30",
          //     fontWeight: "bold",
          //   },
          // },
          labelLine: {
            show: false,
          },
          data: [
            { value: 335, name: "预报", itemStyle: { color: "#6C5CE7" } },
            { value: 310, name: "确报", itemStyle: { color: "#6C5CE7" } },
            { value: 234, name: "靠泊", itemStyle: { color: "#1CD1A1" } },
            { value: 135, name: "开工", itemStyle: { color: "#FE5578" } },
          ],
        },
      ],
    };
    myChart3.setOption(option3);
    //响应式
    window.addEventListener("resize", function() {
      myChart3.resize();
    });
  },
  methods:{
	  gotoPage(){
		  this.$router.push('/externalLink_jd')
		  // alert(this.$route.meta.link)
		  // this.$store.state.iframeSrc = this.$route.meta.link
		  // this.$store.state.iframeTitle = this.$route.meta.title
		  this.$router.push({
		    name: 'LinkHome',
		    params: {
		      title: this.$route.meta.title,
			  link:this.$route.meta.link
		    }
		})
	  }
  }
};
</script>

<style lang="less" scoped>
.container {
  .header_box {
    .card_header {
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        span {
          margin-left: 9px;
          font-size: 14px;
          color: #303133;
        }
      }
      .number_size {
        display: flex;
        flex-direction: column;
        align-items: center;
        .number {
          margin-top: 19px;
          font-size: 22px;
          color: #303133;
        }
        .size {
          margin-top: 6px;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
  // 快速入口
  .ent_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left_name {
      font-size: 16px;
      color: #303133;
    }
    .edit_icon {
      width: 16px;
      height: 16px;
      background-color: #edeff2;
      cursor: pointer;
    }
  }
  .icon_list {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    .icon {
      width: 33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      img {
        width: 36px;
        height: 36px;
      }
      span {
        margin-top: 10px;
        font-size: 12px;
        color: #606266;
      }
    }
  }

  //海轮图表

  .message_number {
    width: 100%;
    .top {
      display: flex;
      justify-content: space-between;
    }
    .btm {
      margin-top: 11px;
      display: flex;
      justify-content: space-between;
    }
    .num_list {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      
      .title{
        font-size: 14px;
        color: #666666;
      }
      .num{
        margin-left:12px;
        font-family: ArialMT;
        font-size: 17px;
        color: #303133;
      }
      .one {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #6c5ce7;
      }
      .two {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #6c5ce7;
      }
      .three {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #1cd1a1;
      }
      .four {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #fe5578;
      }
    }
  }
  
  .el-card{
    cursor:pointer;
  }
}
</style>
