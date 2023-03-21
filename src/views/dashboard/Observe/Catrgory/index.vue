<template>
  <el-card>
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <div>
        <el-radio-group v-model="radio1">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div>
      <div class="pieContainer" ref="pieContainer"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Catrgory",
  data() {
    return {
      radio1: [],
    };
  },
  mounted() {
    this.myEcharts = echarts.init(this.$refs.pieContainer);
    this.myEcharts.setOption({
      title: {
        text: "视频",
        subtext: "1024",
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outsize",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "搜索引擎" },
            { value: 735, name: "直接访问" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "联盟广告" },
            { value: 300, name: "视频广告" },
          ],
        },
      ],
    });

    this.myEcharts.on("mouseover", (params) => {
        let {name,value} = params.data
        this.myEcharts.setOption({
            title:{
                text:name,
                subtext:value
            }
        })
    });
  },
};
</script>

<style>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(226, 226, 226);
  padding-bottom: 20px;
}
.pieContainer {
  height: 300px;
  width: 100%;
}
</style>