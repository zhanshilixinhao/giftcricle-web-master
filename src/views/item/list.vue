<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="商品标题" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品品牌" prop="brand">
                <el-select v-model="ruleForm.brand" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in brandOptions"
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
              <el-form-item label="商品一级分类" prop="category">
                <el-select v-model="ruleForm.category" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品二级分类" prop="sCategory">
                <el-select v-model="ruleForm.sCategory" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
                  <el-option
                    v-for="item in categoryOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!--                <el-cascader-->
                <!--                  expand-trigger="hover"-->
                <!--                  :options="categoryOptions"-->
                <!--                  :props="itemProps"-->
                <!--                  v-model="ruleForm.category"-->
                <!--                  placeholder="请选择"-->
                <!--                  style="width: 50%"-->
                <!--                  @change="handleChange">-->
                <!--                </el-cascader>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="是否精选" prop="choiceness">
                <el-select v-model="ruleForm.choiceness" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in choicenessOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否热门" prop="hot">
                <el-select v-model="ruleForm.hot" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search"
                           @change="categoryChange">
                  <el-option
                    v-for="item in hotOptions"
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
            <el-col :span="12">
              <el-form-item label="商品状态" prop="status">
                <el-select v-model="ruleForm.status" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search" @change="categoryChange">
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
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加商品</el-button>
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
        prop="id"
        align="center"
        width="80%"
        label="商品id">
      </el-table-column>
      <el-table-column
        prop="title"
        label="商品标题"
        show-overflow-tooltip="true"
        width="170%"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        align="center"
        width="80%"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        align="center"
        width="110%"
        label="商品分类">
      </el-table-column>
      <el-table-column
        prop="brandId"
        align="center"
        label="商品品牌"
        :formatter="brandFormat">
      </el-table-column>
      <el-table-column
        prop="sales"
        align="center"
        width="80%"
        label="商品销量">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="username"
        label="平台商"
        width="130%"
        align="center"/>
      <el-table-column
        prop="choiceness"
        align="center"
        width="65%"
        label="精选">
        <template scope="scope">
          <el-tag v-if="scope.row.choiceness === 0" size="small" type="danger">否</el-tag>
          <el-tag v-if="scope.row.choiceness === 1" size="small" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="hot"
        align="center"
        width="65%"
        label="热门">
        <template scope="scope">
          <el-tag v-if="scope.row.hot === 0" size="small" type="danger">否</el-tag>
          <el-tag v-if="scope.row.hot === 1" size="small" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        width="80%"
        label="商品状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2" size="small" type="danger">下架</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small" type="success">上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设置" align="center" width="600px">
        <template scope="scope">
          <el-button v-if="scope.row.status === 1"
                     size="mini"
                     type="danger"
                     icon="close"
                     @click="handleStatus(scope.$index, scope.row)">下架
          </el-button>
          <el-button v-if="scope.row.status === 2"
                     size="mini"
                     type="success"
                     icon="check"
                     @click="handleStatus(scope.$index, scope.row)">上架
          </el-button>
          <el-button
                     size="mini"
                     type="info"
                     icon="check"
                     @click="handleSort(scope.$index, scope.row)">排序值
          </el-button>
          <el-button v-if="scope.row.hot === 1"
                     size="mini"
                     type="danger"
                     icon="close"
                     @click="handleIshot(scope.$index, scope.row)">取消热门
          </el-button>
          <el-button v-if="scope.row.hot === 0"
                     size="mini"
                     type="success"
                     icon="check"
                     @click="handleIshot(scope.$index, scope.row)">设为热门
          </el-button>
          <el-button v-if="scope.row.choiceness === 1"
                     size="mini"
                     type="danger"
                     icon="close"
                     @click="handlechoiceness(scope.$index, scope.row)">取消精选
          </el-button>
          <el-button v-if="scope.row.choiceness === 0"
                     size="mini"
                     type="success"
                     icon="check"
                     @click="handlechoiceness(scope.$index, scope.row)">设为精选
          </el-button>
          <el-button v-if="scope.row.isGroup === 0"
                     size="mini"
                     type="warning"
                     icon="search"
                     @click="handleGroup(scope.$index, scope.row)">组合商品
          </el-button>
          <el-button v-if="scope.row.isGroup > 0"
                     size="mini"
                     type="primary"
                     icon="search"
                     @click="handleSKU(scope.$index, scope.row)">查看组合
          </el-button>
          <el-button v-if="scope.row.isGroup > 0"
                     size="mini"
                     type="primary"
                     icon="search"
                     @click="newHandleSKU(scope.$index, scope.row)">重新组合
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="基本操作" align="center" width="155%">
        <template scope="scope">
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

<!--    设置排序值-->
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="排序值" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="dialogVisible = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog :visible.sync="dialogVisible1" size="tiny" width="75%">
      <item-edit :item-id="itemId" ref="edit1"></item-edit>
    </el-dialog>


  </div>
