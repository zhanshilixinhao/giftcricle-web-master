<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input v-model="ruleForm.price" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>

        <el-form-item label="排序值" prop="sort">
          <el-input v-model="ruleForm.sort" style="width: 50%" type="number"></el-input>
        </el-form-item>

        <el-form-item label="商品分类" prop="category">
          <el-select v-model="ruleForm.category" filterable placeholder="请选择" style="width: 50%" icon="el-icon-search" @change="categoryChange">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品品牌" prop="brand">
          <el-select v-model="ruleForm.brand" clearable="true" filterable placeholder="请选择" style="width: 50%" icon="el-icon-search" @change="brandChange">
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品封面" prop="imageUriList">
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

        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" style="width: 50%" :rows="4"></el-input>
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
  import { getAllVirItemBrand } from '@/api/gift/virItem/virItemBrand'
  import { getAllItemCate } from '@/api/gift/virItem/virItemCate'
  import { updateVirItemApi, detailApi } from '@/api/gift/virItem/virItem'

  export default {
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
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
        loading2: false,
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        categoryOptions: [],
        brandOptions: [],
        images: [],
        // 表单内容
        ruleForm: {
          id: '',
          name: '',
          category: '',
          brand: '',
          sort: '',
          price: '',
          description: '',
          imageUriList: []
        },
        rules: {
          name: [
            { required: true, message: '请填写商品名称', trigger: 'blur' },
            { max: 200, message: '商品名称不能超过200个字' }],
          description: [
            { required: true, message: '请填写商品描述', trigger: 'blur' },
            { max: 200, message: '商品描述不能超过200个字' }],
          category: [
            { required: true, message: '请选择商品分类', trigger: 'blur' },
            { validator: validateRequire, name: '商品分类' }],
          sort: [
            { validator: integerValidator, name: '排序值' }],
          price: [
            { required: true, message: '请填写商品价格', trigger: 'blur' },
            { validator: numberValidator, name: '商品价格' }],
          imageUriList: [
            { required: true, message: '至少要上传一张图片', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      this.loading2 = true
      var permisId = 1103
      getAllItemCate(permisId).then(re => {
        this.categoryOptions = re.data.data
      })
      var permissionId = 1104
      getAllVirItemBrand(permissionId).then(re => {
        this.brandOptions = re.data.data
        this.getDetail()
      })
    },
    methods: {
      getDetail() {
        detailApi(this.$route.params.id).then(re => {
          this.loading2 = false
          if (re.data.errCode !== 0) {
            this.$router.push('/virtualItem/list')
            this.$message.error(re.data.msg)
          }
          var data = re.data.data
          this.ruleForm.name = data.name
          this.ruleForm.description = data.description
          this.ruleForm.detail = data.detail
          this.ruleForm.sort = data.sort
          this.ruleForm.price = data.price
          // this.ruleForm.brand = data.brandId
          var a = ''
          for (var i = 0; i < this.brandOptions.length; i++) {
            if (this.brandOptions[i].id === data.brandId) {
              a = data.brandId
            }
          }
          this.ruleForm.brand = a
          var b = ''
          for (var j = 0; j < this.categoryOptions.length; j++) {
            if (this.categoryOptions[j].id === data.cateId) {
              b = data.cateId
            }
          }
          this.ruleForm.category = b
          this.ruleForm.imageUriList.push(data.cover)
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
      // 返回商品列表
      getBack() {
        this.$router.push('/virtualItem/list')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.updateVirItem()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateVirItem() {
        const virItem = {}
        virItem.id = this.$route.params.id
        virItem.name = this.ruleForm.name
        virItem.description = this.ruleForm.description
        virItem.price = this.ruleForm.price
        if (this.ruleForm.sort === null) {
          this.ruleForm.sort = ''
        }
        virItem.sort = this.ruleForm.sort
        virItem.cover = this.ruleForm.imageUriList[0]
        virItem.brandId = this.ruleForm.brand
        virItem.cateId = this.ruleForm.category
        //  修改商品
        this.loading2 = true
        updateVirItemApi(virItem).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.$router.push('/virtualItem/list')
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
