<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="通知标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="系统通知标题" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通知内容" prop="summary">
              <el-input v-model="ruleForm.summary" placeholder="系统通知内容" type="text" ></el-input>
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
        <el-button type="primary" @click="add()">添加系统通知</el-button>
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
        prop="title"
        width="200%"
        label="通知标题">
      </el-table-column>
      <el-table-column
        align="center"
        prop="summary"
        show-overflow-tooltip="true"
        label="通知内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        width="200%"
        label="目标用户">
        <template scope="scope">
          <span v-if="scope.row.phone === null">所有用户</span>
          <span v-if="scope.row.phone !== null">{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        label="创建时间"
        width="200%"
        :formatter="dateFormat">
      </el-table-column>

      <el-table-column label="操作" align="center" width="200%">
        <template scope="scope">
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
    <el-dialog title="系统通知" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="messageForm">
        <el-form-item label="通知标题">
          <el-input  v-model="messageForm.title" placeholder="请填写通知标题" style="width: 50%">
          </el-input>
        </el-form-item>
        <el-form-item label="通知内容">
          <el-input type="textarea"  v-model="messageForm.summary" placeholder="请填写通知内容" style="width: 50%" :rows="6">
          </el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="messageForm.phone" placeholder="请填写app用户电话, 如要通知给所有的用户则不必填写" style="width: 50%" :rows="6">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
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
  import { getPushMsgList, delMessage, addPushMsg } from '@/api/home/message/appMessage'

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
          tag: '',
          type: '',
          status: ''
        },
        dialogVisible: false,
        messageForm: {
          summary: '',
          phone: '',
          title: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加通知系统窗口打开
      add() {
        this.dialogVisible = true
      },
      // 添加通知系统取消
      addBack() {
        this.dialogVisible = false
      },
      // 添加通知系统提交
      addSubmit() {
        if (this.messageForm.title.trim() === '') {
          this.$message.error('请填写系统通知名称!')
          return
        }
        if (this.messageForm.summary.trim() === '') {
          this.$message.error('请填写系统通知内容!')
          return
        }
        var message = ''
        if (this.messageForm.phone === '') {
          message = '你确定要将本条系统通知给所有APP用户吗?'
        } else {
          message = '你确定要将本条系统通知给' + this.messageForm.phone + '用户吗?'
        }
        this.$confirm(message)
          .then(_ => {
            var pushMsg = {}
            pushMsg.title = this.messageForm.title
            pushMsg.summary = this.messageForm.summary
            pushMsg.phone = this.messageForm.phone
            addPushMsg(pushMsg).then(re => {
              if (re.data.errCode === 0) {
                this.$message.success(re.data.msg)
                this.dialogVisible = false
                this.getList()
                return
              } else {
                this.$message.error(re.data.msg)
              }
            })
          })
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取通知系统列表
      getList() {
        var search = {}
        search.title = this.ruleForm.title
        search.summary = this.ruleForm.summary
        this.loading2 = true
        getPushMsgList(this.pageNum, this.pageSize, search).then(re => {
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
      // 删除系统通知
      handleDelete(index, row) {
        this.$confirm('你确定要删除该系统通知吗?删除后用户将无法查看本条系统通知!')
          .then(_ => {
            this.loading2 = true
            delMessage(row.id).then(re => {
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
