let url = {
  hotLists: '/index/hotLists',
  banner: '/index/banner',
  topList: '/category/topList',
  subList: '/category/subList',
  rank: '/category/rank',
  searchList: '/search/list',
  goodDetails: '/goods/details',
  deal: '/goods/deal',
  addcart: '/cart/add',
  cartLists: '/cart/list',
  cartAdd: '/cart/add',
  cartremove: '/cart/remove',
  cartUpdate: '/cart/update',
  cartMremove: '/cart/mremove'
}

//开发环境和真实环境的切换
// let host = 'http://xx'
let host = 'http://rapapi.org/mockjsdata/24272'

for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}

export default url
