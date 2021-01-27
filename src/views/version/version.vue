<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="版本号" prop="versionCode">
                <el-input v-model="ruleForm.versionCode" placeholder="版本号" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="升级类型" prop="type">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="版本名称" prop="versionName">
                <el-input v-model="ruleForm.versionName" placeholder="版本名称" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="升级提示" prop="upgradePoint">
                <el-input v-model="ruleForm.upgradePoint" placeholder="升级提示" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件上传" prop="fileList3">
                <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  :on-change="handleChange"
                  :on-success="handleAvatarSuccess"
                  :file-list="fileList3">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="标题" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="float: right">
            <el-form-item prop="date">
              <el-button type="primary" @click="handleSearch()">立即上传</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
    <el-table
      :data="tableData3"
      stripe
      border>
      <el-table-column
        type="index"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="versionName"
        label="版本名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="versionCode"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="type"
        align="center"
        label="升级类型">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 2"
                  size="small" type="danger">强制升级</el-tag>
          <el-tag v-if="scope.row.type === 1"
                  size="small" type="success">升级</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="upgradePoint"
        label="升级提示"
        align="center"
        width="80%">
      </el-table-column>
      <el-table-column
        prop="created"
        label="上传时间"
        align="center"
        :formatter="dateFormat">
      </el-table-column>

    </el-table>


  </div>
</template>

<script>
  import { getApkList, uploadApk } from '../../api/version/version'

  var moment = require('moment')

  export default {
    data() {
      return {
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        loading2: false,
        categoryOptions: [{ value: 1, name: '升级' }, { value: 2, name: '强制升级' }],
        fileList3: [],
        tableData3: [],
        ruleForm: {
          versionCode: '',
          versionName: '',
          upgradePoint: '',
          type: '',
          fileList3: '',
          title: '',
          apkUrl: ''
        },
        rules: {
          versionCode: [
            { required: true, message: '请输入版本号', trigger: 'blur' }
          ],
          versionName: [
            { required: true, message: '请输入版本名称', trigger: 'blur' }
          ],
          upgradePoint: [
            { required: true, message: '请输入升级提示', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择升级方式', trigger: 'blur' }
          ],
          fileList3: [
            { required: true, message: '请上传文件', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 上传文件
      handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-1)
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.apkUrl = res.name
      },
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        console.log('bb', date)
        console.log('cc', column.property)
        if (date === undefined || date === null) {
          return ''
        }
        console.log('a', moment(date).utcOffset(480).format('YYYY-MM-DD HH:mm:ss'))
        // moment(date).format('YYYY-MM-DD HH:mm:ss')
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      getList() {
        this.loading2 = true
        getApkList().then(re => {
          this.loading2 = false
          this.tableData3 = [re.data.data]
          console.log(re.data.data)
        })
      },
      handleSearch() {
        var version = {}
        version.versionCode = this.ruleForm.versionCode
        version.versionName = this.ruleForm.versionName
        version.title = this.ruleForm.title
        version.type = this.ruleForm.type
        console.log(this.ruleForm.fileList)
        version.apkUrl = this.ruleForm.apkUrl
        version.upgradePoint = this.ruleForm.upgradePoint
        uploadApk(version).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error('添加文章失败!')
          }
          this.getList()
        }).catch(_ => {
          this.getList()
        })
      }
    }
  }
</script>

<style scoped>

</style>
