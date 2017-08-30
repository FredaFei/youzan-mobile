import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import mixin from 'js/mixin.js'
import velocity from 'velocity-animate'
import { InfiniteScroll } from 'mint-ui'
Vue.use(InfiniteScroll)

let  {keyword, id} = qs.parse(location.search.substr(1))
new Vue({
  el: '.container',
  data() {
    return {
      searchLists: null,
      keyword,
      isGotop: false,
      isLoading: false,
      isAllLoad: false,
      pageNum: 1,
      pageSize: 6
    }
  },
  created() {
    this.getSearchLists()
  },
  methods: {
    getSearchLists(){
      if(this.isAllLoad) return
      this.isLoading = true // 防止重复加载

      axios.post(url.searchList, {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        keyword,
        id
      }).then(res=>{
        let curLists = res.data.data.lists
        // 判断是否全部加在完
        if(curLists.length < this.pageSize){
          this.isAllLoad = true
        }

        if(this.searchLists){
          this.searchLists = this.searchLists.concat(curLists)
        }else{
          this.searchLists = curLists
        }
        this.isLoading = false
        this.pageNum ++
      })
    },
    move(){
      if(document.body.scrollTop>100){
        this.isGotop = true
      }else{
        this.isGotop = false
      }
    },
    gotop(){
      velocity(document.body, 'scroll', {duration: 500})
      this.isGotop = false
    }
  },
  mixins: [mixin]
})
