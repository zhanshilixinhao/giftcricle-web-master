<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="商品名称" type="text" ></el-input>
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
        <el-button type="primary" @click="getBack()">返回</el-button>
        <el-button type="primary" @click="updateValue()">修改商品属性值</el-button>
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
      <el-table-column width="100" label="商品图片" align="center">
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
        prop="status"
        align="center"
        width="80%"
        label="商品状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                     size="small" type="danger">下架</el-tag>
          <el-tag v-if="scope.row.status === 1"
                     size="small" type="success">上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="price"
        align="center"
        width="80%"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="sales"
        align="center"
        width="80%"
        label="商品销量">
      </el-table-column>
      <el-table-column
        prop="stock"
        align="center"
        width="80%"
        label="商品库存">
      </el-table-column>
      <el-table-column
        prop="skuContents"
        align="center"
        width="155%"
        label="组合内容">
        <template scope="scope">
          <el-popover
            ref="popover4"
            placement="right"
            width="400"
            trigger="click">
            <el-table :data="scope.row.skuContents">
              <el-table-column property="featureId" label="商品属性名称" :formatter="featureFormat"></el-table-column>
              <el-table-column property="value" label="商品属性值"></el-table-column>
            </el-table>
            <el-button slot="reference">点击查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        label="创建时间"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updated"
        label="修改时间"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template scope="scope">
          <el-button v-if="scope.row.status == 1"
           size="mini"
           type="danger"
           icon="close"
           @click="handleStatus(scope.$index, scope.row)">下架
          </el-button>
          <el-button v-if="scope.row.status == 2"
           size="mini"
           type="success"
           icon="check"
           @click="handleStatus(scope.$index, scope.row)">上架
          </el-button>
          <el-button
            icon="el-icon-edit"
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
  import { getSkuList, changeStatus } from '@/api/gift/item/group'
  import { getAllFeatureApi } from '@/api/gift/item/itemFeature'

  var moment = require('moment')
  var common = [{ value: 0, label: '高到低排序' }, { value: 1, label: '低到高排序' }]
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '上架' }, { value: 2, name: '下架' }],
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        pictureUrl: process.env.BASE_IMAGES_API,
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        images: [],
        images2: [],
        tableData3: [],
        options: [{
          value: 'price',
          label: '商品价格',
          children: common
        }, {
          value: 'sales',
          label: '销量',
          children: common
        }, {
          value: 'stock',
          label: '库存',
          children: common
        }],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          status: '',
          title: '',
          selectedOptions: ''
        }
      }
    },
    mounted() {
      var permissionId = 1039
      getAllFeatureApi(permissionId).then(re => {
        this.featureOptions = re.data.data
      }).catch(reason => {
      })
      this.getList()
    },
    methods: {
      // 返回商品列表
      getBack() {
        this.$router.push('/item/list/')
      },
      // 修改商品属性值
      updateValue() {
        this.$router.push('/item/skuValueEdit/' + this.$route.params.id)
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商品sku列表
      getList() {
        var search = {}
        // 商品id
        search.id = this.$route.params.id
        search.title = this.ruleForm.title
        search.status = this.ruleForm.status
        if (this.ruleForm.selectedOptions[0] === 'price') {
          search.price = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'sales') {
          search.sales = this.ruleForm.selectedOptions[1]
        }
        if (this.ruleForm.selectedOptions[0] === 'stock') {
          search.stock = this.ruleForm.selectedOptions[1]
        }
        this.loading2 = true
        getSkuList(this.pageNum, this.pageSize, search).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        }).catch(re => {
          this.loading2 = false
        })
      },
      // 编辑商品状态
      handleStatus(index, row) {
        var status = row.status
        if (row.status === 2) {
          if (row.stock === 0) {
            this.$message.error('库存为0的商品不能上架!')
            return
          }
          if (row.price === 0) {
            this.$confirm('商品价格为0,你确定要上架该商品吗?').then(_ => {
              status = 1
              changeStatus(row.id, status).then(re => {
                this.getList()
              })
            })
          } else {
            status = 1
            changeStatus(row.id, status).then(re => {
              this.getList()
            })
          }
        } else {
          status = 2
          changeStatus(row.id, status).then(re => {
            this.getList()
          })
        }
      },
      // 编辑sku商品
      handleEdit(index, row) {
        this.$router.push('/item/skuEdit/' + row.id)
      },
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        if (date === undefined || date === null) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 商品属性格式化
      featureFormat: function(row, column) {
        var id = row[column.property]
        if (id === undefined || id === null || id.length === 0) {
          return ''
        }
        for (var i = 0; i < this.featureOptions.length; i++) {
          if (id === this.featureOptions[i].id) {
            id = this.featureOptions[i].name
            return id
          }
        }
        return id
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
