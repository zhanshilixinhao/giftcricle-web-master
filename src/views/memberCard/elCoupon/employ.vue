<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优惠券标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="优惠券标题" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="用户电话" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="核銷門店" prop="store">
                <el-input v-model="ruleForm.store" placeholder="送券门店" type="text"></el-input>
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
        prop="nickname"
        show-overflow-tooltip
        label="用户昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="用户电话"
        width="120%"/>
      <el-table-column
        align="center"
        prop="title"
        label="优惠券"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        prop="num"
        label="优惠券编码"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        prop="quantity"
        label="核銷數"
        width="120%"/>
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
  import {getCouponUseLog} from "../../../api/v3/elCoupon";

  var moment = require('moment')

  export default {
    name: "user",
    components: {CPagination, CDateItem},
    data() {
      return {
        roleId: this.$store.state.user.roleId,
        ruleForm: {
          title: '',
          phone: '',
          store: '',
          time: ''
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
    },
    methods: {
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
        if (this.ruleForm.store) {
          search.storeName = this.ruleForm.store
        }
        getCouponUseLog(search).then(re => {
          const li = re.data.data
          if (li) {
            li.forEach(item => {
              const detail =  JSON.parse(item.detail)
              item.title = detail.title
              item.num = detail.num
            })
          }
          this.tableData = li
          this.pageData.total = re.data.total
        })
      },
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
