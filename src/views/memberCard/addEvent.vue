<template>
  <div v-loading="loading2" class="app-container" element-loading-text="拼命加载中">
    <el-form :model="form" ref="form" label-width="110px" class="demo-form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="summary">
        <el-input type="textarea" v-model="form.summary"></el-input>
      </el-form-item>
      <el-form-item label="赠送类型"  v-if="roleId !== 3">
        <el-input  placeholder="充钱送钱"  disabled></el-input>
      </el-form-item>
      <el-form-item label="赠送类型" prop="type" v-if="roleId !== 2">
        <el-select v-model="form.type" filterable placeholder="请选择" style="width: 100%"
                   icon="el-icon-search" >
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="充值金额" prop="rechargeMoney">
        <el-input v-model="form.rechargeMoney" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
      </el-form-item>
      <el-form-item label="赠送金额" prop="sendMoney" v-if="form.type !== 2">
        <el-input v-model="form.sendMoney" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
      </el-form-item>
      <el-form-item label="优惠券" prop="targetId" v-if="form.type && form.type !== 1">
        <el-select v-model="form.targetId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券数量" prop="quantity" v-if="form.type &&form.type !== 1">
        <el-input v-model="form.quantity" type="number"></el-input>
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="可使用的门店" prop="storeIds">
            <el-select v-model="form.storeIds" multiple placeholder="请选择">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
      <el-row style="float: left">
        <el-form-Item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="getBack()">返回</el-button>
        </el-form-Item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { addCardEvent ,detailCardEvent, updateCardEvent } from '../../api/v3/event'
  import themeItem from '../themeItem/themeItem'
  import { getElCouponAllList } from "../../api/v3/elCoupon";
  import {allStoreList} from "../../api/v3/card";

  export default {
    name: 'addEvent',
    data() {
      return {
        typeOptions: [{ value: 1, name: '充钱送钱' }, { value: 2, name: '充钱送优惠券' },
          { value: 5, name: '充钱送钱+送优惠券' }],
        loading2: false,
        flag:1,
        form: {
          title: '',
          summary: '',
          type: '',
          rechargeMoney: '',
          sendMoney: '',
          targetId: '',
          quantity: '',
          storeIds: '',
        },
        roleId: '',
        options: [],
        option: []
      }
    },
    mounted() {
      // 可选择门店
      allStoreList().then(re => {
        this.option = re.data.data
      })
      this.roleId = this.$store.state.user.roleId
      if (this.$route.query.id){
        this.getDetail()
      }
      getElCouponAllList().then(re => {
        this.options = re.data.data
      })
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.flag === 2){
              this.update()
            }else {
              this.add()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /***************************************************添加***************************************************/
      add(){
        const event = {}
        if (!this.form.title){
          this.$message.error("请输入标题")
          return
        }
        event.title = this.form.title
        if (!this.form.summary){
          this.$message.error("请输入简介")
          return
        }
        event.summary = this.form.summary
        // if (!this.form.rechargeMoney){
        //   event.rechargeMoney = this.form.rechargeMoney
        //   return
        // }

        event.rechargeMoney = this.form.rechargeMoney
        console.log('ddddddd'+this.form.rechargeMoney)
        // 礼遇圈
        if (this.roleId === 2){
          event.type = 1
          if (!this.form.sendMoney){
            this.$message.error("请输入赠送金额")
            return
          }
        }else {
          if (!this.form.type){
            this.$message.error("请选择赠送类型")
            return
          }
          if (this.form.type ===1 && !this.form.sendMoney){
            this.$message.error("请输入赠送金额")
            return
          }
          if ((this.form.type === 2 || this.form.type === 5)&& !this.form.targetId){
            this.$message.error("请选择优惠券")
            return
          }
          if ( this.form.targetId  && !this.form.quantity){
            this.$message.error("请输入数量")
            return
          }
          event.type = this.form.type
          event.targetId = this.form.targetId
          event.quantity = this.form.quantity
        }
        if (!this.form.sendMoney){
          event.sendMoney = ''
        }else {
          event.sendMoney = this.form.sendMoney
        }
        event.storeIds = this.form.storeIds
        event.status = 1
        addCardEvent(event).then(re => {
          if (re.data.errCode === 0){
            this.$message.success('添加成功')
            // this.$router.push('/memberCard/list3')
            this.$router.go(-1)
          }else {
            this.$message.error(re.data.msg)
          }
        })
      },
      /***************************************************修改***************************************************/
      getDetail() {
        this.flag = 2
        detailCardEvent({eventId: this.$route.query.id}).then(re => {
          const data = re.data.data
          this.form.title = data.title
          this.form.summary = data.summary
          this.form.type = data.type
          this.form.rechargeMoney = data.rechargeMoney
          this.form.sendMoney = data.sendMoney
          this.form.targetId = data.targetId
          this.form.quantity = data.quantity
          if (data.storeIds) {
            const storeIds = data.storeIds.split(',')
            this.form.storeIds = []
            for (let i = 0; i < storeIds.length; i++) {
              console.log('啊啊啊', storeIds[i])
              this.form.storeIds.push(parseInt(storeIds[i]))
            }
            console.log(this.form.storeIds)
          }
        })
      },
      update() {
        const event = {}
        event.id =  this.$route.query.id
        if (!this.form.title){
          this.$message.error("请输入标题")
          return
        }
        event.title = this.form.title
        if (!this.form.summary){
          this.$message.error("请输入简介")
          return
        }
        event.summary = this.form.summary
        // if (!this.form.rechargeMoney){
        //   this.$message.error("请输入充值金额")
        //   return
        // }
        event.rechargeMoney = this.form.rechargeMoney
        // 礼遇圈
        if (this.roleId === 2){
          event.type = 1
          if (!this.form.sendMoney){
            this.$message.error("请输入赠送金额")
            return
          }
        }else {
          if (!this.form.type){
            this.$message.error("请选择赠送类型")
            return
          }
          if (this.form.type ===1 && !this.form.sendMoney){
            this.$message.error("请输入赠送金额")
            return
          }
          if ((this.form.type === 2 || this.form.type === 5)&& !this.form.targetId){
            this.$message.error("请选择优惠券")
            return
          }
          if ( this.form.targetId  && !this.form.quantity){
            this.$message.error("请输入数量")
            return
          }
          event.type = this.form.type
          event.targetId = this.form.targetId
          event.quantity = this.form.quantity
          event.storeIds = this.form.storeIds
        }
        if (!this.form.sendMoney){
          event.sendMoney = ''
        }else {
          event.sendMoney = this.form.sendMoney
        }
        if (this.form.type === 1){
          event.targetId = ''
          event.quantity = ''
        }else if (this.form.type === 2){
          event.sendMoney = ''
        }
        updateCardEvent(event).then(re => {
          if (re.data.errCode === 0){
            this.$message.success('修改成功')
            // this.$router.push('/memberCard/list3')
            this.$router.go(-1)
          }else {
            this.$message.error(re.data.msg)
          }
        })
      },
      getBack() {
        // this.$router.push('/memberCard/list3')
        this.$router.go(-1)
      },
      /***************************************************v3优惠券***************************************************/

    }
  }
</script>

<style scoped>

</style>
