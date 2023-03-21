<template>
  <el-card>
        <div slot="header" class="cardHeader">
        <span>线上热门搜索</span>
        <span class="el-icon-more"></span>
        <span class="hr"></span>
        </div>

        <div style="margin:20px 0;">
            <el-row :gutter="30">
                <el-col :span="12" >
                    <div class="title">
                        <span class="titleContent">搜索用户数</span>
                        <span class="el-icon-info"></span>
                    </div>
                    <lineCharts></lineCharts>
                </el-col>
                <el-col :span="12" >
                    <div class="title">
                        <span class="titleContent">人均搜索次数</span>
                        <span class="el-icon-info"></span>
                    </div>
                    <lineCharts></lineCharts>
                </el-col>
            </el-row>
        </div>

        <div>
            <el-table
                :data="data"
                style="width: 100%"
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
            >
                <el-table-column type="index" width="80" label="排名" align="center"> </el-table-column>
                <el-table-column prop="prop" width="width" label="搜索关键字"> </el-table-column>
                <el-table-column prop="prop" width="width" label="用户数" sortable> </el-table-column>
                <el-table-column prop="prop" width="width" label="周涨幅" sortable> </el-table-column>
            </el-table>
        </div>


        <div style="marginTop:10px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50]"
                :page-size="pageSize"
                layout=" prev, pager, next, jumper,->,total,sizes"
                :total="0"
                style="textAlign:center;"
            >
            </el-pagination>
        </div>
  </el-card>
</template>

<script>
import lineCharts from './lineCharts'

export default {
    name:'Search',
    components:{
        lineCharts
    }
}
</script>

<style>
.title{
    margin-bottom:20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: rgb(169, 169, 169);
}
.title .titleContent{
    margin-right: 10px;
}

</style>