<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="标题" type="text"></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="12">-->
<!--              <el-form-item label="福利礼品类型" prop="type">-->
<!--                <el-select v-model="ruleForm.type" placeholder="请选择">-->
<!--                  <el-option-->
<!--                    v-for="item in typeOptions"-->
<!--                    :key="item.value"-->
<!--                    :label="item.name"-->
<!--                    :value="item.value"/>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-row style="float: right">
            <el-form-item prop="date">
              <el-button type="primary" @click="handleSearch()">搜索</el-button>
              <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加福利</el-button>
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
        width="70%"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="title"
        label="福利标题"
        show-overflow-tooltip
        width="130%"
        align="center">
      </el-table-column>
      <el-table-column
        prop="itemTitle"
        align="center"
        show-overflow-tooltip
        width="150%"
        label="福利物品标题">
      </el-table-column>
      <!--      <el-table-column width="100" label="福利物品图片" align="center">-->
      <!--        <template scope="scope">-->
      <!--          <el-popover trigger="click" placement="right">-->
      <!--            <img-->
      <!--              :src="pictureUrl + scope.row.cover"/>-->
      <!--            <div slot="reference" class="name-wrapper">-->
      <!--              <img style="width: 80px;height: 80px"-->
      <!--                   :src="pictureUrl + scope.row.cover"/>-->
      <!--            </div>-->
      <!--          </el-popover>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="type"
        width="100%"
        label="福利物品类型"
        align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.type === 1" type="info" size="small">商品</el-tag>
          <el-tag v-if="scope.row.type === 2" type="success" size="small">虚拟商品</el-tag>
          <el-tag v-if="scope.row.type === 3" type="primary" size="small">优惠券</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="福利物品总数"
        align="center"/>
      <el-table-column
        prop="count"
        label="福利物品剩余数"
        align="center"/>
      <el-table-column
        prop="targetDate"
        align="center"
        width="155%"
        label="福利生效时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="福利开始展示时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="福利展示结束时间"
        align="center"
        width="155%"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="isCode"
        width="130%"
        label="是否扫码"
        show-overflow-tooltip
        align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.isCode === 1" type="info" size="small">app福利(不需要扫码)</el-tag>
          <el-tag v-if="scope.row.isCode === 2" type="success" size="small">微信福利(需要扫码)</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120" label="二维码" align="center">
        <template scope="scope">
            <img v-if="scope.row.isCode === 2" style="width: 100px;height: 100px"
              :src="scope.row.qrcodeImg" @click="showPicPreviewDialog(scope.row)"/>
        </template>
      </el-table-column>

      <el-table-column label="基本操作" align="center" width="155%">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="edit"
            @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="delete"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="width: 100%;float: right;margin-top: 16px;margin-bottom: 16px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </div>


    <el-dialog :visible.sync="pic.previewDialogVisible">
      <div v-if="pic.qrcode">
        <span>右键另存为或点击</span><a @click="download()" href=" " style="color: #3a8ee6">下载</a>
      </div>
      <img width="100%" :src="pic.previewPic" alt="">
    </el-dialog>


  </div>


</template>

<script>
  import { getWelfareList, deleteWelfare } from '../../../api/home/banner/welfare'
  import Qrcode from 'qrcode'
  import QrcodeVue from 'qrcode.vue';

  var moment = require('moment')
  export default {
    components: {
      QrcodeVue
    },
    data() {
      return {
        typeOptions: [{ value: '', name: '请选择' }, { value: 1, name: '商品' }, { value: 2, name: '虚拟物品' }, {
          value: 3,
          name: '优惠券'
        }],
        loading2: false,
        tableData3: [],
        pictureUrl: process.env.BASE_IMAGES_API,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        ruleForm: {
          title: '',
          type: ''
        },
        pic: {
          previewDialogVisible: false,
          qrcode: '',
          previewPic: ''
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 添加福利
      add() {
        this.$router.push('/banner/welfareAdd')
      },
      // 修改
      handleEdit(index, row) {
        this.$router.push('/banner/welfareEdit/' + row.id)
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1
        this.getList()
      },
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        if (date === undefined || date === null) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 调整每页显示的行数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.pageNum = 1
        this.getList()
      },
      // 调整分页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.getList()
      },
      categoryChange() {
      },
      // 点击放大
      showPicPreviewDialog (data) {
        this.pic.previewDialogVisible = true
        if (data.code) {
          this.pic.qrcode = data.code
          Qrcode.toDataURL(data.code + '', {width: 1024, height: 1024}).then(res => {
            this.pic.previewPic = res
            this.pic.name = data.name
          })
        } else {
          this.pic.previewPic = data
        }
      },
      // 下载图片
      download () {
        let imgData = this.pic.previewPic
        this.downloadFile(this.pic.name + '-活动二维码.png', imgData)
      },
      // 下载
      downloadFile (fileName, content) {
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(content) // new Blob([content]);

        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true)  //  initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName
        aLink.href = URL.createObjectURL(blob)
        // aLink.dispatchEvent(evt);
        aLink.click()
      },
      // base64转blob
      base64ToBlob (code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length

        let uInt8Array = new Uint8Array(rawLength)

        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {type: contentType})
      },
      getList() {
        var search = {}
        search.title = this.ruleForm.title
        search.type = this.ruleForm.type || ''
        this.loading2 = true
        var index = 0
        getWelfareList({ ...search, pageNum: this.pageNum, pageSize: this.pageSize }).then(re => {
         let size = re.data.data.length
          for (let item of re.data.data) {
            Qrcode.toDataURL(item.code + '', { width: 200, height: 200 }).then(res => {
              item.qrcodeImg = res
              console.log(item)
               index++
              if (index === size) {
                this.tableData3 = re.data.data
              }
            })
          }
          this.loading2 = false
          // this.tableData3 = re.data.data
          this.total = re.data.total
          this.currentPages2 = re.data.pageNum
        })
      },
      // 删除福利
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            deleteWelfare(row.id).then(re => {
              this.loading2 = false
              if (re.data.errCode === 0) {
                this.$message({
                  message: re.data.msg,
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message.error(re.data.msg)
              }
            }).catch(_ => {
              this.loading2 = false
            })
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
