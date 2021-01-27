<template>
  <div v-loading="loading2" class="app-container"
       element-loading-text="拼命加载中">
    <el-form :model="form" ref="form" label-width="110px" class="demo-form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="会员卡类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择" icon="el-icon-search"
                       :disabled="this.flag === 2">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="会员卡活动" prop="event" v-if="this.form.type && this.form.type === 11">
            <el-button size="small" type="success" @click="addEventHandle()">活动</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="活动卡所填活动" prop="title" v-if="this.form.detail">
        <el-input v-model="form.detail" disabled></el-input>
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="可使用的门店" prop="storeIds">
            <el-select v-model="form.storeIds" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="颜色" prop="colour">
        <el-color-picker v-model="form.colour"></el-color-picker>
      </el-form-item>
      <el-form-item label="LOGO" prop="logo">
        <c-upload :data="picData"></c-upload>
      </el-form-item>
      <el-form-Item label="使用说明" prop="summary" v-show="dialogVisibleDetail === false">
        <div>
          <div id="editorElem" style="text-align:left"></div>
        </div>
      </el-form-Item>
      <el-row style="float: left">
        <el-form-Item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="getBack()">返回</el-button>
        </el-form-Item>
      </el-row>
    </el-form>

    <el-dialog
      title="使用说明"
      :visible.sync="dialogVisibleDetail"
      size="small">
      <div v-html="form.summary"></div>
    </el-dialog>

    <!--活动添加-->
    <el-dialog title="活动" :visible.sync="dialogVisibleEvent" size="tiny" width="50%">
      <el-form :model="eventForm" ref="eventForm" :rules="rules" label-width="110px" class="demo-form"
               :disabled="flag === 2 || flag1 === 2">
        <h5 style="color: #dd6161">注意：提交后不可修改,请确认好后再提交</h5>
        <el-form-item label="标题" prop="title">
          <el-input v-model="eventForm.title" ></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="充值金额" prop="rechargeMoney">
              <el-input v-model="eventForm.rechargeMoney" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠送金额" prop="sendMoney">
              <el-input v-model="eventForm.sendMoney" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="赠送金额最大限度消费比例(%)" prop="scale">
          <el-input v-model="eventForm.scale" type="number" placeholder="请填0-100内的正整数"></el-input>
        </el-form-item>

        <el-form-Item>
          <el-button type="primary" @click="submitEventForm('eventForm')" size="small" >提交</el-button>
          <el-button @click="dialogVisibleEvent = false" size="small">返回</el-button>
        </el-form-Item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import CUpload from '../../components/CUpload/index'
import E from 'wangeditor'
import {addCard, updateCard, detailCard, allStoreList, allEventList} from '../../api/v3/card'
import {addCardEvent, detailCardEvent} from '../../api/v3/event'

