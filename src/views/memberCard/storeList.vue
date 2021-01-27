<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="门店名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="门店名称" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店地址" prop="address">
                <el-input v-model="ruleForm.address" placeholder="门店地址" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商家" prop="merchant">
                <el-input v-model="ruleForm.merchant" placeholder="商家" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="float: right">
            <el-form-item prop="date">
              <el-button type="primary" @click="search()">搜索</el-button>
              <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
    <div v-if="this.$store.state.user.roleId && this.$store.state.user.roleId !== 2">
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加门店</el-button>
      </el-card>
    </div>
    <br/>
    <el-table
      :data="tableData"
      stripe
      border>
      <el-table-column
        align="center"
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        show-overflow-tooltip
        label="门店名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="电话"
        width="120px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="linkman"
        label="联系人"
        width="120px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="area"
        label="地区"
        width="150px"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="门店地址"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        align="center"
        prop="merchantName"
        label="商家"
        show-overflow-tooltip/>

      <c-date-item prop="created" label="创建时间"/>
      <el-table-column label="操作" align="center" width="120px">
        <template scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            v-if="scope.row.id === 0"
            @click="handleEdit(scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <c-pagination :page-data="pageData"/>

    <!--    为门店绑定后台用户-->
    <el-dialog title="为门店绑定后台用户" :visible.sync="dialogUserVisible" size="tiny" :show-close="false"
               :close-on-press-escape="false" :close-on-click-modal="false">
      <el-input v-model="username" placeholder="请先在后台用户管理创建后台账号, 在此输入账号的用户名">
        <template slot="prepend">用户名</template>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userBack()">取 消</el-button>
        <el-button type="primary" @click="userSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <!--    门店信息-->
    <el-dialog title="门店信息" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.number="form.phone"  maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            :props="props"
            v-model="form.area">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input type="textarea" v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
     </span>
    </el-dialog>

  </div>
</template>

<script>
  import CDateItem from '../../components/CDateItem/index'
  import CPagination from '../../components/CPagination/index'
  import { getStoreList, deleteStore, getDistrictList, addStore, updateStore, bindStore } from '../../api/v3/store'

  export default {
    name: 'CardList',
    components: { CPagination, CDateItem },
    data() {
      return {
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        flag: '',
        loading2: false,
        dialogVisible: false,
        tableData: [],
        ruleForm: {
          name: '',
          address: '',
          merchant: ''
        },
        form: {
          name: '',
          phone: '',
          linkman: '',
          area: '',
          address: ''
        },
        dialogUserVisible: false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入号码', trigger: 'blur' }
          ],
          linkman: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '请输入地取', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        id: '',
        username: '',
        options: [],
        props: {
          value: 'name',
          label: 'name'
        }
      }
    },
    mounted() {
      this.getList()
      this.getDistrict()
    },
    methods: {
      getList() {
        var search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        search.name = this.ruleForm.name
        search.location = this.ruleForm.address
        search.merchant = this.ruleForm.merchant
        getStoreList(search).then(re => {
          this.tableData = re.data.data
          this.pageData.total = re.data.total
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.flag === 1) {
              this.store()
            } else {
              this.edit()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      add() {
        this.dialogVisible = true
        this.form = {
          name: '',
          phone: '',
          linkman: '',
          area: '',
          address: ''
        }
        this.flag = 1
      },
      store() {
        const store = {}
        store.name = this.form.name
        store.phone = this.form.phone
        store.linkman = this.form.linkman
        store.area = this.form.area
        store.address = this.form.address
        addStore(store).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error('添加失败!')
          }
        })
      },
      handleEdit(row) {
        console.log(row, 'aaaaaaaaa')
        this.dialogVisible = true
        this.flag = 2
        this.id = row.id
        this.form.name = row.name
        this.form.phone = row.phone
        this.form.linkman = row.linkman
        this.form.area = row.area.split(',')
        this.form.address = row.address
      },
      edit() {
        const store = {}
        store.id = this.id
        store.name = this.form.name
        store.phone = this.form.phone
        store.linkman = this.form.linkman
        store.area = this.form.area
        store.address = this.form.address
        updateStore(store).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error('修改失败!')
          }
        })
      },
      getDistrict() {
        getDistrictList().then(re => {
          this.options = re.data.data
        })
      },
      handleDelete(row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            deleteStore({ storeId: row.id }).then(re => {
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
      // 绑定用户
      handlePass(row) {
        this.dialogUserVisible = true
        this.id = row.id
      },
      userSubmit() {
        if (this.username.trim() === '') {
          this.$message.error('请填写用户名!')
          return
        }
        const bind = {}
        bind.storeId = this.id
        bind.username = this.username
        bindStore(bind).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUserVisible = false
            this.id = ''
            this.username = ''
            this.getList()
          }
        })
      },
      userBack() {
        this.id = ''
        this.username = ''
        this.dialogUserVisible = false
      },
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
  .el-table .warning-row {
    background: #dd6161;
  }
</style>
