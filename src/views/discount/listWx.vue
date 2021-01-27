<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding:'12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="收款人姓名" prop="cardHolder">
                <el-input v-model="ruleForm.cardHolder" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折现类型" prop="type">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="折现状态" prop="status">
                <el-select v-model="ruleForm.status" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
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
          <el-row style="float: right">
            <el-form-item prop="date">
              <el-button type="primary" @click="handleSearch()">搜索</el-button>
              <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
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
        type="index"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称"
        show-overflow-tooltip="true"
        width="155%"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        width="155%"
        label="用户电话">
      </el-table-column>

      <el-table-column
        prop="title"
        align="center"
        width="155%"
        label="商品标题">
      </el-table-column>

      <el-table-column
        prop="price"
        align="center"
        width="110%"
        label="商品价格">
      </el-table-column>

      <el-table-column
        prop="amount"
        align="center"
        width="110%"
        label="折后价格(提现金额)">
      </el-table-column>
      <el-table-column
        align="center"
        porp="status"
        width="120%"
        label="折现状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 3"
                  size="small" type="danger">折现失败</el-tag>
          <el-tag v-if="scope.row.status === 2"
                  size="small" type="success">折现成功</el-tag>
          <el-tag v-if="scope.row.status === 1"
                  size="small" type="primary">申请折现</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cardHolder"
        width="110%"
        label="收款人姓名">
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
        prop="depositBank"
        width="150%"
        show-overflow-tooltip="true"
        label="开户行">
      </el-table-column>
      <el-table-column
        prop="type"
        align="center"
        width="100%"
        label="折现类型">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 1" type="success">支付宝</el-tag>
          <el-tag v-if="scope.row.type === 2" type="primary">银行卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cardNo"
        width="190%"
        label="银行卡号/支付宝账号">
      </el-table-column>

      <el-table-column
        prop="created"
        label="申请时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="240%">
        <template scope="scope">
          <el-button v-if="scope.row.status === 1" size="mini" type="primary"
                     @click="handleStatus(scope.$index, scope.row, 2)">处理成功</el-button>
          <el-button v-if="scope.row.status === 1" size="mini" type="danger" @click="handleStatus(scope.$index, scope.row, 3)">处理失败</el-button>
          <el-button v-if="scope.row.status !== 1" size="mini" type="danger"  @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
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


  </div>
</template>

<script>
  import { getWxDiscountList, deleteWxDiscount, handleWXDiscount } from '../../api/gift/discount/wxDiscount'

  var moment = require('moment')
  export default {
    data() {
      return {
        typeOptions: [{ value: '', name: '请选择' }, { value: 1, name: '支付宝' }, { value: 2, name: '银行卡' }],
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '申请折现' }, { value: 2, name: '折现成功' }, { value: 3, name: '折现失败' }],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          cardHolder: '',
          type: '',
          status: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      getList() {
        this.loading2 = true
        getWxDiscountList({ pageNum: this.pageNum, pageSize: this.pageSize, cardHolder: this.ruleForm.cardHolder,
          type: this.ruleForm.type, status: this.ruleForm.status }).then(re => {
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
      // 处理
      handleStatus(index, row, active) {
        this.$confirm('你确定处理吗?')
          .then(_ => {
            this.loading2 = true
            handleWXDiscount({ id: row.id, status: active }).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message.error(re.data.msg)
              }
            }).catch(_ => {
              this.loading2 = false
            })
          })
      },
      // 删除订单
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            deleteWxDiscount({ id: row.id }).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message.error(re.data.msg)
              }
            }).catch(_ => {
              this.loading2 = false
            })
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
