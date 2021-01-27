<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="虚拟商品名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="虚拟商品名称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="虚拟商品分类" prop="category">
                <el-select v-model="ruleForm.category" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="虚拟商品品牌" prop="brand">
                <el-select v-model="ruleForm.brand" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in brandOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="selectedOptions">
                <el-cascader
                  style="width: 100%"
                  expand-trigger="hover"
                  :options="options"
                  v-model="ruleForm.selectedOptions"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品状态" prop="status">
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
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加虚拟商品</el-button>
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
        prop="status"
        align="center"
        width="155%"
        label="商品状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                     size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 1"
                     size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        width="300%"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        align="center"
        width="155%"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="cateId"
        align="center"
        width="155%"
        label="商品分类"
        :formatter="typeFormat">
      </el-table-column>
      <el-table-column
        prop="brandId"
        align="center"
        width="155%"
        label="商品品牌"
        :formatter="brandFormat">
      </el-table-column>
      <el-table-column
        prop="sales"
        align="center"
        width="155%"
        label="商品销量">
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        width="155%"
        label="排序值">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="基本操作" align="center" width="250px">
        <template scope="scope">
          <el-button v-if="scope.row.status == 1"
           size="mini"
           type="danger"
           icon="close"
           @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.status == 2"
           size="mini"
           type="success"
           icon="check"
           @click="handleStatus(scope.$index, scope.row)">启用
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="edit"
            @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="delete"
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
  import { getVirItemList, changeStatus, delVirItemApi } from '@/api/gift/virItem/virItem'
  import { getAllVirItemBrand } from '@/api/gift/virItem/virItemBrand'
  import { getAllItemCate } from '@/api/gift/virItem/virItemCate'

  var moment = require('moment')
  var common = [{ value: 0, label: '高到低排序' }, { value: 1, label: '低到高排序' }]
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        categoryOptions: [],
        brandOptions: [],
        options: [{
          value: 'price',
          label: '商品价格',
          children: common
        }, {
          value: 'sales',
          label: '商品销量',
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
          brand: '',
          category: '',
          name: '',
          status: ''
        }
      }
    },
    mounted() {
      var permisId = 1096
      getAllItemCate(permisId).then(re => {
        this.categoryOptions = re.data.data
      })
      var permissionId = 1097
      getAllVirItemBrand(permissionId).then(re => {
        this.brandOptions = re.data.data
      })
      this.getList()
    },
    methods: {
      // 添加商品
      add() {
        this.$router.push('/virtualItem/add')
      },
      // 搜索商品
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商品列表
      getList() {
        var search = {}
        search.name = this.ruleForm.name
        search.category = this.ruleForm.category
        search.brand = this.ruleForm.brand
        search.status = this.ruleForm.status
        if (this.ruleForm.selectedOptions[0] === 'price') {
          search.price = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'sales') {
          search.sales = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'date') {
          search.date = this.ruleForm.selectedOptions[1]
        }
        this.loading2 = true
        getVirItemList(this.pageNum, this.pageSize, search).then(re => {
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
      // 商品分类格式化
      typeFormat: function(row, column) {
        var type = row[column.property]
        for (var i = 0; i < this.categoryOptions.length; i++) {
          if (this.categoryOptions[i].id === type) {
            return this.categoryOptions[i].name
          }
        }
        return ''
      },
      // 商品品牌格式化
      brandFormat: function(row, column) {
        var brand = row[column.property]
        for (var i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].id === brand) {
            return this.brandOptions[i].name
          }
        }
        return ''
      },
      // 改变商品状态
      handleStatus(index, row) {
        var status = row.status
        if (status === 1) {
          status = 2
        } else {
          status = 1
        }
        changeStatus(row.id, status).then(re => {
          if (re.data.errCode !== 0) {
            this.$message.error(re.data.msg)
          } else {
            this.getList()
          }
        })
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
      // 编辑商品
      handleEdit(index, row) {
        this.$router.push('/virtualItem/edit/' + row.id)
      },
      // 删除商品
      handleDelete(index, row) {
        this.$confirm('你确定要删除该商品吗?')
          .then(_ => {
            this.loading2 = true
            delVirItemApi(row.id).then(re => {
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
