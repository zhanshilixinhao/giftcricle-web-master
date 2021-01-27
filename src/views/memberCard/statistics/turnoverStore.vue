<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
<!--    <div>-->
<!--      &lt;!&ndash;      v-if="this.$store.state.user.roleId && (this.$store.state.user.roleId === 2 ||this.$store.state.user.roleId === 1)"&ndash;&gt;-->
<!--      <el-tabs v-model="editableTabsValue" type="card" @tab-click="handleClick">-->
<!--        <el-tab-pane-->
<!--          :key="item.name"-->
<!--          v-for="(item, index) in editableTabs"-->
<!--          :label="item.title"-->
<!--          :name="item.name">-->
<!--        </el-tab-pane>-->
<!--      </el-tabs>-->
<!--    </div>-->
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="活动" prop="eventId">
                <el-select v-model="ruleForm.eventId" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
                  <el-option
                    v-for="item in eventOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会员卡名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="会员卡名称" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="时间" prop="time">
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
            <el-col :span="12">
              <el-form-item label="用户电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="用户电话" type="text"></el-input>
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
            <el-form-item label="总营业额" style="color: #dd6161" >
              <div>{{this.totalMoney}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总收入" style="color: #dd6161" >
              <div>{{this.totalBlagMoney}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总营销费用" style="color: #dd6161">
              <div>{{this.totalTurnoverMoney}}</div>
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
        prop="totalMoney"
        width="120px"
        label="营业额">
      </el-table-column>
      <el-table-column
        align="center"
        prop="blagMoney"
        width="120px"
        label="本金收入">
      </el-table-column>
      <el-table-column
        align="center"
        prop="turnoverMoney"
        label="营销费用"
        width="120px">
      </el-table-column>
      <el-table-column
        align="center"
        label="会员卡类型"
        width="120px">
        <template slot-scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.type === 1">礼遇圈卡</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.type === 10">储值卡</el-tag>
          <el-tag size="mini" type="danger" v-if="scope.row.type === 11">活动卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderNo"
        label="订单号"
        width="120px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="eventName"
        label="活动"
        show-overflow-tooltip>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="storeName"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--        label="消费门店">-->
<!--      </el-table-column>-->
      <el-table-column
        align="center"
        prop="title"
        label="会员卡标题"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="nickname"
        label="用户昵称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="用户电话"
        width="120">
      </el-table-column>


      <c-date-item prop="created" label="创建时间"/>

    </el-table>
    <c-pagination :page-data="pageData"/>


  </div>
</template>

<script>
  var moment = require('moment')
  import CPagination from '../../../components/CPagination/index'
  import CDateItem from '../../../components/CDateItem/index'
  import { getTurnoverList } from '../../../api/v3/turnover'
  import { storeCardEvent } from '../../../api/v3/event'

  import { objKeySort } from '../../../utils/validate'

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

    name: 'turnover',
    components: { CDateItem, CPagination },
    data() {
      return {
        loading2: false,
        editableTabsValue: '1',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        ruleForm: {
          eventId: '',
          title: '',
          time: [],
          phone: ''
        },
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        totalBlagMoney: '',
        totalTurnoverMoney: '',
        tableData: [],
        eventOptions: [],
        isExport: false
      }
    },
    mounted() {
      this.getList()
      storeCardEvent().then(re => {
        this.eventOptions = re.data.data
      })
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
        if (this.ruleForm.eventId) {
          search.eventId = this.ruleForm.eventId
        }
        if (this.ruleForm.title) {
          search.title = this.ruleForm.title
        }
        if (this.ruleForm.time && this.ruleForm.time[0]) {
          search.startTime = moment(this.ruleForm.time[0])._d.getTime()
        }
        if (this.ruleForm.time && this.ruleForm.time[1]) {
          search.endTime = moment(this.ruleForm.time[1])._d.getTime()
        }
        if (this.ruleForm.phone) {
          search.phone = this.ruleForm.phone
        }
        if (this.isExport) {
          search.isExport = 1
          downloadExcel(search, 'manage/v3/turnover/list', this.$store.state.user.token)
          this.isExport = false
          return
        }
        getTurnoverList(search).then(re => {
          this.tableData = re.data.data.turnoverVo
          this.pageData.total = re.data.total
          this.totalTurnoverMoney = re.data.data.money.totalTurnoverMoney
          this.totalBlagMoney = re.data.data.money.totalBlagMoney
          this.totalMoney = re.data.data.money.totalMoney
        })
      },
      handleClick(tab, event) {
        console.log(tab)
        if (tab.name && tab.name === '2') {
          this.$router.push('/memberCard/list8')
        } else if (tab.name && tab.name === '3') {
          this.$router.push('/memberCard/list9')
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
