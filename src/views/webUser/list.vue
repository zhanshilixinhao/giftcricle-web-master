<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" placeholder="用户名" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户状态" prop="status">
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
<!--              <el-form-item label="用户角色" prop="role">-->
<!--                <el-select v-model="ruleForm.role" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">-->
<!--                  <el-option-->
<!--                    v-for="item in roleOptions"-->
<!--                    :key="item.id"-->
<!--                    :label="item.name"-->
<!--                    :value="item.id">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="用户电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="用户电话" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户性别" prop="gender">
                <el-select v-model="ruleForm.gender" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-row :gutter="24">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="用户状态" prop="status">-->
<!--                <el-select v-model="ruleForm.status" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">-->
<!--                  <el-option-->
<!--                    v-for="item in statusOptions"-->
<!--                    :key="item.id"-->
<!--                    :label="item.name"-->
<!--                    :value="item.value">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
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
        <el-button type="primary" @click="add()">添加用户</el-button>
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
      <el-table-column width="100%" label="用户头像" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.avatar"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.avatar"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="active"
        align="center"
        width="170%"
        label="用户状态">
        <template scope="scope">
          <el-tag v-if="scope.row.active === 2"
                     size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.active === 1"
                     size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleId"
        align="center"
        width="170%"
        label="用户角色"
        :formatter="roleFormat">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        show-overflow-tooltip="true"
        width="170%"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        width="170%"
        label="用户电话">
      </el-table-column>
      <el-table-column
        prop="gender"
        align="center"
        width="170%"
        label="性别"
        :formatter="genderFormat">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        :formatter="dateFormat">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="updated"-->
        <!--label="修改时间"-->
        <!--align="center"-->
        <!--width="155%"-->
        <!--:formatter="dateFormat">-->
      <!--</el-table-column>-->
      <el-table-column label="基本操作" align="center" width="260%">
        <template scope="scope">
          <el-button v-if="scope.row.active === 1"
           size="mini"
           type="danger"
           icon="close"
           @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.active === 2"
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
  import { getWebUserList, changeStatus, delSysAdminApi ,getWebUserList1 } from '@/api/webUser/webUser'
  import { getAllRoleList } from '@/api/permission/permission'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        genderOptions: [{ value: '', name: '请选择' }, { value: 1, name: '男' }, { value: 2, name: '女' }, { value: 3, name: '保密' }],
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        pictureUrl: process.env.BASE_IMAGES_API,
        roleOptions: [],
        tableData3: [],
        pwdType: 'password',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          role: '',
          gender: '',
          username: '',
          phone: '',
          status: ''
        }
      }
    },
    mounted() {
      // 权限的id
      var permissionId = 1129
      getAllRoleList(permissionId).then(re => {
        this.roleOptions = re.data.data
      })
      this.getList()
    },
    methods: {
      // 添加用户
      add() {
        this.$router.push('/permission/add')
      },
      // 搜索用户
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取用户列表
      getList() {
        var search = {}
        search.pageNum = this.pageNum
        search.pageSize = this.pageSize
        search.username = this.ruleForm.username
        search.gender = this.ruleForm.gender
        // search.role = this.ruleForm.role
        search.status = this.ruleForm.status
        search.phone = this.ruleForm.phone
        this.loading2 = true
        getWebUserList1(search).then(re => {
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
      // 用户性别格式化
      genderFormat: function(row, column) {
        var type = row[column.property]
        for (var i = 0; i < this.genderOptions.length; i++) {
          if (this.genderOptions[i].value === type) {
            return this.genderOptions[i].name
          }
        }
        return ''
      },
      // 用户角色格式化
      roleFormat: function(row, column) {
        var type = row[column.property]
        for (var i = 0; i < this.roleOptions.length; i++) {
          if (this.roleOptions[i].id === type) {
            return this.roleOptions[i].name
          }
        }
        return ''
      },
      // 改变用户状态
      handleStatus(index, row) {
        var status = row.active
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
      // 编辑用户
      handleEdit(index, row) {
        this.$router.push('/permission/edit/' + row.id)
      },
      // 删除用户
      handleDelete(index, row) {
        this.$confirm('你确定要删除该用户吗?删除后不可恢复!')
          .then(_ => {
            this.loading2 = true
            delSysAdminApi(row.id).then(re => {
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
