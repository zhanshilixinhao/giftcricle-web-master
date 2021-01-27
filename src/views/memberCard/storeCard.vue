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
              <el-form-item label="卡标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="卡标题" type="text"></el-input>
              </el-form-item>
            </el-col>
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
      <!--<el-card :body-style="{ padding: '12px' }">-->
      <!--<el-button type="primary" @click="add()">开卡</el-button>-->
      <!--</el-card>-->
      <el-card :body-style="{ padding: '12px' }">
        <el-form style="padding: 16px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-button type="primary" @click="add()">开卡</el-button>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所有会员总余额" style="color: #dd6161">
                <div>{{this.totalMoney}}</div>
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
        label="操作"
        width="360%">
        <template scope="scope">
          <el-button type="primary" @click="chargehandle(scope.row)" size="mini" v-if="scope.row.type !== 1">充值
          </el-button>
          <el-button type="success" @click="expensehandle(scope.row)" size="mini">消费</el-button>
          <el-button type="info" @click="updateGrade(scope.row)" size="mini" v-if="scope.row.type === 10">等级修改
          </el-button>
          <el-button type="primary" @click="invoicehandle(scope.row)" size="mini">发票</el-button>
          <el-button type="danger" @click="backhandle(scope.row)" size="mini">退卡</el-button>
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
        width="120%">
      </el-table-column>

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

    <!--    用户开卡-->
    <el-dialog title="用户开卡" :visible.sync="dialogVisibleAdd" width="80%">
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
          <el-button @click="dialogVisibleAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    用户充值-->
    <el-dialog title="用户充值" :visible.sync="dialogVisibleCharge" width="80%"
               v-loading="loading"
               element-loading-text="提交中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="chargeForm" :model="chargeForm" label-width="80px">
        <el-form-item label="会员卡活动">
          <el-select v-model="chargeForm.eventId" filterable placeholder="注:活动卡必须选择活动" style="width: 100%"
                     icon="el-icon-search" @change="categoryChange">
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


        <el-form-item label="优惠券">
          <el-input v-model="chargeForm.coupon" style="width: 50%" disabled ></el-input>
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
        <el-form-item>
          <el-button type="primary" @click="onSubmitCharge">提交</el-button>
          <el-button @click="dialogVisibleCharge = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    用户消费-->
    <el-dialog title="用户消费" :visible.sync="dialogVisibleCard" width="80%"
               v-loading="loading1"
               element-loading-text="提交中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="expenseForm" :model="expenseForm" label-width="90px">
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
          <el-button @click="dialogVisibleCard = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--    修改会员等级-->
    <el-dialog title="会员等级" :visible.sync="dialogVisibleGrade" width="50%">
      <el-form ref="gradeForm" :model="gradeForm" label-width="80px">
        <el-form-item label="会员等级">
          <el-select v-model="gradeForm.id" placeholder="请选择">
            <el-option
              v-for="item in options1"
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

    <!--    活动卡余额详情-->
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
        <el-table-column align="center" label="返现" width="120%">
          <template scope="scope">
            <el-button type="danger" v-if="scope.row.sendStatus === 3" size="mini" @click="eventStatus(scope.row)">需返现
            </el-button>
            <el-tag type="info" v-if="scope.row.sendStatus === 5" size="mini">已返现</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--    开发票-->
    <el-dialog title="发票" :visible.sync="dialogVisibleInvoice" width="80%">
      <div>
        <el-form style="padding: 16px">
          <el-row :gutter="24">
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
      <el-form ref="inForm" :model="inForm" label-width="90px">
        <el-form-item label="开票金额">
          <el-input v-model="inForm.amount" style="width: 50%" type="number"
                    :disabled="amount === 0 "
                    onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="inForm.summary" type="text" placeholder="此项可以不填" :disabled="amount === 0 "></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitInvoice" :disabled="amount === 0 ">提交</el-button>
          <el-button @click="dialogVisibleInvoice = false">取消</el-button>
        </el-form-item>
      </el-form>
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

    <!--    退卡-->
    <el-dialog title="退卡" :visible.sync="dialogVisibleBack" width="80%">
      <div>
        <el-form style="padding: 16px">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="总充值本金" style="color: #dd6161">
                <div>{{this.charge1}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总消费金额" style="color: #dd6161">
                <div>{{this.expense1}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总转赠金额" style="color: #dd6161">
                <div>{{this.send1}}</div>
              </el-form-item>
            </el-col>
          <el-col :span="6">
            <el-form-item label="需退还金额" style="color: #dd6161">
              <div>{{this.amount1}}</div>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </div>
      <el-form label-width="90px">
        <el-form-item>
          <el-button type="primary" @click="onSubmitBack" >退卡</el-button>
          <el-button @click="dialogVisibleBack = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import CDateItem from '../../components/CDateItem/index'
  import CPagination from '../../components/CPagination/index'
  import {
    getUserCardList1,
    cardInfo,
    expenseCard,
    chargeCard,
    addUserCard,
    cardEvent,
    getCardList1,
    getEventCardDetail,
    getEventCardStatus,
    getCardDetail,
    backCard
  } from '../../api/v3/userCard'
  import {getCardGradeList, updateUserGrade} from '../../api/v3/event'
  import {objKeySort} from "../../utils/validate";
  import { detailCardEvent } from "../../api/v3/event";
  import { addInvoice, getInvoice } from "../../api/v3/elCoupon";

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
    name: 'userCard',
    components: {CPagination, CDateItem},
    data() {
      return {
        explainOptions: [{value: '微信', label: '微信'}, {value: '支付宝', label: '支付宝'}, {value: '银行卡', label: '银行卡'},
          {value: '现金', label: '现金'}, {value: '其他', label: '其他'}],
        loading2: false,
        loading1: false,
        loading: false,
        loading3: false,
        dialogVisible: false,
        dialogVisibleInRe: false,
        dialogVisibleExpense: false,
        dialogVisibleBack: false,
        dialogVisibleGrade: false,
        dialogVisibleBalance: false,
        dialogVisibleInvoice: false,
        tableData: [],
        tableData1: [],
        tableData3: [],
        tableData4: [],
        tableData2: [],
        ruleForm: {
          cardNo: '',
          phone: '',
          title: '',
          storeName: ''
        },
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        totalCharge: '',
        totalInvoice: '',
        amount: '',
        dialogVisibleAdd: false,
        dialogVisibleCard: false,
        dialogVisibleCharge: false,
        form: {
          phone: '',
          cardId: '',
          password: ''
        },
        chargeForm: {
          recharge: '',
          send: '',
          eventId: '',
          explain: '',
          userId: '',
          cardId: '',
          coupon: ''
        },
        eventOptions: [],
        expenseForm: {
          expense: '',
          explain: '',
          userId: '',
          cardId: '',
          password: ''
        },
        inForm: {
          amount: '',
          summary: ''
        },
        options: [],
        gradeForm: {
          id: ''
        },
        options1: [],
        userId: '',
        cardId: '',
        type: '',
        capital1: '',
        send1: '',
        isExport: false,
        totalMoney: '',
        charge1: '',
        expense1: '',
        amount1: '',
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
        search.title = this.ruleForm.title
        search.storeName = this.ruleForm.storeName
        if (this.isExport) {
          search.isExport = 1
          downloadExcel(search, 'manage/v3/userCard/list_store', this.$store.state.user.token)
          this.isExport = false
          return
        }
        getUserCardList1(search).then(re => {
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
        getEventCardDetail({userId: this.userId, cardId: this.cardId}).then(re => {
          this.capital1 = re.data.data.capital1
          this.send1 = re.data.data.send1
          this.tableData1 = re.data.data.list
        })
      },
      eventStatus(row) {
        getEventCardStatus({storeMemberEventId: row.id}).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('操作成功')
            this.getCardDetail()
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 开卡
      add() {
        this.dialogVisibleAdd = true
        getCardList1({type: 1}).then(re => {
          this.options = re.data.data
        })
        this.form = {
          phone: '',
          cardId: '',
          password: ''
        }
      },
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
            this.getList()
            this.dialogVisibleAdd = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisibleAdd = false
          }
        })
      },
      // 用户消费
      expensehandle(row) {
        this.dialogVisibleCard = true
        this.expenseForm = {
          expense: '',
          explain: '',
          userId: '',
          cardId: '',
          password: ''
        }
        this.expenseForm.userId = row.userId
        this.expenseForm.cardId = row.cardId
      },
      onSubmitExpense() {
        this.loading1 = true
        const ex = {}
        ex.userId = this.expenseForm.userId
        ex.cardId = this.expenseForm.cardId
        if (!this.expenseForm.expense) {
          this.loading1 = false
          this.$message.error('请输入消费金额')
          return
        }
        if (!this.expenseForm.password) {
          this.loading1 = false
          this.$message.error('请输入会员卡密码')
          return
        }
        ex.expense = this.expenseForm.expense
        ex.password = new MD5().update(this.expenseForm.password).digest('hex').toUpperCase()
        ex.explain = this.expenseForm.explain
        expenseCard(ex).then(re => {
          this.loading1 = false
          if (re.data.errCode === 0) {
            this.$message.success('操作成功')
            this.getList()
            this.dialogVisibleCard = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisibleCard = false
          }
        }).catch(re => {
          this.loading1 = false
        })
      },
      // 充值记录
      charge(row) {
        this.dialogVisible = true
        cardInfo({userId: row.userId, cardId: row.cardId}).then(re => {
          this.tableData2 = re.data.data.charges
        })
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
      // 用户充值
      chargehandle(row) {
        this.dialogVisibleCharge = true
        this.chargeForm = {
          recharge: '',
          send: '',
          eventId: '',
          explain: '',
          userId: '',
          cardId: ''
        }
        this.chargeForm.userId = row.userId
        this.chargeForm.cardId = row.cardId
        cardEvent({cardId: row.cardId}).then(re => {
          this.eventOptions = re.data.data
        })
        this.type = row.type
      },
      onSubmitCharge() {
        this.loading = true
        const ch = {}
        ch.userId = this.chargeForm.userId
        ch.cardId = this.chargeForm.cardId
        if (this.chargeForm.recharge.length === 0) {
          this.loading = false
          this.$message.error('请输入充值金额')
          return
        }
        if (this.type === 11 && !this.chargeForm.eventId) {
          this.loading = false
          this.$message.error('活动卡充值必须选择活动')
          return
        }
        ch.recharge = this.chargeForm.recharge
        ch.send = this.chargeForm.send
        ch.explain = this.chargeForm.explain
        ch.eventId = this.chargeForm.eventId
        chargeCard(ch).then(re => {
          console.log(re,'wwwwwwww')
          this.loading = false
          if (re.data.errCode === 0) {
            this.$message.success('操作成功')
            this.getList()
            this.dialogVisibleCharge = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisibleCharge = false
          }
        }).catch(re => {
          this.loading = false
        })
      },
      // 消费记录
      expense(row) {
        this.dialogVisibleExpense = true
        cardInfo({userId: row.userId, cardId: row.cardId}).then(re => {
          this.tableData3 = re.data.data.expenses
        })
      },
      //等级
      updateGrade(row) {
        this.dialogVisibleGrade = true
        this.gradeForm.id = row.gradeId
        getCardGradeList({cardId: row.cardId}).then(re => {
          this.options1 = re.data.data
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
      // 发票
      invoicehandle(row){
        this.dialogVisibleInvoice = true
        this.inForm = {
          amount: '',
          summary: ''
        }
        this.userId = row.userId
        this.cardId = row.cardId
        getInvoice({userId: row.userId, cardId: row.cardId}).then(re => {
          this.totalInvoice = re.data.data.totalInvoice
          this.amount = re.data.data.amount
        })
      },
      onSubmitInvoice(){
        if (!this.inForm.amount){
          this.$message.error("请填写开票金额")
          return
        }
        const add = {}
        add.userId = this.userId
        add.cardId = this.cardId
        add.amount = this.inForm.amount
        add.summary = this.inForm.summary
        addInvoice(add).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getList()
            this.dialogVisibleInvoice = false
          } else {
            this.$message.error('添加失败!')
            this.dialogVisibleInvoice = false
          }
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
      //退卡
      backhandle(row){
        this.dialogVisibleBack = true
        this.userId = row.userId
        this.cardId = row.cardId
        getCardDetail({userId: row.userId, cardId: row.cardId}).then(re => {
          this.charge1 = re.data.data.charge
          this.expense1 = re.data.data.expense
          this.amount1 = re.data.data.amount
          this.send1 = re.data.data.send
        })
      },
      onSubmitBack(){
        this.$confirm('你确定要退卡吗?')
          .then(_ => {
            this.loading3 = true
            backCard({userId: this.userId, cardId: this.cardId,
              capital:this.capital1,send: this.send1}).then(re => {
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.loading3 = false
                this.dialogVisibleBack = false
                this.getList()
              } else {
                this.loading3 = false
                this.dialogVisibleBack = false
                this.$message.error(re.data.msg)
              }
            }).catch(_ => {
            })
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
