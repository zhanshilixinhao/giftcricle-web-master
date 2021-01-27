<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="角色名称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="ruleForm.description" placeholder="角色描述" type="text" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="角色状态" prop="status">
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
        <el-button type="primary" @click="add()">添加角色</el-button>
      </el-card>
    </div>
    <br/>
    <el-table
      :data="tableData3"
      stripe
      border>
      <el-table-column type="expand"
                       prop="permissionNames"
                       align="center">
        <template scope="scope">
          <span>{{ scope.row.permissionNames }}</span>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="active"
        align="center"
        label="角色状态">
        <template scope="scope">
          <el-tag v-if="scope.row.active === 2"
                     size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.active === 1"
                     size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名称"
        show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="description"
        label="角色描述"
        show-overflow-tooltip="true"
        align="center">
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
      <el-table-column label="基本操作" align="center" width="260%">
        <template scope="scope">
          <el-button v-if="scope.row.active === 1 && scope.row.id !== 1 && scope.row.id !== 2 && scope.row.id !== 3"
                     size="mini"
                     type="danger"
                     icon="close"
                     @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.active === 2 && scope.row.id !== 1 && scope.row.id !== 2 && scope.row.id !== 3"
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
            v-if="scope.row.id !== 1 && scope.row.id !== 2 && scope.row.id !== 3"
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
  import { getRoleList, changeStatus, delRole } from '@/api/permission/permission'
  import store from '@/store/index'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          name: '',
          description: '',
          status: ''
        }
      }
    },
    mounted() {
      // store.dispatch('GenerateMenuUrl', this.$route.path).then(() => {})
      this.getList()
    },
    methods: {
      // 添加角色
      add() {
        this.$router.push('/permission/roleAdd')
      },
      // 搜索角色
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取角色列表
      getList() {
        var search = {}
        search.name = this.ruleForm.name
        search.description = this.ruleForm.description
        search.status = this.ruleForm.status
        this.loading2 = true
        getRoleList(this.pageNum, this.pageSize, search).then(re => {
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
      // 角色分类格式化
      typeFormat: function(row, column) {
        var type = row[column.property]
        for (var i = 0; i < this.categoryOptions.length; i++) {
          if (this.categoryOptions[i].value === type) {
            return this.categoryOptions[i].name
          }
        }
        return ''
      },
      // 角色品牌格式化
      brandFormat: function(row, column) {
        var brand = row[column.property]
        for (var i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].id === brand) {
            return this.brandOptions[i].name
          }
        }
        return ''
      },
      // 改变角色状态
      handleStatus(index, row) {
        var status = row.active
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
      // 编辑角色
      handleEdit(index, row) {
        console.log(store.getters.addRouters)
        this.$router.push('/permission/roleEdit/' + row.id)
      },
      // 删除角色
      handleDelete(index, row) {
        this.$confirm('你确定要删除该角色吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delRole(row.id).then(re => {
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
