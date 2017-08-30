import './goods_common.css'
import './goods.css'
import './goods_custom.css'
import './goods_base.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_theme.css'
import './goods_transition.css'

import url from 'js/api.js'
import mixin from 'js/mixin.js'
import axios from 'axios'
import qs from 'qs'
import Swipe from 'components/Swipe.vue'

let {id} = qs.parse(location.search.substr(1))
let detailTab = ['商品详情','本店成交']

new Vue({
  el: '#goods',
  components: {Swipe},
  data(){
    return{
      id,
      goodDetail: null,
      detailTab,
      tabIndex: 0,
      dealLists: null,
      bannerLists: null,
      skuType: 1,
      showSku: false,
      skuNum: 1,
      showMessage: false,
      isAddcart: false
    }
  },
  created(){
    this.getDetails()
  },
  methods: {
    getDetails(){
      axios.post(url.goodDetails,{
        id: this.id
      }).then(res=>{
        this.goodDetail = res.data.data
        this.isAddcart = this.goodDetail.isAdd
        this.bannerLists = []
        this.goodDetail.imgs.forEach(item=>{
          this.bannerLists.push({
            clickUrl: '',
            image: item
          })
        })
      })
    },
    changeTab(index){
      this.tabIndex = index
      if(this.tabIndex === 1){
        this.getDeal()
      }
    },
    getDeal(){
      axios.post(url.deal).then(res=>{
        this.dealLists = res.data.data.lists
      })
    },
    chooseSku(type){
      this.skuType = type
      this.showSku = true
    },
    changeSkuNum(n){
      if(n<0 && this.skuNum==1){
        return 
      }
      this.skuNum += n
    },
    addShopCart(){
      axios.post(url.addcart,{
        id,
        number: this.skuNum
      }).then(res=>{
        if(res.status===200){
          this.isAddcart = true
          this.showMessage = true
          this.showSku = false
        }
      })
    }
  },
  watch: {
    showSku(val, oldVal){
      document.body.style.overflow = val ? 'hidden': 'auto' 
      document.querySelector('html').style.overflow = val ? 'hidden': 'auto'
      document.body.style.height = val ? '100%': 'auto' 
      document.querySelector('html').style.height = val ? '100%': 'auto' 
    }
  },
  mixins: [mixin]
})
