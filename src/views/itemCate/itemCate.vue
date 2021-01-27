<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="分类名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="分类名称" type="text" ></el-input>
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
        <el-button type="primary" @click="add()">添加分类</el-button>
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
        prop="status"
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
        label="父级分类名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序值">
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
        label="下一级分类">
        <template scope="scope">
          <el-button v-if="scope.row.id !==0"
                     size="mini"
                     type="success"
                     @click="categorySecond(scope.$index, scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320px">
        <template scope="scope">
          <el-button v-if="scope.row.status === 1 && scope.row.id !==0"
            size="mini"
            type="danger"
            @click="handleStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button v-if="scope.row.status === 2 && scope.row.id !==0"
            size="mini"
            type="success"
            @click="handleStatus(scope.$index, scope.row)">启用
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
          <el-button
            v-if="scope.row.id !==0"
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


    <el-dialog title="新增商品分类" :visible.sync="dialogVisible" size="tiny" >
      <el-form :model="cateForm">
        <el-form-item label="商品分类名称">
          <el-input  v-model="cateForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="imageUrlWx">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccessWx"
            :before-upload="beforeAvatarUploadWx"
            :on-error="handleAvatarErrorWx"
            :on-preview="handleAvatarPictureCardPreviewWx">
            <img v-if="cateForm.imageUrlWx" :src="icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传200KB以内的jpg、png格式图片</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改商品分类" :visible.sync="dialogUpdateVisible" size="tiny" >
      <el-form :model="cateUpdateForm">
        <el-form-item label="商品分类名称">
          <el-input :disabled="cateUpdateForm.id === 0" v-model="cateUpdateForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input  v-model="cateUpdateForm.sort" type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
            :on-preview="handleAvatarPictureCardPreview">
            <img v-if="cateUpdateForm.imageUrl" :src="icon1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传200KB以内的jpg、png格式图片</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSubmit()">提 交</el-button>
      </div>
    </el-dialog>

    <!--    下级分类-->
    <el-dialog title="下一级分类" :visible.sync="categoryDialogVisible" size="tiny" >
      <div>
          <el-button type="primary" size="small" @click="addCategorySecond()">添加</el-button>
      </div>
     <br/>
      <el-table
        :data="tableData4"
        stripe
        border>
        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态">
          <template scope="scope">
            <el-tag v-if="scope.row.status === 2"
                    size="small" type="danger">禁用</el-tag>
            <el-tag v-if="scope.row.status === 1"
                    size="small" type="success">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="分类名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sort"
          label="排序值">
        </el-table-column>
        <el-table-column
          align="center"
          prop="created"
          label="创建时间"
          :formatter="dateFormat">
        </el-table-column>

        <el-table-column label="操作" align="center" width="200px">
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
      <div class="block" style="width: 100%;">
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
    </el-dialog>

    <el-dialog :visible.sync="dialogVisiblePiture" size="tiny">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>
    <!--      小程序图片上传-->
    <el-dialog :visible.sync="dialogVisiblePitureWx" size="tiny">
      <img :src="dialogImageUrlWx" alt="">
    </el-dialog>

  </div>
</template>

