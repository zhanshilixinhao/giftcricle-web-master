<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="文章场景标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="文章场景标题" type="text"></el-input>
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
        <el-button type="primary" @click="add()">添加场景</el-button>
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
        prop="title"
        label="文章场景标题"
        show-overflow-tooltip="true"
        align="center">
      </el-table-column>

      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        width="165%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="updated"
        label="更新时间"
        align="center"
        width="165%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="基本操作" align="center" width="350%">
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


    <!--文章场景-->
    <el-dialog title="文章场景" :visible.sync="dialogVisible" size="tiny">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="场景名称" prop="title">
          <el-input v-model="addForm.title" placeholder="场景名称" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>

  import { getSceneList, addScene, updateScene, delScene } from '../../api/gift/article/scene'

  var moment = require('moment')

  export default {
    data() {
      return {
        loading2: false,
        tableData3: [],
        flag: 0,
        id: '',
        dialogVisible: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        ruleForm: {
          title: ''
        },
        addForm: {
          title: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入场景名称', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        var search = {}
        search.pageNum = this.pageNum
        search.pageSize = this.pageSize
        search.title = this.ruleForm.title
        this.loading2 = true
        getSceneList(search).then(re =>{
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.flag === 1){
              this.addInfo()
            }else {
              this.updateInfo()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 添加
      add() {
        this.dialogVisible = true
        this.addForm.title = ''
        this.flag = 1
      },
      addInfo() {
        addScene({ title: this.addForm.title }).then(re => {
          if (re.data.errCode === 0){
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error(re.data.msg)
            this.getList()
          }
        })
      },
      // 修改
      handleEdit(index, row){
        this.dialogVisible = true
        this.addForm.title = row.title
        this.flag = 2
        this.id = row.id
      },
      updateInfo() {
        updateScene({ id: this.id, title: this.addForm.title }).then(re => {
          if (re.data.errCode === 0){
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error(re.data.msg)
            this.getList()
          }
        })
      },
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗?删除后不可恢复')
          .then(_ => {
            this.loading2 = true
            delScene({ id: row.id }).then(re => {
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
// --------------------------------------------------常用----------------------------------------------------------------
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        console.log('bb', date)
        console.log('cc', column.property)
        if (date === undefined || date === null) {
          return ''
        }
        console.log('a', moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss'))
        // moment(date).format('YYYY-MM-DD HH:mm:ss')
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
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
