<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="节日名称" prop="festival">
                <el-input v-model="ruleForm.festival" placeholder="节日名称" type="text"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">-->
              <!--<el-form-item label="节日日期" prop="targetDate">-->
                <!--<el-date-picker-->
                  <!--v-model="ruleForm.targetDate"-->
                  <!--type="date"-->
                  <!--placeholder="选择日期">-->
                <!--</el-date-picker>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
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
    <div>
      <el-card :body-style="{padding: '12px' }">
        <el-button type="primary" @click="add()">添加节日</el-button>
      </el-card>
    </div>
    <br>
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
        prop="festival"
        label="节日名称"
        align="center"/>
      <el-table-column
        prop="targetDate"
        label="节日日期"
        align="center"
        :formatter="dateFormat"/>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        :formatter="dateFormat"/>
      <el-table-column
        label="基本操作"
        align="center">
        <template scope="scope">
          <el-button type="primary" size="small" @click="updateHandle(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.$index, scope.row)">删除</el-button>
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

    <!--添加节日-->
    <el-dialog title="添加节日" :visible.sync="dialogVisible"   :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-addForm">
        <el-form-item label="节日名称" prop="festival">
          <el-input v-model="addForm.festival"></el-input>
        </el-form-item>
        <el-form-item label="节日日期" prop="targetDate">
          <el-date-picker
            v-model="addForm.targetDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改节日-->
    <el-dialog title="修改节日" :visible.sync="dialogVisibleUpdate"   :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" center>
      <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px" class="demo-updateForm">
        <el-form-item label="节日名称" prop="festival">
          <el-input v-model="updateForm.festival"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateSubmit()">立即修改</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import { getFestivalList, delFestival, addFestival, updateFestival, festivalDetail } from '@/api/home/festival'

  var moment = require('moment')
  export default {
    data() {
      return {
        tableData3: [],
        loading2: false,
        pageNum: 1,
        dialogVisible: false,
        dialogVisibleUpdate: false,
        pageSize: 10,
        total: 0,
        id: '',
        ruleForm: {
          festival: '',
          targetDate: ''
        },
        addForm: {
          festival: '',
          targetDate: ''
        },
        updateForm: {
          festival: ''
        },
        rules: {
          festival: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          targetDate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 获取节日列表
      getList() {
        this.loading2 = true
        getFestivalList(this.pageNum, this.pageSize, this.ruleForm.festival, this.ruleForm.targetDate).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 添加节日
      add() {
        this.addForm.festival = null
        this.addForm.targetDate = null
        this.dialogVisible = true
      },
      // 添加节日，提交
      addSubmit() {
        var fast = {}
        fast.festival = this.addForm.festival
        fast.targetDate = this.addForm.targetDate
        addFestival(fast).then(re => {
          this.dialogVisible = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 修改节日
      updateHandle(index, row) {
        this.dialogVisibleUpdate = true
        this.id = row.id
        festivalDetail(row.id).then(re => {
          this.updateForm.festival = re.data.data.festival
        })
      },
      updateSubmit() {
        updateFestival({ id: this.id, festival: this.updateForm.festival }).then(re => {
          this.dialogVisibleUpdate = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.getList()
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
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
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
      deleteHandle(index, row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            delFestival(row.id).then(re => {
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

<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
