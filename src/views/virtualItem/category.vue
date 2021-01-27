<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="分类名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="分类名称" type="text" ></el-input>
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
        <el-button type="primary" @click="add()">添加分类</el-button>
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
        prop="status"
        label="状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                     size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 1"
                     size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="分类名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序值">
      </el-table-column>

      <el-table-column
        align="center"
        prop="created"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updated"
        label="修改时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="290px">
        <template scope="scope">
          <el-button v-if="scope.row.status == 1"
                     size="mini"
                     type="danger"
                     @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.status == 2"
                     size="mini"
                     type="success"
                     @click="handleStatus(scope.$index, scope.row)">启用
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
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
    <el-dialog title="新增商品分类" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="cateForm">
        <el-form-item label="商品分类名称">
          <el-input  v-model="cateForm.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改商品分类" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="cateUpdateForm">
        <el-form-item label="商品分类名称">
          <el-input  v-model="cateUpdateForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input  v-model="cateUpdateForm.sort" type="number">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateBack()">取 消</el-button>
        <el-button type="primary" @click="updateSubmit()">提 交</el-button>
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
  import { getItemCateList, delItemCate, changeStaus, addItemCate, updateItemCate } from '@/api/gift/virItem/virItemCate'

  var moment = require('moment')

  export default {
    components: { ElRow },
    data() {
      return {
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
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
      // 添加分类窗口打开
      add() {
        this.cateForm.name = ''
        this.dialogVisible = true
      },
      // 添加分类取消
      addBack() {
        this.dialogVisible = false
        this.cateForm.name = ''
      },
      // 添加分类提交
      addSubmit() {
        if (this.cateForm.name.trim() === '') {
          this.$message.error('请填写虚拟商品分类名称!')
          return
        }
        addItemCate(this.cateForm.name).then(re => {
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
      // 编辑分类窗口打开
      handleEdit(index, row) {
        this.cateUpdateForm.id = row.id
        this.cateUpdateForm.name = row.name
        this.cateUpdateForm.sort = row.sort
        this.dialogUpdateVisible = true
      },
      // 编辑分类取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.cateUpdateForm.name = ''
        this.cateUpdateForm.sort = null
        this.cateUpdateForm.id = null
      },
      // 编辑分类提交
      updateSubmit() {
        if (this.cateUpdateForm.name.trim() === '') {
          this.$message.error('请填写虚拟商品分类名称!')
          return
        }
        if (this.cateUpdateForm.sort !== null && this.cateUpdateForm.sort !== '') {
          var re = /^[0-9]+$/
          if (re.test(this.cateUpdateForm.sort) === false) {
            this.$message.error('排序值必须为正整数!')
            return
          }
        }
        updateItemCate(this.cateUpdateForm.id, this.cateUpdateForm.name, this.cateUpdateForm.sort).then(re => {
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
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商品分类列表
      getList() {
        var name = this.ruleForm.name
        this.loading2 = true
        getItemCateList(this.pageNum, this.pageSize, name).then(re => {
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
      // 改变启用状态
      handleStatus(index, row) {
        var status = row.status
        if (status === 1) {
          status = 2
        } else {
          status = 1
        }
        changeStaus(row.id, status).then(re => {
          this.getList()
        })
      },
      // 删除分类
      handleDelete(index, row) {
        this.$confirm('你确定要删除该分类吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delItemCate(row.id).then(re => {
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
