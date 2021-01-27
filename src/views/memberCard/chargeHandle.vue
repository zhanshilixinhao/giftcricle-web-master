<template>
  <div v-loading="loading2" element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       element-loading-text="提交中">
    <el-form ref="chargeForm" :model="chargeForm" label-width="90px">
      <el-form-item label="用户电话">
        <el-input v-model="chargeForm.phone" @change="categoryChange2"></el-input>
      </el-form-item>
      <el-form-item label="会员卡">
        <el-select v-model="chargeForm.cardId" placeholder="请选择" @change="categoryChange1" :disabled="this.chargeForm.phone === ''">
          <el-option
            v-for="item in options"
            :key="item.cardId"
            :label="item.title"
            :value="item.cardId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员卡活动">
        <el-select v-model="chargeForm.eventId" filterable placeholder="请选择活动" style="width: 100%"
                   icon="el-icon-search" @change="categoryChange" >
          <el-option
            v-for="item in eventOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="充值金额">
        <el-input v-model="chargeForm.recharge" style="width: 50%" type="number"
                  :disabled="chargeForm.eventId !== '' "
                  onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
      </el-form-item>

      <el-form-item label="赠送金额">
        <el-input v-model="chargeForm.send" style="width: 50%" type="number"
                  :disabled="chargeForm.eventId !== '' "
                  onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
      </el-form-item>

      <el-form-item label="充值说明">
        <el-select v-model="chargeForm.explain" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in explainOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券">
        <el-input v-model="chargeForm.coupon" style="width: 50%" disabled ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmitCharge">提交</el-button>
        <el-button @click="getBack()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getCardList1, cardEvent, chargeCard, getUserCardList1} from '../../api/v3/userCard'
  import { detailCardEvent } from "../../api/v3/event";

  export default {
    name: 'chargeHandle',
    data(){
      return{
        explainOptions: [{value: '微信', label: '微信'},{value: '支付宝', label: '支付宝'},{value: '银行卡', label: '银行卡'},
          {value: '现金', label: '现金'},{value: '其他', label: '其他'}],
        loading2:false,
        chargeForm: {
          recharge: '',
          send: '',
          eventId: '',
          explain: '',
          phone: '',
          cardId: '',
          coupon: ''
        },
        eventOptions: [],
        options: []
      }
    },
    mounted() {

      cardEvent().then(re =>{
        this.eventOptions = re.data.data
      })
    },
    methods: {
      // 选择会员卡
      categoryChange2(value) {
        if (this.chargeForm.phone) {
          this.chargeForm.phone = parseInt(value);
          const s = {}
          s.phone = this.chargeForm.phone
          getUserCardList1(s).then(re => {
            this.options = re.data.data.userCardVos
          })
        }
      },
      // 选择活动
      categoryChange(id) {
        for (let cate of this.eventOptions) {
          if (cate.id === id) {
            this.chargeForm.recharge = cate.rechargeMoney
            this.chargeForm.send = cate.sendMoney
            detailCardEvent({eventId:id}).then(re => {
              const da = re.data.data
              if (da.type === 5 ||da.type === 2 )
              this.chargeForm.coupon = re.data.data.couponTitle + '  '+re.data.data.quantity+'张'
            })
          }
        }
      },
      categoryChange1(id) {
        this.chargeForm.recharge = ''
        this.chargeForm.send = ''
        this.chargeForm.eventId = ''
        this.chargeForm.coupon = ''

      },
      onSubmitCharge() {
        const ch = {}
        if(!this.chargeForm.phone){
          this.$message.error('请输入用户电话')
          return
        }
        ch.phone = this.chargeForm.phone
        if(!this.chargeForm.cardId){
          this.$message.error('请选择会员卡')
          return
        }
        ch.cardId = this.chargeForm.cardId
        if (this.chargeForm.recharge.length === 0) {
          this.$message.error('请输入充值金额')
          return
        }
        ch.recharge = this.chargeForm.recharge
        ch.send = this.chargeForm.send
        ch.explain = this.chargeForm.explain
        ch.eventId = this.chargeForm.eventId
        this.loading2 = true
        chargeCard(ch).then(re => {
          this.loading2 = false
          if (re.data.errCode === 0) {
            this.$message.success('操作成功')
            this.$router.push('/merchantStatistics/list2')
          } else {
            this.$message.error(re.data.msg)
            this.$router.push('/merchantStatistics/list2')
          }
        }).catch( re =>{
          this.loading2 = false
        })
      },
      getBack(){
        this.$router.push('/merchantStatistics/list2')
      }
    }
  }
</script>

<style scoped>

</style>
