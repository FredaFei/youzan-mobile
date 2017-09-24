import Address from 'js/addressService.js'

export default{
  data() {
    return{
      name: '',
      tel: '',
      provinceValue: -1,
      cityValue: -1,
      districtValue: -1,
      address: '',
      id: '',
      type: '',
      instance: '',
      isInitVal: false,
      addressData: require('js/address.json'),
      cityList: null,
      districtList: null
    }
  },
  created() {
    let query = this.$route.query
    this.type = query.type
    this.instance = query.instance
    if(this.type === 'edit'){
      let ad = this.instance
      this.provinceValue = parseInt(ad.provinceValue)
      this.isInitVal = true
      this.tel = ad.tel
      this.name = ad.name
      this.address = ad.address
      this.id = ad.id
    }
  },
  computed: {
      lists () {
        return this.$store.state.lists
      }
  },
  watch: {
    // 对象形式深度监听
    'lists': {
      handler(){
        this.$router.go(-1)
      },
      deep: true
    },
    // lists(){ // 监听数据变化，路由相应变化
    //   this.$router.go(-1)
    // },
    provinceValue(val){
      if(val===-1) return
      let list = this.addressData.list
      let index = list.findIndex((item)=>{
        return item.value === val
      })
      this.cityList = list[index].children
      this.cityValue = -1 //还原
      this.districtValue = -1
      if(this.type === 'edit' && this.isInitVal){ //编辑状态还原城市
        this.cityValue = parseInt(this.instance.cityValue)
        this.isInitVal = false
      }
    },
    cityValue(val){
      if(val===-1) return
      let list = this.cityList
      let index = list.findIndex((item)=>{
        return item.value === val
      })
      this.districtList = this.cityList[index].children
      this.districtValue = -1
      if(this.type === 'edit' && this.isInitVal){ //编辑状态还原区
        this.districtValue = parseInt(this.instance.districtValue)
        this.isInitVal = false
      }
    }
  },
  methods: {
    add(){
      //if(){} // 非空和合法性校验
      let {name, tel, provinceValue, cityValue, districtValue, address} = this
      let data = {name, tel, provinceValue, cityValue, districtValue, address}
      if(this.type === 'add'){
        // data.id = this.id
        // Address.add(data).then(res=>{
        //   this.$router.go(-1)
        // })
        this.$store.dispatch('addAction', data)
      }
      if(this.type === 'edit'){
        // Address.update(data).then(res=>{
        //   this.$router.go(-1)
        // })

        this.$store.dispatch('updateAction', data)
      }

    },
    remove(){
      if(window.confirm('确认删除吗？')){
        // Address.remove(this.id).then(res=>{
        //   this.$router.go(-1)
        // })
        this.$store.dispatch('removeAction', this.id)
      }
    },
    setDefault(){
      // Address.setDefault(this.id).then(res=>{
      //   this.$router.go(-1)
      // })
      this.$store.dispatch('setDefaultAction', this.id)
    }
  }
}
