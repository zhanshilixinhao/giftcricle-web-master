<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :label-position="left" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商家名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="商家名称" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商家地址" prop="address">
                <el-input v-model="ruleForm.address" placeholder="商家地址" type="text" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="法人名字" prop="person">
                <el-input v-model="ruleForm.person" placeholder="法人名字" type="text" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商家电话" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="商家电话" type="text" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="审核状态" prop="status">
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
        <el-button type="primary" @click="add()">添加商家</el-button>
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
        prop="userNickName"
        show-overflow-tooltip="true"
        label="APP用户昵称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userPhone"
        width="120%"
        label="APP用户电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        show-overflow-tooltip="true"
        label="商家名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        show-overflow-tooltip="true"
        label="商家地址">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        width="150%"
        label="商家电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="legalPerson"
        width="120%"
        label="法人名字">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        width="100%"
        label="商家状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status === 2"
                     size="small">审核中</el-tag>
          <el-tag v-if="scope.row.status === 4"
                     size="small" type="danger">审核失败</el-tag>
          <el-tag v-if="scope.row.status === 3"
                     size="small" type="success">审核通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="adminName"
        width="120%"
        label="后台账号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="created"
        label="申请时间"
        width="160%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column label="操作" align="center" width="320px">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="merchantFile(scope.$index, scope.row)">查看文件
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handlePass(scope.$index, scope.row)">审核通过
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleFail(scope.$index, scope.row)">审核失败
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

    <el-dialog title="查看商家文件" :visible.sync="dialogViewVisible" size="tiny">
      <el-form :model="viewForm" label-width="100px">
        <el-form-item label="申请用户昵称" prop="userNickName">
          <el-input type="text" disabled="true" v-model="viewForm.userNickName"></el-input>
        </el-form-item>
        <el-form-item label="申请用户电话" prop="userPhone">
          <el-input type="text" disabled="true" v-model="viewForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="企业注册号" prop="registrationNo">
          <el-input type="text" disabled="true" v-model="viewForm.registrationNo"></el-input>
        </el-form-item>
        <el-form-item label="营业执照" prop="imageUriList">
          <el-upload
            list-type="picture-card"
            :file-list="images"
            :disabled="true"
            :on-preview="handlePictureCardPreview">
            <i v-if="viewForm.imageUriList.length < 1" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="其它证件" prop="imageUriList2">
          <el-upload
            list-type="picture-card"
            :file-list="images2"
            :on-preview="handlePictureCardPreview"
            :disabled="true">
            <i v-if="viewForm.imageUriList2.length < 5" class="el-icon-plus"></i>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，尺寸750X500，大小不超过150KB</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="为商家绑定后台用户" :visible.sync="dialogUserVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <!--<el-form :model="updateForm" label-width="100px">
        <el-form-item label="排序值">
          <el-input  v-model="updateForm.sort">
          </el-input>
        </el-form-item>
      </el-form>-->
      <el-input  v-model="username" placeholder="请先在后台用户管理创建后台账号, 在此输入账号的用户名">
        <template slot="prepend">用户名</template>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userBack()">取 消</el-button>
        <el-button type="primary" @click="userSubmit()">提 交</el-button>
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
  import { getMerchantList, changePassStatus, changeFailStatus } from '@/api/iwant/merchant/merchant'

  var moment = require('moment')

  export default {
    components: {
      ElRow },
    data() {
      return {
        statusOptions: [{ value: '', name: '请选择' }, { value: 2, name: '审核中' }, { value: 3, name: '审核通过' }, { value: 4, name: '审核失败' }],
        dialogViewVisible: false,
        dialogUserVisible: false,
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        id: '',
        username: '',
        tableData3: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        images: [],
        images2: [],
        ruleForm: {
          name: '',
          address: '',
          person: '',
          status: '',
          phone: ''
        },
        viewForm: {
          userNickName: '',
          userPhone: '',
          registrationNo: '',
          imageUriList2: [],
          imageUriList: []
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加商品
      add() {
        this.$router.push('/merchant/add')
      },
      // 查看文件
      merchantFile(index, row) {
        this.dialogViewVisible = true
        this.$data.images = []
        this.$data.images2 = []
        this.viewForm.userNickName = row.userNickName
        this.viewForm.userPhone = row.userPhone
        this.viewForm.registrationNo = row.registrationNo
        if (row.licensePic) {
          var object
          object = {}
          object.name = row.licensePic
          object.url = process.env.BASE_IMAGES_API + row.licensePic
          this.$data.images.push(object)
        }
        var otherPics = JSON.parse(row.otherPics)
        if (otherPics) {
          var obj
          for (var i = 0; i < otherPics.length; i++) {
            obj = {}
            obj.name = otherPics[i]
            obj.url = process.env.BASE_IMAGES_API + otherPics[i]
            this.$data.images2.push(obj)
          }
        }
      },
      // 审核成功状态改变
      handlePass(index, row) {
        var status = row.status
        if (status === 3) {
          this.$message.error('该商家已审核成功, 请勿重复点击!')
          return
        }
        if (row.adminName === null) {
          this.dialogUserVisible = true
          this.id = row.id
          return
        }
        status = 3
        changePassStatus(row.id, status, row.adminName).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUserVisible = false
            this.getList()
          }
        })
      },
      userBack() {
        this.id = ''
        this.username = ''
        this.dialogUserVisible = false
      },
      userSubmit() {
        if (this.username.trim() === '') {
          this.$message.error('请填写用户名!')
          return
        }
        var status = 3
        changePassStatus(this.id, status, this.username).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.dialogUserVisible = false
            this.id = ''
            this.username = ''
            this.getList()
          }
        })
      },
      // 审核失败状态改变
      handleFail(index, row) {
        var status = row.status
        if (status === 4) {
          this.$message.error('该商家已审核失败, 请勿重复点击!')
          return
        }
        status = 4
        this.loading2 = true
        changeFailStatus(row.id, status).then(re => {
          this.loading2 = false
          if (re.data.errCode !== 0) {
            this.$message.error(re.data.msg)
          } else {
            this.$message.success(re.data.msg)
            this.getList()
            this.dialogUserVisible = false
          }
        })
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 获取商家列表
      getList() {
        var search = {}
        search.name = this.ruleForm.name
        search.address = this.ruleForm.address
        search.person = this.ruleForm.person
        search.status = this.ruleForm.status
        search.phone = this.ruleForm.phone
        this.loading2 = true
        getMerchantList(this.pageNum, this.pageSize, search).then(re => {
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
      // 图片上传失败
      handleError(errors, file, fileList) {
        this.$message({
          message: '图片上传时错误，请检查图片格式及大小是否超过200kb',
          type: 'error'
        })
      },
      // 图片上传之前
      handleBeforeUpload(file) {
        if (this.ruleForm.imageUriList.length < 1) {
          return true
        } else {
          this.$message({
            message: '只能上传一张商品封面图片',
            type: 'error'
          })
          return false
        }
      },
      // 移除一张图片
      handleRemove(file, fileList) {
        console.log(this.ruleForm.imageUriList)
        // 将删除的这张图从图片列表中移除
        for (let i = 0; i < this.ruleForm.imageUriList.length; i++) {
          // 如果存在这张图
          if (this.ruleForm.imageUriList[i] === file.name) {
            // 移除
            this.ruleForm.imageUriList.splice(i, 1)
            break
          }
        }
        console.log(this.ruleForm.imageUriList)
      },
      // 图片上传成功
      handleSuccess(re, file, fileList) {
        file.name = re.name
        this.ruleForm.imageUriList.push(re.name)
        console.log(this.ruleForm.imageUriList)
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
        if (this.ruleForm.imageUriList2.length < 5) {
          return true
        } else {
          this.$message({
            message: '至多上传5张商品图片',
            type: 'error'
          })
          return false
        }
      },
      // 移除一张图片
      handleRemove2(file, fileList) {
        console.log(this.ruleForm.imageUriList2)
        // 将删除的这张图从图片列表中移除
        for (let i = 0; i < this.ruleForm.imageUriList2.length; i++) {
          // 如果存在这张图
          if (this.ruleForm.imageUriList2[i] === file.name) {
            // 移除
            this.ruleForm.imageUriList2.splice(i, 1)
            break
          }
        }
        console.log(this.updateForm.imageUriList2)
      },
      // 图片上传成功
      handleSuccess2(re, file, fileList) {
        file.name = re.url
        this.ruleForm.imageUriList2.push(re.url)
        console.log(this.ruleForm.imageUriList2)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
