<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="文章标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="文章标题" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="文章类型" prop="type">
              <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                <el-option
                  v-for="item in typeOptions"
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
        <el-button type="primary" @click="add()">添加文章</el-button>
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
      <el-table-column width="100%" label="文章封面" align="center">
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
        prop="status"
        align="center"
        width="80%"
        label="文章状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                  size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 1"
                  size="small" type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="文章类型"
        align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 1"
                  size="small" type="success">今日推荐</el-tag>
          <el-tag v-if="scope.row.type !== 1"
                  size="small" type="primary">普通文章</el-tag>
<!--          <el-tag v-if="scope.row.type === 2"-->
<!--                  size="small" type="info">星座文章</el-tag>-->
<!--          <el-tag v-if="scope.row.type === 4"-->
<!--                  size="small" type="warning">商城文章</el-tag>-->
<!--          <el-tag v-if="scope.row.type === 3"-->
<!--                  size="small" type="primary">首页文章</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="文章标题"
        show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="detail"
        align="center"
        width="100%"
        label="文章详情">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="search"
            @click="handleItemDetail(scope.$index, scope.row)">点击查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序值"
        align="center"
        width="80%">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="showTime"-->
<!--        label="展示时间"-->
<!--        align="center"-->
<!--        width="155%"-->
<!--        :formatter="dateFormat">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="基本操作" align="center" width="350%">
        <template scope="scope">
          <el-button
            size="mini"
            type="success"
            icon="delete"
            @click="manageItem(scope.$index, scope.row)">商品管理
          </el-button>
          <el-button v-if="scope.row.status === 1"
           size="mini"
           type="danger"
           icon="close"
           @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.status === 2"
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
    <el-dialog
      title="文章详情"
      :visible.sync="dialogVisibleDetail"
      size="small"
      :before-close="handleClose">
      <div v-html="detail"></div>
    </el-dialog>

    <!--文章商品-->
    <el-dialog title="文章商品列表" :visible.sync="dialogVisible"  >
      <div>
          <el-button type="primary" @click="addItem()">添加商品</el-button>
          <el-button type="primary"  @click="addBack()">返回</el-button>
      </div>
      <br>
      <el-table
        ref="multipleTable"
        :data="tableData4"
        stripe
        border>
        <el-table-column
          prop="title"
          label="文章标题"
          show-overflow-tooltip="true"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column width="100" label="商品封面" align="center">
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
          prop="name"
          show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          width="110%"
          label="商品价格">
        </el-table-column>
        <el-table-column label="基本操作" align="center" width="100%">
          <template scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="delete"
              @click="deleteItem(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--添加文章商品-->
    <el-dialog :title="title" :visible.sync="dialogVisibleItem" size="tiny"  >
      <el-form :model="addForm" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name" placeholder="商品名称" type="text" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="itemSearch()">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData5"
        @selection-change="handleSelectionChange"
        stripe
        border>
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column width="100" label="商品封面" align="center">
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
          label="商品名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          width="160%"
          label="商品价格">
        </el-table-column>
      </el-table>
      <div class="block" style="width: 100%;float: right;margin-top: 16px;margin-bottom: 16px">
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page.sync="pageNum2"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize2"
          layout="sizes, prev, pager, next, total, jumper"
          :total="total2">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addItemBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
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
  import { getArticleList, changeStatus, delArticleApi, getArticleItemList, addArticleItem, delArticleItem } from '@/api/gift/article/article'
  import { getItemList } from '@/api/gift/item/item'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        pictureUrl: process.env.BASE_IMAGES_API,
        // typeOptions: [{ value: 1, name: '今日推荐(banner文章)' }, { value: 1, name: 'banner文章' }, { value: 2, name: '星座文章' }, { value: 3, name: '首页文章' }, { value: 4, name: '商城文章' }],
        typeOptions: [{ value: 1, name: '今日推荐' },  { value: 5, name: '普通文章' },{ value: 6, name: '活动通知' }],
        tableData3: [],
        tableData4: [],
        tableData5: [],
        multipleTable: [],
        dialogVisible: false,
        dialogVisibleItem: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageNum2: 1,
        pageSize2: 10,
        total2: 0,
        title: '',
        articleId: '',
        dialogVisibleDetail: false,
        loading2: false,
        detail: '',
        ruleForm: {
          title: '',
          type: ''
        },
        addForm: {
          name: '',
          imageUriList: [],
          requesturl: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 管理商品,商品列表
      manageItem(index, row) {
        this.articleId = row.id
        this.dialogVisible = true
        this.getArticleItems()
      },
      // 获取文章商品列表
      getArticleItems() {
        getArticleItemList(this.articleId).then(re => {
          this.tableData4 = re.data.data
        })
      },
      // 取消管理商品,商品列表
      addBack() {
        this.dialogVisible = false
      },
      // 管理商品，添加商品
      addItem(index, row) {
        this.addForm.name = ''
        this.getItemList()
        this.dialogVisibleItem = true
      },
      handleSelectionChange(value) {
        this.multipleTable = value
      },
      // 添加商品提交
      addSubmit() {
        if (this.multipleTable.length === 0) {
          this.$message.error('请先选择商品')
          return
        }
        var ids = ''
        for (var i = 0; i < this.multipleTable.length; i++) {
          if (i === (this.multipleTable.length - 1)) {
            ids = ids + this.multipleTable[i].id
          } else {
            ids = ids + this.multipleTable[i].id + ','
          }
        }
        addArticleItem(this.articleId, ids).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisibleItem = false
            this.addForm.name = ''
            this.addForm.imageUriList = []
            this.images = []
            // 关闭选择标签窗口
            this.addItemBack()
            // 刷新页面
            this.getArticleItems()()
            return
          } else {
            if (re.data.errCode === 1) {
              for (var i = 0; i < this.tableData4.length; i++) {
                if (this.tableData4[i].id === parseInt(re.data.msg)) {
                  this.$message.error('商品' + this.tableData4[i].title + '已加入该标签,请重新选择!')
                  return
                }
              }
            } else {
              this.$message.error(re.data.msg)
            }
          }
        })
      },
      // 取消管理，添加商品
      addItemBack(rows) {
        this.dialogVisibleItem = false
        this.addForm.name = ''
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
        this.multipleTable = []
      },
      // 处理文章详情
      handleItemDetail(index, row) {
        this.detail = row.detail
        this.dialogVisibleDetail = true
      },
      // 添加文章
      add() {
        this.$router.push('/article/add')
      },
      // 搜索文章
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      itemSearch() {
        this.pageNum2 = 1
        this.getItemList()
      },
      // 获取文章列表
      getList() {
        var name = this.ruleForm.title
        var type = this.ruleForm.type
        this.loading2 = true
        getArticleList(this.pageNum, this.pageSize, name, type).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 获取商品列表
      getItemList() {
        var search = {}
        search.title = this.addForm.name
        var permissionId = 1083
        getItemList(this.pageNum2, this.pageSize2, search, permissionId).then(re => {
          this.tableData5 = re.data.data
          this.total2 = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
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
      // 改变文章状态
      handleStatus(index, row) {
        var status = row.status
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
      // 调整每页显示的行数
      handleSizeChange2(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize2 = val
        this.pageNum2 = 1
        this.getItemList()
      },
      // 调整分页
      handleCurrentChange2(val) {
        console.log(`当前页: ${val}`)
        this.pageNum2 = val
        this.getItemList()
      },
      // 编辑文章
      handleEdit(index, row) {
        this.$router.push('/article/edit/' + row.id)
      },
      // 删除文章
      handleDelete(index, row) {
        this.$confirm('你确定要删除该文章吗?')
          .then(_ => {
            this.loading2 = true
            delArticleApi(row.id).then(re => {
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
      deleteItem(index, row) {
        this.$confirm('你确定要删除该商品吗?')
          .then(_ => {
            this.loading2 = true
            delArticleItem(row.id).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.getArticleItems()
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
