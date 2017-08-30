import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import Foot from 'components/Foot.vue'
import mixin from 'js/mixin.js'

new Vue({
  el: '#category',
  components: {
    Foot
  },
  data() {
    return {
      topLists: null,
      subLists: null,
      topIndex: 0,
      rankLists: null
    }
  },
  created() {
    this.getTopLists()
    this.getSubLists(0)
  },
  methods: {
    getTopLists(){
      axios.post(url.topList).then(res=>{
        this.topLists = res.data.data.lists
      })
    },
    getSubLists(index, id){
      console.log(index)
      this.topIndex = index
      if(index==0){
        this.getRank() // 综合排行
      }else{
        axios.post(url.subList, {id}).then(res=>{
          this.subLists = res.data.data
        })
      }
    },
    getRank(){
      axios.post(url.rank).then(res=>{
        this.rankLists = res.data.data
        console.log(this.rankLists.hotGoods)
      })
    },
    toSearch(item){
      location.href = `search.html?keyword=${item.name}&id=${item.id}`
    }
  },
  mixins: [mixin]
})
