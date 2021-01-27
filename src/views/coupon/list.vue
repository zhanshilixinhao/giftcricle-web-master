<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优惠券名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="优惠券名称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌名称" prop="brandName">
                <el-input v-model="ruleForm.brandName" placeholder="品牌名称" type="text" ></el-input>
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
        <el-button type="primary" @click="add()">添加优惠券</el-button>
        <el-button type="primary" @click="use()">使用优惠券</el-button>
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
        prop="status"
        align="center"
        width="80%"
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
        prop="title"
        show-overflow-tooltip="true"
        label="优惠券名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="brandName"
        label="品牌名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        width="155%"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updated"
        width="155%"
        label="修改时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="500px">
        <template scope="scope">
          <el-button
           size="mini"
           type="success"
           icon="close"
           @click="sendUserCoupon(scope.$index, scope.row)">赠送用户
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
    <el-dialog title="添加优惠券" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="优惠券名称">
          <el-input  v-model="addForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input  v-model="addForm.brandName">
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券图片" prop="imageUriList">
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
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，尺寸750X500，大小不超过150KB</div>-->
          </el-upload>
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

    <el-dialog title="修改优惠券" :visible.sync="dialogUpdateVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="updateForm" label-width="100px">
        <el-form-item label="优惠券名称">
          <el-input  v-model="updateForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input  v-model="updateForm.brandName">
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券图片">
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
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，尺寸750X500，大小不超过150KB</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateBack()">取 消</el-button>
        <el-button type="primary" @click="updateSubmit()">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="couponName" :visible.sync="dialogUserVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" center>
      <el-form :model="userForm" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="用户电话" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入用户电话" type="text" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="userSearch()">搜索</el-button>
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
        <el-table-column width="100" label="用户头像" align="center">
          <template scope="scope">
            <el-popover trigger="click" placement="right">
              <img
                :src="pictureUrl + scope.row.avatar"/>
              <div slot="reference" class="name-wrapper">
                <img class="cover"
                     :src="pictureUrl + scope.row.avatar"/>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="nickname"
          show-overflow-tooltip="true"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          width="160%"
          label="手机号">
        </el-table-column>
        <el-table-column
          align="center"
          width="160%"
          label="赠送数量">
          <template slot-scope="scope">
            <el-input v-model="quantity" placeholder="赠送数量" type="number" ></el-input>
          </template>
        </el-table-column>

      </el-table>
      <!--<div class="block" style="width: 100%;float: right;margin-top: 16px;margin-bottom: 16px">
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page.sync="pageNum2"
          :page-sizes="[10, 1, 30, 40]"
          :page-size="pageSize2"
          layout="sizes, prev, pager, next, total, jumper"
          :total="total2">
        </el-pagination>
      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userBack()">取 消</el-button>
        <el-button type="primary" @click="userSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="使用优惠券" :visible.sync="dialogUseVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" center>
      <!--<el-form :model="userForm" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="用户电话" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入用户电话" type="text" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>-->
      <el-input v-model="couponCode" placeholder="请输入优惠券码" type="text" ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="useBack()">返 回</el-button>
        <el-button type="primary" @click="useSubmit()">使 用</el-button>
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
  import { getCouponList, delCoupon, addCoupon, updateCoupon, changeStatus, giveCouponUser, useCoupon } from '@/api/gift/coupon/coupon'
  import { getUserListByPhone } from '@/api/appUser/appUser'

  var moment = require('moment')
  export default {
    components: { ElRow },
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        pictureUrl: process.env.BASE_IMAGES_API,
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
        quantity: '',
        couponCode: '',
        dialogUseVisible: false,
        loading2: false,
        ruleForm: {
          name: '',
          brandName: ''
        },
        dialogVisible: false,
        addForm: {
          name: '',
          brandName: '',
          imageUriList: [],
          requesturl: ''
        },
        coupon: '',
        couponName: '',
        dialogUserVisible: false,
        userForm: {
          phone: ''
        },
        dialogUpdateVisible: false,
        updateForm: {
          id: null,
          name: '',
          brandName: '',
          imageUriList2: [],
          requesturl: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 搜索用户
      userSearch() {
        this.pageNum2 = 1
        this.getUserList()
      },
      // 处理多选
      handleSelectionChange(value) {
        this.multipleTable = value
      },
      // 赠送用户窗口打开
      sendUserCoupon(index, row) {
        this.tableData4 = []
        this.coupon = row.id
        this.couponName = row.title
        this.userForm.phone = ''
        this.dialogUserVisible = true
      },
      // 赠送用户窗口关闭
      userBack(rows) {
        this.dialogUserVisible = false
        this.userForm.phone = ''
        this.coupon = ''
        this.quantity = ''
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
        this.multipleTable = []
        this.tableData4 = []
      },
      // 赠送用户提交
      userSubmit() {
        if (this.multipleTable.length === 0) {
          this.$message.error('请先选择用户')
          return
        }
        if (this.quantity.toString().trim() === '') {
          this.$message.error('请填写赠送数量')
          return
        }
        if (this.quantity !== null && this.quantity !== '') {
          var re = /^\+?[1-9]\d*$/
          if (re.test(this.quantity) === false) {
            this.$message.error('赠送数量必须为正整数!')
            return
          }
        }
        var userId = this.multipleTable[0].id
        var couponId = this.coupon
        giveCouponUser(couponId, this.quantity, userId).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUserVisible = false
            this.userForm.phone = ''
            // 刷新页面
            this.getList()
            return
          }
        })
      },
      // 改变优惠券状态
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
      // 添加优惠券窗口打开
      add() {
        this.addForm.name = ''
        this.addForm.brandName = ''
        this.dialogVisible = true
      },
      // 添加优惠券取消
      addBack() {
        this.dialogVisible = false
        this.addForm.name = ''
        this.addForm.brandName = ''
        this.addForm.imageUriList = []
        this.images = []
      },
      // 添加优惠券提交
      addSubmit() {
        if (this.addForm.name.trim() === '') {
          this.$message.error('请填写优惠券名称!')
          return
        }
        if (this.addForm.brandName.trim() === '') {
          this.$message.error('请填写品牌名称!')
          return
        }
        if (this.addForm.imageUriList.length === 0) {
          this.$message.error('至少上传一张图片')
          return
        }
        addCoupon(this.addForm.name, this.addForm.imageUriList[0], this.addForm.brandName).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogVisible = false
            this.addForm.name = ''
            this.addForm.brandName = ''
            this.addForm.imageUriList = []
            this.images = []
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      use() {
        this.dialogUseVisible = true
      },
      useBack() {
        this.dialogUseVisible = false
        this.couponCode = ''
      },
      useSubmit() {
        if (this.couponCode.toString().trim() === '') {
          this.$message.error('优惠券码不能为空')
          return
        }
        var patrn = /^[0-9]+$/
        if (!patrn.exec(this.couponCode)) {
          this.$message.error('优惠券码只能是数字')
          return
        }
        useCoupon(this.couponCode).then(re => {
          if (re.data.errCode !== 0) {
            this.$message.error(re.data.msg)
          } else {
            this.dialogUseVisible = false
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
          }
        })
      },
      // 编辑优惠券窗口打开
      handleEdit(index, row) {
        this.images2 = []
        this.updateForm.imageUriList2 = []
        this.updateForm.id = row.id
        this.updateForm.name = row.title
        this.updateForm.brandName = row.brandName
        var obj = {}
        obj.url = process.env.BASE_IMAGES_API + row.cover
        obj.name = row.cover
        this.images2.push(obj)
        this.updateForm.imageUriList2.push(row.cover)
        this.dialogUpdateVisible = true
      },
      // 编辑优惠券取消
      updateBack() {
        this.dialogUpdateVisible = false
        this.updateForm.name = ''
        this.updateForm.brandName = ''
        this.updateForm.id = null
        this.images2 = []
        this.updateForm.imageUriList2 = []
      },
      // 编辑优惠券提交
      updateSubmit() {
        if (this.updateForm.name.trim() === '') {
          this.$message.error('请填写优惠券名称!')
          return
        }
        if (this.updateForm.brandName.trim() === '') {
          this.$message.error('请填写品牌名称!')
          return
        }
        if (this.updateForm.imageUriList2.length === 0) {
          this.$message.error('至少上传一张图片')
          return
        }
        updateCoupon(this.updateForm.id, this.updateForm.name, this.updateForm.imageUriList2[0], this.updateForm.brandName).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUpdateVisible = false
            this.updateForm.name = ''
            this.updateForm.brandName = ''
            this.images2 = []
            this.imageUriList2 = []
            this.updateForm.id = null
            this.getList()
            return
          } else {
            this.$message.error(re.data.msg)
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
      // 获取优惠券优惠券列表
      getList() {
        var name = this.ruleForm.name
        var brandName = this.ruleForm.brandName
        var adminId = 1
        this.loading2 = true
        getCouponList(this.pageNum, this.pageSize, name, brandName, adminId).then(re => {
          this.loading2 = false
          this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 获取用户列表
      getUserList() {
        var phone = this.userForm.phone
        if (phone.toString().trim() === '') {
          this.$message.error('请输入用户电话')
          return
        }
        getUserListByPhone(this.pageNum2, this.pageSize2, phone).then(re => {
          if (re.data.data.length === 0) {
            this.$message.error('无此用户')
          }
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
        this.getUserList()
      },
      // 调整分页
      handleCurrentChange2(val) {
        console.log(`当前页: ${val}`)
        this.pageNum2 = val
        this.getUserList()
      },
      // 删除优惠券
      handleDelete(index, row) {
        this.$confirm('你确定要删除该优惠券吗?删除后无法恢复!')
          .then(_ => {
            this.loading2 = true
            delCoupon(row.id).then(re => {
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
