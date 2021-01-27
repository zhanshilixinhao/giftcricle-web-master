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
    <!--<div>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加用户</el-button>
      </el-card>
    </div>-->
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
        align="center"
        width="155%">
      </el-table-column>

      <el-table-column
        prop="phone"
        align="center"
        label="用户电话"
        width="155%">
      </el-table-column>

      <el-table-column
        prop="orderNo"
        align="center"
        label="订单号"
        width="155%">
      </el-table-column>

      <el-table-column
        prop="title"
        align="center"
        label="商品标题"
        width="155%">
      </el-table-column>

      <el-table-column property="cover" label="封面图片"  align="center" width="155%">
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
        label="价格"
        width="110%">
      </el-table-column>

      <el-table-column
        prop="quantity"
        align="center"
        label="数量"
        width="110%">
      </el-table-column>

      <el-table-column label="收货信息" align="center" width="140%">
        <template scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="getReceive(scope.$index, scope.row)">收货信息
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        label="订单状态"
        width="100%">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 1" type="danger">待发货</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">已发货</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning">已收货</el-tag>
          <el-tag v-if="scope.row.status === 4" type="primary">已评价</el-tag>
          <el-tag v-if="scope.row.status === 5" type="info">已取消</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="物流信息" align="center" width="140%">
        <template scope="scope">
          <el-button
            v-if="scope.row.status === 1"
            size="small"
            type="success">未发货
          </el-button>
          <el-button
            v-if="scope.row.status !== 1"
            size="small"
            type="primary"
            @click="getLogistics(scope.$index, scope.row)">物流详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="平台商"
        align="center"
        width="130%"/>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        :formatter="dateFormat"
        width="155%">
      </el-table-column>

      <!--<el-table-column-->
        <!--prop="updated"-->
        <!--label="修改时间"-->
        <!--align="center"-->
        <!--:formatter="dateFormat"-->
        <!--width="155%">-->
      <!--</el-table-column>-->



      <el-table-column label="操作" align="center" fixed="right" width="250%">
        <template scope="scope">
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button  v-if="scope.row.status === 1" size="small" type="primary" @click="submitDialog(scope.$index, scope.row)">发货</el-button>
          <el-button  v-if="scope.row.status !==1" size="small" type="success" @click="update(scope.$index, scope.row)">修改物流信息</el-button>
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

    <el-dialog title="收货信息" :visible.sync="dialogTableVisible" width="80%">
    <el-form :label-position="top" label-width="100px" :model="formLabelAlign">
      <el-form-item label="收件人">
        <el-input v-model="formLabelAlign.consigneeName" disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收件人电话">
        <el-input v-model="formLabelAlign.phone" disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="收货地区">
        <el-input v-model="formLabelAlign.address" disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="formLabelAlign.addressDetail" disabled="true" ></el-input>
      </el-form-item>
    </el-form>
    </el-dialog>

    <el-dialog title="物流详情" :visible.sync="dialogTableVisible1" width="80%">
      <el-form :label-position="top" label-width="100px" :model="formLabelAlign">
        <el-form-item label="快递公司">
          <el-input v-model="formLabelAlign.expressCompany" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="formLabelAlign.expressNo" disabled="true"></el-input>
        </el-form-item>
        <el-table
          :data="gridData">
          <el-table-column property="time" label="到达时间" width="230"></el-table-column>
          <el-table-column property="context" label="详情" ></el-table-column>
        </el-table>
    </el-form>
    </el-dialog>

    <el-dialog title="填写快递信息" :visible.sync="clickShipments" >
      <div style="color: #f56c6c">注意：填写错误将无法查看物流信息</div>
      <br>
      <el-form :model="shipmentsForm" :rules="rules">
        <el-form-item label="快递公司" label-width="120px" prop="expressCompany">
          <el-input v-model="shipmentsForm.expressCompany" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司代码" label-width="120px" prop="com">
          <el-input v-model="shipmentsForm.com" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" label-width="120px" prop="expressNo">
          <el-input v-model="shipmentsForm.expressNo" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clickShipments = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="修改快递信息" :visible.sync="updateLogistics" >
      <div style="color: #f56c6c">注意：填写错误将无法查看物流信息</div>
      <br>
      <el-form :model="logisticsForm" :rules="rules">
        <el-form-item label="快递公司" label-width="120px" prop="expressCompany">
          <el-input v-model="logisticsForm.expressCompany" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司代码" label-width="120px" prop="com">
          <el-input v-model="logisticsForm.com" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" label-width="120px" prop="expressNo">
          <el-input v-model="logisticsForm.expressNo" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateLogistics = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit1()">修 改</el-button>
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
  import { getReItemOrder, delReItemOrder, receiveInfo, logisticsInfo, shipments, updateLogistics } from '@/api/order/reItemOrder'
  // import index from "../../router";

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '待发货' }, { value: 2, name: '已发货' },
          { value: 3, name: '已收货' }, { value: 4, name: '已评价' }, { value: 5, name: '已取消' }],
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData3: [{ nickname: '查出', phone: '', orderNo: 232131, amount: 0.01, payWay: '80', status: 1 }],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        dialogTableVisible: false,
        dialogTableVisible1: false,
        orderId: 0,
        id: '',
        ruleForm: {
          nickname: '',
          phone: '',
          orderNo: '',
          status: ''
        }, labelPosition: 'right',
        formLabelAlign: {
          consigneeName: '',
          phone: '',
          address: '',
          addressDetail: '',
          expressCompany: '',
          expressNo: ''
        },
        gridData: [{
          time: '',
          context: ''
        }],
        clickShipments: false,
        shipmentsForm: {
          expressCompany: '',
          com: '',
          expressNo: ''
        },
        updateLogistics: false,
        logisticsForm: {
          expressCompany: '',
          com: '',
          expressNo: ''
        },
        rules: {
          expressCompany: [
            { required: true, message: '请输入快递公司' }
          ],
          com: [
            { required: true, message: '请输入公司代码' }
          ],
          expressNo: [
            { required: true, message: '请输入快速单号' }
          ]
        }
      }
    },
    mounted() {
      this.getList()
      this.$store.getters.sidebar.reCount = 0
    },
    methods: {
      // 添加用户
      add() {
        this.$router.push('/item/add')
      },
      // 搜索用户
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取用户列表
      getList() {
        var search = {}
        search.nickname = this.ruleForm.nickname
        search.status = this.ruleForm.status
        search.phone = this.ruleForm.phone
        search.orderNo = this.ruleForm.orderNo
        this.loading2 = true
        search.pageNum = this.pageNum
        search.pageSize = this.pageSize
        getReItemOrder(search).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 获取收货信息
      getReceive(index, row) {
        var rec = {}
        rec.consigneeName = this.formLabelAlign.consigneeName
        rec.phone = this.formLabelAlign.phone
        rec.address = this.formLabelAlign.address
        rec.addressDetail = this.formLabelAlign.addressDetail
        this.dialogTableVisible = true
        console.log('探测')
        receiveInfo(row.id).then(re => {
          // this.dialogTableVisible = false
          this.formLabelAlign = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 获取物流信息
      getLogistics(index, row) {
        this.dialogTableVisible1 = true
        console.log('探测')
        logisticsInfo(row.id).then(re => {
          // this.dialogTableVisible = false
          this.formLabelAlign = re.data.data.logisticsInfoVo
          this.logisticsForm = re.data.data.logisticsInfoVo
          this.gridData = re.data.data.logisticsDetail
        })
      },
      // 点击发货
      submitDialog(index, row) {
        this.shipmentsForm.expressCompany = ''
        this.shipmentsForm.com = ''
        this.shipmentsForm.expressNo = ''
        this.orderId = row.id
        this.clickShipments = true
      },
      onSubmit() {
        var search = {}
        search.expressCompany = this.shipmentsForm.expressCompany
        if (this.shipmentsForm.expressCompany == null) {
          this.$message.error('快递公司必须填写')
          return
        }
        search.id = this.orderId
        search.com = this.shipmentsForm.com
        if (this.shipmentsForm.com == null) {
          this.$message.error('快递公司代码必须填写')
          return
        }
        search.expressNo = this.shipmentsForm.expressNo
        if (this.shipmentsForm.expressNo == null) {
          this.$message.error('快递单号必须填写')
          return
        }
        this.loading2 = true
        search.pageNum = this.pageNum
        search.pageSize = this.pageSize
        shipments(search).then(re => {
          this.loading2 = false
          this.clickShipments = false
          this.$message.success('发货成功')
          this.getList()
        })
          .catch(() => {
            this.loading2 = false
          })
      },
      // 修改物流信息
      update(index, row) {
        this.id = row.id
        logisticsInfo(row.id).then(re => {
          this.updateLogistics = true
          this.logisticsForm = re.data.data.logisticsInfoVo
        })
      },
      onSubmit1() {
        var search = {}
        search.expressCompany = this.logisticsForm.expressCompany
        if (this.logisticsForm.expressCompany == null) {
          this.$message.error('快递公司必须填写')
          return
        }
        search.id = this.id
        search.com = this.logisticsForm.com
        if (this.logisticsForm.com == null) {
          this.$message.error('快递公司代码必须填写')
          return
        }
        search.expressNo = this.logisticsForm.expressNo
        if (this.logisticsForm.expressNo == null) {
          this.$message.error('快递单号必须填写')
          return
        }
        this.loading2 = true
        updateLogistics(search).then(re => {
          this.loading2 = false
          this.updateLogistics = false
          this.$message.success('修改物流信息成功！')
          this.getList()
        })
          .catch(() => {
            this.loading2 = false
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
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            delReItemOrder(row.id).then(re => {
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

