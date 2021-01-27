<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="ruleForm.nickname" placeholder="用户昵称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="用户电话" type="text" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="订单号" prop="orderNo">
                <el-input v-model="ruleForm.orderNo" placeholder="订单号" type="text" ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="类型" prop="status">
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
              <el-form-item label="订单状态" prop="status">
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
            <el-col :span="12">
              <el-form-item label="支付方式" prop="payWay">
                <el-select v-model="ruleForm.payWay" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
                  <el-option
                    v-for="item in payWayOptions"
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
        prop="sellNickname"
        label="卖家昵称"
        show-overflow-tooltip="true"
        width="155%"
        align="center">
      </el-table-column>

      <el-table-column
        prop="sellPhone"
        align="center"
        width="155%"
        label="卖家电话">
      </el-table-column>

      <el-table-column
        prop="orderNo"
        align="center"
        width="155%"
        label="订单号">
      </el-table-column>

      <el-table-column
        prop="title"
        align="center"
        width="155%"
        label="商品名称">
      </el-table-column>

      <el-table-column width="110%" label="封面图片" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.cover"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.cover"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="price"
        align="center"
        width="110%"
        label="单价">
      </el-table-column>

      <el-table-column
        prop="quantity"
        align="center"
        width="110%"
        label="数量">
      </el-table-column>

      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>

      <el-table-column
        prop="updated"
        label="修改时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>

      <el-table-column
        prop="type"
        align="center"
        width="80%"
        label="类型">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 1" type="success">商品</el-tag>
          <el-tag v-if="scope.row.type === 3" type="info">优惠券</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="payWay"
        align="center"
        width="80%"
        label="支付方式">
        <template scope="scope">
          <el-tag v-if="scope.row.payWay === 80" type="success">微信</el-tag>
          <el-tag v-if="scope.row.payWay === -114" type="info">支付宝</el-tag>
          <el-tag v-if="scope.row.payWay === -47" type="primary">余额</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        align="center"
        width="80%"
        label="订单状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2" type="success">已支付</el-tag>
          <el-tag v-if="scope.row.status === 1" type="danger">未支付</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning">已取消</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120%">
        <template scope="scope">
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
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
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import { getConItemList, delConItemList } from '@/api/order/conItemOrder'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '未支付' }, { value: 2, name: '已支付' }, { value: 3, name: '已取消' }],
        payWayOptions: [{ value: '', name: '请选择' }, { value: 80, name: '微信' }, { value: -114, name: '支付宝' }, { value: -47, name: '余额' }],
        typeOptions: [{ value: '', name: '请选择' }, { value: 1, name: '商品' }, { value: 3, name: '优惠券' }],
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData3: [{ nickname: '查出', phone: '', orderNo: 232131, amount: 0.01, payWay: '1', status: 1 }],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          nickname: '',
          phone: '',
          orderNo: '',
          type: '',
          status: '',
          payWay: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // // 添加用户
      // add() {
      //   this.$router.push('/item/add')
      // },
      // 搜索用户
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取订单列表
      getList() {
        var search = {}
        search.nickname = this.ruleForm.nickname
        search.status = this.ruleForm.status
        search.payWay = this.ruleForm.payWay
        search.phone = this.ruleForm.phone
        search.orderNo = this.ruleForm.orderNo
        search.type = this.ruleForm.type
        this.loading2 = true
        search.pageNum = this.pageNum
        search.pageSize = this.pageSize
        getConItemList(search).then(re => {
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
      // 用户性别格式化
      // genderFormat: function(row, column) {
      //   var type = row[column.property]
      //   for (var i = 0; i < this.genderOptions.length; i++) {
      //     if (this.genderOptions[i].value === type) {
      //       return this.genderOptions[i].name
      //     }
      //   }
      //   return ''
      // },

      // 改变用户状态
      // handleStatus(index, row) {
      //   var status = row.status
      //   if (status === 1) {
      //     status = 2
      //   } else {
      //     status = 1
      //   }
      //   changeStatus(row.id, status).then(re => {
      //     if (re.data.errCode !== 0) {
      //       this.$message.error('设置失败')
      //     } else {
      //       this.getList()
      //     }
      //   })
      // },
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
      // 删除订单
      handleDelete(index, row) {
        this.$confirm('你确定要删除该订单吗?')
          .then(_ => {
            this.loading2 = true
            delConItemList(row.id).then(re => {
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


