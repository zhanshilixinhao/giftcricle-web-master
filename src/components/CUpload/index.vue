<template>
  <div>
    <el-upload
      ref="upload"
      :action="uploadUrl"
      class="avatar-uploader"
      list-type="picture-card"
      :file-list="data.pics"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-error="handleError"
      :data="data"
      :limit="data.maxPic"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-plus" v-if="data.pics.length < data.maxPic"></i>
      <div v-if="data.sizeTip && data.sizeTip !== ''" slot="tip" class="el-upload__tip">{{data.sizeTip}}</div>
    </el-upload>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <img v-if="data.mediaType===1" width="100%" :src="dialogImageUrl" alt="">
      <video v-else :src="dialogImageUrl" controls="controls" style="width: 500px"></video>
    </el-dialog>
  </div>
</template>

<script>
  // ---data示例---
  // picData: {
  //   pics: [],
  //     width: 440,
  //     height: 440,
  //     label: '商品图片',
  //     maxPic: 9,
  //     mediaType: 1,
  //     fileType: ['jpeg', 'png'],
  //     fileSize: 200 * 1024, // 200KB以内
  //     sizeTip: '只能上传440x440的jpg、png格式图片，200KB以内,最多9张'
  // },
  import {getToken} from '@/utils/auth'

  function util(indata) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = function (e) {
        let data = e.target.result
        let img = new Image()
        img.src = data
        img.onload = function () {
          if (indata.data.width !== img.width || indata.data.height !== img.height) {
            indata.instance.$message.error(indata.data.sizeTip)
            reject("错误")
          } else {
            resolve()
          }
        }
      }
      reader.readAsDataURL(indata.file)
    })
  }

  export default {
    name: 'CUpload',
    props: {
      data: {
        type: Object,
        default: function () {
          return {
            label: '上传图片',
            pics: [],
            maxPic: 1,
            mediaType: 1,
            fileType: [],
            fileSize: 0,
            width: 750,
            height: 400,
            sizeTip: ''
          }
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        // uploadUrl: process.env.BASE_API + '/file/image?token=' + getToken(),
      }
    },
    mounted() {

    },
    methods: {
      // 上传图片
      handleAvatarSuccess(res, file) {
        console.log('aaa')
        if (res.errCode && res.errCode !== 0) {
          this.$message.error('错误' + res.msg)
          this.$refs.upload.clearFiles()
          return
        }
        this.data.pics.push(res)
        file.id = res.name
      },
      // 文件上传之前的处理
      beforeAvatarUpload(file) {
        const data = this.data
        console.log(file)
        console.log('图片上传', data)
        if (data.pics.length >= data.maxPic) {
          this.$message.error('最多只能上传' + data.maxPic + (data.mediaType === 1 ? '张照片' : '个视频'))
          return false
        }
        let typeV = true
        if (data.fileType && data.fileType.length > 0) {
          typeV = false
          data.fileType.forEach(item => {
            if (file.type === 'image/' + item || file.type === 'video/' + item) {
              typeV = true
            }
          })
        }

        if (!typeV) {
          this.$message.error(data.sizeTip)
          return false
        }
        const isLt2M = file.size <= data.fileSize
        if (!isLt2M) {
          this.$message.error(data.sizeTip)
          return false
        }
        console.log('走到最后')
        // 进行图片大小验证
        if (!data.width || !data.height) {
          return true
        }
        return util({
          instance: this,
          data,
          file
        })
      },
      // 图片伤处
      handleRemove(file, fileList) {
        this.data.pics = fileList
      },
      // 文件上传失败的处理
      handleError(e, file, fileList) {
        console.log(e)
        this.$message.error(e.message)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    }
  }
</script>
