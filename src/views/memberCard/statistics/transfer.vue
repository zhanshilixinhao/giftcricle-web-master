<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div v-if="this.$store.state.user.roleId === 1 || this.$store.state.user.roleId === 2">
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
              <el-form-item label="卡标题" prop="title">
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
              <el-form-item label="状态" prop="status" >
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
        label="卡标题"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        prop="sendMoney"
        label="赠送金额"
        width="120%"/>
      <el-table-column
        align="center"
        label="状态"
        width="120%">
        <template scope = "scope">
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
  import { getTransferSend } from '../../../api/v3/turnover'
  import { objKeySort } from '../../../utils/validate'

  var moment = require('moment')
  var MD5 = require('md5.js')
  export const downloadExcel = (res, path,token) => {
    const uri = convertUrl(res)
    const url = process.env.BASE_API + '/' + path + '?isExport=1&token='+ token + '&' + uri
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
    name: 'refund',
    components: { CDateItem, CPagination },
    data() {
      return{
        statusOptions: [{value: '1', label: '未领取'}, {value: '2', label: '已领取'}],
        loading2: false,
        editableTabsValue: '4',
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
          time:[]
        },
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        tableData: [],
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
      getList(flag){
        if (!flag) {
          this.isExport = false
        }
        const search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        if(this.ruleForm.title){
          search.title = this.ruleForm.title
        }
        if(this.ruleForm.nickname){
          search.nickname = this.ruleForm.nickname
        }
        if(this.ruleForm.status){
          search.status = this.ruleForm.status
        }
        if (this.ruleForm.time && this.ruleForm.time[0]){
          search.startTime = moment(this.ruleForm.time[0])._d.getTime()
        }
        if (this.ruleForm.time && this.ruleForm.time[1]){
          search.endTime = moment(this.ruleForm.time[1])._d.getTime()
        }
        if (this.isExport) {
          search.isExport = 1
          downloadExcel(search, 'manage/v3/turnover/transfer_list', this.$store.state.user.token)
          this.isExport = false
          return
        }
        getTransferSend(search).then(re => {
          this.tableData = re.data.data
          this.pageData.total = re.data.total
        })
      },
      handleClick(tab, event) {
        console.log(tab)
        if (tab.name && tab.name === '2') {
          this.$router.push('/memberCard/list8')
        }else if (tab.name && tab.name === '1'){
          this.$router.push('/memberCard/list7')
        }else if (tab.name && tab.name === '3'){
          this.$router.push('/memberCard/list9')
        }else if (tab.name && tab.name === '4'){
          this.$router.push('/memberCard/list10')
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
