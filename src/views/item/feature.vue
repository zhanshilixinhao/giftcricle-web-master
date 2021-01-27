<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item label="商品属性名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="商品属性名称" type="text"></el-input>
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
        <el-button type="primary" @click="addFeature()">添加商品属性</el-button>
      </el-card>
    </div>
    <br/>
    <el-table
      :data="tableData3"
      stripe
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="商品属性名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序值">
      </el-table-column>
      <el-table-column
        prop="username"
        label="平台商"
        align="center"/>
      <el-table-column
        prop="created"
        align="center"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="updated"
        align="center"
        label="修改时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <el-button
            icon="edit"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="danger"-->
            <!--icon="delete"-->
            <!--@click="handleDelete(scope.$index, scope.row)">删除-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加商品属性" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="cateForm">
        <el-form-item label="商品属性名称">
          <el-input  v-model="cateForm.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
        <el-button @click="addBack()">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改商品属性" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="cateUpdateForm">
        <el-form-item label="商品属性名称">
          <el-input  v-model="cateUpdateForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input  v-model="cateUpdateForm.sort" type="number">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateSubmit()">提 交</el-button>
        <el-button @click="updateBack()">取 消</el-button>
      </div>
    </el-dialog>
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
  import { getItemFeatureList, delItemFeatureApi, addItemFeature, updateItemFeature } from '@/api/gift/item/itemFeature'

  var moment = require('moment')

  export default {
    data() {
      return {
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        src: '',
        loading2: false,
        cateName: '',
        cateName1: '',
        ruleForm: {
          name: ''
        },
        dialogVisible: false,
        cateForm: {
          name: ''
        },
        dialogUpdateVisible: false,
        cateUpdateForm: {
          id: null,
          name: '',
          sort: null
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加商品属性窗口打开
      addFeature() {
        this.cateForm.name = ''
        this.dialogVisible = true
      },
      // 添加商品属性取消
      addBack() {
        this.dialogVisible = false
        this.cateForm.name = ''
      },
      // 添加商品属性提交
      addSubmit() {
        if (this.cateForm.name.trim() === '') {
          this.$message.error('请填写商品商品属性名称!')
          return
        }
        addItemFeature(this.cateForm.name).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('添加成功!')
            this.dialogVisible = false
            this.cateForm.name = ''
            this.getList()
            return
          } else {
            this.$message.error('添加失败!')
          }
        })
      },
      // 编辑商品属性窗口打开
      handleEdit(index, row) {
        this.cateUpdateForm.id = row.id
        this.cateUpdateForm.name = row.name
        this.cateUpdateForm.sort = row.sort
        this.dialogUpdateVisible = true
      },
      // 编辑商品属性取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.cateUpdateForm.name = ''
        this.cateUpdateForm.sort = null
        this.cateUpdateForm.id = null
      },
      // 编辑商品属性提交
      updateSubmit() {
        if (this.cateUpdateForm.name.trim() === '') {
          this.$message.error('请填写商品商品属性名称!')
          return
        }
        if (this.cateUpdateForm.sort !== null && this.cateUpdateForm.sort !== '') {
          var re = /^[0-9]+$/
          if (re.test(this.cateUpdateForm.sort) === false) {
            this.$message.error('排序值必须为正整数!')
            return
          }
        }
        updateItemFeature(this.cateUpdateForm.id, this.cateUpdateForm.name, this.cateUpdateForm.sort).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('修改成功!')
            this.dialogUpdateVisible = false
            this.cateUpdateForm.name = ''
            this.cateUpdateForm.sort = null
            this.cateUpdateForm.id = null
            this.getList()
            return
          } else {
            this.$message.error('修改失败!')
          }
        })
      },
      // 搜索商品属性
      handleSearch() {
        this.getList()
      },
      // 获取商品属性列表
      getList() {
        var name = this.ruleForm.name
        this.loading2 = true
        getItemFeatureList(this.pageNum, this.pageSize, name).then(re => {
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
      // 删除商品属性
      handleDelete(index, row) {
        this.$confirm('你确定要删除该删除商品属性吗?')
          .then(_ => {
            this.loading2 = true
            delItemFeatureApi(row.id).then(re => {
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

