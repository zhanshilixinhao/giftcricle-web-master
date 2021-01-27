<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" disabled="true" style="width: 50%" placeholder="必填, 请输入用户名,用户名唯一不可重复"></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="ruleForm.password"  style="width: 50%" placeholder="如果不修改密码请勿填写"></el-input>
        </el-form-item>

        <el-form-item label="用户电话" prop="phone">
          <el-input v-model="ruleForm.phone" style="width: 50%" placeholder="选填, 请输入用户电话"></el-input>
        </el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="ruleForm.realName" style="width: 50%" placeholder="选填, 请输入用户真实姓名"></el-input>
        </el-form-item>

        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="ruleForm.idNumber" style="width: 50%" placeholder="选填, 请输入用户身份证号"></el-input>
        </el-form-item>

        <el-form-item label="用户qq" prop="qq">
          <el-input v-model="ruleForm.qq" style="width: 50%" placeholder="选填, 请输入用户qq号"></el-input>
        </el-form-item>

        <el-form-item label="用户微信" prop="wechat">
          <el-input v-model="ruleForm.wechat" style="width: 50%" placeholder="选填, 请输入用户微信号"></el-input>
        </el-form-item>

        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="ruleForm.email" style="width: 50%" placeholder="选填, 请输入用户邮箱"></el-input>
        </el-form-item>

        <el-form-item label="用户角色" prop="role">
          <el-select disabled="true" v-model="ruleForm.role" filterable placeholder="必选, 请选择" style="width: 50%" icon="el-icon-search" @change="categoryChange">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户性别"  prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="3">保密</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用户头像" prop="imageUriList">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="images"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :on-error="handleError"
            :on-remove="handleRemove">
            <i v-if="ruleForm.imageUriList.length < 1" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-row  style="float: left">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即修改</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-dialog :visible.sync="dialogVisiblePiture" size="tiny">
        <img :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import { updateSysAdminApi, getSysAdminDetail } from '@/api/webUser/webUser'
  import { getAllRoleList } from '@/api/permission/permission'

  var MD5 = require('md5.js')
  export default {
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
    },
    data() {
      // 验证密码
      const validatePassword = (rule, value, callback) => {
        if (value === null || value === '' || value === undefined) {
          callback()
          return
        }
        if (value.length < 6) {
          callback(new Error('用户密码不能小于6位'))
        } else {
          callback()
        }
      }
      // 校验用户名只能由数字和字母组成
      const usernameValidator = (rule, value, callback) => {
        var patrn = /^[0-9a-zA-Z]+$/
        if (!patrn.exec(value)) {
          callback(new Error('用户名只能由数字和字母组成'))
        } else {
          callback()
        }
      }
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        loading2: false,
        dialogVisiblePiture: false,
        dialogVisibleDetail: false,
        roleOptions: [],
        itemDetail: '',
        dialogImageUrl: '',
        categoryOptions: [],
        brandOptions: [],
        images: [],
        images2: [],
        // 表单内容
        ruleForm: {
          username: '',
          password: '',
          gender: '',
          qq: '',
          email: '',
          wechat: '',
          phone: '',
          role: '',
          idNumber: '',
          realName: '',
          imageUriList: []
        },
        rules: {
          username: [
            { required: true, message: '请填写用户名', trigger: 'blur' },
            { max: 15, message: '用户名不能超过15个字' },
            { validator: usernameValidator }],
          gender: [
            { required: true, message: '请选择用户性别', trigger: 'blur' }],
          password: [/* { required: true, message: '请填写用户密码', trigger: 'blur' },*/
            { validator: validatePassword }],
          role: [
            { required: true, message: '请选择用户角色', trigger: 'blur' }],
          imageUriList: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      this.loading2 = true
      // 权限的id
      var permissionId = 1134
      getAllRoleList(permissionId).then(re => {
        this.roleOptions = re.data.data
        this.getDetail()
      })
    },
    methods: {
      getDetail() {
        getSysAdminDetail(this.$route.params.id).then(re => {
          this.loading2 = false
          var data = re.data.data
          this.ruleForm.username = data.username
          this.ruleForm.qq = data.qq
          this.ruleForm.email = data.email
          this.ruleForm.wechat = data.wechat
          this.ruleForm.gender = data.gender.toString()
          this.ruleForm.phone = data.phone
          this.ruleForm.realName = data.realName
          this.ruleForm.idNumber = data.idNumber
          this.ruleForm.role = data.roleId
          this.ruleForm.imageUriList.push(data.avatar)
          var avatar = data.avatar
          if (avatar) {
            var object
            object = {}
            object.name = avatar
            object.url = process.env.BASE_IMAGES_API + avatar
            this.$data.images.push(object)
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
        if (this.ruleForm.imageUriList.length < 1) {
          return true
        } else {
          this.$message({
            message: '只能上传一张用户封面图片',
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
      // 返回用户列表
      getBack() {
        this.$router.push('/permission/list')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.updateSysAdmin()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateSysAdmin() {
        const sysAdmin = {}
        sysAdmin.id = this.$route.params.id
        sysAdmin.username = this.ruleForm.username
        if (this.ruleForm.password !== '') {
          sysAdmin.password = new MD5().update(this.ruleForm.password).digest('hex').toUpperCase()
        }
        sysAdmin.gender = this.ruleForm.gender
        sysAdmin.qq = this.ruleForm.qq
        sysAdmin.email = this.ruleForm.email
        sysAdmin.wechat = this.ruleForm.wechat
        sysAdmin.phone = this.ruleForm.phone
        sysAdmin.roleId = this.ruleForm.role
        sysAdmin.idNumber = this.ruleForm.idNumber
        sysAdmin.realName = this.ruleForm.realName
        sysAdmin.avatar = this.ruleForm.imageUriList[0]

        // 修改用户
        this.loading2 = true
        updateSysAdminApi(sysAdmin).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.$router.push('/permission/list')
          } else {
            this.$message.error(re.data.msg)
          }
          this.$data.loading2 = false
        }).catch(_ => {
          this.$data.loading2 = false
        })
      }
    }
  }
</script>
