import request from '@/utils/request'

//获取销售平台属性
export const reqSpuSaleAttrList = (spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

//新增sku
export const reqAddSKu = (data) => request({url:"/admin/product/saveSkuInfo",method:'post',data})

//获取sku列表
export const reqGetSkuList = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,methods:'get'})


//获取当前页的sku列表
export const reqSkuList = (page,limit) => request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//商品上架
export const reqOnSale = (skuId) =>request({url:`/admin/product/onSale/${skuId}`,method:'get'})

//商品下架 
export const reqCancelSale = (skuId) =>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

//获取sku详情
export const reqSkuDetail = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})