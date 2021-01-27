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
              <el-form-item label="用户电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="用户电话" type="text" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="商品标题" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单号" prop="orderNo">
                <el-input v-model="ruleForm.orderNo" placeholder="订单号" type="text" ></el-input>
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
        align="center"
        label="商品标题">
      </el-table-column>

      <el-table-column property="cover" label="封面图片"  align="center" width="155px">
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
        prop="nickname"
        label="用户昵称"
        show-overflow-tooltip="true"
        align="center">
      </el-table-column>

      <el-table-column
        prop="phone"
        align="center"
        label="用户电话">
      </el-table-column>

      <el-table-column
        prop="orderNo"
        align="center"
        label="订单号">
      </el-table-column>


      <el-table-column label="评价详情" align="center" width="140px">
        <template scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="getCommentDetail(scope.$index, scope.row)">查看
          </el-button>
        </template>
      </el-table-column>


      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        :formatter="dateFormat"
        width="155px">
      </el-table-column>

      <el-table-column label="操作" align="center"  width="200px">
        <template scope="scope">
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <el-dialog title="评价详情" :visible.sync="commentDetail" width="80%">
      <el-form :label-position="top" label-width="100px" :model="form">
        <el-form-item label="评分星值">
          <el-rate
            v-model="form.star"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </el-form-item>
        <el-form-item label="评价内容">
          <span>{{form.content}}</span>
        </el-form-item>
        <el-form-item label="评价图片">
          <div v-for="pic in form.pictures">
            <img :src="pic"/>
          </div>
          <!--<el-popover trigger="click" placement="center">-->
            <!--<img-->
              <!--:src="pic" v-for="pic in form.pictures"/>-->
            <!--<div slot="reference" class="name-wrapper">-->
              <!--<img class="cover"-->
                   <!--:src="pic" v-for="pic in form.pictures"/>-->
            <!--</div>-->
          <!--</el-popover>-->
        </el-form-item>
      </el-form>
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
  import { getCommentList, deleteComment, getContentDetail } from '@/api/order/orderComment'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        commentDetail: false,
        id: '',
        ruleForm: {
          nickname: '',
          phone: '',
          orderNo: '',
          title: ''
        },
        form: {
          star: '',
          content: '',
          pictures: []
        }
      }
    },
    mounted() {
      this.getList()
      this.$store.getters.sidebar.commentCount = 0
    },
    methods: {
      // 搜索用户
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取用户列表
      getList() {
        var search = {}
        search.nickname = this.ruleForm.nickname
        search.title = this.ruleForm.title
        search.phone = this.ruleForm.phone
        search.orderNo = this.ruleForm.orderNo
        this.loading2 = true
        getCommentList(this.pageNum, this.pageSize, search).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 查看评价详情
      getCommentDetail(index, row) {
        this.commentDetail = true
        getContentDetail(row.id).then(re => {
          this.form.star = re.data.data.star
          this.form.content = re.data.data.content
          var pic = JSON.parse(re.data.data.pictures)
          this.form.pictures = []
          pic.forEach(item => {
            this.form.pictures.push(this.pictureUrl + item)
          })
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
      // 删除订单评价
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            deleteComment(row.id).then(re => {
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


