<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="品牌名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="品牌名称" type="text" ></el-input>
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
        <el-button type="primary" @click="add()">添加品牌</el-button>
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
        prop="name"
        label="品牌名称">
      </el-table-column>
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
    <el-dialog title="新增虚拟商品品牌" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="brandForm">
        <el-form-item label="虚拟商品品牌名称">
          <el-input  v-model="brandForm.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改虚拟商品品牌" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="brandUpdateForm">
        <el-form-item label="虚拟商品品牌名称">
          <el-input  v-model="brandUpdateForm.name">
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
  import { getVirItemBrandList, delVirItemBrand, addVirItemBrand, updateVirItemBrand } from '@/api/gift/virItem/virItemBrand'

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
          name: ''
        },
        dialogVisible: false,
        brandForm: {
          name: ''
        },
        dialogUpdateVisible: false,
        brandUpdateForm: {
          id: null,
          name: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加分类窗口打开
      add() {
        this.brandForm.name = ''
        this.dialogVisible = true
      },
      // 添加分类取消
      addBack() {
        this.dialogVisible = false
        this.brandForm.name = ''
      },
      // 添加分类提交
      addSubmit() {
        if (this.brandForm.name.trim() === '') {
          this.$message.error('请填写虚拟商品品牌名称!')
          return
        }
        addVirItemBrand(this.brandForm.name).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.brandForm.name = ''
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 编辑分类窗口打开
      handleEdit(index, row) {
        this.brandUpdateForm.id = row.id
        this.brandUpdateForm.name = row.name
        this.dialogUpdateVisible = true
      },
      // 编辑分类取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.brandUpdateForm.name = ''
        this.brandUpdateForm.id = null
      },
      // 编辑分类提交
      updateSubmit() {
        if (this.brandUpdateForm.name.trim() === '') {
          this.$message.error('请填写虚拟商品品牌名称!')
          return
        }
        updateVirItemBrand(this.brandUpdateForm.id, this.brandUpdateForm.name).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('修改成功!')
            this.dialogUpdateVisible = false
            this.brandUpdateForm.name = ''
            this.brandUpdateForm.id = null
            this.getList()
            return
          } else {
            this.$message.error('修改失败!')
          }
        })
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商品分类列表
      getList() {
        var name = this.ruleForm.name
        this.loading2 = true
        getVirItemBrandList(this.pageNum, this.pageSize, name).then(re => {
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
      // 删除虚拟商品品牌
      handleDelete(index, row) {
        this.$confirm('你确定要删除该品牌吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delVirItemBrand(row.id).then(re => {
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
