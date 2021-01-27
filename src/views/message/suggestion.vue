<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="ruleForm.nickname" placeholder="用户昵称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="反馈内容" prop="feedback">
                <el-input v-model="ruleForm.feedback" placeholder="反馈内容" type="text" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contactWay">
                <el-input v-model="ruleForm.contactWay" placeholder="联系方式" type="text" ></el-input>
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
        prop="nickname"
        width="150%"
        label="反馈用户昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="contactWay"
        width="200%"
        label="联系方式">
      </el-table-column>
      <el-table-column
        align="center"
        prop="feedback"
        show-overflow-tooltip="true"
        label="反馈内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        width="155%"
        label="反馈类型">
        <template scope="scope">
          <span v-if="scope.row.type === 1">提个建议</span>
          <span v-if="scope.row.type === 2">程序出错啦</span>
          <span v-if="scope.row.type === 3">不好用</span>
          <span v-if="scope.row.type === 4">其它</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        label="反馈时间"
        width="155%"
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
  import { getSuggestionList, delSuggestion } from '@/api/home/message/suggestion'

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
          nickname: '',
          contactWay: '',
          feedback: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取反馈列表
      getList() {
        var search = {}
        search.nickname = this.ruleForm.nickname
        search.contactWay = this.ruleForm.contactWay
        search.feedback = this.ruleForm.feedback
        this.loading2 = true
        getSuggestionList(this.pageNum, this.pageSize, search).then(re => {
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
      // 删除反馈
      handleDelete(index, row) {
        this.$confirm('你确定要删除该意见反馈吗?')
          .then(_ => {
            this.loading2 = true
            delSuggestion(row.id).then(re => {
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
