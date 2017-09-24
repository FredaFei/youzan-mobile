import 'css/common.css'
import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import axios from 'axios'
import mixin from 'js/mixin.js'
import url from 'js/api.js'
import Cart from 'js/cartService.js'
import Foot from 'components/Foot.vue'
import { Toast } from 'mint-ui'
// import Hammer from 'hummerjs'
import Volecity from 'velocity-animate'
Vue.use(Toast)

new Vue({
  el: '#cart',
  components: { Foot },
  data(){
    return {
      lists: null,
      total: 0,
      selectGoods: [],
      editingShop: null,
      editingShopIndex: -1,
      removePop: false,
      removeData: null,
      removeMsg: ''
    }
  },
  created(){
    this.getCartLists()
  },
  computed: {
    allSelected: {
      get(){
        if(this.lists && this.lists.length>0){
          return this.lists.every(shop=>{
            return shop.checked
          })
        }
      },
      set(val){
        if(this.lists && this.lists.length>0){
          this.lists.forEach(shop=>{
            shop.checked = val
            shop.goodsList.forEach(good=>{
              good.checked = val
            })
          })
        }
      }
    },
    allRemoveSelected: {
      get(){
        if(this.editingShop){
          return this.editingShop.removechecked
        }
        return false
      },
      set(newVal){
        if(this.editingShop){
          this.editingShop.removechecked = newVal
          this.editingShop.goodsList.forEach(good=>{
            good.removechecked = newVal
          })
        }
      }
    },
    selectLists(){
      let tmparr = []
      let tmpsum = 0
      if(this.lists && this.lists.length>0){
        this.lists.forEach(shop=>{
          shop.goodsList.forEach(good=>{
            if(good.checked){
              tmparr.push(good)
              tmpsum += good.price * good.number
            }
          })
        })
        this.total = tmpsum
        return tmparr
      }
      return []
    },
    removeLists(){
      if(this.editingShop){
        let arr = []
        this.editingShop.goodsList.forEach(good=>{
          if(good.removechecked){
            arr.push(good)
          }
        })
        return arr
      }
      return []
    }
  },
  methods: {
    getCartLists(){
      axios.post(url.cartLists).then(res=>{
        let rowData = res.data.cartList
        rowData.forEach(shop=>{
          shop.checked = true  // 商店的选中
          shop.editMsg = '编辑'
          shop.editing = false // 商店的编辑状态
          shop.removechecked = false
          shop.goodsList.forEach(good=>{
            good.checked = true
            good.editing = false
            good.removechecked = false
          })
        })
        this.lists = rowData
      })
    },
    selectGood(shop, good){
      let attr = this.editingShop ? 'removechecked' : 'checked'
      good[attr] = !good[attr]
      shop[attr] = shop.goodsList.every(good=>{
        return good[attr]
      })
    },
    selectShop(shop){
      let attr = this.editingShop ? 'removechecked' : 'checked'
      shop[attr] = !shop[attr]
      shop.goodsList.forEach(good=>{
        good[attr] = shop[attr]
      })
    },
    selectAll(){
      let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected'
      this[attr] = !this[attr]
    },
    editMsg(shop,shopIndex){
      shop.editing = !shop.editing
      shop.editMsg = shop.editing ? '完成':'编辑'
      this.lists.forEach((curshop,i)=>{
        if(shopIndex!==i){
          curshop.editing = false
          curshop.editMsg = shop.editing ? '':'编辑'
        }
      })
      this.editingShop = shop.editing ? shop : null
      this.editingShopIndex = shop.editing ? shopIndex : -1

    },
    reduce(good){
      if(good.number===1){
        return
      }
      Cart.reduce(good.id).then(res=>{
        good.number--
      })
    },
    add(good){
      Cart.add(good.id).then(res=>{
        good.number++
      })
    },
    remove(shop,good,shopIndex,goodIndex){
      this.removePop = true
      this.removeData = {shop,good,shopIndex,goodIndex}
      this.removeMsg = '确定要删除该商品吗？'
    },
    removeCancel(){
      this.removePop = false
    },
    removeList(){
      this.removePop = true
      this.removeMsg = `确定将所选${this.removeLists.length}个商品删除吗？`
    },
    removeConfirm(){
      if(this.removeMsg === '确定要删除该商品吗？'){ // 删除单个商品
        let { shop,good,shopIndex,goodIndex } = this.removeData
        Cart.cartremove(good.id).then(res=>{
          shop.goodsList.splice(goodIndex,1)
          if(!shop.goodsList.length){
            this.lists.splice(shopIndex, 1)
            this.removeShop()
          }
          this.removePop = false
        })
      }else{ // 删除多个商品
        let ids = Cart.remove(this.removeLists)
        Cart.cartMremove(ids).then(res=>{
          let arr = []
          this.editingShop.goodsList.forEach(good=>{
            let index = this.removeLists.findIndex(item=>{
              return item.id === good.id
            })
            if(index === -1){
              arr.push(good)
            }
          })
          if(arr.length){
            this.editingShop.goodsList = arr
          }else{
            this.lists.splice(this.editingShopIndex,1)
            this.removeShop()
          }
          this.removePop = false
        })
      }
    },
    removeShop(){
      this.editingShopIndex = -1
      this.editingShop = null
      this.lists.forEach(shop=>{
        shop.editing = false
        shop.editMsg = '编辑'
      })
    },
    cartUpdate(good){
      console.log(/^\d+$/g.test(good.number))
      if(/^\d+$/g.test(good.number)){
        if(good.number > good.stock){
          Toast({
            message: `最大库存量为${good.stock}`,
            position: 'middle',
            duration: 3000
          });
          good.number = good.stock
        }
        Cart.cartUpdate({
          id: good.id,
          number: good.number
        }).then(res=>{
          good.number = good.number
        })
        console.log(good.number)
      }else{
        good.number = 1
      }


    },
    start(e, good){
      good.startX = e.changedTouches[0].clientX
    },
    end(e,shopIndex,good,goodIndex){
      let endX = e.changedTouches[0].clientX
      console.log('endX: ' + endX)
      console.log(good.id)
      let left = '0'
      console.log('good.startX: ' + good.startX)
      if(good.startX - endX>100){
        left = '-60px'
      }
      if(endX - good.startX>100){
        left = '0px'
      }
      console.log(this.$refs[`goods-${shopIndex}-${goodIndex}`])
      Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`],{
        left
      })
    }
  },
  mixins: [mixin]
})
