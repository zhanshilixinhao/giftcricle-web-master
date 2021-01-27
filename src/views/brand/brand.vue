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
<!--      <el-table-column width="100" label="logo" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.logo"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.logo"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>-->

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
    <el-dialog title="添加品牌" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="品牌名称">
          <el-input  v-model="addForm.name">
          </el-input>
        </el-form-item>
       <!-- <el-form-item label="logo" prop="imageUriList">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="images"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :on-error="handleError"
            :on-remove="handleRemove">
            <i v-if="addForm.imageUriList.length < 1" class="el-icon-plus"></i>
            &lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，尺寸750X500，大小不超过150KB</div>&ndash;&gt;
          </el-upload>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBack()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisiblePiture">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog title="修改品牌" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="updateForm" label-width="100px">
        <el-form-item label="品牌名称">
          <el-input  v-model="updateForm.name">
          </el-input>
        </el-form-item>
        <!--<el-form-item label="logo">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="images2"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess2"
            :before-upload="handleBeforeUpload2"
            :on-error="handleError2"
            :on-remove="handleRemove2">
            <i v-if="updateForm.imageUriList2.length < 1" class="el-icon-plus"></i>
            &lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，尺寸750X500，大小不超过150KB</div>&ndash;&gt;
          </el-upload>
        </el-form-item>-->
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
  import { getBrandList, delBrand, addBrand, updateBrand } from '@/api/brand/brand'

  var moment = require('moment')

  export default {
    components: { ElRow },
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        pictureUrl: process.env.BASE_IMAGES_API,
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        images: [],
        images2: [],
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
          name: '',
          imageUriList: [],
          requesturl: ''
        },
        dialogUpdateVisible: false,
        updateForm: {
          id: null,
          name: '',
          imageUriList2: [],
          requesturl: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加分类窗口打开
      add() {
        this.addForm.name = ''
        this.dialogVisible = true
      },
      // 添加分类取消
      addBack() {
        this.dialogVisible = false
        this.addForm.name = ''
        this.addForm.imageUriList = []
        this.images = []
      },
      // 添加分类提交
      addSubmit() {
        if (this.addForm.name.trim() === '') {
          this.$message.error('请填写品牌名称!')
          return
        }
  /*      if (this.addForm.imageUriList.length === 0) {
          this.$message.error('至少上传一张图片')
          return
        }*/
       // addBrand(this.addForm.name, this.addForm.imageUriList[0]).then(re => {
        addBrand(this.addForm.name, '').then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('添加成功!')
            this.dialogVisible = false
            this.addForm.name = ''
            this.addForm.imageUriList = []
            this.images = []
            this.getList()
            return
          } else {
            this.$message.error('添加失败!')
          }
        })
      },
      // 编辑分类窗口打开
      handleEdit(index, row) {
        this.images2 = []
        this.updateForm.imageUriList2 = []
        this.updateForm.id = row.id
        this.updateForm.name = row.name
        var obj = {}
        obj.url = process.env.BASE_IMAGES_API + row.logo
        obj.name = row.logo
        this.images2.push(obj)
        this.updateForm.imageUriList2.push(row.logo)
        this.dialogUpdateVisible = true
      },
      // 编辑分类取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.updateForm.name = ''
        this.updateForm.id = null
        this.images2 = []
        this.updateForm.imageUriList2 = []
      },
      // 编辑分类提交
      updateSubmit() {
        if (this.updateForm.name.trim() === '') {
          this.$message.error('请填写品牌名称!')
          return
        }
/*        if (this.updateForm.imageUriList2.length === 0) {
          this.$message.error('至少上传一张图片')
          return
        }*/
        // updateBrand(this.updateForm.id, this.updateForm.name, this.updateForm.imageUriList2[0]).then(re => {
        updateBrand(this.updateForm.id, this.updateForm.name, '').then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('修改成功!')
            this.dialogUpdateVisible = false
            this.updateForm.name = ''
            this.images2 = []
            this.imageUriList2 = []
            this.updateForm.id = null
            this.getList()
            return
          } else {
            this.$message.error('修改失败!')
          }
        })
      },
      // 图片上传失败
      handleError(errors, file, fileList) {
        this.$message({
          message: '图片上传时错误，请检查图片格式及大小是否超过200kb',
          type: 'error'
        })
      },
      // 图片上传之前
      handleBeforeUpload(file) {
        if (this.addForm.imageUriList.length < 1) {
          return true
        } else {
          this.$message({
            message: '只能上传一张图片',
            type: 'error'
          })
          return false
        }
      },
      // 移除一张图片
      handleRemove(file, fileList) {
        console.log(this.addForm.imageUriList)
        // 将删除的这张图从图片列表中移除
        for (let i = 0; i < this.addForm.imageUriList.length; i++) {
          // 如果存在这张图
          if (this.addForm.imageUriList[i] === file.name) {
            // 移除
            this.addForm.imageUriList.splice(i, 1)
            break
          }
        }
        console.log(this.addForm.imageUriList)
      },
      // 图片上传成功
      handleSuccess(re, file, fileList) {
        file.name = re.name
        this.addForm.imageUriList.push(re.name)
        console.log(this.addForm.imageUriList)
      },
      // 图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisiblePiture = true
      },
      // 图片上传失败
      handleError2(errors, file, fileList) {
        this.$message({
          message: '图片上传时错误，请检查图片格式及大小是否超过200kb',
          type: 'error'
        })
      },
      // 图片上传之前
      handleBeforeUpload2(file) {
        if (this.updateForm.imageUriList2.length < 1) {
          return true
        } else {
          this.$message({
            message: '只能上传一张图片',
            type: 'error'
          })
          return false
        }
      },
      // 移除一张图片
      handleRemove2(file, fileList) {
        console.log(this.updateForm.imageUriList2)
        // 将删除的这张图从图片列表中移除
        for (let i = 0; i < this.updateForm.imageUriList2.length; i++) {
          // 如果存在这张图
          if (this.updateForm.imageUriList2[i] === file.name) {
            // 移除
            this.updateForm.imageUriList2.splice(i, 1)
            break
          }
        }
        console.log(this.updateForm.imageUriList2)
      },
      // 图片上传成功
      handleSuccess2(re, file, fileList) {
        file.name = re.name
        this.updateForm.imageUriList2.push(re.name)
        console.log(this.updateForm.imageUriList2)
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取品牌分类列表
      getList() {
        var name = this.ruleForm.name
        this.loading2 = true
        getBrandList(this.pageNum, this.pageSize, name).then(re => {
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
      // 删除分类
      handleDelete(index, row) {
        this.$confirm('你确定要删除该品牌吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delBrand(row.id).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: '品牌删除成功!',
                  type: 'success'
                })
                this.getList()
              }
              if (re.data.errCode === 1) {
                this.$message.error('品牌删除失败!')
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
