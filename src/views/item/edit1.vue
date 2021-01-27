<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="商品名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input v-model="ruleForm.price" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>


        <!--        <el-form-item label="商品分类" prop="category">-->
        <!--          <el-cascader-->
        <!--            expand-trigger="hover"-->
        <!--            :options="options"-->
        <!--            :props="itemProps"-->
        <!--            v-model="ruleForm.category"-->
        <!--            placeholder="请选择"-->
        <!--            style="width: 50%"-->
        <!--            @change="handleChange">-->
        <!--          </el-cascader>-->
        <!--        </el-form-item>-->

        <el-form-item label="商品一级分类" prop="category">
          <el-select v-model="ruleForm.category" filterable placeholder="请选择" style="width: 50%" icon="el-icon-search"
                     @change="categoryChange">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品二级分类" prop="sCategory">
          <el-select v-model="ruleForm.sCategory" filterable placeholder="请选择" style="width: 50%"
                     icon="el-icon-search">
            <el-option
              v-for="item in categoryOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品品牌" prop="brand">
          <el-select v-model="ruleForm.brand" clearable="true" filterable placeholder="请选择" style="width: 50%"
                     icon="el-icon-search" @change="brandChange">
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="推荐最小年龄" prop="minAge">
              <el-input type="number" placeholder="推荐最小年龄" v-model="ruleForm.minAge" style="width: 70%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">---</el-col>
          <el-col :span="6">
            <el-form-item label="推荐最大年龄" prop="maxAge">
              <el-input type="number" placeholder="推荐最大年龄" v-model="ruleForm.maxAge" style="width: 70%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="推荐性别" prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="0">不推荐</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="商品封面" prop="imageUrl">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-error="handleAvatarError"
                :on-preview="handleAvatarPictureCardPreview">
                <img v-if="ruleForm.imageUrl" :src="cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传200KB以内的jpg、png格式图片!（建议图片尺寸是430x430）</div>
              </el-upload>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="小程序商品详情图片" prop="imageUrlWx">-->
<!--              <el-upload-->
<!--                class="avatar-uploader"-->
<!--                :action="uploadUrl"-->
<!--                :show-file-list="false"-->
<!--                :on-success="handleAvatarSuccessWx"-->
<!--                :before-upload="beforeAvatarUploadWx"-->
<!--                :on-error="handleAvatarErrorWx"-->
<!--                :on-preview="handleAvatarPictureCardPreviewWx">-->
<!--                <img v-if="ruleForm.imageUrlWx" :src="wxcover" class="avatar">-->
<!--                <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                <div slot="tip" class="el-upload__tip">只能上传jpg、png格式图片</div>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-form-item label="商品图片" prop="imageUriList2">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="images2"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess2"
            :before-upload="handleBeforeUpload2"
            :on-error="handleError2"
            :on-remove="handleRemove2">
            <!--:data="imageData"-->
            <i v-if="ruleForm.imageUriList2.length < 10" class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传200KB以内的jpg、png格式图片（建议图片尺寸是430x430）！</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="小程序商品详情图片" prop="imageUrlWxList">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="images3"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccessWx"
            :before-upload="handleBeforeUploadWx"
            :on-error="handleErrorWx"
            :on-remove="handleRemoveWx">
            <!--:data="imageData"-->
            <i v-if="ruleForm.imageUrlWxList && ruleForm.imageUrlWxList.length < 50" class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传1M以内的jpg、png格式图片！</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品属性" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" style="width: 50%" :rows="4"></el-input>
          <el-button type="primary" @click="handleItemDetail()">点击预览商品详情</el-button>
        </el-form-item>

        <el-form-item label="商品详情" prop="detail" v-show="dialogVisibleDetail == false">
          <div>
            <div id="editorElem" style="text-align:left"></div>
          </div>
        </el-form-item>
        <el-row style="float: left">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即修改</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-dialog :visible.sync="dialogVisiblePiture" size="tiny">
        <img :src="dialogImageUrl" alt="">
      </el-dialog>
      <!--      小程序图片上传-->
      <el-dialog :visible.sync="dialogVisiblePitureWx" size="tiny">
        <img :src="dialogImageUrlWx" alt="">
      </el-dialog>
      <el-dialog
        title="商品详情"
        :visible.sync="dialogVisibleDetail"
        size="small"
        :before-close="handleClose">
        <div v-html="ruleForm.detail"></div>
      </el-dialog>
    </div>
  </div>
