<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>查询条件</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="分享券标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="分享券标题" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="float: right">
            <el-form-item prop="date">
              <el-button type="primary" @click="search()">搜索</el-button>
              <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <br/>
    <div v-if="roleId !== 5">
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加分享券</el-button>
      </el-card>
    </div>
    <br/>
    <el-table :data="tableData"
    stripe
    border>
      <el-table-column
        align="center"
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="title"
        width="100%"
        label="分享券标题">
      </el-table-column>
      <el-table-column
        prop="summary"
        align="center"
        width="100%"
        label="使用说明">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="search"
            @click="handleItemDetail(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="summary"
        align="center"
        width="100%"
        label="使用规则">
        <template scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="search"
            @click="handleItem(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="130%" label="LOGO" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.logo"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.logo"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <c-date-item prop="startTime" label="开始日期"/>
      <c-date-item prop="date" label="截止日期"/>
      <el-table-column
        align="center"
        label="可使用的门店"
        width="150%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="storeCheck(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>

      <c-date-item prop="created" label="创建时间"/>
      <el-table-column
        align="center"
        prop="day"
        label="有效天数"
        width="90%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="ceiling"
        label="领取上限"
        width="90%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="total"
        label="总数量"
        width="90%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totality"
        label="剩余数量"
        width="90%">
      </el-table-column>
      <el-table-column v-if="roleId !== 5" label="操作" align="center" width="240px">
        <template scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="editCard( scope.row)">修改
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="deleteCard( scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <c-pagination :page-data="pageData"/>

    <!--    使用说明-->
    <el-dialog
      title="分享券使用说明"
      :visible.sync="dialogVisibleDetail"
      size="small">
      <div>{{detail}}</div>
    </el-dialog>

    <!--    使用说明-->
    <el-dialog
      title="分享券使用规则"
      :visible.sync="dialogVisible"
      size="small">
      <div>{{rule}}</div>
    </el-dialog>

    <!--    门店列表-->
    <el-dialog title="可使用门店" :visible.sync="dialogVisibleStore" size="tiny" center>
      <el-table
        :data="tableData3"
        stripe
        border>
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          label="门店名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="电话"
          width="120px">
        </el-table-column>
        <el-table-column
          align="center"
          prop="linkman"
          label="联系人"
          width="120px">
        </el-table-column>
        <el-table-column
          align="center"
          prop="area"
          label="地区"
          width="150px"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="门店地址"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--    添加优惠券-->
    <el-dialog title="添加分享券" :visible.sync="dialogVisibles" size="tiny" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="140px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="使用说明" prop="summary">
          <el-input type="textarea" v-model="addForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" prop="rule">
          <el-input type="textarea" v-model="addForm.rule"></el-input>
        </el-form-item>
        <el-form-item label="LOGO">
          <c-upload :data="picData"></c-upload>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="可使用的门店" prop="storeIds">
              <el-select v-model="addForm.storeIds" multiple placeholder="请选择">
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
        <el-form-item label="优惠券有效期" prop="value4">
          <el-date-picker
            v-model="addForm.value4"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有限天数" prop="day">
          <el-input v-model="addForm.day" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>
        <el-form-item label="总数量" prop="totality">
          <el-input v-model="addForm.totality" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>
        <el-form-item label="每人领取上限" prop="ceiling">
          <el-input v-model="addForm.ceiling" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>
        <el-form-Item>
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="dialogVisibles = false">取消</el-button>
        </el-form-Item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
  import CDateItem from '../../../components/CDateItem/index'
  import CPagination from '../../../components/CPagination/index'
  import CUpload from "../../../components/CUpload/index";
  import {getShareCouponList,addShareCoupon,updateShareCoupon,deleteShareCoupon} from "../../../api/v4/shareCoupon"
  import {allStoreList} from "../../../api/v3/card";
  var moment = require('moment')
  export default {
    components: {CUpload, CPagination, CDateItem},
    data(){
      return{
        roleId: this.$store.state.user.roleId,
        pictureUrl: process.env.BASE_IMAGES_API,
        tableData: [],
        tableData3: [],
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        ruleForm: {
          title: ''
        },
        loading2: false,
        detail: '',
        dialogVisibleDetail: false,
        dialogVisibleStore: false,
        dialogVisible: false,
        dialogVisibles: false,
        rule: '',
        flag: 1,
        options: [],
        picData: {
          pics: [],
          label: '优惠券图',
          maxPic: 1,
          mediaType: 1,
          fileType: ['jpeg', 'png'],
          fileSize: 200 * 1024, // 200KB以内
          sizeTip: '只能上传jpg、png格式图片，200KB以内'
        },
        addForm: {
          title: '',
          summary: '',
          rule: '',
          day:'',
          ceiling:'',
          totality:'',
          logo: '',
          storeIds: '',
          value4: [],
        },
        id:'',
        rules: {
          title: [
            {required: true, message: '请输入优惠券标题', trigger: 'blur'}
          ],
          storeIds: [
            {required: true, message: '请选择可使用门店', trigger: 'change'}
          ],
          value4: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          summary: [
            {required: true, message: '请填写使用说明', trigger: 'blur'}
          ],
          rule: [
            { required: true, message: '请填写使用规则', trigger: 'blur' }
          ],
          totality: [
            { required: true, message: '请选择总库存', trigger: 'blur' }
          ],
          day: [
            { required: true, message: '请选择有效天数', trigger: 'blur' }
          ],
          ceiling: [
            { required: true, message: '请选择每人领取上限', trigger: 'blur' }
          ],
        },
        rules1: {
          phone: [
            {required: true, message: '请输入用户号码', trigger: 'blur'}
          ],
          quantity: [
            {required: true, message: '请输入赠送数量', trigger: 'change'}
          ]
        },
      }
    },
    mounted() {
      this.getList()
      // 可选择门店
      allStoreList().then(re => {
        this.options = re.data.data
      })
    },
    methods:{
      deleteCard(row){
        const del = {}
        del.shareCouponId = row.id
        deleteShareCoupon(del).then(re =>{
          if (re.data.errCode === 0) {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error(re.data.msg)
          }
        })
      },
      // 修改
      editCard(row) {
        this.dialogVisibles = true
        this.flag = 2
        this.id = row.id
        this.addForm.title = row.title
        this.addForm.summary = row.summary
        this.addForm.rule = row.rule
        this.addForm.day = row.day
        this.addForm.ceiling = row.ceiling
        this.addForm.totality = row.totality
        this.addForm.value4 = [moment(row.startTime), moment(row.date)]
        if (row.logo && row.logo !== '') {
          this.picData.pics = [{name: row.logo, url: row.logo}]
        }
        if (row.storeIds) {
          const storeIds = row.storeIds.split(',')
          this.addForm.storeIds = []
          for (let i = 0; i < storeIds.length; i++) {
            console.log('啊啊啊', storeIds[i])
            this.addForm.storeIds.push(parseInt(storeIds[i]))
          }
          console.log(this.addForm.storeIds)
        }
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.flag === 1) {
              this.addList()
            } else {
              this.updateList()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      updateList(){
        const add = {}
        add.id = this.id
        add.title = this.addForm.title
        add.summary = this.addForm.summary
        add.rule = this.addForm.rule
        add.day = this.addForm.day
        add.totality = this.addForm.totality
        add.storeIds = this.addForm.storeIds
        add.ceiling = this.addForm.ceiling
        add.startTime = this.addForm.value4[0]
        add.date = this.addForm.value4[1]
        if (this.picData.pics.length !== 0) {
          add.logo = this.picData.pics[0].name
        }
        updateShareCoupon(add).then(re =>{
          if (re.data.errCode === 0) {
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.getList()
            this.dialogVisibles = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisibles = false
          }
        })
      },
      addList(){
        const add = {}
        add.title = this.addForm.title
        add.summary = this.addForm.summary
        add.rule = this.addForm.rule
        add.day = this.addForm.day
        add.ceiling = this.addForm.ceiling
        add.totality = this.addForm.totality
        add.storeIds = this.addForm.storeIds
        add.startTime = this.addForm.value4[0]
        add.date = this.addForm.value4[1]
        if (this.picData.pics.length !== 0) {
          add.logo = this.picData.pics[0].name
        }
        addShareCoupon(add).then(re =>{
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getList()
            this.dialogVisibles = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisibles = false
          }
        })
      },
      // 添加
      add() {
        this.dialogVisibles = true
        this.addForm = {
          title: '',
          summary: '',
          rule: '',
          day:'',
          ceiling:'',
          totality:'',
          logo: '',
          storeIds: '',
          value4: [],
        }
        this.flag = 1
        this.picData.pics = []
      },
      // 门店
      storeCheck(row) {
        this.dialogVisibleStore = true
        this.tableData3 = row.storeVos
      },
      // 使用说明
      handleItemDetail(row) {
        this.detail = row.summary
        this.dialogVisibleDetail = true
      },
      // 使用规则
      handleItem(row) {
        this.rule = row.rule
        this.dialogVisible = true
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      getList() {
        var search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        search.title = this.ruleForm.title
        getShareCouponList(search).then(re => {
          this.tableData = re.data.data.list
          this.pageData.total = re.data.total
        })
      },
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },

    }
  }
</script>

<style scoped>

</style>
