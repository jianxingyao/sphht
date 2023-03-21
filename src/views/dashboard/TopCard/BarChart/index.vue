<template>
  <div ref="BarContainer" class="BarContainer"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'BarChart',
    mounted(){
        let bar = echarts.init(this.$refs.BarContainer)
        const option = {
            xAxis:{show:false,type:'category', boundaryGap: false},
            yAxis:{show:false,},
            series:{
                type:"bar",
                data:[20,10,20,30,40,50,60],

            },
            grid: {
                left: "0",
                right: "0",
                top: "0",
                bottom: "0",
            },
            tooltip:{}
        }



        bar.setOption(option)
    }
}
</script>

<style>
.BarContainer{
    width: 100%;
    height: 100%;
}
</style>