</template>

<style>
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
</style>

<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import { getAllItemCate } from '@/api/gift/item/itemCate'
  import { getAllBrand } from '@/api/brand/brand'
  import { updateItemApi, detailApi } from '@/api/gift/item/item'
  import E from 'wangeditor'

  var editor
  export default {
    name: 'ItemEdit',
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
    },
    props: {
      itemId: {
        type: String,
        default: ''
      }
    },
    data() {
      // 验证文本必传项
      const validateRequire = (rule, value, callback) => {
        if (value === '' || value.length === 0) {
          this.$message({
            message: rule.name + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      // 校验价格
      const numberValidator = (rule, value, callback) => {
        // var patrn = /^[0-9]{1,20}$/
        var patrn = /^\d+(\.\d+)?$/
        if (!patrn.exec(value)) {
          callback(new Error('请输入正确的' + rule.name + '格式!'))
        } else {
          callback()
        }
      }
      // 校验年龄
      const integerValidator = (rule, value, callback) => {
        var patrn = /^[0-9]+$/
        if (value === null || value === '' || value === undefined) {
          callback()
        } else {
          if (!patrn.exec(value)) {
            callback(new Error('请输入正确的' + rule.name + '格式!'))
          } else {
            if (this.ruleForm.maxAge !== '' && this.ruleForm.minAge !== null && this.ruleForm.maxAge > 110 && this.ruleForm.maxAge > '110') {
              callback(new Error('推荐最大年龄只能填110'))
            }
            if (this.ruleForm.maxAge !== '' && this.ruleForm.minAge !== null && this.ruleForm.maxAge <= this.ruleForm.minAge) {
              callback(new Error('推荐最大年龄需大于推荐最小年龄!'))
            } else {
              callback()
            }
          }
        }
      }
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        loading2: false,
        dialogVisiblePiture: false,
        dialogVisiblePitureWx: false,
        dialogVisibleDetail: false,
        itemDetail: '',
        dialogImageUrlWx: '',
        dialogImageUrl: '',
        categoryOptions: [],
        itemProps: { value: 'id', label: 'name' },
        options: [],
        categoryOption: [],
        brandOptions: [],
        images: [],
        images2: [],
        images3: [],
        cover: '',
        wxcover: '',
        coverData: {
          width: 430,
          height: 430
        },
        imageData: {
          width: 430,
          height: 430
        },
        // 表单内容
        ruleForm: {
          gender: 1,
          title: '',
          category: '',
          sCategory: '',
          brand: '',
          price: '',
          description: '',
          detail: '',
          minAge: '',
          maxAge: '',
          imageUriList2: [],
          imageUriList: [],
          imageUrlWxList: [],
          imageUrl: '',
          imageUrlWx: ''
        },
        rules: {
          title: [
            { required: true, message: '请填写商品标题', trigger: 'blur' },
            { max: 200, message: '商品标题不能超过200个字' }],
          gender: [
            { required: true, message: '请选择推荐性别', trigger: 'blur' }],
          category: [
            { required: true, message: '请选择商品分类', trigger: 'blur' },
            // { validator: validateRequire, name: '商品分类' }
            ],
          brand: [
            { required: true, message: '请选择商品品牌', trigger: 'blur' },
            // { validator: validateRequire, name: '商品品牌' }
            ],
          price: [
            { required: true, message: '请填写商品价格', trigger: 'blur' },
            { validator: numberValidator, name: '商品价格' }],
          minAge: [
            { validator: integerValidator, name: '推荐最小年龄' }],
          maxAge: [
            { validator: integerValidator, name: '推荐最大年龄' }],
          detail: [
            { required: true, message: '请填写商品详情', trigger: 'blur' }],
          imageUriList: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }],
          imageUriList2: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }],
          imageUrl: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }]
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
      // 表单内容
      this.loading2 = true
      var permisId = 1028
      getAllItemCate(permisId).then(re => {
        this.categoryOptions = re.data.data
        // this.options = re.data.data
        var permissionId = 1029
        getAllBrand(permissionId).then(re => {
          this.brandOptions = re.data.data
          this.getDetail(this.itemId)
        })
      })
    },
    methods: {
      categoryChange(id) {
        this.categoryOption = []
        this.ruleForm.sCategory = ''
        for (let cate of this.categoryOptions) {
          if (cate.id === id) {
            this.categoryOption = cate.children
          }
        }
      },
      getDetail(id) {
        this.ruleForm = {
          gender: 1,
          title: '',
          category: '',
          sCategory: '',
          brand: '',
          price: '',
          description: '',
          detail: '',
          minAge: '',
          maxAge: '',
          imageUriList2: [],
          imageUriList: [],
          imageUrlWxList: [],
          imageUrl: '',
          imageUrlWx: ''
        }
        this.loading2 = true
        detailApi(id).then(re => {
          console.log(id)
          this.loading2 = false
          if (re.data.errCode !== 0) {
            this.$router.push('/item/list')
            this.$message.error('商品信息有误!')
          }
          var data = re.data.data
          this.ruleForm.title = data.title
          if (data.description === null) {
            this.ruleForm.description = ''
          } else {
            this.ruleForm.description = data.description
          }
          this.ruleForm.detail = data.detail
          if (data.reAgeMin === null) {
            this.ruleForm.minAge = ''
          } else {
            this.ruleForm.minAge = data.reAgeMin
          }
          if (data.reMaxAge === null) {
            this.ruleForm.maxAge = ''
          } else {
            this.ruleForm.maxAge = data.reMaxAge
          }
          this.ruleForm.gender = data.reGender.toString()
          this.ruleForm.price = data.price
          if (data.brandId === null) {
            this.ruleForm.brand = ''
          } else {
            this.ruleForm.brand = data.brandId
          }
          if (data.pid === 0) {
            this.ruleForm.category = data.categoryId
            this.ruleForm.sCategory = ''
          } else {
            this.categoryChange(data.pid)
            this.ruleForm.category = data.pid
            this.ruleForm.sCategory = data.categoryId
          }
          this.ruleForm.imageUrl = data.cover
          // this.ruleForm.imageUrlWx = data.wxCover
          // this.ruleForm.imageUriList.push(data.cover)
          this.ruleForm.imageUriList2 = JSON.parse(data.pictures)
          var pictures = JSON.parse(data.pictures)
          var cover = data.cover
          // var wxcover = data.wxCover
          this.$data.images2 = []
          if (pictures) {
            var obj
            for (var i = 0; i < pictures.length; i++) {
              obj = {}
              obj.name = pictures[i]
              obj.url = process.env.BASE_IMAGES_API + pictures[i]
              this.$data.images2.push(obj)
            }
          }
          if (cover) {
            this.cover = process.env.BASE_IMAGES_API + cover
          }
          // if (wxcover) {
          //   this.wxcover = process.env.BASE_IMAGES_API + wxcover
          // }
          this.$data.images3 = []
          if (data.wxCover && data.wxCover !== '' && data.wxCover !== 'null') {
            this.ruleForm.imageUrlWxList = JSON.parse(data.wxCover)
            var wxCover = JSON.parse(data.wxCover)
            if (wxCover) {
              var obj
              for (var i = 0; i < wxCover.length; i++) {
                obj = {}
                obj.name = wxCover[i]
                obj.url = process.env.BASE_IMAGES_API + wxCover[i]
                this.$data.images3.push(obj)
              }
            }
          }
          editor.txt.html(data.detail)
        })
      },
      handleChange(value) {
        console.log(value)
      },
      // 处理商品详情
      handleItemDetail() {
        this.dialogVisibleDetail = true
      },
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
        this.ruleForm.imageUrl = re.name
        this.cover = process.env.BASE_IMAGES_API + re.name
      },
      // 封面图片上传之前
      beforeAvatarUpload(file) {
        if (this.ruleForm.imageUrl.length < 1) {
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
        // else {
        //   this.$message({
        //     message: '只能上传一张商品封面图片',
        //     type: 'error'
        //   })
        //   return false
        // }
      },
      // ---------------------------------------------------------小程序图片上传----------------------------------------------------------------
      // // 封面图片上传失败
      // handleAvatarErrorWx(errors, file, fileList) {
      //   this.$message.error('图片上传失败')
      // },
      // // 封面图片预览
      // handleAvatarPictureCardPreviewWx(file) {
      //   this.dialogImageUrlWx = file.url
      //   this.dialogVisiblePitureWx = true
      // },
      // // 封面图片上传成功
      // handleAvatarSuccessWx(re, file) {
      //   file.name = re.name
      //   this.ruleForm.imageUrlWx = re.name
      //   this.wxcover = process.env.BASE_IMAGES_API + re.name
      // },
      // // 封面图片上传之前
      // beforeAvatarUploadWx(file) {
      //   if (this.ruleForm.imageUrlWx && this.ruleForm.imageUrlWx.length < 1) {
      //     // return true
      //     const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      //     // const isLt2M = file.size / 1024 / 1024 < 0.2
      //     if (!isJPG) {
      //       this.$message.error('上传图片只能是 JPG 或png 格式!')
      //     }
      //     // if (!isLt2M) {
      //     //   this.$message.error('上传图片大小不能超过 200KB!')
      //     // }
      //     return isJPG
      //     // return isJPG && isLt2M
      //   }
      //   // else {
      //   //   this.$message({
      //   //     message: '只能上传一张商品封面图片',
      //   //     type: 'error'
      //   //   })
      //   //   return false
      //   // }
      // },
      // ---------------------------------------------------------小程序图片上传2----------------------------------------------------------------

      // 图片上传失败
      handleErrorWx(errors, file, fileList) {
        this.$message.error('上传图片大小不能超过 200KB!')
      },
      // 图片上传之前
      handleBeforeUploadWx(file) {
        if (this.ruleForm.imageUrlWxList.length < 50) {
          // return true
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 1
          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或png 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 1M!')
          }
          return isJPG && isLt2M
        } else {
          this.$message({
            message: '至多上传5张商品图片',
            type: 'error'
          })
          return false
        }
      },
      // 移除一张图片
      handleRemoveWx(file, fileList) {
        console.log(this.ruleForm.imageUrlWxList)
        // 将删除的这张图从图片列表中移除
        for (let i = 0; i < this.ruleForm.imageUrlWxList.length; i++) {
          // 如果存在这张图
          if (this.ruleForm.imageUrlWxList[i] === file.name) {
            // 移除
            this.ruleForm.imageUrlWxList.splice(i, 1)
            break
          }
        }
        console.log(this.updateForm.imageUrlWxList)
      },
      // 图片上传成功
      handleSuccessWx(re, file, fileList) {
        file.name = re.name
        this.ruleForm.imageUrlWxList.push(re.name)
        console.log(this.ruleForm.imageUrlWxList)
      },
      // ---------------------------------------------------------小程序图片上传----------------------------------------------------------------

      // 图片上传失败
      handleError2(errors, file, fileList) {
        this.$message.error('图片的尺寸建议是430x430')
      },
      // 图片上传之前
      handleBeforeUpload2(file) {
        // return true
        if (this.ruleForm.imageUriList2.length < 10) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 0.2
          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或png 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 200KB!')
          }
          return isJPG && isLt2M
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
        this.ruleForm.imageUriList2.push(re.name)
        console.log(this.ruleForm.imageUriList2)
      },
      // 返回商品列表
      getBack() {
        this.$parent.$parent.dialogVisible1 = false
        console.log(this)
        // this.$router.go(-1)
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.updateItem()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateItem() {
        const item = {}
        item.id = this.itemId
        item.title = this.ruleForm.title
        item.description = this.ruleForm.description
        item.detail = this.ruleForm.detail
        item.reAgeMin = this.ruleForm.minAge
        item.reMaxAge = this.ruleForm.maxAge
        item.reGender = this.ruleForm.gender
        item.price = this.ruleForm.price
        // item.cover = this.ruleForm.imageUriList[0]
        item.cover = this.ruleForm.imageUrl
        // item.wxCover = this.ruleForm.imageUrlWx
        item.pictures = JSON.stringify(this.ruleForm.imageUriList2)
        item.wxCover = JSON.stringify(this.ruleForm.imageUrlWxList)
        item.brandId = this.ruleForm.brand
        if (!this.ruleForm.sCategory) {
          item.categoryId = this.ruleForm.category
        } else {
          item.categoryId = this.ruleForm.sCategory
        }
        // 添加商品
        this.loading2 = true
        updateItemApi(item).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: '修改商品成功!',
              type: 'success'
            })
            this.$parent.$parent.dialogVisible1 = false
          } else {
            this.$message.error('修改商品失败!')
          }
          this.$data.loading2 = false
        }).catch(_ => {
          this.$data.loading2 = false
        })
      }
    }
  }
</script>
