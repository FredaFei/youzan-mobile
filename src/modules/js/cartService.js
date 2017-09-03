import fetch from 'js/fetch.js'
import url from 'js/api.js'

class Cart {
  static add(id){
    return fetch(url.cartAdd, {
      id,
      number: 1
    })
  }
  static reduce(id){
    return fetch(url.cartremove, {
      id,
      number: 1
    })
  }
  static cartremove(id){
    return fetch(url.cartremove, {
      id
    })
  }
  static cartMremove(ids){
    return fetch(url.cartMremove, {
      ids
    })
  }
  static cartUpdate(data){
    return fetch(url.cartUpdate, {
      id: data.id,
      number:data.number
    })
  }
  static remove(arr){ // 收集编辑状态下选中的商品id
    let ids = []
    arr.forEach(good=>{
      ids.push(good.id)
    })
    return ids
  }
}
export default Cart
