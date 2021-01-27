<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-tabs v-model="editableTabsValue" type="card" @tab-click="handleClick">
        <el-tab-pane
          :key="item.name"
          v-for="(item, index) in editableTabs"
          :label="item.title"
          :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="卡号" prop="cardNo">
                <el-input v-model="ruleForm.cardNo" placeholder="卡号" type="text"></el-input>
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
              <el-form-item label="消费门店" prop="storeName">
                <el-input v-model="ruleForm.storeName" placeholder="消费门店" type="text"></el-input>
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
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="订单号" prop="orderNo">
                <el-input v-model="ruleForm.orderNo" placeholder="订单号" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-button type='success' style="float: left;" @click="exportExcel('ruleForm')">导出</el-button>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='date' style="float: right">
                <el-button type="primary" @click="search()">搜索</el-button>
                <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
    <div>
      <el-form style="padding: 16px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="总消费金额" style="color: #dd6161">
              <div>{{this.totalExpenseMoney}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
        label="消费方式"
        width="100%">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.type === 1" size="mini">APP消费</el-tag>
          <el-tag type="primary" v-if="scope.row.type === 2" size="mini">门店消费</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="nickname"
        show-overflow-tooltip
        label="用户昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cardNo"
        label="卡号"
        width="140%"/>
      <el-table-column
        align="center"
        prop="phone"
        label="用户电话"
        width="120%"/>
      <el-table-column
        align="center"
        prop="expenseMoney"
        label="消费金额"
        width="120%"/>
      <el-table-column
        align="center"
        prop="orderNo"
        label="订单号"
        width="140%"/>
      <el-table-column
        align="center"
        prop="storeName"
        label="消费门店"
        show-overflow-tooltip/>

      <el-table-column
        align="center"
        prop="title"
        label="卡标题"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        prop="explain"
        show-overflow-tooltip
        label="消费说明">
      </el-table-column>

      <c-date-item prop="created" label="消费时间"/>

    </el-table>
    <c-pagination :page-data="pageData"/>


  </div>
</template>

<script>
    var moment = require('moment')
    import {getExpenseRecord} from '../../../api/v3/turnover'
    import CDateItem from '../../../components/CDateItem/index'
    import CPagination from '../../../components/CPagination/index'

    import {objKeySort} from '../../../utils/validate'

    var MD5 = require('md5.js')
    export const downloadExcel = (res, path, token) => {
        const uri = convertUrl(res)
        const url = process.env.BASE_API + '/' + path + '?isExport=1&token=' + token + '&' + uri
        // window.location = encodeURI(process.env.BASE_API + '/'+ path + '?isExport=1&token='+ token +'&'+ uri)
        window.open(url)
    }

    export const convertUrl = (data) => {
        let ret = ''
        if (!data) data = {}
        data.u = new Date().getTime() + ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        let ret1 = ''
        data = objKeySort(data)
        for (let it in data) {
            ret1 += it + '=' + data[it] + '&'
        }
        ret1 += 'f=' + createV()
        ret += 'v=' + new MD5().update(ret1).digest('hex').toUpperCase()
        return ret
    }

    export function createV() {
        return '*KJSDJKJ#@RSNDHDJRH#&*@RFJKSKjdsafhsda'
    }

    export default {
        name: 'expense',
        components: {CPagination, CDateItem},
        data() {
            return {
                loading2: false,
                editableTabsValue: '3',
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
                    cardNo: '',
                    storeName: '',
                    phone: '',
                    time: [],
                    orderNo: ''
                },
                editableTabs: [{
                    title: '收入及营销费用',
                    name: '1',
                    content: '收入及营销费用'
                }, {
                    title: '充值记录',
                    name: '2',
                    content: '充值记录'
                }, {
                    title: '消费记录',
                    name: '3',
                    content: '消费记录'
                }, {
                    title: '退款记录',
                    name: '4',
                    content: '退款记录'
                }, {
                  title: '转增记录',
                  name: '5',
                  content: '转增记录'
                }],
                pageData: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                    action: this.getList
                },
                tableData: [],
                totalExpenseMoney: '',
                isExport: false
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            exportExcel() {
                this.isExport = true
                this.getList(true)
            },
            getList(flag) {
                if (!flag) {
                    this.isExport = false
                }
                const search = {}
                search.pageNum = this.pageData.pageNum
                search.pageSize = this.pageData.pageSize
                if (this.ruleForm.cardNo) {
                    search.cardNo = this.ruleForm.cardNo
                }
                if (this.ruleForm.storeName) {
                    search.storeName = this.ruleForm.storeName
                }
                if (this.ruleForm.phone) {
                    search.phone = this.ruleForm.phone
                }
                if (this.ruleForm.orderNo) {
                    search.orderNo = this.ruleForm.orderNo
                }
                if (this.ruleForm.time && this.ruleForm.time[0]) {
                    search.startTime = moment(this.ruleForm.time[0])._d.getTime()
                }
                if (this.ruleForm.time && this.ruleForm.time[1]) {
                    search.endTime = moment(this.ruleForm.time[1])._d.getTime()
                }
                if (this.isExport) {
                    search.isExport = 1
                    downloadExcel(search, 'manage/v3/turnover/expense_list', this.$store.state.user.token)
                    this.isExport = false
                    return
                }
                getExpenseRecord(search).then(re => {
                    this.tableData = re.data.data.expenseReVo
                    this.pageData.total = re.data.total
                    this.totalExpenseMoney = re.data.data.totalExpenseMoney
                })
            },
            handleClick(tab, event) {
                console.log(tab)
                if (tab.name && tab.name === '2') {
                    this.$router.push('/memberCard/list8')
                } else if (tab.name && tab.name === '1') {
                    this.$router.push('/memberCard/list7')
                } else if (tab.name && tab.name === '4') {
                    this.$router.push('/memberCard/list10')
                }else if (tab.name && tab.name === '5') {
                    this.$router.push('/memberCard/list11')
                }
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
