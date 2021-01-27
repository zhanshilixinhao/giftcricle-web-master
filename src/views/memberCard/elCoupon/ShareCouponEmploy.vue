<template>
    <div class="app-container"  element-loading-text="拼命加载中">
      <div>
        <el-card :body-style="{ padding: '12px' }">
          <h4>条件查询</h4>
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="用户电话" prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="用户电话" type="text"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="float: right">
              <el-form-item prop="date">
                <el-button type="primary" @click="search()">搜索</el-button>
                <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <br/>
      <el-table
        :data="tableData"
        stripe
        border>
        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userName"
          show-overflow-tooltip
          label="用户昵称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userPhone"
          label="用户电话"
          width="120%"/>
        <el-table-column
          align="center"
          prop="title"
          label="折扣券"
          show-overflow-tooltip/>
        <el-table-column
          align="center"
          prop="shareCouponUserId"
          label="折扣券编码"
          show-overflow-tooltip/>
        <el-table-column
          align="center"
          prop="storeName"
          label="核銷門店"
          show-overflow-tooltip/>
        <c-date-item prop="created" label="核銷時間"/>
      </el-table>
      <c-pagination :page-data="pageData"/>
    </div>
</template>

<script>
  import CDateItem from "../../../components/CDateItem/index";
  import CPagination from "../../../components/CPagination/index";
  import {userShareCouponLog} from "../../../api/v4/shareCoupon";
  var moment = require('moment')
  export default {
    name: 'ShareCouponEmploy',
    components: {CPagination, CDateItem},
    data(){
      return{
        roleId: this.$store.state.user.roleId,
        ruleForm: {
          title: '',
          phone: '',
        },
        tableData: [],
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        }
      }
    },
    mounted() {
      this.getList()
      console.log(this.tableData)
    },
    methods:{
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      getList() {
        const search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        if (this.ruleForm.title) {
          search.title = this.ruleForm.title
        }
        if (this.ruleForm.phone) {
          search.phone = this.ruleForm.phone
        }
        userShareCouponLog(search).then(re => {
          const li = re.data.data.list
          if (li) {
            li.forEach(item => {
              const detail = JSON.parse(item.detail)
              item.title = detail.title
              item.num = detail.num
            })
          }
          this.tableData = li
          this.pageData.total = re.data.total
        })
      },
    }
  }
</script>

<style scoped>

</style>
