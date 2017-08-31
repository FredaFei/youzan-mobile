import 'css/common.css'
import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import axios from 'axios'
import mixin from 'js/mixin.js'
import url from 'js/api.js'
import Foot from 'components/Foot.vue'

new Vue({
  el: '#cart',
  components: { Foot },
  data(){
    return {
      lists: null,
      total: 0,
      selectGoods: []
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
    }
  },
  methods: {
    getCartLists(){
      axios.post(url.cartLists).then(res=>{
        let rowData = res.data.cartList
        rowData.forEach(shop=>{
          shop.checked = true
          shop.goodsList.forEach(good=>{
            good.checked = true
          })
        })
        this.lists = rowData
      })
    },
    selectGood(shop, good){
      good.checked = !good.checked
      shop.checked = shop.goodsList.every(good=>{
        return good.checked
      })
    },
    selectShop(shop){
      shop.checked = !shop.checked
      shop.goodsList.forEach(good=>{
        good.checked = shop.checked
      })
    },
    selectAll(){
      console.log(this.allSelected)
      this.allSelected = !this.allSelected
    }
  },
  mixins: [mixin]
})
