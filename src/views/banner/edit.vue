<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="横幅标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请填写横幅标题"></el-input>
        </el-form-item>

        <el-form-item label="横幅图片" prop="imageUriList">
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

        <el-form-item label="横幅类型" prop="type">
          <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 50%" icon="el-icon-search" @change="categoryChange">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品id" prop="itemId" v-if="ruleForm.type === 1">
          <el-input style="width: 50%" v-model="ruleForm.itemId" type="number" placeholder="请填写商品id"></el-input>
        </el-form-item>

        <el-form-item label="主题id" prop="themeId" v-if="ruleForm.type === 2">
          <el-input style="width: 50%" v-model="ruleForm.themeId" type="number" placeholder="请填写主题id"></el-input>
        </el-form-item>

        <el-form-item label="网页外链" prop="requestUrl" v-if="ruleForm.type === 3">
          <el-input style="width: 50%" v-model="ruleForm.requestUrl" placeholder="请填写网页外链"></el-input>
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
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import { getBannerDetail, updateBannerApi } from '@/api/home/banner/banner'

  export default {
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
    },
    data() {
      // 校验大于等于0的正整数
      const integerValidator = (rule, value, callback) => {
        var patrn = /^\+?[1-9]\d*$/
        if (!patrn.exec(value)) {
          callback(new Error(rule.name + '必须是大于0的正整数!'))
        } else {
          callback()
        }
      }
      // 校验网址
      // const urlValidator = (rule, value, callback) => {
      //   var patrn = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
      //   if (!patrn.exec(value)) {
      //     callback(new Error('请输入正确的' + rule.name + '格式!'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        categoryOptions: [{ value: 1, name: '商品详情' }, { value: 2, name: '主题商品列表' },
          { value: 3, name: '网页外链' }, { value: 4, name: '纯展示' }],
        loading2: false,
        dialogVisiblePiture: false,
        dialogVisibleDetail: false,
        itemDetail: '',
        dialogImageUrl: '',
        images: [],
        // 表单内容
        ruleForm: {
          title: '',
          type: 4,
          itemId: '',
          themeId: '',
          requestUrl: '',
          imageUriList: []
        },
        rules: {
          title: [
            { required: true, message: '请填写横幅标题', trigger: 'blur' },
            { max: 50, message: '横幅标题不能超过50个字' }],
          type: [
            { required: true, message: '请选择横幅类型', trigger: 'blur' }],
          itemId: [
            { required: true, message: '请填写商品id', trigger: 'blur' },
            { validator: integerValidator, name: '商品id' }],
          themeId: [
            { required: true, message: '请填写主题id', trigger: 'blur' },
            { validator: integerValidator, name: '主题id' }],
          requestUrl: [
            { required: true, message: '请填写网页外链', trigger: 'blur' },
            // { validator: urlValidator, name: '网页外链' }
            ],
          imageUriList: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        getBannerDetail(this.$route.params.id).then(re => {
          var data = re.data.data
          this.ruleForm.type = data.type
          this.ruleForm.title = data.title
          this.ruleForm.imageUriList.push(data.cover)
          if (data.type === 1) {
            this.ruleForm.itemId = data.targetId
          }
          if (data.type === 2) {
            this.ruleForm.themeId = data.targetId
          }
          if (data.requestUrl !== null) {
            this.ruleForm.requestUrl = data.requestUrl
          }
          var cover = data.cover
          if (cover) {
            var object
            object = {}
            object.name = cover
            object.url = process.env.BASE_IMAGES_API + cover
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
            message: '只能上传一张横幅封面图片',
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
      // 返回横幅列表
      getBack() {
        this.$router.push('/banner/list')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.updateBanner()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateBanner() {
        const banner = {}
        banner.id = this.$route.params.id
        banner.title = this.ruleForm.title
        banner.cover = this.ruleForm.imageUriList[0]
        banner.type = this.ruleForm.type
        if (banner.type === 1) {
          banner.targetId = this.ruleForm.itemId
        }
        if (banner.type === 2) {
          banner.targetId = this.ruleForm.themeId
        }
        if (banner.type === 3) {
          banner.requestUrl = this.ruleForm.requestUrl
        }
        // 添加横幅
        this.loading2 = true
        updateBannerApi(banner).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.$router.push('/banner/list')
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
