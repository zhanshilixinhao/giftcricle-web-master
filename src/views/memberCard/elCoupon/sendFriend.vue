<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优惠券" prop="title">
                <el-input v-model="ruleForm.title" placeholder="卡标题" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠送者昵称" prop="nickname">
                <el-input v-model="ruleForm.nickname" placeholder="赠送者昵称" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="ruleForm.status" placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时间" prop="title">
                <el-date-picker
                  v-model="ruleForm.time"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
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
        label="赠送者昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="赠送者电话"
        width="120%"/>
      <el-table-column
        align="center"
        prop="title"
        label="优惠券"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        prop="quantity"
        label="赠送数量"
        width="120%"/>
      <el-table-column
        align="center"
        label="状态"
        width="120%">
        <template scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.status === 1">未领取</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.status === 2">已领取</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="reNickname"
        show-overflow-tooltip
        label="领取者昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="rePhone"
        label="领取者电话"
        width="120%"/>

      <c-date-item prop="created" label="赠送时间"/>
      <c-date-item prop="created1" label="领取时间"/>

    </el-table>
    <c-pagination :page-data="pageData"/>
  </div>
</template>

<script>
  import CPagination from '../../../components/CPagination/index'
  import CDateItem from '../../../components/CDateItem/index'
  import { getSendCouponList } from "../../../api/v3/elCoupon";
  var moment = require('moment')


  export default {
    name: 'refund',
    components: {CDateItem, CPagination},
    data() {
      return {
        statusOptions: [{value: '1', label: '未领取'}, {value: '2', label: '已领取'}],
        loading2: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        ruleForm: {
          title: '',
          nickname: '',
          status: '',
          time: []
        },
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        tableData: [],
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
        if (this.ruleForm.nickname) {
          search.nickname = this.ruleForm.nickname
        }
        if (this.ruleForm.status) {
          search.status = this.ruleForm.status
        }
        if (this.ruleForm.time && this.ruleForm.time[0]) {
          search.startTime = moment(this.ruleForm.time[0])._d.getTime()
        }
        if (this.ruleForm.time && this.ruleForm.time[1]) {
          search.endTime = moment(this.ruleForm.time[1])._d.getTime()
        }
        getSendCouponList(search).then(re => {
          this.tableData = re.data.data
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
