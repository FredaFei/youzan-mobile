import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Address from 'js/addressService.js'

const store = new Vuex.Store({
  state: {
    lists: null
  },
  mutations: {
    init(state, lists){
      state.lists = lists
    },
    add(state, instance){ // instance 地址实例
      state.lists.push(instance)
    },
    remove(state, id){
      let lists = state.lists
      let index = lists.findIndex(item=>{
        return item.id === id
      })
      lists.splice(index, 1)
    },
    update(state, instance){
      let lists = JSON.parse(JSON.stringify(state.lists))
      let index = lists.findIndex(item=>{
        return item.id === instance.id
      })
      lists[index] = instance
      state.lists = lists
    },
    setDefault(state, id){
      let lists = state.lists
      lists.forEach(item=>{
        item.isDefault = item.id === id ? true : false
      })
    }
  },
  actions: {
    getLists({commit}){
      Address.list().then(res=>{
        commit('init', res.data.lists)
      })
    },
    addAction({commit}, instance){
      Address.add(instance).then(res=>{
        // 模拟添加id，其实instance应该后台返回
        instance.id = parseInt(Math.random()*10000)
        commit('add', instance)
      })
    },
    removeAction({commit}, id){
      Address.remove(id).then(res=>{
        commit('remove', id)
      })
    },
    updateAction({commit}, instance){
      Address.update(instance).then(res=>{
        commit('update', instance)
      })
    },
    setDefaultAction({commit}, id){
      Address.setDefault(this.id).then(res=>{
        commit('setDefault', id)
      })
    }
  }
})

export default store
