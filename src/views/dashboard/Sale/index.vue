<template>
  <div class="SaleContainer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
          <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
          <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
        </el-tabs>

        <!-- 头部右侧日期盒子 -->
        <div class="dataContainer">
          <div>
            <span @click="setDay">今日</span>
            <span @click="setWeek">本周</span>
            <span @click="setMouth">本月</span>
            <span @click="setYear">本年</span>
          </div>

          <el-date-picker
            v-model="timeArry"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>

      <div>
        <el-row :gutter="10">
          <el-col :span="16" >
            <div ref="barContainer" class="barContainer"></div>
          </el-col>
          <el-col :span="8">
            <h4>门店{{title}}排名</h4>
            <ul class="sortBox">
                <li>
                    <span class="rank"><div class="active">1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
                <li>
                    <span class="rank"><div class="active">1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
                <li>
                    <span class="rank"><div class="active">1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
                <li>
                    <span class="rank"><div>1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
                <li>
                    <span class="rank"><div>1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
                <li>
                    <span class="rank"><div>1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
                <li>
                    <span class="rank"><div>1</div></span>
                    <span class="name">肯德基</span>
                    <span class="number">323,234</span>
                </li>
               
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs'
export default {
  name: "Sale",
  data() {
    return {
      activeName: "销售额",
      timeArry: [],
    };
  },
  computed:{
    title(){
        return this.activeName === '销售额'? '销售额' : '访问量'
    }
  },
  watch:{
    title:{
        handler(newValue){
            this.myEcharts.setOption({
                title:{text:this.title}
            })
        }
    }
  },
  methods:{
    //当天
    setDay(){
        const day = dayjs().format('YYYY-MM-DD')
        this.timeArry = [day,day]
    },
    //本周
    setWeek(){
        const start = dayjs().day(1).format('YYYY-MM-DD')
        const end = dayjs().day(7).format('YYYY-MM-DD')
        this.timeArry = [start,end]
    },
    //本月
    setMouth(){
        const start = dayjs().startOf('month').format('YYYY-MM-DD')
        const end = dayjs().endOf('month').format('YYYY-MM-DD')
        this.timeArry = [start,end]
    },
    //今年
    setYear(){
         const start = dayjs().startOf('year').format('YYYY-MM-DD')
        const end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.timeArry = [start,end]
    },
  },
  mounted() {
    this.myEcharts = echarts.init(this.$refs.barContainer);

    this.myEcharts.setOption({
    title:{
        text:'销售额'
    },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月","十一月","十二月"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
  
        {
            show:true,
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220,200,100,50,30,40],
          color:'rgb(81,114,202)'
        },
      ],
    });
  },
};
</script>

<style >
.barContainer{
   width: 100%;
   height: 300px;
}
.clearfix {
  position: relative;
}
.dataContainer {
  position: absolute;
  bottom: 20px;
  right: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.dataContainer span {
  margin: 0 10px;
}
.tab {
  width: 100%;
}

.SaleContainer {
  margin-top: 30px;
}
.sortBox{
    margin-top: 20px;
}
.sortBox li{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px;

}
.sortBox .rank{
    flex: 0.3;
}
.sortBox .rank div{
    display: flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    
    border-radius: 50%;
}
.active{
    background-color: black;
    color: white;
}
.sortBox .name{
    flex: 1;
    line-height: 30px;
}
.sortBox .number{
    flex: 0.5;
    line-height: 30px;
}
</style>