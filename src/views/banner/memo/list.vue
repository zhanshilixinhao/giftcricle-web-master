<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="节日事件名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="节日事件名称" type="text"></el-input>
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
        <el-button type="primary" @click="add()">添加节日事件</el-button>
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
        width="70%"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        show-overflow-tooltip
        width="170%"
        align="center">
      </el-table-column>
      <el-table-column
        prop="summary"
        align="center"
        show-overflow-tooltip
        width="170%"
        label="简介">
      </el-table-column>
      <el-table-column width="100" label="封面" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.cover"/>
            <div slot="reference" class="name-wrapper">
              <img style="width: 80px;height: 80px"
                   :src="pictureUrl + scope.row.cover"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        width="100%"
        label="详情标题"
        align="center">
      </el-table-column>
      <el-table-column width="100" label="详情图片" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.picture"/>
            <div slot="reference" class="name-wrapper">
              <img style="width: 80px;height: 80px"
                   :src="pictureUrl + scope.row.picture"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="detail"
        align="center"
        show-overflow-tooltip
        width="170%"
        label="详情描述">
      </el-table-column>

      <el-table-column
        prop="targetTime"
        align="center"
        width="155%"
        label="节日事件时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>

      <el-table-column label="基本操作" align="center" width="300%">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="edit"
            @click="manageItem(scope.$index, scope.row)">商品管理
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

    <!--节日商品列表-->
    <el-dialog title="节日商品列表" :visible.sync="dialogVisible" >
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
          prop="name"
          label="节日名称"
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
          prop="title"
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

    <!--添加节日商品-->
    <el-dialog :title="title" :visible.sync="dialogVisibleItem" size="tiny">
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

<script>
  import { getMemoFestivalList, delFestivalItem, getFestivalItemList, delMemoFestival, addFestivalItem} from "../../../api/home/banner/memo";
  import { getItemList } from '@/api/gift/item/item'

  var moment = require('moment')
  export default {
    data() {
      return {
        loading2: false,
        tableData3: [],
        tableData4: [],
        tableData5: [],
        pictureUrl: process.env.BASE_IMAGES_API,
        title: '',
        pageNum: 1,
        id: '',
        dialogVisible: false,
        dialogVisibleItem: false,
        pageSize: 10,
        total: 0,
        pageNum2: 1,
        pageSize2: 10,
        total2: 0,
        ruleForm: {
          name: ''
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
      // 添加
      add() {
        this.$router.push('/banner/memoAdd')
      },
      // 修改
      handleEdit(index, row) {
        this.$router.push('/banner/memoEdit/' + row.id)
      },
      // 管理商品,商品列表
      manageItem(index, row) {
        this.id = row.id
        this.dialogVisible = true
        this.getItems()
      },
      // 获取节日商品列表
      getItems() {
        getFestivalItemList({ id: this.id }).then(re => {
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
        addFestivalItem({ festivalId: this.id, ids: ids }).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisibleItem = false
            this.addForm.name = ''
            this.addForm.imageUriList = []
            this.images = []
            // 关闭选择标签窗口
            this.addItemBack()
            // 刷新页面
            this.getItems()
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
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 搜索商品
      itemSearch() {
        this.pageNum2 = 1
        this.getItemList()
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
      // 调整每页显示的行数2
      handleSizeChange2(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize2 = val
        this.pageNum2 = 1
        this.getItemList()
      },
      // 调整分页2
      handleCurrentChange2(val) {
        console.log(`当前页: ${val}`)
        this.pageNum2 = val
        this.getItemList()
      },
      getList() {
        this.loading2 = true
        getMemoFestivalList({ pageNum: this.pageNum, pageSize: this.pageSize, name: this.ruleForm.name }).then(re => {
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
      // 删除节日
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            delMemoFestival({ id: row.id }).then(re => {
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
      // 删除商品
      deleteItem(index, row) {
        this.$confirm('你确定要删除该商品吗?')
          .then(_ => {
            this.loading2 = true
            delFestivalItem({ id: row.id }).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.getItems()
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

<style scoped>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
