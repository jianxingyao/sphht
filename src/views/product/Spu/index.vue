<template>
  <div>
    <!-- 顶部 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!(second === 0)"
      ></CategorySelect>
    </el-card>

    <el-card>
      <!-- 展示Spu -->
      <div v-show="second === 0">
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plsu"
          style="margin: 20px 0"
          @click="addSpuBack"
          :disabled="!category3Id"
          >添加SPU</el-button
        >

        <!-- 表格 -->
        <el-table :data="spuList" style="width: 100%; margin: 20px 0" border>
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template scope="{row,$index}">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSKu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                style="marginRight:10px;"
                @click="lookSkuList(row)"
              ></el-button>

              <el-dialog :title="spu.spuName" :visible.sync="dialogTableVisible" :before-close="closeDialong">
                  <el-table
                    :data="skuList"
                    style="width: 100%"
                    v-loading="loading"  
                  >
                    <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
                    <el-table-column prop="price" label="价格" width="width"></el-table-column>
                    <el-table-column prop="weight" label="重量" width="width"></el-table-column>
                    <el-table-column prop="" label="默认图片" width="width">
                      <template scope="{row}">
                        <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
                      </template>
                    </el-table-column>
                  </el-table>
              </el-dialog>

              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row, $index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除当前spu"
                  slot="reference"
                  style="marginleft: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="totalCount"
          style="textalign: center"
        >
        </el-pagination>
      </div>

      <!-- 增加|修改SPU -->
      <Spu-From
        v-show="second === 1"
        ref="spu"
        @changeSecond="changeSecond"
      ></Spu-From>
      <!-- 增加SKU -->
      <Sku-From
        v-show="second === 2"
        ref="sku"
        @changeSecond="changeSecond"
      ></Sku-From>
    </el-card>
  </div>
</template>

<script>
import SpuFrom from "./SpuFrom";
import SkuFrom from "./SkuFrom";

export default {
  name: "Spu",
  components: {
    SpuFrom,
    SkuFrom,
  },
  data() {
    return {
      isShowTable: true,
      category1Id: "", //一级分类Id
      category2Id: "", //二级分类Id
      category3Id: "", //三级分类Id
      spuList: [], //spu列表
      currentPage: 1, //当前页数
      limit: 3, //每页多少数据
      totalCount: 99, //总页数
      second: 0, //0 展示spu  1增加|修改Spu  2增加Sku
      dialogTableVisible:false,
      spu:{},
      skuList:[],
      loading:true
    };
  },
  methods: {
    //关闭对话框前的回调
    closeDialong(done){
      done()
      this.loading = true
      this.spu = {}
      this.skuList = []
    },
    //查看当前spu下的sku列表
    async lookSkuList(row) {
      this.dialogTableVisible = true
      this.spu = row
      const result = await this.$API.sku.reqGetSkuList(row.id)
      if(result.code !== 200)return

      this.skuList = result.data
      this.loading = false

    },
    //删除spu
    async deleteSpu(row) {
      console.log(123);
      const result = await this.$API.spu.reqDelSpu(row.id);
      if (result.code !== 200) return;
      this.getSpuList(this.currentPage);
    },
    //获取分类Id
    getCategoryId({ categoryId, leve }) {
      console.log("这是父组件", categoryId, leve);
      switch (leve) {
        case 1:
          this.category1Id = categoryId;
          this.category2Id = "";
          this.category3Id = "";
          break;

        case 2:
          this.category2Id = categoryId;
          this.category3Id = "";
          break;

        case 3:
          this.category3Id = categoryId;
          this.getSpuList();
          break;

        default:
          break;
      }
    },
    //添加Spu的回调
    addSpuBack() {
      this.second = 1;
      this.$refs.spu.addSpu(this.category3Id);
    },

    //获取spu列表数据
    async getSpuList() {
      let { currentPage, limit, category3Id } = this;

      const result = await this.$API.spu.reqSpuList({
        currentPage,
        limit,
        category3Id,
      });

      if (result.code !== 200) return;

      this.spuList = result.data.records;
      this.totalCount = result.data.total;
    },

    //修改SPu
    updateSpu(row) {
      this.second = 1;
      this.$refs.spu.getSpuInfo(row);
    },

    //改变当前展示表格
    changeSecond(second) {
      this.second = second;
      this.getSpuList();
    },

    //更换当前  每页展示多少条数据  回调
    handleSizeChange(newVal) {
      this.limit = newVal;
      this.getSpuList();
    },
    //点击页数按钮 回调
    handleCurrentChange(newVal) {
      this.currentPage = newVal;
      this.getSpuList();
    },

    //添加sku
    addSKu(row) {
      let { category1Id, category2Id } = this;
      this.second = 2;
      console.log(row);
      this.$refs.sku.getSkuInfo(category1Id, category2Id, row);
    },
  },
};
</script>

<style>
</style>