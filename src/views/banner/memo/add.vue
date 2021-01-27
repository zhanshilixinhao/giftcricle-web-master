<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-row :gutter="24">
          <el-col :span="14">
            <el-form-item label="节日事件名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-Item label="节日事件封面" prop="imageUriList">
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
        </el-form-Item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="节日事件简介" prop="summary">
              <el-input type="textarea" v-model="ruleForm.summary"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节日事件时间" prop="targetTime">
              <el-date-picker
                v-model="ruleForm.targetTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="14">
            <el-form-item label="节日事件详情标题" prop="title">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-Item label="节日事件详情图片" prop="imageUriList2">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="images2"
            :on-preview="handlePictureCardPreview2"
            :on-success="handleSuccess2"
            :before-upload="handleBeforeUpload2"
            :on-error="handleError2"
            :on-remove="handleRemove2">
            <i v-if="ruleForm.imageUriList2.length < 1" class="el-icon-plus"></i>
          </el-upload>
        </el-form-Item>
        <el-row :gutter="24">
          <el-col :span="14">
            <el-form-item label="节日事件详情描述" prop="detail">
              <el-input type="textarea" v-model="ruleForm.detail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="getBack()">返回</el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script>
  import { addMemoFestival } from '../../../api/home/banner/memo'

  var moment = require('moment')

  export default {
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        images: [],
        images2: [],
        loading2: false,
        ruleForm: {
          name: '',
          summary: '',
          targetTime: null,
          imageUriList: [],
          title: '',
          imageUriList2: [],
          detail: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入节日事件名称', trigger: 'blur' }
          ],
          summary: [
            { required: true, message: '请输入节日事件简介', trigger: 'blur' }
          ],
          targetTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          imageUriList: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }],
          title: [
            { required: true, message: '请输入节日事件详情标题', trigger: 'blur' }
          ],
          detail: [
            { required: true, message: '请输入节日事件详情描述', trigger: 'blur' }
          ],
          imageUriList2: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }]
        }
      }
    },
    methods: {
      // 创建
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addFestival()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 立即创建
      addFestival() {
        var memo = {}
        memo.name = this.ruleForm.name
        memo.summary = this.ruleForm.summary
        memo.targetTime = moment(this.ruleForm.targetTime)
        memo.cover = this.ruleForm.imageUriList[0]
        memo.title = this.ruleForm.title
        memo.detail = this.ruleForm.detail
        memo.picture = this.ruleForm.imageUriList2[0]
        addMemoFestival(memo).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.ruleForm = ''
            this.$router.push('/banner/memo')
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
            message: '只能上传一张文章封面图片',
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
        if (this.ruleForm.imageUriList2.length < 1) {
          return true
        } else {
          this.$message({
            message: '只能上传一张文章封面图片',
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
        console.log(this.ruleForm.imageUriList2)
      },
      // 图片上传成功
      handleSuccess2(re, file, fileList) {
        file.name = re.name
        this.ruleForm.imageUriList2.push(re.name)
        console.log(this.ruleForm.imageUriList2)
      },
      // 图片预览
      handlePictureCardPreview2(file) {
        this.dialogImageUrl = file.url
        this.dialogVisiblePiture = true
      },
      // 返回
      getBack() {
        this.$router.push('/banner/memo')
      }
    }
  }
</script>

<style scoped>

</style>
