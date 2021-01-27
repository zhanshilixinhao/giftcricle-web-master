<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="横幅标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="横幅标题" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="横幅类型" prop="type">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="横幅状态" prop="status">
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
        <el-button type="primary" @click="add()">添加横幅</el-button>
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
      <el-table-column width="100" label="横幅图片" align="center">
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
        label="横幅状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                     size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 1"
                     size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="横幅标题"
        show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        align="center"
        label="横幅类型"
        :formatter="typeFormat">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="updated"
        label="修改时间"
        align="center"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="基本操作" align="center" width="280px">
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
  import { getBannerList, changeStatus, delBanner } from '@/api/home/banner/banner'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        categoryOptions: [{ value: '', name: '请选择' }, { value: 1, name: '商品详情' },
          { value: 2, name: '主题商品列表' }, { value: 3, name: '网页外链' }, { value: 4, name: '纯展示' }],
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          title: '',
          type: '',
          status: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加横幅
      add() {
        this.$router.push('/banner/add')
      },
      // 搜索横幅
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取横幅列表
      getList() {
        var search = {}
        search.title = this.ruleForm.title
        search.type = this.ruleForm.type
        search.status = this.ruleForm.status
        this.loading2 = true
        getBannerList(this.pageNum, this.pageSize, search).then(re => {
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
      // 横幅分类格式化
      typeFormat: function(row, column) {
        var type = row[column.property]
        for (var i = 0; i < this.categoryOptions.length; i++) {
          if (this.categoryOptions[i].value === type) {
            return this.categoryOptions[i].name
          }
        }
        return ''
      },
      // 横幅品牌格式化
      brandFormat: function(row, column) {
        var brand = row[column.property]
        for (var i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].id === brand) {
            return this.brandOptions[i].name
          }
        }
        return ''
      },
      // 改变横幅状态
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
      // 编辑横幅
      handleEdit(index, row) {
        this.$router.push('/banner/edit/' + row.id)
      },
      // 删除横幅
      handleDelete(index, row) {
        this.$confirm('你确定要删除该横幅吗?')
          .then(_ => {
            this.loading2 = true
            delBanner(row.id).then(re => {
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
