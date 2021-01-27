<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="商品名称" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期" prop="day">
                <el-date-picker
                  v-model="ruleForm.day"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
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
        <el-button type="primary" @click="addReItem()">添加商品</el-button>
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
        prop="status"
        width="100%"
        label="状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                  size="small" type="danger">禁用
          </el-tag>
          <el-tag v-if="scope.row.status === 1"
                  size="small" type="success">启用
          </el-tag>
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
        prop="sort"
        width="100%"
        label="排序值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="day"
        width="160%"
        label="展示日期"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        width="160%"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="320%">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="edit"
            @click="handleEdit(scope.$index, scope.row)">设置排序值
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


    <el-dialog title="日期选择" :visible.sync="recommendVisible">
      <div class="block">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recommendVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择商品" :visible.sync="dialogVisible" size="tiny"  center>
      <el-form :model="addForm" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name" placeholder="商品名称" type="text"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="itemSearch()">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData4"
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置排序值" :visible.sync="dialogUpdateVisible" size="tiny" :show-close="false"
               :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="updateForm" label-width="100px">
        <el-form-item label="排序值">
          <el-input v-model="updateForm.sort" type="number">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
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
  import {
    getRecommendList,
    addRecommendItem,
    delRecommendItem,
    sortRecommendItem
  } from '../../api/gift/item/recommend'
  import ElRow from 'element-ui/packages/row/src/row'
  import { getItemList } from '@/api/gift/item/item'

  var moment = require('moment')

  export default {
    components: {
      ElRow
    },
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        pictureUrl: process.env.BASE_IMAGES_API,
        day: '',
        dialogVisible: false,
        dialogUpdateVisible: false,
        recommendVisible: false,
        tableData3: [],
        tableData4: [],
        multipleTable: [],
        id: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageNum2: 1,
        pageSize2: 10,
        total2: 0,
        loading2: false,
        ruleForm: {
          name: '',
          day: ''
        },
        addForm: {
          name: ''
        },
        updateForm: {
          sort: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 获取列表
      getList: function() {
        var search = {}
        search.pageNum = this.pageNum
        search.pageSize = this.pageSize
        search.name = this.ruleForm.name
        if (this.ruleForm.day) {
          search.day = moment(this.ruleForm.day)._d.getTime()
        }
        this.loading2 = true
        getRecommendList(search).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 添加商品
      addReItem() {
        this.day = ''
        this.recommendVisible = true
      },
      add() {
        if (!this.day) {
          this.$message.error('请选择日期')
          return
        }
        this.dialogVisible = true
        this.getItemList()
      },
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
        addRecommendItem({ day: moment(this.day)._d.getTime(), ids: ids }).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.addForm.name = ''
            this.recommendVisible = false
            // 刷新页面
            this.getList()
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
      // 设置排序值()
      handleEdit(index, row) {
        this.dialogUpdateVisible = true
        this.id = row.id
        this.updateForm.sort = row.sort
      },
      // 获取商品列表
      getItemList() {
        var search = {}
        search.title = this.addForm.name
        var permissionId = 1083
        getItemList(this.pageNum2, this.pageSize2, search, permissionId).then(re => {
          this.tableData4 = re.data.data
          this.total2 = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      updateSubmit() {
        sortRecommendItem({ id: this.id, sort: this.updateForm.sort }).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              type: 'success',
              message: '设置成功'
            })
            this.getList()
            this.dialogUpdateVisible = false
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 删除商品
      handleDelete(index, row) {
        this.$confirm('你确定要删除该商品吗?')
          .then(_ => {
            this.loading2 = true
            delRecommendItem({ id: row.id }).then(re => {
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
      handleSelectionChange(value) {
        this.multipleTable = value
      },
      // -------------------------------------------------常用----------------------------------------------------------
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
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      itemSearch() {
        this.pageNum2 = 1
        this.getItemList()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