<style>
  .cover {
    width: 40px;
    height: 40px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  .w-e-text-container{
    height: 700px !important;/*!important是重点，因为原div是行内样式设置的高度300px*/
  }
</style>

<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import { getItemCateList, delItemCate, changeStaus, updateItemCate, getItemCateListByPid, addItemCateByPid } from '../../api/gift/item/itemCate'

  var moment = require('moment')

  export default {
    components: { ElRow },
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        dialogVisiblePiture: false,
        dialogVisiblePitureWx: false,
        dialogImageUrl: '',
        dialogImageUrlWx: '',
        tableData3: [],
        tableData4: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageNum2: 1,
        pageSize2: 10,
        total2: 0,
        pid: '',
        icon: '',
        icon1: '',
        loading2: false,
        ruleForm: {
          name: ''
        },
        dialogVisible: false,
        categoryDialogVisible: false,
        cateForm: {
          name: '',
          imageUrlWx: ''
        },
        dialogUpdateVisible: false,
        cateUpdateForm: {
          id: null,
          name: '',
          imageUrl: '',
          sort: null
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加分类窗口打开
      add() {
        this.cateForm.name = ''
        this.cateForm.imageUrlWx = ''
        this.pid = 0
        this.dialogVisible = true
      },
      // 根据父级id添加商品
      addCategorySecond() {
        this.cateForm.name = ''
        this.cateForm.imageUrlWx = ''
        this.dialogVisible = true
      },
      // 添加分类提交
      addSubmit() {
        if (this.cateForm.name.trim() === '') {
          this.$message.error('请填写商品分类名称!')
          return
        }
        if (this.cateForm.imageUrlWx.trim() === '') {
          this.$message.error('请上传分类图标!')
          return
        }
        addItemCateByPid(this.cateForm.name, this.pid,this.cateForm.imageUrlWx).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('添加成功!')
            this.dialogVisible = false
            this.cateForm.name = ''
            this.getListPid()
            this.getList()
            return
          } else {
            this.$message.error('添加失败!')
          }
        })
      },
      // 编辑分类窗口打开
      handleEdit(index, row) {
        this.cateUpdateForm.id = row.id
        this.cateUpdateForm.name = row.name
        this.cateUpdateForm.sort = row.sort
        this.cateUpdateForm.imageUrl = row.icon
        var cover = row.icon
        if (cover) {
          this.icon1 = process.env.BASE_IMAGES_API + cover
        }
        this.dialogUpdateVisible = true
      },
      // 编辑分类提交
      updateSubmit() {
        if (this.cateUpdateForm.name.trim() === '') {
          this.$message.error('请填写商品分类名称!')
          return
        }
        if (this.cateUpdateForm.imageUrl.trim() === '') {
          this.$message.error('请上传分类图标!')
          return
        }
        // if (this.cateUpdateForm.sort === null && this.cateUpdateForm.sort === '') {
        //   this.ruleForm.sort = ''
        // }
        if (this.cateUpdateForm.sort !== null && this.cateUpdateForm.sort !== '') {
          var re = /^[0-9]+$/
          if (re.test(this.cateUpdateForm.sort) === false) {
            this.$message.error('排序值必须为正整数!')
            return
          }
        }
        console.log(this.cateUpdateForm.imageUrl,'hhhhhhhhhhh')
        updateItemCate({ id: this.cateUpdateForm.id, name: this.cateUpdateForm.name, sort: this.cateUpdateForm.sort,
          icon: this.cateUpdateForm.imageUrl}).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success('修改成功!')
            this.dialogUpdateVisible = false
            this.cateUpdateForm.name = ''
            this.cateUpdateForm.imageUrl = ''
            this.cateUpdateForm.sort = null
            this.cateUpdateForm.id = null
            this.getListPid()
            this.getList()
            return
          } else {
            this.$message.error('修改失败!')
          }
        })
      },
      // ---------------------------------------------------------图片上传----------------------------------------------------------------

      // 封面图片上传失败
      handleAvatarError(errors, file, fileList) {
        this.$message.error('上传图片大小不能超过 200KB!')
      },
      // 封面图片预览
      handleAvatarPictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisiblePiture = true
      },
      // 封面图片上传成功
      handleAvatarSuccess(re, file) {
        file.name = re.name
        this.cateUpdateForm.imageUrl = re.name
        this.icon1 = process.env.BASE_IMAGES_API + re.name
      },
      // 封面图片上传之前
      beforeAvatarUpload(file) {
        if (this.cateUpdateForm.imageUrl && this.cateUpdateForm.imageUrl.length < 1) {
          // return true
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 0.2
          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或png 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 200KB!')
          }
          return isJPG && isLt2M
        }
      },
      // 封面图片上传失败
      handleAvatarErrorWx(errors, file, fileList) {
        this.$message.error('图片上传失败')
      },
      // 封面图片预览
      handleAvatarPictureCardPreviewWx(file) {
        this.dialogImageUrlWx = file.url
        this.dialogVisiblePitureWx = true
      },
      // 封面图片上传成功
      handleAvatarSuccessWx(re, file) {
        file.name = re.name
        this.cateForm.imageUrlWx = re.name
        this.icon = process.env.BASE_IMAGES_API + re.name
      },
      // 封面图片上传之前
      beforeAvatarUploadWx(file) {
        if (this.cateForm.imageUrlWx && this.cateForm.imageUrlWx.length < 1) {
          // return true
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 0.2
          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或png 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 200KB!')
          }
          return isJPG && isLt2M
        }
      },
      // ---------------------------------------------------------图片上传----------------------------------------------------------------

      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商品分类列表
      getList() {
        var name = this.ruleForm.name
        this.loading2 = true
        getItemCateList(this.pageNum, this.pageSize, name).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 查看下一级
      categorySecond(index, row) {
        this.pid = row.id
        this.categoryDialogVisible = true
        this.getListPid()
      },
      // 下一级列表
      getListPid() {
        getItemCateListByPid(this.pageNum2, this.pageSize2, this.pid).then(re => {
          this.tableData4 = re.data.data
          this.total2 = re.data.total
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
        this.getListPid()
      },
      // 调整分页
      handleCurrentChange2(val) {
        console.log(`当前页: ${val}`)
        this.pageNum2 = val
        this.getListPid()
      },
      // 改变启用状态
      handleStatus(index, row) {
        var status = row.status
        if (status === 1) {
          status = 2
        } else {
          status = 1
        }
        changeStaus(row.id, status).then(re => {
          this.getList()
        })
      },
      // 删除分类
      handleDelete(index, row) {
        this.$confirm('你确定要删除该分类吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delItemCate(row.id).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: '商品分类删除成功!',
                  type: 'success'
                })
                this.getListPid()
                this.getList()
              }
              if (re.data.errCode === 1) {
                this.$message.error('商品分类删除失败!')
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
