<template>
  <div>
    
    <!-- sku列表 -->
    <el-table
      :data="skuList"
      style="width: 100%"
      border
    >
      <el-table-column label="序号" width="60" align="center" type="index"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="120">
        <template scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="100"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100"></el-table-column>
      <el-table-column label="操作" width="width">
        <template scope="{row}">
          <el-button :type="row.isSale === 1?'success':'info'" :icon="row.isSale === 1?'el-icon-top':'el-icon-bottom'" size="mini" @click="upOrDown(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="openDrawer(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="50%"
    >
      <el-row>
        <el-col :span="6" class="title">名称</el-col>
        <el-col :span="12" class="name">{{skuDetail.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="title">描述</el-col>
        <el-col :span="12" class="name">{{skuDetail.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="title">价格</el-col>
        <el-col :span="12" class="name">{{skuDetail.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="title">平台属性</el-col>
        <el-col :span="12" >
          <el-tag type="success" v-for="item in skuDetail.skuAttrValueList" :key="item.id" style="margin:0 10px;">{{item.valueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="title">商品图片</el-col>
        <el-col :span="12" >
            <el-carousel height="300px">
              <el-carousel-item v-for="item in skuDetail.skuImageList" :key="item">
                <img :src="item.imgUrl" style="height:100%;width:100%">
              </el-carousel-item>
            </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="textAlign:center"
      >
    </el-pagination>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name:'Sku',
    data() {
      return {
        skuList:[],//sku列表
        currentPage:1,//当前页
        limit:7,//每一页显示数据数量
        total:0,//总数据数量
        direction:'rtl',//抽屉方向
        drawer:false,//抽屉显示隐藏
        skuDetail:{},//sku详情信息
      }
    },
    methods:{
      //打开抽屉
      async openDrawer({id}){
        this.drawer = true
        const result = await this.$API.sku.reqSkuDetail(id)
        if(result.code !== 200)return
        this.skuDetail = result.data
      },
      //抽屉关闭后的回调
      handleClose(done){
        done()
      },
      //上架下架回调
      async upOrDown(row){
        let {isSale,id} = row

        if(isSale){
          const result = await this.$API.sku.reqCancelSale(id)
          if(result.code !== 200)return
          this.$message({
            type:'success',
            message:'下架成功'
          })
          row.isSale = 0

        }else{
          const result = await this.$API.sku.reqOnSale(id)
          if(result.code !== 200)return
          this.$message({
            type:'success',
            message:'上架成功'
          })
          row.isSale = 1
        }
      },
      //更换显示条数回调
      handleSizeChange(limit){
        this.limit = limit
        this.getSkuList()
      },
      //更换页数的回调
      handleCurrentChange(currentPage){
        this.currentPage = currentPage
        this.getSkuList()
      },
      //获取当前页的数据
      async getSkuList(){
        const {currentPage,limit} = this
        const result = await this.$API.sku.reqSkuList(currentPage,limit)
        if(result.code !== 200)return
        console.log(result);
        this.total = result.data.total
        this.skuList = result.data.records

      }
    },
    mounted(){
      this.getSkuList()
    }

    
}
</script>

<style scoped>
  .el-row{
    margin: 20px 0;
  }
  .title{
      text-align:right;
      font-size:25px;
      font-weight:900;
      margin-right:20px;
  }
  .name{
    line-height: 30px;
    display: flex;
    flex-direction:column;
    justify-content: center;
  }



   .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>