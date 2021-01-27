<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优惠券名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="优惠券名称" type="text" ></el-input>
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
      <el-table-column width="100" label="优惠券图片" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.cover"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.cover"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="title"
        show-overflow-tooltip="true"
        label="优惠券名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="nickname"
        show-overflow-tooltip="true"
        label="核销用户昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="核销用户电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="bpId"
        label="核销码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        width="160%"
        label="核销时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="350px">
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

    <el-dialog :visible.sync="dialogVisiblePiture">
      <img :src="dialogImageUrl" alt="">
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
  import { getUseRecordList, deleteUseRecord } from '../../api/gift/coupon/coupon'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        ruleForm: {
          title: '',
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
      // 获取优惠券优惠券列表
      getList() {
        var title = this.ruleForm.title
        var adminId = 1
        this.loading2 = true
        getUseRecordList({pageNum:this.pageNum, pageSize:this.pageSize, title:title}).then(re => {
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
      // 删除优惠券
      handleDelete(index, row) {
        this.$confirm('你确定要删除该记录吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            deleteUseRecord({useId:row.id}).then(re => {
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
