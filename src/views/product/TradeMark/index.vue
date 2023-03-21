<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px"
      @click="addHanlder"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table :data="pageList" style="width: 100%" border>
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 150px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template scope="{row}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateHandler(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" @click="deleteHandler(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="textalign: center; margin: 20px"
      :current-page="currentPage"
      :page-sizes="pageSize"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog title="品牌添加" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="90px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <el-upload
            class="avatar-uploader"
            action="/base/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip">只能上传.jpg图片</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      currentPage: 1, //当前页数
      total: 99, //总数据条数
      limit: 3, //每页几条数据
      pageSize: [3, 5, 7], //可以选择的每页显示几条数据
      pageList: [], //品牌信息
      dialogFormVisible: false, //对话框是否显示
      formLabelWidth: "100px",
      //表单收集数据
      form: {
        tmName: "", //品牌名称
        logoUrl: "", //品牌logo
      },
      //表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "change",
          },
        ],

        logoUrl: [{ required: true, message: "请选择品牌LOGO" }],
      },
    };
  },
  methods: {
    //更改每页显示的  数据条数
    handleSizeChange(pageCount) {
      this.limit = pageCount;
      this.getPageList();
    },
    //获取表单数据
    async getPageList(page = 1) {
      //更改当前页数
      this.currentPage = page;

      let { currentPage, limit } = this;
      const result = await this.$API.tradeMark.requestBaseList(
        currentPage,
        limit
      );
      if (result.code !== 200) return;

      this.pageList = result.data.records;
      this.total = result.data.total;
    },

    //添加品牌
    addHanlder() {
      this.dialogFormVisible = true;
      this.form = {
        tmName: "",
        logoUrl: "",
      };
    },
    //修改品牌信息回调
    updateHandler(row) {
      this.form = { ...row };

      this.dialogFormVisible = true;
    },
    //删除品牌信息回调
    deleteHandler(row) {

       this.$confirm('确定删除这个品牌吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          const result = await this.$API.tradeMark.requestDeleteBrand(row.id)
          if(result.code !== 200)return 
           //如果本页数据  全被删除  就返回上一页
          this.getPageList(this.pageList.length = 1 ? this.currentPage - 1: this.currentPage)

         
         

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    //上传图片的回调
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = URL.createObjectURL(file.raw);
    },
    //上传图片前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //对品牌 点击确定 操作回调
    addOrUpdateHandler() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          if (this.form.id) {
            this.dialogFormVisible = false;
            const result = await this.$API.tradeMark.requestUpdateBrand(
              this.form
            );
            if (result.code !== 200) return;
            this.$message({
              type: "success",
              message: "修改品牌成功",
            });
            this.getPageList(this.currentPage);
          } else {
            this.dialogFormVisible = false;
            const result = await this.$API.tradeMark.requestAddBrand(this.form);
            if (result.code !== 200) return;
            this.$message({
              type: "success",
              message: "添加品牌成功",
            });
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>