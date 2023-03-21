<template>
  <div>
    <el-form ref="form" :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            style="margin: 0 10px 0"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择"
              style="margin: 0 20px"
              v-model="attr.attrIdAndValueId"
            >
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
          style="margin: 0 10px 0"
        >
          <el-form-item
            :label="saleAttrItem.saleAttrName"
            v-for="saleAttrItem in spuSaleAttrList"
            :key="saleAttrItem.id"
          >
            <el-select
              placeholder="请选择"
              style="margin: 0 20px"
              v-model="saleAttrItem.saleIdAndslaeValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttrItem.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttrItem.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="supImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="prop"
            width="100"
            type="selection"
            align="center"
          ></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template scope="{row}">
              <img :src="row.imgUrl" style="widthL100px;height:100px" alt="" />
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template scope="{row}">
              <el-button
                type="primary"
                v-show="row.isDefault === 0"
                @click="changeIsDefault(row)"
                >添加设置</el-button
              >
              <el-button type="success" v-show="row.isDefault === 1"
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" style="margin: 20px 0 0 0" @click="saveSku"
          >保存</el-button
        >
        <el-button @click="callAddSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuFrom",
  data() {
    return {
      supImageList: [], //图片数据
      spuSaleAttrList: [], //销售属性
      attrList: [], //平台属性
      skuInfo: {
        //父组件给的信息
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //自身组件收集的数据
        skuDesc: "",
        skuName: "",
        price: 0,
        weight: "",
        //平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        //默认图片地址
        skuDefaultImg: "",
        //图片列表
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {}, //spu信息
      imgList: [], //勾选照片收集
    };
  },
  methods: {
    //改变默认选项
    changeIsDefault(row) {
      this.supImageList.forEach((item) => {
        item.isDefault = 0;
        if (item.id === row.id) {
          item.isDefault = 1;
          this.skuInfo.skuDefaultImg = item.imgUrl;
        }
      });
    },
    //勾选的回调
    handleSelectionChange(params) {
      console.log(params);
      this.imgList = params;
    },
    //获取sku的基本信息
    async getSkuInfo(category1Id, category2Id, spu) {
      //给sku信息赋值
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      let {
        spu: { reqIconImage },
        attr: { reqAttrList },
        sku: { reqSpuSaleAttrList },
      } = this.$API;

      //请求结果   数组
      let ProArr = [];

      ProArr.push(reqIconImage(spu.id));
      ProArr.push(reqSpuSaleAttrList(spu.id));
      ProArr.push(reqAttrList(category1Id, category2Id, spu.category3Id));

      const result = await Promise.all(ProArr).catch((err) => {
        console.log(err);
      });
      if (!result) return;
      this.supImageList = result[0].data.map((item) => {
        return { ...item, isDefault: 0 };
      });
      this.spuSaleAttrList = result[1].data;
      this.attrList = result[2].data;
    },
    //取消添加sku
    callAddSku() {
      this.$emit("changeSecond", 0);
      Object.assign(this._data, this.$options.data());
    },
    //保存sku
    async saveSku() {
      let { attrList, skuInfo, spuSaleAttrList,imgList } = this;

      //attrId valueId

      //整理平台属性
      skuInfo.skuAttrValueList = attrList.map((item) => {
        if (item.attrIdAndValueId){
          let [attrId, valueId] = item.attrIdAndValueId.split(":");
          return {
            attrId,
            valueId,
          };
        }
      }).filter(item => {
        return item
      })

      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.map((item) => {
        if (item.saleIdAndslaeValueId){
          let [saleAttrId, saleAttrValueId] =
            item.saleIdAndslaeValueId.split(":");
          return {
            saleAttrId,
            saleAttrValueId,
          };
        }
      }).filter(item => {
        return item
      })

      //整理图片信息
      skuInfo.skuImageList = imgList.map(item => {
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })

      this.skuInfo.weight *= 1
      this.skuInfo.price *= 1 

      let result = await this.$API.sku.reqAddSKu(skuInfo)
      if(result.code !== 200)return
      this.$message({
        type:"success",
        message:"添加成功"
      })
      this.$emit('changeScenes',0)

    },
  },
};
</script>

<style>
</style>