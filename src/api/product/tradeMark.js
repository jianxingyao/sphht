import request from '@/utils/request'


//品牌列表接口
export const requestBaseList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})


//品牌新增   /admin/product/baseTrademark/save
export const requestAddBrand = (tradeMark) => request({url:'/admin/product/baseTrademark/save',data:tradeMark,method:'post'})


//品牌修改 /admin/product/baseTrademark/update
export const requestUpdateBrand = (tradeMark) => request({url:'/admin/product/baseTrademark/update',data:tradeMark,method:'put'})

//品牌删除
export const requestDeleteBrand = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})