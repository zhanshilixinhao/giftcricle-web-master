<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
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
            <el-col :span="12">
              <el-form-item label="卡号" prop="cardNo">
                <el-input v-model="ruleForm.cardNo" placeholder="卡号" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="会员卡类型" prop="type" v-if="this.$store.state.user.roleId !== 3 ">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="卡标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="卡标题" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="开卡门店" prop="title">
                <el-input v-model="ruleForm.storeName" placeholder="开卡门店" type="text"></el-input>
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
            <el-form-item label="所有会员总余额" style="color: #dd6161">
              <div>{{this.totalMoney}}</div>
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
        v-if="this.$store.state.user.roleId !== 3 "
        align="center"
        label="会员等级"
        width="100%">
        <template scope="scope">
          <el-button v-if="scope.row.type === 1" type="success" @click="updateGrade(scope.row)" size="mini">修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="gradeTitle"
        label="会员等级"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        label="发票记录"
        width="100%">
        <template scope="scope">
          <el-button type="success" @click="invoiceRecord(scope.row)" size="mini">查看</el-button>
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
        prop="phone"
        label="用户电话"
        width="120%"/>
      <el-table-column
        align="center"
        prop="title"
        label="卡标题"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        prop="cardNo"
        label="卡号"
        width="120%"/>
      <el-table-column
        align="center"
        label="会员卡类型"
        width="100%">
        <template scope="scope">
          <el-tag type="success" v-if="scope.row.type === 1" size="mini">礼遇圈卡</el-tag>
          <el-tag type="primary" v-if="scope.row.type === 10" size="mini">企业门店卡</el-tag>
          <el-button type="danger" v-if="scope.row.type === 11" @click="eventCard(scope.row)" size="mini">活动卡
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="balance"
        label="余额"
        width="120%"/>
      <el-table-column
        align="center"
        prop="storeName"
        label="开卡门店"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        label="充值记录"
        width="100%">
        <template scope="scope">
          <el-button type="success" @click="charge(scope.row)" size="mini">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="消费记录"
        width="100%">
        <template scope="scope">
          <el-button type="primary" @click="expense(scope.row)" size="mini">查看</el-button>
        </template>
      </el-table-column>

      <c-date-item prop="created" label="创建时间"/>

    </el-table>
    <c-pagination :page-data="pageData"/>

    <!--    充值记录-->
    <el-dialog title="充值记录" :visible.sync="dialogVisible" width="80%">
      <el-table
        :data="tableData2"
        stripe
        border>
        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          label="充值方式"
          width="100%">
          <template scope="scope">
            <el-tag type="success" v-if="scope.row.type === 1" size="mini">APP充值</el-tag>
            <el-tag type="primary" v-if="scope.row.type === 2" size="mini">门店充值</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="rechargeMoney"
          label="充值金额"
          width="120%"/>
        <el-table-column
          align="center"
          prop="sendMoney"
          label="赠送金额"
          width="120%"/>
        <el-table-column
          align="center"
          prop="storeName"
          label="充值门店"
          show-overflow-tooltip/>
        <el-table-column
          align="center"
          prop="explain"
          show-overflow-tooltip
          label="充值说明">
        </el-table-column>
        <c-date-item prop="created" label="充值时间"/>
      </el-table>
    </el-dialog>

    <!--    消费记录-->
    <el-dialog title="消费记录" :visible.sync="dialogVisibleExpense" width="80%">
      <el-table
        :data="tableData3"
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
          prop="expenseMoney"
          label="消费金额"
          width="120%"/>

        <el-table-column
          align="center"
          prop="storeName"
          label="消费门店"
          show-overflow-tooltip/>
        <el-table-column
          align="center"
          prop="explain"
          show-overflow-tooltip
          label="消费说明">
        </el-table-column>
        <c-date-item prop="created" label="消费时间"/>
      </el-table>
    </el-dialog>

    <!--    修改会员等级-->
    <el-dialog title="会员等级" :visible.sync="dialogVisibleGrade" width="50%">
      <el-form ref="gradeForm" :model="gradeForm" label-width="80px">
        <el-form-item label="会员等级">
          <el-select v-model="gradeForm.id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleGrade = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('gradeForm')">确 定</el-button>
     </span>
    </el-dialog>

    <!--    余额详情-->
    <el-dialog title="会员等级" :visible.sync="dialogVisibleBalance" width="40%">
      <div>
        本金总余额：{{capital1}}
      </div>
      <div>
        赠送总余额：{{send1}}
      </div>
      <el-table :data="tableData1">
        <el-table-column align="center" prop="capitalBalance" label="本金余额" width="120%"/>
        <el-table-column align="center" prop="sendBalance" label="赠送余额" width="120%"/>
      </el-table>
    </el-dialog>

    <!--    发票记录-->
    <el-dialog title="发票记录" :visible.sync="dialogVisibleInRe" width="80%">
      <div>
        <el-form style="padding: 16px">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="总充值金额" style="color: #dd6161">
                <div>{{this.totalCharge}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总开票金额" style="color: #dd6161">
                <div>{{this.totalInvoice}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="可开票金额" style="color: #dd6161">
                <div>{{this.amount}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="tableData4"
        stripe
        border>
        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>

        <el-table-column
          align="center"
          prop="amount"
          label="开票金额"
          width="120%"/>

        <el-table-column
          align="center"
          prop="storeName"
          label="开票门店"
          show-overflow-tooltip/>
        <el-table-column
          align="center"
          prop="summary"
          show-overflow-tooltip
          label="备注">
        </el-table-column>
        <c-date-item prop="created" label="开票时间"/>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import CDateItem from '../../components/CDateItem/index'
  import CPagination from '../../components/CPagination/index'
  import { getUserCardList, cardInfo, getEventCardDetail } from '../../api/v3/userCard'
  import { getCardGradeList, updateUserGrade } from '../../api/v3/event'
  import { objKeySort } from "../../utils/validate";
  import {getInvoice} from "../../api/v3/elCoupon";
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
    name: 'userCard',
    components: { CPagination, CDateItem },
    data() {
      return {
        typeOptions: [{ value: 1, name: '礼遇圈卡' }, { value: 10, name: '企业门店卡' }, { value: 11, name: '活动卡' }],
        loading2: false,
        dialogVisible: false,
        dialogVisibleExpense: false,
        dialogVisibleInRe: false,
        dialogVisibleGrade: false,
        dialogVisibleBalance: false,
        tableData: [],
        tableData1: [],
        tableData3: [],
        tableData2: [],
        tableData4: [],
        totalCharge: '',
        totalInvoice: '',
        amount: '',
        ruleForm: {
          cardNo: '',
          phone: '',
          type: '',
          title: '',
          storeName: ''
        },
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        gradeForm: {
          id: ''
        },
        options: [],
        userId: '',
        cardId: '',
        type: '',
        capital1: '',
        send1: '',
        isExport: false,
        totalMoney: ''
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
        var search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        search.cardNo = this.ruleForm.cardNo
        search.phone = this.ruleForm.phone
        search.type = this.ruleForm.type
        search.title = this.ruleForm.title
        search.storeName = this.ruleForm.storeName
        if (this.isExport) {
          search.isExport = 1
          downloadExcel(search, 'manage/v3/userCard/list', this.$store.state.user.token)
          this.isExport = false
          return
        }
        getUserCardList(search).then(re => {
          this.tableData = re.data.data.userCardVos
          this.pageData.total = re.data.total
          this.totalMoney =  re.data.data.totalMoney
        })
      },
      // 活动卡详情
      eventCard(row) {
        this.dialogVisibleBalance = true
        this.userId = row.userId
        this.cardId = row.cardId
        this.getCardDetail()
      },
      getCardDetail() {
        getEventCardDetail({ userId: this.userId, cardId: this.cardId }).then(re => {
          this.capital1 = re.data.data.capital1
          this.send1 = re.data.data.send1
          this.tableData1 = re.data.data.list
        })
      },
      charge(row) {
        this.dialogVisible = true
        cardInfo({ userId: row.userId, cardId: row.cardId }).then(re => {
          this.tableData2 = re.data.data.charges
        })
      },
      expense(row) {
        this.dialogVisibleExpense = true
        cardInfo({ userId: row.userId, cardId: row.cardId }).then(re => {
          this.tableData3 = re.data.data.expenses
        })
      },
      invoiceRecord(row){
        console.log(row,'1111111')
        this.dialogVisibleInRe = true
        getInvoice({userId: row.userId, cardId: row.cardId}).then(re => {
          this.tableData4 = re.data.data.invoiceVos
          this.totalCharge = re.data.data.totalCharge
          this.totalInvoice = re.data.data.totalInvoice
          this.amount = re.data.data.amount
        })
      },
      //等级
      updateGrade(row) {
        this.dialogVisibleGrade = true
        this.gradeForm.id = row.gradeId
        getCardGradeList({ cardId: row.cardId }).then(re => {
          this.options = re.data.data
        })
        this.userId = row.userId
        this.cardId = row.cardId
      },
      submitForm() {
        const update = {}
        if (!this.gradeForm.id) {
          this.$message.error('请选择等级')
          return
        }
        update.userId = this.userId
        update.cardId = this.cardId
        update.gradeId = this.gradeForm.id
        updateUserGrade(update).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '成功!',
              type: 'success'
            })
            this.getList()
            this.dialogVisibleGrade = false
          } else {
            this.$message.error('失败!')
          }
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
