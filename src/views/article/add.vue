<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-Item label="文章名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-Item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="文章类型" prop="type">
              <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%" icon="el-icon-search"
                         @change="categoryChange">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="10">-->
<!--            <el-form-item label="展示时间" prop="showTime">-->
<!--              <el-date-picker-->
<!--                v-model="ruleForm.showTime"-->
<!--                type="date"-->
<!--                placeholder="选择日期">-->
<!--              </el-date-picker>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="文章节日" prop="festival">
              <el-select v-model="ruleForm.festival" placeholder="请选择">
                <el-option
                  v-for="item in festivalOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文章场景" prop="scene">
              <el-select v-model="ruleForm.scene" placeholder="请选择">
                <el-option
                  v-for="item in sceneOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文章对象" prop="label">
              <el-select v-model="ruleForm.label" placeholder="请选择">
                <el-option
                  v-for="item in labelOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-Item label="文章封面" prop="imageUriList">
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
          <el-col :span="10">
            <el-form-Item label="排序值" prop="sort">
              <el-input type="number" placeholder="排序值" v-model="ruleForm.sort" style="width: 70%;"></el-input>
            </el-form-Item>
          </el-col>
        </el-row>

        <el-form-Item label="文章简介" prop="summary">
          <el-input type="textarea" v-model="ruleForm.summary" style="width: 50%" :rows="4"></el-input>
          <el-button type="primary" @click="handleItemDetail()">点击预览文章详情</el-button>
        </el-form-Item>

        <el-form-Item label="文章详情" prop="detail" v-show="dialogVisibleDetail === false">
          <div>
            <div id="editorElem" style="text-align:left"></div>
          </div>
        </el-form-Item>
        <el-row style="float: left">
          <el-form-Item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-Item>
        </el-row>
      </el-form>
      <el-dialog :visible.sync="dialogVisiblePiture" size="tiny">
        <img :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog
        title="文章详情"
        :visible.sync="dialogVisibleDetail"
        size="small"
        :before-close="handleClose">
        <div v-html="ruleForm.detail"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import { addArticleApi, getSceneListAll, getFestivalListAll, getArLabelListAll } from '../../api/gift/article/article'
  import E from 'wangeditor'

  var editor
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
        var patrn = /^[0-9]+$/
        if (value === null || value === '' || value === undefined) {
          callback()
        } else {
          if (!patrn.exec(value)) {
            callback(new Error('请输入正确的' + rule.name + '格式!'))
          } else {
            callback()
          }
        }
      }
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        // typeOptions: [{ value: 1, name: '今日推荐(banner文章)' }, { value: 1, name: 'banner文章' }, { value: 2, name: '星座文章' }, { value: 3, name: '首页文章' }, { value: 4, name: '商城文章' }],
        typeOptions: [{ value: 1, name: '今日推荐' },  { value: 5, name: '普通文章' },{ value: 6, name: '活动通知' }],
        loading2: false,
        dialogVisiblePiture: false,
        dialogVisibleDetail: false,
        festivalOptions: [],
        sceneOptions: [],
        labelOptions: [],
        ItemDetail: '',
        dialogImageUrl: '',
        images: [],
        images2: [],
        // 表单内容
        ruleForm: {
          title: '',
          sort: '',
          festival: '',
          scene: '',
          label: '',
          summary: '',
          detail: '',
          imageUriList: [],
          type: '',
          showTime: null
        },
        rules: {
          title: [
            { required: true, message: '请填写文章标题', trigger: 'blur' },
            { max: 200, message: '文章标题不能超过200个字' }],
          sort: [
            { validator: integerValidator, name: '排序值' }],
          summary: [
            { required: true, message: '请填写文章简介', trigger: 'blur' }],
          detail: [
            { required: true, message: '请填写文章详情', trigger: 'blur' }],
          imageUriList: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }],
          type: [
            { required: true, message: '请选择文章类型', trigger: 'blur' }]
          // festival: [
          //   { required: true, message: '请选择文章节日', trigger: 'blur' }],
          // scene: [
          //   { required: true, message: '请选择文章场景', trigger: 'blur' }],
          // label: [
          //   { required: true, message: '请选择文章对象', trigger: 'blur' }],
          // showTime: [
          //   { required: true, message: '请选择展示时间', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      editor = new E('#editorElem')
      editor.customConfig.onchange = (html) => {
        this.ruleForm.detail = html
      }
      editor.customConfig.uploadImgServer = process.env.BASE_API + '/manage/upload/image?module=2'
      // 限制一次最多上传 8 张图片
      editor.customConfig.uploadImgMaxLength = 8
      editor.customConfig.uploadImgParams = {
        type: 1 // 属性值会自动进行 encode ，此处无需 encode
      }
      editor.create()
      getFestivalListAll().then(re => {
        this.festivalOptions = re.data.data
      })
      getSceneListAll().then(re => {
        this.sceneOptions = re.data.data
      })
      getArLabelListAll().then(re => {
        this.labelOptions = re.data.data
      })
    },
    methods: {
      // 处理文章详情
      handleItemDetail() {
        this.dialogVisibleDetail = true
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
      // 返回文章列表
      getBack() {
        this.$router.push('/article/list')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.addArticle()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      addArticle() {
        const article = {}
        article.title = this.ruleForm.title
        article.summary = this.ruleForm.summary
        article.detail = this.ruleForm.detail
        if (!this.ruleForm.sort || this.ruleForm.sort === '') {
          article.sort = 0
        } else {
          article.sort = this.ruleForm.sort
        }
        article.cover = this.ruleForm.imageUriList[0]
        article.type = this.ruleForm.type
        // article.showTime = this.ruleForm.showTime
        if (this.ruleForm.scene) {
          article.sceneId = this.ruleForm.scene
        }
        if (this.ruleForm.label) {
          article.labelId = this.ruleForm.label
        }
        if (this.ruleForm.festival) {
          article.festivalId = this.ruleForm.festival
        }
        // 添加文章
        this.loading2 = true
        addArticleApi(article).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加文章成功!',
              type: 'success'
            })
            this.$router.push('/article/list')
          } else {
            this.$message.error('添加文章失败!')
          }
          this.$data.loading2 = false
        }).catch(_ => {
          this.$data.loading2 = false
        })
      }
    }
  }
</script>
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
