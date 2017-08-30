import 'css/common.css'
import './index.css'

import url from 'js/api.js'
import Swipe from 'components/Swipe.vue'
import Foot from 'components/Foot.vue'
import axios from 'axios'
import {InfiniteScroll} from 'mint-ui'
Vue.use(InfiniteScroll)

new Vue({
  el: '#app',
  components: {
    Swipe,
    Foot
  },
  data() {
    return {
      bannerList: null,
      lists: null,
      pageNum: 1,
      pageSize: 6,
      loading: false,
      allLoad: false
    }
  },
  created() {
    this.getBannerList()
    this.getLists()
  },
  methods: {
    getBannerList() {
      axios.post(url.banner).then(res => {
          this.bannerList = res.data.lists
        })
    },
    getLists() {
      if(this.allLoad) return
      this.loading = true // 防止重复加载
      axios.get(url.hotLists, {
        pageNum: this.pageNum,
        pageSize: 6
      }).then(res => {
          let curLists =  res.data.data.lists
          // 判断是否全部加在完
          if(curLists.length < this.pageSize){
            this.allLoad = true
          }
          if(this.lists){
            this.lists = this.lists.concat(curLists)
          }else{
            // 初次请求
            this.lists = curLists
          }
          this.loading = false
          this.pageNum ++
        })

    }
  }
})
