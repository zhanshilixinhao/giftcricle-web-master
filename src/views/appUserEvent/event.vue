<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="送礼事件名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="送礼事件名称" type="text" ></el-input>
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
        <el-button type="primary" @click="add()">添加送礼事件</el-button>
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
        prop="eventName"
        label="送礼事件名称">
      </el-table-column>
      <!--<el-table-column-->
        <!--align="center"-->
        <!--prop="nickname"-->
        <!--label="事件创建者">-->
      <!--</el-table-column>-->
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
      <el-table-column label="操作" align="center">
        <template scope="scope">
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
    <el-dialog title="添加送礼事件" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="送礼事件名称">
          <el-input  v-model="addForm.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisiblePiture">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog title="修改送礼事件" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="updateForm" label-width="100px">
        <el-form-item label="送礼事件名称">
          <el-input  v-model="updateForm.name">
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
  import { getEventList, delEvent, addEvent, updateEvent } from '@/api/appUser/appUserEvent'

  var moment = require('moment')

  export default {
    components: { ElRow },
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          name: ''
        },
        dialogVisible: false,
        addForm: {
          name: ''
        },
        dialogUpdateVisible: false,
        updateForm: {
          id: null,
          name: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加送礼事件窗口打开
      add() {
        this.addForm.name = ''
        this.dialogVisible = true
      },
      // 添加送礼事件取消
      addBack() {
        this.dialogVisible = false
        this.addForm.name = ''
      },
      // 添加送礼事件提交
      addSubmit() {
        if (this.addForm.name.trim() === '') {
          this.$message.error('请填写送礼事件名称!')
          return
        }
        addEvent(this.addForm.name).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.addForm.name = ''
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 编辑送礼事件窗口打开
      handleEdit(index, row) {
        this.updateForm.id = row.id
        this.updateForm.name = row.eventName
        this.dialogUpdateVisible = true
      },
      // 编辑送礼事件取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.updateForm.name = ''
        this.updateForm.id = null
      },
      // 编辑送礼事件提交
      updateSubmit() {
        if (this.updateForm.name.trim() === '') {
          this.$message.error('请填写送礼事件名称!')
          return
        }
        updateEvent(this.updateForm.id, this.updateForm.name).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUpdateVisible = false
            this.updateForm.name = ''
            this.updateForm.id = null
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
      // 获取送礼事件送礼事件列表
      getList() {
        var name = this.ruleForm.name
        this.loading2 = true
        getEventList(this.pageNum, this.pageSize, name).then(re => {
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
      // 删除送礼事件
      handleDelete(index, row) {
        this.$confirm('你确定要删除该送礼事件吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delEvent(row.id).then(re => {
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
