<template>
  <div v-loading="loading2" class="app-container"
       element-loading-text="拼命加载中">
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="用户电话">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="会员卡">
        <el-select v-model="form.cardId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员卡密码">
        <el-input v-model="form.password" type="password" placeholder="默认密码:手机后6位(此项可以不填)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="getBack()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  var MD5 = require('md5.js')
  import { getCardList1,addUserCard} from '../../api/v3/userCard'
  export default {
    name: 'openCard',
    data() {
      return{
        loading2:false,
        form: {
          phone: '',
          cardId: '',
          password: ''
        },
        options: []
      }
    },
    mounted() {
      getCardList1({ type: 1 }).then(re => {
        this.options = re.data.data
      })
    },
    methods:{
      onSubmit() {
        const ex = {}
        if (!this.form.phone) {
          this.$message.error('请输入号码')
          return
        }
        ex.phone = this.form.phone
        if (!this.form.cardId) {
          this.$message.error('请选择会员卡')
          return
        }
        ex.membershipCardId = this.form.cardId
        if (this.form.password) {
          ex.password = new MD5().update(this.form.password).digest('hex').toUpperCase()
        }
        addUserCard(ex).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('操作成功')
            this.$router.push('/userCardInfo/list2')
          } else {
            this.$message.error(re.data.msg)
            this.$router.push('/userCardInfo/list2')
          }
        })
      },
      getBack() {
        this.$router.push('/userCardInfo/list2')
      }
    }
  }
</script>

<style scoped>

</style>
