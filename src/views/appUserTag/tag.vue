<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="印象标签名称" prop="tag">
                <el-input v-model="ruleForm.tag" placeholder="印象标签名称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="印象标签状态" prop="status">
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
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="印象标签类型" prop="type">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
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
        <el-button type="primary" @click="add()">添加印象标签</el-button>
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
        prop="tag"
        label="印象标签名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        label="标签类型">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 2"
                     size="small" type="danger">负面</el-tag>
          <el-tag v-if="scope.row.type === 1"
                     size="small" type="success">正面</el-tag>
        </template>
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
      <el-table-column label="操作" align="center" width="320px">
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
    <el-dialog title="新增印象标签" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="tagForm">
        <el-form-item label="印象标签名称">
          <el-input  v-model="tagForm.tag">
          </el-input>
        </el-form-item>
        <el-form-item label="印象标签类型" prop="type">
          <el-select v-model="tagForm.type" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
            <el-option
              v-for="item in typeAddOptions"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改印象标签" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="tagUpdateForm">
        <el-form-item label="印象标签名称">
          <el-input  v-model="tagUpdateForm.tag">
          </el-input>
        </el-form-item>
        <el-form-item label="印象标签类型" prop="type">
          <el-select v-model="tagUpdateForm.type" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
            <el-option
              v-for="item in typeUpdateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
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
  import { getTagList, delTag, changeStaus, addTag, updateTag } from '@/api/appUser/appUserTag'

  var moment = require('moment')

  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        typeOptions: [{ value: '', name: '请选择' }, { value: 1, name: '正面' }, { value: 2, name: '负面' }],
        typeAddOptions: [{ value: '', name: '请选择' }, { value: 1, name: '正面' }, { value: 2, name: '负面' }],
        typeUpdateOptions: [{ value: '', name: '请选择' }, { value: 1, name: '正面' }, { value: 2, name: '负面' }],
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          tag: '',
          type: '',
          status: ''
        },
        dialogVisible: false,
        tagForm: {
          type: '',
          tag: ''
        },
        dialogUpdateVisible: false,
        tagUpdateForm: {
          id: null,
          type: '',
          tag: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加印象标签窗口打开
      add() {
        this.tagForm.tag = ''
        this.tagForm.type = ''
        this.dialogVisible = true
      },
      // 添加印象标签取消
      addBack() {
        this.dialogVisible = false
        this.tagForm.tag = ''
        this.tagForm.type = ''
      },
      // 添加印象标签提交
      addSubmit() {
        if (this.tagForm.tag.trim() === '') {
          this.$message.error('请填写印象标签名称!')
          return
        }
        if (this.tagForm.type === '') {
          this.$message.error('请选择印象标签类型!')
          return
        }
        addTag(this.tagForm.tag, this.tagForm.type).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.tagForm.tag = ''
            this.tagForm.type = ''
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 编辑印象标签窗口打开
      handleEdit(index, row) {
        this.tagUpdateForm.id = row.id
        this.tagUpdateForm.tag = row.tag
        this.tagUpdateForm.type = row.type
        this.dialogUpdateVisible = true
      },
      // 编辑印象标签取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.tagUpdateForm.tag = ''
        this.tagUpdateForm.type = ''
        this.tagUpdateForm.id = null
      },
      // 编辑印象标签提交
      updateSubmit() {
        if (this.tagUpdateForm.tag.trim() === '') {
          this.$message.error('请填写印象标签名称!')
          return
        }
        if (this.tagUpdateForm.type === '') {
          this.$message.error('请选择印象标签类型!')
          return
        }
        updateTag(this.tagUpdateForm.id, this.tagUpdateForm.tag, this.tagUpdateForm.type).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUpdateVisible = false
            this.tagUpdateForm.tag = ''
            this.tagUpdateForm.type = ''
            this.tagUpdateForm.id = null
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取印象标签列表
      getList() {
        var search = {}
        search.tag = this.ruleForm.tag
        search.status = this.ruleForm.status
        search.type = this.ruleForm.type
        this.loading2 = true
        getTagList(this.pageNum, this.pageSize, search).then(re => {
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
      // 删除印象标签
      handleDelete(index, row) {
        this.$confirm('你确定要删除该印象标签吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delTag(row.id).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.getList()
              }
              if (re.data.errCode === 1) {
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
