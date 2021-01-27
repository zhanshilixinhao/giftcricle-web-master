<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="25">
            <el-col :span="5">
              <el-form-item label="套餐名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="套餐名称" type="text" style="width: 194px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="套餐副标题" prop="subhead">
                <el-input v-model="ruleForm.subhead" placeholder="套餐副标题" type="text" style="width: 194px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="套餐状态" prop="isaudit">
                <el-select v-model="ruleForm.isaudit" placeholder="请选择" icon="el-icon-search">
                  <el-option
                    v-for="item in isauditOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="排序" prop="selectedOptions">
                <el-cascader
                  expand-trigger="hover"
                  :options="options"
                  v-model="ruleForm.selectedOptions"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="float: right">
            <el-col :span="6">
              <el-form-item prop="date">
                <el-button type="primary" @click="handleSearch()">搜索</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="date">
                <el-button type="primary" @click="resetForm('ruleForm')" >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加套餐</el-button>
      </el-card>
    </div>
    <br/>
    <el-table
      :data="tableData3"
      stripe
      border>
      <el-table-column
        type="index"
        width="70px"
        label="序号">
      </el-table-column>
      <el-table-column width="100" label="封面图片">
        <template scope="scope">
          <el-popover trigger="click" placement="top">
            <img
              :src="'static/' + scope.row.cover"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="'static/' + scope.row.cover"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="isaudit"
        width="100px"
        label="审核状态">
        <template scope="scope">
          <el-button v-if="scope.row.isaudit === 0"
                     size="small" type="danger">未审核</el-button>
          <el-button v-if="scope.row.isaudit === 1"
                     size="small" type="success">已审核</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="套餐名称"
        width="550px">
      </el-table-column>
      <el-table-column
        prop="subhead"
        label="套餐副标题"
        width="300px">
      </el-table-column>
      <el-table-column
        prop="price"
        width="100px"
        label="门市价">
      </el-table-column>
      <el-table-column
        prop="magicbeans"
        width="100px"
        label="所需优豆">
      </el-table-column>
      <el-table-column
        prop="canusehours"
        width="100px"
        label="可用时长">
      </el-table-column>
      <el-table-column
        prop="salescount"
        width="100px"
        label="套餐销量">
      </el-table-column>
      <el-table-column
        prop="stock"
        width="100px"
        label="库存">
      </el-table-column>
      <el-table-column
        prop="endtime"
        label="套餐截止时间"
        width="180px"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        width="180px"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="updatetime"
        label="修改时间"
        width="180px"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作"width="100px">
        <template scope="scope">
          <el-button
            icon="edit"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">修改
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
  import { listApi, delPartnerApi } from '@/api/gift/item/itemCate'

  var moment = require('moment')
  var common = [{ value: 0, label: '高到低排序' }, { value: 1, label: '低到高排序' }]
  export default {
    components: { ElRow },
    data() {
      return {
        createdOptions: [{ value: '', label: '无时间排序' }, { value: 0, label: '高到低排序' }, { value: 1, label: '低到高排序' }],
        isauditOptions: [{ value: '', label: '请选择' }, { value: 0, label: '未审核' }, { value: 1, label: '已审核' }],
        options: [{
          value: 'price',
          label: '价格',
          children: common
        }, {
          value: 'sales',
          label: '销量',
          children: common
        }, {
          value: 'canusehours',
          label: '可用时长',
          children: common
        }, {
          value: 'magicbeans',
          label: '所需优豆',
          children: common
        }, {
          value: 'stock',
          label: '库存',
          children: common
        }, {
          value: 'endtime',
          label: '套餐截止时间',
          children: common
        }, {
          value: 'date',
          label: '创建时间',
          children: common
        }],
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          selectedOptions: '',
          name: '',
          isaudit: '',
          subhead: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加套餐
      add() {
        this.$router.push('/partnerServer/chargePackageAdd')
      },
      // 搜索套餐
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取套餐列表
      getList() {
        var search = {}
        search.name = this.ruleForm.name
        search.subhead = this.ruleForm.subhead
        search.isaudit = this.ruleForm.isaudit
        search.partnerid = '58748a5fb3278014bc58e03b'
        if (this.ruleForm.selectedOptions[0] === 'price') {
          search.price = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'sales') {
          search.sales = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'canusehours') {
          search.canusehours = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'magicbeans') {
          search.magicbeans = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'date') {
          search.date = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'stock') {
          search.stock = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'endtime') {
          search.endtime = this.ruleForm.selectedOptions[1]
        }
        listApi(this.pageNum, this.pageSize, search).then(re => {
          this.tableData3 = re.data.data.data
          this.total = re.data.data.total
          this.currentPages2 = re.data.data.pageNum
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
      // 编辑平台商
      handleEdit(index, row) {
        this.$router.push('/partnerServer/chargePackageEdit/' + row.id)
        // this.$router.push({ path: '/auction/edit/', query: { itemAuctionId: row.itemAuctionId, auctionId: row.auctionId }})
      },
      // 删除平台商
      handleDelete(index, row) {
        this.$confirm('你确定要删除该平台商吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delPartnerApi(row.id).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: '恭喜你，平台商删除成功！',
                  type: 'success'
                })
                for (var i in this.tableData3) {
                  if (this.tableData3[i].id === row.id) {
                    this.tableData3.splice(i, 1)
                    break
                  }
                }
              }
              if (re.data.errCode === 1) {
                this.$message.error(re.data.data)
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
