import request from '@/utils/request'




//获取spu列表
export const reqSpuList = ({currentPage:page,limit,category3Id}) => request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

//获取spu基本信息
export const reqSpuInfo = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

//获取品牌信息 /admin/product/baseTrademark/getTrademarkList
export const reqTradeInfo = () => request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'})

//获取Spu图标的接口 /admin/product/spuImageList/{spuId} 
export const reqIconImage = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取全部平台属性 /admin/product/baseSaleAttrList
export const reqAllBaseAttrList = () => request({url:`/admin/product/baseSaleAttrList`,method:'get'})

//更新Spu /admin/product/updateSpuInfo
export const reqUpdateSpu = (data) => request({url:'/admin/product/updateSpuInfo',method:'post',data})

//新增Spu /admin/product/saveSpuInfo
export const reqAddSpu = (data) => request({url:'/admin/product/saveSpuInfo',method:'post',data})
 
//删除Spu
export const reqDelSpu = (spuId) => request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})