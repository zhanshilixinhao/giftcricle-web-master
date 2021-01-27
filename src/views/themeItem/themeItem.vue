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
                <el-input v-model="ruleForm.name" placeholder="商品名称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主题商品状态" prop="status">
                <el-select v-model="ruleForm.status" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="主题选择" prop="theme">
                <el-select v-model="ruleForm.theme" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in themeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
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
        <el-button type="primary" @click="addTheme()">添加主题商品</el-button>
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
                     size="small" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 1"
                     size="small" type="success">启用</el-tag>
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
        prop="themeId"
        show-overflow-tooltip="true"
        label="主题名称"
        :formatter="themeFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        width="100%"
        label="排序值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        width="160%"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updated"
        width="160%"
        label="修改时间"
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
          <el-button v-if="scope.row.status == 1"
             size="mini"
             type="danger"
             icon="close"
             @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.status == 2"
             size="mini"
             type="success"
             icon="check"
             @click="handleStatus(scope.$index, scope.row)">启用
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
    <el-dialog title="主题选择" :visible.sync="themeVisible">
      <el-select v-model="themes" filterable placeholder="请先选择主题" style="width: 100%" icon="el-icon-search" @change="themeChange">
        <el-option
          v-for="item in addThemeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backTheme()">取 消</el-button>
        <el-button type="primary" @click="add()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="themeName" :visible.sync="dialogVisible" size="tiny"  center>
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
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置排序值" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="updateForm" label-width="100px">
        <el-form-item label="排序值">
          <el-input  v-model="updateForm.sort" type="number">
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
  import { getAllTheme } from '@/api/gift/themeItem/theme'
  import { getThemeItemList, delThemeItem, addThemeItem, changeStatus, updateThemeItemSort } from '@/api/gift/themeItem/themeItem'
  import { getItemList } from '@/api/gift/item/item'
  var moment = require('moment')

  export default {
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        dialogVisiblePiture: false,
        pictureUrl: process.env.BASE_IMAGES_API,
        statusOptions: [{ value: '', name: '请选择' }, { value: 1, name: '启用' }, { value: 2, name: '禁用' }],
        themeOptions: [],
        addThemeOptions: [],
        dialogImageUrl: '',
        themes: '',
        themeName: '',
        images: [],
        images2: [],
        tableData3: [],
        tableData4: [],
        multipleTable: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageNum2: 1,
        pageSize2: 10,
        total2: 0,
        loading2: false,
        ruleForm: {
          name: '',
          status: '',
          theme: ''
        },
        dialogVisible: false,
        themeVisible: false,
        addForm: {
          name: '',
          imageUriList: [],
          requesturl: ''
        },
        dialogUpdateVisible: false,
        updateForm: {
          id: null,
          sort: null
        }
      }
    },
    mounted() {
      getAllTheme().then(re => {
        this.themeOptions = re.data.data
        this.addThemeOptions = re.data.data
      })
      this.getList()
    },
    methods: {
      themeChange(val) {
        for (var i = 0; i < this.themeOptions.length; i++) {
          if (this.themeOptions[i].id === val) {
            this.themeName = this.themeOptions[i].name
          }
        }
      },
      // 主题格式化
      themeFormat: function(row, column) {
        var brand = row[column.property]
        for (var i = 0; i < this.themeOptions.length; i++) {
          if (this.themeOptions[i].id === brand) {
            return this.themeOptions[i].name
          }
        }
        return ''
      },
      handleSelectionChange(value) {
        this.multipleTable = value
      },
      // 改变主题状态
      handleStatus(index, row) {
        var status = row.status
        if (status === 1) {
          status = 2
        } else {
          status = 1
        }
        changeStatus(row.id, status).then(re => {
          if (re.data.errCode !== 0) {
            this.$message.error(re.data.msg)
          } else {
            this.getList()
          }
        })
      },
      // 打开主题窗口
      addTheme() {
        this.themeVisible = true
      },
      // 关闭主题窗口
      backTheme() {
        this.themes = ''
        this.themeVisible = false
      },
      // 添加主题窗口打开
      add() {
        if (this.themes === '') {
          this.$message.error('请先选择主题')
          return
        }
        this.addForm.name = ''
        this.getItemList()
        this.dialogVisible = true
      },
      // 添加主题取消
      addBack(rows) {
        this.dialogVisible = false
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
      // 添加主题提交
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
        addThemeItem(this.themes, ids).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.addForm.name = ''
            this.addForm.imageUriList = []
            this.images = []
            // 关闭选择主题窗口
            this.backTheme()
            // 刷新页面
            this.getList()
            return
          } else {
            if (re.data.errCode === 1) {
              for (var i = 0; i < this.tableData4.length; i++) {
                if (this.tableData4[i].id === parseInt(re.data.msg)) {
                  this.$message.error('商品' + this.tableData4[i].title + '已加入该主题,请重新选择!')
                  return
                }
              }
            } else {
              this.$message.error(re.data.msg)
            }
          }
        })
      },
      // 编辑主题窗口打开
      handleEdit(index, row) {
        this.updateForm.id = row.id
        this.updateForm.sort = row.sort
        this.dialogUpdateVisible = true
      },
      // 编辑主题取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.updateForm.id = null
        this.updateForm.sort = null
      },
      // 编辑主题提交
      updateSubmit() {
        if (this.updateForm.sort !== null && this.updateForm.sort !== '') {
          var re = /^[0-9]+$/
          if (re.test(this.updateForm.sort) === false) {
            this.$message.error('排序值必须为正整数!')
            return
          }
        }
        var theme = {}
        theme.id = this.updateForm.id
        theme.sort = this.updateForm.sort
        updateThemeItemSort(theme).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUpdateVisible = false
            this.updateForm.id = null
            this.updateForm.sort = null
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
      itemSearch() {
        this.pageNum2 = 1
        this.getItemList()
      },
      // 获取主题主题列表
      getList() {
        var search = {}
        search.name = this.ruleForm.name
        search.status = this.ruleForm.status
        search.theme = this.ruleForm.theme
        this.loading2 = true
        getThemeItemList(this.pageNum, this.pageSize, search).then(re => {
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
          this.tableData4 = re.data.data
          this.total2 = re.data.total
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
      // 删除主题
      handleDelete(index, row) {
        this.$confirm('你确定要删除该主题商品吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delThemeItem(row.id).then(re => {
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
