import request from '@/utils/request'


//一级分类接口
export const reqCategory1List = () => request({url:`/admin/product/getCategory1`,method:'get'})
//二级分类接口
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
//三级分类接口
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})


//获取商品 数据
export const reqAttrList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加商品属性
export const reqAddAttribute = (data) => request({url:'/admin/product/saveAttrInfo',method:'post',data})