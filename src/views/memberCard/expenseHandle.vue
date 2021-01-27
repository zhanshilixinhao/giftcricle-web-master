<template>
  <div v-loading="loading2" element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       element-loading-text="提交中">
    <el-form ref="expenseForm" :model="expenseForm" label-width="90px">
      <el-form-item label="用户电话">
        <el-input v-model="expenseForm.phone" @change="categoryChange"></el-input>
      </el-form-item>
      <el-form-item label="会员卡">
        <el-select v-model="expenseForm.cardId" placeholder="请选择" :disabled="this.expenseForm.phone === ''">
          <el-option
            v-for="item in options"
            :key="item.cardId"
            :label="item.title"
            :value="item.cardId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消费金额">
        <el-input v-model="expenseForm.expense" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="会员卡密码">
            <el-input v-model="expenseForm.password" type="password" placeholder="默认密码为手机后六位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="消费说明">
        <el-input type="textarea" v-model="expenseForm.explain"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmitExpense">提交</el-button>
        <el-button @click="getBack()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {expenseCard} from '../../api/v3/userCard'
  import {getUserCardList1} from '../../api/v3/userCard'

  var MD5 = require('md5.js')
  export default {
    name: 'expenseHandle',
    data() {
      return {
        expenseForm: {
          expense: '',
          explain: '',
          phone: '',
          cardId: '',
          password: ''
        },
        loading2: false,
        options: []
      }
    },
    mounted() {

    },
    methods: {
      categoryChange(value) {
        if (this.expenseForm.phone) {
          this.expenseForm.phone = parseInt(value);
          const s = {}
          s.phone = this.expenseForm.phone
          getUserCardList1(s).then(re => {
            this.options = re.data.data.userCardVos
          })
        }
      },
      onSubmitExpense() {
        const ex = {}
        if (!this.expenseForm.phone) {
          this.$message.error('请输入用户电话')
          return
        }
        ex.phone = this.expenseForm.phone
        if (this.expenseForm.cardId && this.expenseForm.cardId === '') {
          this.$message.error('请选择会员卡')
          return
        }
        ex.cardId = this.expenseForm.cardId
        if (!this.expenseForm.expense) {
          this.$message.error('请输入消费金额')
          return
        }
        if (!this.expenseForm.password) {
          this.$message.error('请输入会员卡密码')
          return
        }
        ex.password = new MD5().update(this.expenseForm.password).digest('hex').toUpperCase()
        ex.expense = this.expenseForm.expense
        ex.explain = this.expenseForm.explain
        this.loading2 = true
        expenseCard(ex).then(re => {
          this.loading2 = false
          if (re.data.errCode === 0) {
            this.$message.success('操作成功')
            this.$router.push('/merchantStatistics/list3')
          } else {
            this.$message.error(re.data.msg)
            this.$router.push('/merchantStatistics/list3')
          }
        }).catch(re => {
          this.loading2 = false
        })
      },
      getBack() {
        this.$router.push('/merchantStatistics/list3')
      }
    }
  }
</script>

<style scoped>

</style>
