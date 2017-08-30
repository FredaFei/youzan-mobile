import 'css/common.css'
import './member_base.css'
import './member.css'

import Vue from 'vue'
import mixin from 'js/mixin.js'

new Vue({
  el: '#member',
  components: { Foot },
  data(){
    return {}
  },
  mixins: [mixin]
})
