<template>
  <div class="lineContainer" ref="lineContainer"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    let line = echarts.init(this.$refs.lineContainer);
    console.log(line);

    let option = {
      xAxis: { show: false, type: "category", boundaryGap: false },
      yAxis: { show: false },
      series: {
        type: "line",
        data: [30, 10, 20, 10, 40],
        smooth: true,
        itemStyle: {
          opacity: 0,
        },
        lineStyle: {
          color: "rgb(166,140,217)",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgb(249,246,253)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgb(166,140,217)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },

      grid: {
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
      },
      
    };

    line.setOption(option);
  },
};
</script>

<style>
.lineContainer {
  width: 100%;
  height: 100%;
}
</style>