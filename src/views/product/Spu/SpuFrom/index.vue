<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in tradeMarkList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/base/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="photoSuccessBack"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="
            unSelect.length >= 1
              ? `还有${unSelect.length}项未选择`
              : '没有可添加的属性了!!!'
          "
          v-model="attrInfo"
        >
          <el-option
            v-for="item in unSelect"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          >
          </el-option>
        </el-select>

        <el-button
          type="primary"
          icon="el-icon-plus"
          style="marginleft: 10px"
          :disabled="!attrInfo"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >

        <el-table
          :data="spu.spuSaleAttrList"
          style="width: 100%; margin: 10px 0"
          border
        >
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="180"
          ></el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template scope="{row,$index}">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                <!--   @close="handleClose(tag)" -->
                {{ tag.saleAttrValueName }}
              </el-tag>

              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
                <!--  v-model="inputValue" -->
                <!-- @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm" -->
              </el-input>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showAttrInput(row)"
                >+ New Tag</el-button
              >
              <!--  @click="showInput" -->
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="200">
            <template scope="{row,$index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="closeSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        tmId: 0,
      }, //spu基本信息
      tradeMarkList: [], //品牌信息
      spuImageList: [], //SPU图片
      saleAttrList: [], //全部属性
      attrInfo: "", //未选择销售属性收集对象
    };
  },
  computed: {
    unSelect() {
      const result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((i) => {
          return item.name !== i.saleAttrName;
        });
      });
      return result;
    },
  }, //baseSaleAttrId:item.id,saleAttrName:item.name
  methods: {
    //取消操作
    closeSpu() {
      this.$emit("changeSecond", 0);
      Object.assign(this._data,this.$options.data())
    },
    //增加或修改spu
    async addOrUpdateSpu() {
      let { reqUpdateSpu, reqAddSpu } = this.$API.spu;

      //整理参数
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });

      if (this.spu.id) {
        const result = await reqUpdateSpu(this.spu);
        if (result.code !== 200) return;
        this.$emit("changeSecond",0);
       
      } else {
        const result = await reqAddSpu(this.spu);
        if (result.code !== 200) return;
        this.$emit("changeSecond",0);
      }
    },
    //添加新的 属性值
    handleInputConfirm(row) {
      console.log(row);
      const newObj = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue,
      };
      if (newObj.saleAttrValueName === "")
        return this.$message({ type: "error", message: "属性值不能为空" });

      let pushFlang = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName !== newObj.saleAttrValueName;
      });
      if (!pushFlang)
        return this.$message({ type: "error", message: "属性值不能重复" });

      row.spuSaleAttrValueList.push(newObj);
      row.inputVisible = false;
    },
    //改变属性值编辑状态
    showAttrInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //添加新的属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrInfo.split(":");
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.attrInfo = "";
    },
    //删除照片的回调
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    //图片预览的回调
    handlePictureCardPreview(file) {
      //预览图片路径
      this.dialogImageUrl = file.url;
      //开启预览
      this.dialogVisible = true;
    },
    //图片上传成功回调
    photoSuccessBack(response, file, fileList) {
      console.log(response, file, fileList);
      this.spuImageList = fileList;
    },

    //请求Spu数据
    async getSpuInfo(params) {
      let { id } = params;
      let { reqSpuInfo, reqTradeInfo, reqIconImage, reqAllBaseAttrList } =
        this.$API.spu;

      //获取spu基本信息
      const result1 = await reqSpuInfo(id);
      if (result1.code === 200) {
        this.spu = result1.data;
      }

      //获取品牌信息
      const result2 = await reqTradeInfo();
      if (result2.code === 200) {
        this.tradeMarkList = result2.data;
      }

      //获取SPU图片数据
      const result3 = await reqIconImage(id);
      if (result3.code === 200) {
        const res = result3.data.map((item) => {
          return {
            id: item.id,
            url: item.imgUrl,
            name: item.imgName,
          };
        });
        this.spuImageList = res;
      }

      //获取全部平台属性
      const result4 = await reqAllBaseAttrList();
      if (result4.code === 200) {
        this.saleAttrList = result4.data;
      }
    },

    async addSpu(category3Id) {
      this.spu.category3Id = category3Id
       let { reqSpuInfo, reqTradeInfo, reqIconImage, reqAllBaseAttrList } =
        this.$API.spu;
      //获取品牌信息
      const result2 = await reqTradeInfo();
      if (result2.code === 200) {
        this.tradeMarkList = result2.data;
      }
      //获取全部平台属性
      const result4 = await reqAllBaseAttrList();
      if (result4.code === 200) {
        this.saleAttrList = result4.data;
      }
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
