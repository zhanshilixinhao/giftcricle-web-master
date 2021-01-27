<template>
  <div class="app-container" v-loading="loading2" element-loading-text="加载中">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户昵称">
            <el-input v-model="form.username" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-Item label="用户头像" prop="avatar">
            <div>
              <img :src="form.avatar" class="cover"/>
            </div>
          </el-form-Item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户角色">
            <el-input v-model="form.role" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="账户余额">
            <el-input v-model="form.totalAmount" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="提现记录">
            <el-button type="success" size="small" @click="checkHandle()">查看</el-button>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作">
            <el-button type="primary" size="small" @click="withdrawHandle()">提现</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <!--提现记录-->
    <el-dialog title="提现记录列表" :visible.sync="dialogVisible" width="80%" size="tiny">
      <el-table
        :data="tableData3"
        stripe
        border>
        <el-table-column
          type="index"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          width="110"
          label="提现状态">
          <template scope="scope">
            <el-tag v-if="scope.row.status === 1"
                    size="small" type="danger">申请提现
            </el-tag>
            <el-tag v-if="scope.row.status === 2"
                    size="small" type="success">开始处理
            </el-tag>
            <el-tag v-if="scope.row.status === 3"
                    size="small" type="success">提现成功
            </el-tag>
            <el-tag v-if="scope.row.status === 4"
                    size="small" type="success">提现失败
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="bankName"
          label="银行名称"
          show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="depositBank"
          label="开户行"
          align="center"
          width="80%">
        </el-table-column>
        <el-table-column
          prop="cardHolder"
          label="持卡人姓名"
          align="center"
          width="155%">
        </el-table-column>
        <el-table-column
          prop="cardNo"
          label="银行卡号"
          align="center"
          width="155%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="describe"
          show-overflow-tooltip="true"
          label="提现说明">
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          align="center"
          width="155%"
          :formatter="dateFormat">
        </el-table-column>
      </el-table>
      <div class="block" style="width: 100%;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next, total, jumper"
          :total="total">
        </el-pagination>
      </div>

    </el-dialog>


    <!--提现-->
    <el-dialog title="提现" :visible.sync="addDialogVisible" width="60%" size="tiny">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="addForm.bankName"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="depositBank">
          <el-input v-model="addForm.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="持卡人姓名" prop="cardHolder">
          <el-input v-model="addForm.cardHolder"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="cardNo">
          <el-input v-model="addForm.cardNo"></el-input>
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <el-input v-model="addForm.amount" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="submitForm('addForm')">提现</el-button>
          <el-button @click="addDialogVisible = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>


<script>
  import { getAdminWalletDetail, addWithRecord, sysWithdrawRecord } from '../../api/gift/coupon/wallet'

  var moment = require('moment')
  export default {
    data() {
      return {
        loading2: false,
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData3: [],
        dialogVisible: false,
        addDialogVisible: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        amount: '',
        form: {
          username: '',
          avatar: '',
          role: '',
          totalAmount: ''
        },
        addForm: {
          bankName: '',
          depositBank: '',
          cardHolder: '',
          cardNo: '',
          amount: ''
        },
        rules: {
          bankName: [
            { required: true, message: '请输入银行名称', trigger: 'blur' }],
          depositBank: [
            { required: true, message: '请输入开户行', trigger: 'blur' }
          ],
          cardHolder: [
            { required: true, message: '请输入持卡人姓名', trigger: 'blur' }
          ],
          cardNo: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入提现金额', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      // 获取详情
      getDetail() {
        getAdminWalletDetail().then(re => {
          this.form.username = re.data.data.username
          this.form.avatar = this.pictureUrl + re.data.data.avatar
          this.form.role = re.data.data.name
          this.form.totalAmount = re.data.data.totalAmount
        })
      },
      // 提现记录
      getList() {
        sysWithdrawRecord({ pageNum: this.pageNum, pageSize: this.pageSize }).then(re => {
          this.tableData3 = re.data.data
          this.total = re.data.total
        })
      },
      // 查看提现记录
      checkHandle() {
        this.dialogVisible = true
        this.getList()
      },
      // 提现
      withdrawHandle() {
        this.addDialogVisible = true
        this.addForm = {
          bankName: '',
          depositBank: '',
          cardHolder: '',
          cardNo: '',
          amount: ''
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.add()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 添加提现
      add() {
        var wallet = {}
        wallet.bankName = this.addForm.bankName
        wallet.depositBank = this.addForm.depositBank
        wallet.cardHolder = this.addForm.cardHolder
        wallet.cardNo = this.addForm.cardNo
        wallet.amount = this.addForm.amount
        addWithRecord(wallet).then(re => {
          this.addDialogVisible = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
          } else {
            this.$message.error(re.data.msg)
          }
          this.addDialogVisible = false
        }).catch(_ => {
          this.addDialogVisible = false
        })
      },
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        console.log('bb', date)
        console.log('cc', column.property)
        if (date === undefined || date === null) {
          return ''
        }
        console.log('a', moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss'))
        // moment(date).format('YYYY-MM-DD HH:mm:ss')
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 调整每页显示的行数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.pageNum = 1
        this.getList()
      },
      // 调整分页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .cover {
    width: 60px;
    height: 60px;
  }
</style>