var editor
export default {
  name: 'addCard',
  components: {CUpload},
  data() {
    // 校验赠送金额最大限度消费比例0-100
    const integerValidator = (rule, value, callback) => {
      var patrn = /^[0-9]+$/
      if (value === null || value === '' || value === undefined) {
        callback()
      } else {
        if (!patrn.exec(value)) {
          callback(new Error('请输入正确的' + rule.name + '格式!'))
        } else {
          if (this.eventForm.scale && this.eventForm.scale > 100 && this.eventForm.scale > '100') {
            callback(new Error('最大只能填100'))
          }
          if (this.eventForm.scale && this.eventForm.scale < 0 && this.eventForm.scale < '0') {
            callback(new Error('最小只能填0'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      typeOptions: [{value: 1, name: '礼遇圈卡', disabled: true}, {value: 10, name: '普通储值卡'}, {
        value: 11,
        name: '活动卡'
      }],
      picData: {
        pics: [],
        label: '文章封面图',
        maxPic: 1,
        mediaType: 1,
        fileType: ['jpeg', 'png'],
        fileSize: 200 * 1024, // 200KB以内
        sizeTip: '只能上传jpg、png格式图片，200KB以内'
      },
      dialogVisibleDetail: false,
      dialogVisibleEvent: false,
      loading2: false,
      flag: 1,
      flag1: 1,
      cardId: '',
      form: {
        id: '',
        title: '',
        logo: '',
        colour: '#409EFF',
        summary: '',
        storeIds: '',
        event: '',
        detail: '',
        type: ''
      },
      eventForm: {
        title: '',
        rechargeMoney: '',
        sendMoney: '',
        scale: ''
      },
      options: [],
      eventOptions: [],
      eventId: '',
      rules: {
        scale: [
          {validator: integerValidator, name: '赠送金额最大限度消费比例(%)'}]
      }
    }
  },
  mounted() {
    // 富文本
    editor = new E('#editorElem')
    editor.customConfig.onchange = (html) => {
      this.form.summary = html
    }
    editor.customConfig.uploadImgServer = process.env.BASE_API + '/manage/upload/image?module=2'
    // 限制一次最多上传 8 张图片
    editor.customConfig.uploadImgMaxLength = 8
    editor.customConfig.uploadImgParams = {
      type: 1 // 属性值会自动进行 encode ，此处无需 encode
    }
    editor.create()
    // 可选择门店
    allStoreList().then(re => {
      this.options = re.data.data
    })
    // 可选择的活动
    allEventList().then(re => {
      this.eventOptions = re.data.data
    })
    if (this.$route.query.id || this.$route.query.id === 0) {
      this.cardId = this.$route.query.id
      this.getDetail()
    }
  },
  methods: {
    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.flag === 2) {
            this.update()
          } else {
            this.addCardM()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /***************************************************添加***************************************************/
    addSubmit() {
      if (this.multipleTable.length === 0) {
        this.$message.error('请先选择活动')
        return
      }
      var ids = ''
      for (var i = 0; i < this.multipleTable.length; i++) {
        if (i === (this.multipleTable.length - 1)) {
          ids = ids + this.multipleTable[i].id
        } else {
          ids = ids + this.multipleTable[i].id + ','
        }
      }
      this.form.event = ids
      this.dialogVisible = false
    },
    addCardM() {
      const card = {}
      if (!this.form.title) {
        this.$message.error('请输入标题')
        return
      }
      if (!this.form.type) {
        this.$message.error('请选择会员卡类型')
        return
      }
      if (!this.form.summary) {
        this.$message.error('请输入使用说明')
        return
      }
      /*if (!this.picData.pics || this.picData.pics.length === 0) {
        this.$message.error('请上传logo')
        return
      }*/
      if (!this.form.storeIds || this.form.storeIds.length === 0) {
        this.$message.error('请输选择门店')
        return
      }

        card.eventIds = this.eventId

      card.title = this.form.title
      card.type = this.form.type
      card.summary = this.form.summary
      card.colour = this.form.colour
      if (this.picData.pics.length !== 0) {
        add.logo = this.picData.pics[0].name
      }
      if (this.picData.pics.length !== 0) {
        card.logo = this.picData.pics[0].name
      }
      card.storeIds = this.form.storeIds
      addCard(card).then(re => {
        if (re.data.errCode === 0) {
          this.$message({
            message: '添加成功!',
            type: 'success'
          })
          // this.$router.push('/memberCard/list2')
          this.$router.go(-1)
        } else {
          this.$message.error('添加失败!')
        }
      })
    },
    // 添加活动
    addEventHandle() {
      console.info(this.form.detail,'this.form.detail')
      console.info(this.flag,'this.flag')
      console.info(this.flag1,'this.flag1')
      // if (this.flag === 1 && !this.form.detail) {
      //   this.dialogVisibleEvent = true
      // }
      this.dialogVisibleEvent = true
    },
    submitEventForm() {
      const event = {}
      if (!this.eventForm.title) {
        this.$message.error('请输入标题')
        return
      }
      event.title = this.eventForm.title
      if (!this.eventForm.rechargeMoney) {
        this.$message.error('请输入充值金额')
        return
      }
      event.rechargeMoney = this.eventForm.rechargeMoney
      if (!this.eventForm.sendMoney) {
        this.$message.error('请输入赠送金额')
        return
      }
      event.sendMoney = this.eventForm.sendMoney
      if (!this.eventForm.scale) {
        this.$message.error('请输比例')
        return
      }
      event.scale = this.eventForm.scale
      event.status = 10
      event.type = 1
      addCardEvent(event).then(re => {
        if (re.data.errCode === 0) {
          this.eventId = re.data.data
          this.$message.success('活动填写成功')
          this.dialogVisibleEvent = false
          detailCardEvent({eventId: this.eventId}).then(re => {
            this.form.detail = re.data.data.title
          })
          this.flag1 = 2
        } else {
          this.$message.error(re.data.msg)
        }
      })
    },
    /***************************************************修改***************************************************/
    getDetail() {
      this.flag = 2
      detailCard({cardId: this.cardId}).then(re => {
        if (re.data.errCode !== 0) {
          // this.$router.push('/memberCard/list2')
          this.$router.go(-1)
          this.$message.error('信息有误!')
        }
        var data = re.data.data
        this.form.id = data.id
        this.form.title = data.title
        this.form.type = data.type
        if (data.logo && data.logo !== '') {
          this.picData.pics = [{name: data.logo, url: data.logo}]
        }
        if (data.detail) {
          this.form.detail = data.detail
        }
        this.form.colour = data.colour
        this.form.summary = data.summary
        if (data.storeIds) {
          this.form.storeIds = data.storeIds.split(',')
          for (let i = 0; i < this.form.storeIds.length; i++) {
            this.form.storeIds[i] = Number.parseInt(this.form.storeIds[i])
          }
        }
        if (data.eventIds) {
          this.form.event = data.eventIds.split(',')
          for (let i = 0; i < this.form.event.length; i++) {
            this.form.event[i] = Number.parseInt(this.form.event[i])
          }
          if (data.type && data.type === 11) {
            this.eventId = data.eventIds
          }
        }
        if (data.eventVos) {
          const eventVo = data.eventVos[0]
          this.eventForm.title = eventVo.title
          this.eventForm.rechargeMoney = eventVo.rechargeMoney
          this.eventForm.sendMoney = eventVo.sendMoney
          this.eventForm.scale = eventVo.scale
        }
        editor.txt.html(data.summary)
      })
    },
    update() {
      const card = {}
      if (!this.form.title) {
        this.$message.error('请输入标题')
        return
      }
      if (!this.form.type) {
        this.$message.error('请选择会员卡类型')
        return
      }
      if (!this.form.summary) {
        this.$message.error('请输入使用说明')
        return
      }
      /*if (!this.picData.pics || this.picData.pics.length === 0) {
        this.$message.error('请上传logo')
        return
      }*/
      if (!this.form.storeIds || this.form.storeIds.length === 0) {
        this.$message.error('请输选择门店')
        return
      }

        card.eventIds = this.eventId

      card.id = this.$route.query.id
      card.title = this.form.title
      card.type = this.form.type
      card.summary = this.form.summary
      card.colour = this.form.colour
      if (this.picData.pics.length !== 0) {
        card.logo = this.picData.pics[0].name
      }
      card.storeIds = this.form.storeIds
      updateCard(card).then(re => {
        if (re.data.errCode === 0) {
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          // this.$router.push('/memberCard/list2')
          this.$router.go(-1)
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    getBack() {
      // this.$router.push('/memberCard/list2')
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
