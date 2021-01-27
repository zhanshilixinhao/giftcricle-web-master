<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="ruleForm.price" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="商品库存" prop="stock">
              <el-input v-model="ruleForm.stock" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品图片" prop="imageUriList">
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
            <el-button type="primary" @click="submitForm()">提交修改</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
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

  import { editItemSKUApi, getSkuDetailApi } from '@/api/gift/item/group'

  export default {
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
    },
    data() {
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
        if (!patrn.exec(value)) {
          callback(new Error('请输入正确的' + rule.name + '格式!'))
        } else {
          callback()
        }
      }
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        loading2: false,
        dialogVisible: false,
        dialogImageUrl: '',
        images: [],
        // 表单内容
        ruleForm: {
          id: '',
          name: '',
          price: '',
          stock: '',
          imageUriList: []
        },
        rules: {
          name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
          price: [
            { required: true, message: '请填写商品价格', trigger: 'blur' },
            { validator: numberValidator, name: '商品价格' }],
          stock: [
            { required: true, message: '请填写商品库存', trigger: 'blur' },
            { validator: integerValidator, name: '商品库存' }],
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
        this.loading2 = true
        getSkuDetailApi(this.$route.params.id).then(re => {
          this.loading2 = false
          var data = re.data.data
          this.ruleForm.name = data.title
          this.ruleForm.itemId = data.itemId
          this.ruleForm.stock = data.stock
          this.ruleForm.price = data.price
          this.ruleForm.imageUriList.push(data.cover)
          if (data.cover) {
            var obj
            obj = {}
            obj.name = data.cover
            obj.url = process.env.BASE_IMAGES_API + data.cover
            this.$data.images.push(obj)
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
            message: '最多上传1张照片',
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
      handlePictureCardPreview(file, fileList) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 返回组合商品sku列表
      getBack() {
        this.$router.push('/item/skuList/' + this.ruleForm.itemId)
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.editItemSKU()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      editItemSKU() {
        const itemSku = {}
        itemSku.id = this.$route.params.id
        itemSku.pictures = JSON.stringify(this.ruleForm.imageUriList)
        itemSku.cover = this.ruleForm.imageUriList[0]
        itemSku.title = this.ruleForm.name
        itemSku.price = this.ruleForm.price
        itemSku.stock = this.ruleForm.stock
        // 修改商品
        this.loading2 = true
        editItemSKUApi(itemSku).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.$router.push('/item/skuList/' + this.ruleForm.itemId)
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
