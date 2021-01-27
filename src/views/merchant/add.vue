<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="企业地址" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="企业注册号" prop="registrationNo">
              <el-input v-model="ruleForm.registrationNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="法人代表" prop="legalPerson">
              <el-input v-model="ruleForm.legalPerson"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="营业执照" prop="licensePic">
          <c-upload :data="picData"></c-upload>
        </el-form-item>

        <el-form-item label="其他证件图" prop="otherPics">
          <c-upload :data="picData1"></c-upload>
        </el-form-item>
        <el-row style="float: left">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<style>

</style>

<script>
  import {applyMerchant} from '@/api/iwant/merchant/merchant'
  import CUpload from "../../components/CUpload/index";


  export default {
    components: {
      CUpload
    },
    data() {
      return {
        loading2: false,
        // 表单内容
        ruleForm: {
          name: '',
          address: '',
          registrationNo: '',
          legalPerson: '',
          phone: '',
          licensePic: '',
          otherPics: []
        },
        picData: {
          pics: [],
          label: '营业执照图',
          maxPic: 1,
          mediaType: 1,
          fileType: ['jpeg', 'png'],
          fileSize: 200 * 1024, // 200KB以内
          sizeTip: '只能上传jpg、png格式图片，200KB以内'
        },
        picData1: {
          pics: [],
          label: '其他证件图',
          maxPic: 10,
          mediaType: 1,
          fileType: ['jpeg', 'png'],
          fileSize: 200 * 1024, // 200KB以内
          sizeTip: '只能上传jpg、png格式图片，200KB以内'
        },
        rules: {
          name: [
            {required: true, message: '请填写企业名称', trigger: 'blur'}],
          address: [
            {required: true, message: '请填写企业地址', trigger: 'blur'}],
          registrationNo: [
            {required: true, message: '请填写企业注册号', trigger: 'blur'}],
          legalPerson: [
            {required: true, message: '请填写法人代表', trigger: 'blur'}],
          phone: [
            {required: true, message: '请填写手机号码', trigger: 'blur'}]
          // licensePic: [
          //   {required: true, message: '请上传营业执照', trigger: 'blur'}]
        }
      }
    },
    mounted() {

    },
    methods: {
      // 返回商品列表
      getBack() {
        this.$router.push('/merchant/auth')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.addItem()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      addItem() {
        const item = {}
        if (!this.picData.pics || this.picData.pics.length === 0) {
          this.$message.error('请上传营业执照')
          return
        }
        item.name = this.ruleForm.name
        item.address = this.ruleForm.address
        item.registrationNo = this.ruleForm.registrationNo
        item.legalPerson = this.ruleForm.legalPerson
        item.phone = this.ruleForm.phone
        item.licensePic = this.picData.pics[0].name
        item.otherPics = []
        if (this.picData1.pics && this.picData1.pics.length > 0) {
          this.picData1.pics.forEach(re => {
            item.otherPics.push(re.name)
          })
        }
        // 添加
        this.loading2 = true
        applyMerchant(item).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.$router.push('/merchant/auth')
          } else {
            this.$message.error('添加失败!')
          }
          this.$data.loading2 = false
        }).catch(_ => {
          this.$data.loading2 = false
        })
      }
    }
  }
</script>
