<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>

    <el-card>
      <!-- 添加属性 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 0 20px 20px"
        v-show="isShowTable"
        @click="addAttrShow"
        >添加属性</el-button
      >
      <!-- 表格 -->
      <div>
        <el-table
          :data="attrList"
          border
          style="width: 100%"
          v-show="isShowTable"
        >
          <el-table-column label="序号" width="80" align="center" type="index">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="attrValueList" label="属性列表">
            <template scope="{row:{attrValueList}}">
              <el-tag
                type="warning"
                v-for="attrItem in attrValueList"
                :key="attrItem.id"
                style="margin: 20px; cursor: pointer"
                >{{ attrItem.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="200">
            <template scope="{row}">
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="alterAttr(row)"
                style="margin:0 20px 0 0"
              ></el-button>


               <el-popconfirm
                :title="`确定删除${row.attrName}吗?`"
                @onConfirm="delAttr(row)"
              >
                <el-button type="danger" slot="reference" icon="el-icon-delete" ></el-button>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作属性表格 -->
      <div v-show="!isShowTable">
        <!-- 属性名输入 -->
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttribute"
          >添加属性值</el-button
        >
        <el-button @click="clearAttrInfo">取消</el-button>

        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            prop="prop"
            label="序号"
            width="80"
            align="center"
            type="index"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性名称" width="width">
            <template scope="{row}">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="handlerInputShow(row)"
                v-show="row.flang"
                @keyup.native.enter="handlerInputShow(row)"
                :ref="row.valueName"
              ></el-input>

              <span
                style="display: block; height: 40px; width: 100%"
                v-show="!row.flang"
                @click="spanBack(row)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="180">
            <template scope="{row,$index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="delAttrItem($index)"
              >
                <el-button
                  slot="reference"
                  type="warning"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" style="margin: 20px 0 0 0" @click="saveAttr" :disabled="this.attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//lodash深拷贝
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "", //一级分类Id
      category2Id: "", //二级分类Id
      category3Id: "", //三级分类Id
      attrList: [], //表格数据
      isShowTable: true, //表格是否显示
      //属性 添加|修改 信息收集
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
      isShowInput: true,
    };
  },
  methods: {
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
          this.getAttrList();
          break;

        default:
          break;
      }
    },

    //获取请求
    async getAttrList() {
      //解构Id
      const { category1Id, category2Id, category3Id } = this;
      //发送请求  获取attrList数据
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code !== 200) return;

      this.attrList = result.data;
    },

    //增加属性值
    addAttribute() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flang: true, //控制 是否处于编辑状态
      });

      //新增获取焦点
      this.$nextTick(() => {
        this.$refs[
          this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1]
            .valueName
        ].focus();
      });
    },

    //是否处于编辑状态
    handlerInputShow(row) {
      //输入是否为空
      if (row.valueName.trim() === "") {
        this.$message({
          type: "error",
          message: "请输入一个非空属性值",
        });
        return;
      }

      //输入值是否重复
      let rep = this.attrInfo.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });

      if (rep) {
        this.$message({
          type: "error",
          message: "属性值不能重复",
        });
        return;
      }

      row.flang = false;
    },

    //添加属性按钮回调
    addAttrShow() {
      this.isShowTable = false;

      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },

    //清除当前  属性值信息
    clearAttrInfo() {
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },

    //修改属性
    alterAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);

      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flang", false);
      });
    },

    //点击span的回调
    spanBack(row) {
      row.flang = true;

      //新增自动聚焦
      this.$nextTick(() => {
        this.$refs[row.valueName].focus();
      });
    },


    //删除属性值
    delAttrItem(index){
      this.attrInfo.attrValueList.splice(index,1)
    },

    //删除整个属性
    async delAttr(row){
      
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList = []
      const result = await this.$API.attr.reqAddAttribute(this.attrInfo)
      if(result.code !== 200)return

      this.getAttrList()
    },



    //保存属性
    async saveAttr(){
      //整理参数   为空的不要  并且删除  flang
      this.attrInfo.attrValueList =  this.attrInfo.attrValueList.filter(item => {
        if(item.valueName.trim() !== ''){
          delete item.flang
          return true
        }
      })

      if(this.attrInfo.attrValueList.length < 1){
        this.$message({type:'error',message:"属性值不能为空"})
        return
      }

      const result = await this.$API.attr.reqAddAttribute(this.attrInfo)
      if(result.code !== 200)return

      this.getAttrList()
      this.isShowTable = true
      

    }
  },
};
</script>

<style>
</style>