<template>
  <div ref="seachLine" class="seachLine"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    this.myEcharts = echarts.init(this.$refs.seachLine);
    this.myEcharts.setOption({
      xAxis: {
        show: false,
        boundaryGap: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "line",
        data: [2, 1, 3, 2, 1, 3, 4, 2],
        symbol: "none",
        smooth: true,
        color: "rgb(138,169,230)",
        areaStyle: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgb(217,230,255)", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgb(217,230,255)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      grid: {
        left: "0",
        top: "0",
        bottom: "0",
        right: "0",
      },
    });
  },
};
</script>

<style>
.seachLine {
  height: 80px;
}
</style>