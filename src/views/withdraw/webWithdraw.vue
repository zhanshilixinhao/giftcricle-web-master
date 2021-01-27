<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商家昵称" prop="username">
                <el-input v-model="ruleForm.username" placeholder="商家昵称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请状态" prop="status">
                <el-select v-model="ruleForm.status" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  style="float: right">
            <el-form-item prop="date">
              <el-button type="primary" @click="handleSearch()">搜索</el-button>
              <el-button type="primary" @click="resetForm('ruleForm')" >重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
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
        porp="status"
        width="120%"
        label="提现状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 4"
                     size="small" type="danger">提现失败</el-tag>
          <el-tag v-if="scope.row.status === 3"
                     size="small" type="success">提现成功</el-tag>
          <el-tag v-if="scope.row.status === 2"
                     size="small">处理中</el-tag>
          <el-tag v-if="scope.row.status === 1"
                     size="small">申请提现</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="describes"
        show-overflow-tooltip="true"
        label="提现说明">
      </el-table-column>
      <el-table-column
        align="center"
        prop="username"
        width="110%"
        show-overflow-tooltip="true"
        label="商家昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        width="110%"
        show-overflow-tooltip="true"
        label="商家电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cardHolder"
        width="110%"
        label="持卡人姓名">
      </el-table-column>
      <el-table-column
        align="center"
        prop="bankName"
        width="110%"
        show-overflow-tooltip="true"
        label="银行名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cardNo"
        width="190%"
        label="银行卡号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="depositBank"
        width="150%"
        show-overflow-tooltip="true"
        label="开户行">
      </el-table-column>
      <el-table-column
        align="center"
        prop="amount"
        width="100%"
        label="提现金额">
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        label="申请时间"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updated"
        label="处理时间"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="200%">
        <template scope="scope">
          <el-button v-if="scope.row.status === 1"
            size="mini"
            type="success"
            @click="handleBegin(scope.$index, scope.row, 2)">开始处理
          </el-button>
          <el-button v-if="scope.row.status === 2"
             size="mini"
             type="primary"
             @click="handleWithdraw(scope.$index, scope.row,3)">处理成功
          </el-button>
          <el-button v-if="scope.row.status === 2"
             size="mini"
             type="danger"
             @click="handleWithdraw(scope.$index, scope.row, 4)">处理失败
          </el-button>
          <!--<el-button v-if="scope.row.status !== 1"
             size="mini"
             type="info">已处理
          </el-button>-->
          <span v-if="scope.row.status === 3 || scope.row.status === 4">已处理</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="width: 100%;float: right;margin-top: 16px;margin-bottom: 16px">
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
    <el-dialog title="修改提现说明" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="messageForm">
        <el-form-item label="提现说明">
          <el-input  v-model="messageForm.describe" placeholder="提现失败或体现成功的说明">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import { getMerchantsWithdrawList, handleUserWithdraw, handleBeginWithdraw } from '../../api/gift/coupon/wallet'

  var moment = require('moment')
  var status = null
  var id = null
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '申请提现' }, { value: 2, name: '处理中' }, { value: 2, name: '提现成功' }, { value: 3, name: '提现失败' }],
        bankOptions: [],
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          status: '',
          username: ''
        },
        dialogVisible: false,
        messageForm: {
          describe: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 开始处理操作
      handleBegin(index, row) {
        handleBeginWithdraw({ id: row.id }).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 处理成功失败操作
      handleWithdraw(index, row, active) {
        this.dialogVisible = true
        status = active
        id = row.id
      },
      // 添加通知系统取消
      addBack() {
        this.dialogVisible = false
      },
      // 添加通知系统提交
      addSubmit() {
        if (this.messageForm.describe.trim() === '') {
          this.$message.error('请填写提现说明!')
          return
        }
        if (status == null || id == null) {
          this.$message.error('请选择处理方式!')
          return
        }
        var user = {}
        user.id = id
        user.status = status
        user.describe = this.messageForm.describe
        handleUserWithdraw(user).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取用户提现列表
      getList() {
        this.loading2 = true
        getMerchantsWithdrawList({ pageNum: this.pageNum, pageSize: this.pageSize,
          username: this.ruleForm.username, status: this.ruleForm.status }).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        if (date === undefined || date === null) {
          return ''
        }
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
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
