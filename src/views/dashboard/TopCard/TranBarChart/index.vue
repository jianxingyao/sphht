<template>
  <div class="TranBarChart" ref="TranBarChart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
    name:'TranBarChart',
    mounted(){
         let bar = echarts.init(this.$refs.TranBarChart)
        const option = {
            xAxis:{show:false, boundaryGap: false,min:0,max:100},
            yAxis:{show:false,type:'category',},
            series:{
                type:"bar",
                data:[78],
                barWidth:25,
                color:'rgb(153,191,47)',
                showBackground:true,
                backgoroundStyle:{
                    color:'#eee'
                },
                label:{
                    show:true,
                    formatter:'|',
                    fontSize:25,
                    position:"right"
                }
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
    },
}
</script>

<style>
.TranBarChart{
    width: 100%;
    height: 100%;
}
</style>