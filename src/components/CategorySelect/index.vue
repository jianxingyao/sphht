<template>
  <div>
    <el-form :inline="true" :model="cFrom" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select placeholder="一级分类" v-model="cFrom.category1Id" :disabled="show">
          <el-option
            :label="lis1Item.name"
            :value="lis1Item.id"
            v-for="lis1Item in list1"
            :key="lis1Item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="二级分类" v-model="cFrom.category2Id" :disabled="show">
          <el-option :label="list2Item.name" :value="list2Item.id" v-for="list2Item in list2" :key="list2Item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="三级分类" v-model="cFrom.category3Id" :disabled="show">
          <el-option :label="list3Item.name" :value="list3Item.id" v-for="list3Item in list3" :key="list3Item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data() {
    return {
      list1: [], //一级分类数据
      list2: [], //二级分类数据
      list3: [], //三级分类数据
      //表单收集数据
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //获取一级分类
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List();
      if (result.code !== 200) return;

      this.list1 = result.data;
    },
  },
  watch: {
    //一级分类监听
    "cFrom.category1Id": {
      async handler(newId) {
        //id为空不发送请求
        if(!newId)return
        const result = await this.$API.attr.reqCategory2List(newId);
        if (result.code !== 200) return;
        //如果下级分类不为空 的情况 需要 清空           
        if(this.cFrom.category3Id || this.cFrom.category2Id){
            this.cFrom.category2Id = ''
            this.cFrom.category3Id = ''
            this.list3 = []
        }
        //向父组件回传Id
        this.$emit('getCategoryId',{categoryId:newId,leve:1})
        this.list2 = result.data;
      },
    },

    //二级分类监听
    "cFrom.category2Id": {
      async handler(newId) {
        //id为空不发送请求
        if(!newId)return
        const result = await this.$API.attr.reqCategory3List(newId);
        if (result.code !== 200) return;
        //如果下级分类不为空 的情况 需要 清空
        if(this.cFrom.category3Id){
            this.cFrom.category3Id = ''
            this.list3 = []
        }
        //向父组件回传Id
        this.$emit('getCategoryId',{categoryId:newId,leve:2})
        this.list3 = result.data;
      },
    },

    //三级分类监听
    "cFrom.category3Id": {
      handler(newId) {
        //id为空不发送请求
        if(!newId)return
        //向父组件回传Id
        this.$emit('getCategoryId',{categoryId:newId,leve:3})
      },
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style>
</style>