</template>
<style>
  .cover {
    width: 40px;
    height: 40px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
</style>
<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import ItemEdit from './edit1'
  import {
    getItemList,
    changeStatus,
    changeHot,
    changeChoiceness,
    delItemApi,
    deleteSkuAll,
    setSort
  } from '../../api/gift/item/item'
  import { getAllItemCate } from '@/api/gift/item/itemCate'
  import { getAllBrand } from '@/api/brand/brand'
  import { countSKUApi } from '@/api/gift/item/group'
  // import ElTag from "../../../node_modules/element-ui/packages/tag/src/tag.vue";

  var moment = require('moment')
  var common = [{ value: 0, label: '高到低排序' }, { value: 1, label: '低到高排序' }]
  export default {
    components: {
      ItemEdit,
      ElRow
    },
    data() {
      return {
        hotOptions: [{ value: '', name: '请选择' }, { value: 1, name: '是' }, { value: 0, name: '否' }],
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        choicenessOptions: [{ value: '', name: '请选择' }, { value: 1, name: '是' }, { value: 0, name: '否' }],
        categoryOptions: [],
        categoryOption: [],
        // itemProps: { value: 'id', label: 'name' },
        brandOptions: [],
        options: [{
          value: 'price',
          label: '商品价格',
          children: common
        }, {
          value: 'sales',
          label: '销量',
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
        dialogVisible1: false,
        ruleForm: {
          selectedOptions: '',
          brand: '',
          category: '',
          sCategory: '',
          title: '',
          hot: '',
          status: '',
          choiceness: ''
        },
        dialogVisible: false,
        itemId: '',
        form: {
          sort: ''
        },
        rules: {
          sort: [
            { required: true, message: '请输入排序值', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      var permisId = 1022
      getAllItemCate(permisId).then(re => {
        this.categoryOptions = re.data.data
      })
      var permissionId = 1023
      getAllBrand(permissionId).then(re => {
        this.brandOptions = re.data.data
      })
      this.getList()
    },
    methods: {
      // 添加商品
      add() {
        this.$router.push('/item/add')
      },
      categoryChange(id) {
        this.categoryOption = []
        this.ruleForm.sCategory = ''
        for (let cate of this.categoryOptions) {
          if (cate.id === id) {
            this.categoryOption = cate.children
          }
        }
      },
      // 搜索商品
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商品列表
      getList() {
        var search = {}
        search.title = this.ruleForm.title
        if (!this.ruleForm.sCategory) {
          search.category = this.ruleForm.category
        } else {
          search.category = this.ruleForm.sCategory
        }
        search.brand = this.ruleForm.brand
        search.status = this.ruleForm.status
        search.choiceness = this.ruleForm.choiceness
        search.hot = this.ruleForm.hot
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
        var permissionId = 1017
        getItemList(this.pageNum, this.pageSize, search, permissionId).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // handleChange(value) {
      //   console.log(value)
      // },
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        if (date === undefined || date === null) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // // 商品分类格式化
      // typeFormat: function(row, column) {
      //   var type = row[column.property]
      //   for (var i = 0; i < this.categoryOptions.length; i++) {
      //     if (this.categoryOptions[i].id === type) {
      //       return this.categoryOptions[i].name
      //     }
      //   }
      //   return ''
      // },
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
      // 设置排序值
      handleSort(index, row) {
        this.dialogVisible = true
        this.form.sort = row.sort
        this.itemId = row.id
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            setSort(this.itemId, this.form.sort).then(re => {
              if (re.data.errCode === 0){
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                })
                this.dialogVisible = false
                this.getList()
              } else {
                this.$message.error(re.data.msg)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
            this.$message.error('设置失败')
          } else {
            this.getList()
          }
        })
      },
      // 改变热门状态
      handleIshot(index, row) {
        var status = row.hot
        if (status === 1) {
          status = 0
        } else {
          status = 1
        }
        changeHot(row.id, status).then(re => {
          if (re.data.errCode !== 0) {
            this.$message.error('设置失败')
          } else {
            this.getList()
          }
        })
      },
      // 改变精选状态
      handlechoiceness(index, row) {
        var status = row.choiceness
        if (status === 1) {
          status = 0
        } else {
          status = 1
        }
        changeChoiceness(row.id, status).then(re => {
          if (re.data.errCode !== 0) {
            this.$message.error('设置失败')
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
        this.itemId = row.id
        this.dialogVisible1 = true
        // 主动调用子组件中的方法
        this.$refs.edit1.getDetail(row.id)
        // this.$router.push('/item/edit/' + row.id)
      },
      // 组合商品
      handleGroup(index, row) {
        // 判断该商品是否组合过
        countSKUApi(row.id).then(re => {
          if (re.data.data !== 0) {
            this.$message({
              type: 'warning',
              message: '该商品已被组合过了!'
            })
          } else {
            this.$router.push({
              path: '/item/group/',
              query: { productId: row.id, cover: row.cover, productName: row.title }
            })
          }
        })
      },
      // 查看组合商品
      handleSKU(index, row) {
        this.$router.push('/item/skuList/' + row.id)
      },
      // 重新组合商品
      newHandleSKU(index, row) {
        this.$confirm('你确定要重新组合商品吗?')
          .then(_ => {
            deleteSkuAll(row.id).then(re => {
              this.$router.push({
                path: '/item/group/',
                query: { productId: row.id, cover: row.cover, productName: row.title }
              })
            }).catch(_ => {
              this.$message.error('重新组合商品错误')
            })
          })
      },
      // 删除商品
      handleDelete(index, row) {
        this.$confirm('你确定要删除该商品吗?')
          .then(_ => {
            this.loading2 = true
            delItemApi(row.id).then(re => {
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
