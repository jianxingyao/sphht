<template>
  <div  class="Observe">
    <el-row :gutter="30" class="row">

        <el-col :span="15">
            
                <Search></Search>
        </el-col>

        <el-col :span="15">
            
                <Catrgory></Catrgory>
        
        </el-col>

    </el-row>
  </div>
</template>

<script>
import Catrgory from './Catrgory'
import Search from './Search'
export default {
    name:"Observe",
    components:{
        Catrgory,
        Search
    }
}
</script>

<style>
.Observe{
    margin-top:20px;
}
.row{
    display: flex;
    flex-direction: row;
}
.cardHeader{
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
}
.hr{
    position: absolute;
    bottom: 0;
    width: 120%;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgb(234, 234, 234);
}
</style>