<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优惠券标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="优惠券标题" type="text"></el-input>
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
        <el-button type="primary" @click="add()">添加优惠券</el-button>
      </el-card>
    </div>
    <div v-else>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="give()">批量赠送优惠券</el-button>
      </el-card>
    </div>
    <br/>

    <el-table
      :data="tableData"
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
        show-overflow-tooltip
        label="优惠券标题">
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
      <el-table-column width="130%" label="qrCode" align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.qrCode"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.qrCode"/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="summary"
        align="center"
        width="130%"
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
      <c-date-item prop="startTime" label="开始日期"/>
      <c-date-item prop="date" label="截止日期"/>
      <el-table-column
        align="center"
        prop="day"
        label="有效天数"
        width="90%">
      </el-table-column>
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
      <el-table-column label="操作" align="center" width="240px">
        <template scope="scope">
          <el-button
            v-if="roleId !== 5"
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="editCard( scope.row)">修改
          </el-button>
          <el-button
            v-if="roleId !== 3"
            size="mini"
            type="success"
            @click="forUser( scope.row)">赠送用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <c-pagination :page-data="pageData"/>


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
    <el-dialog title="添加优惠券" :visible.sync="dialogVisible" size="tiny" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="140px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="使用说明" prop="summary">
          <el-input type="textarea" v-model="addForm.summary"></el-input>
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
            end-placeholder="结束日期"
            :disabled="this.addForm.day !== ''" >
          </el-date-picker>
        </el-form-item>
        <div>注意！！有限天数日期选择2选一</div>
        <el-form-item label="有限天数" prop="day" >
          <el-input v-model="addForm.day" style="width: 50%" type="number"  onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"
          ></el-input>
        </el-form-item>
        <el-form-Item>
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-Item>
      </el-form>
    </el-dialog>

    <!--    使用说明-->
    <el-dialog
      title="优惠券使用说明"
      :visible.sync="dialogVisibleDetail"
      size="small">
      <div>{{detail}}</div>
    </el-dialog>

    <!--    赠送给用户-->
    <el-dialog title="赠送用户" :visible.sync="dialogVisibleUser" size="tiny" center>
      <el-form :model="form" :rules="rules1" ref="form" label-width="100px">
        <el-form-item label="用户电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="优惠券数量" prop="quantity">
          <el-input v-model="form.quantity" type="number"></el-input>
        </el-form-item>
        <el-form-Item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button @click="dialogVisibleUser = false">取消</el-button>
        </el-form-Item>
      </el-form>
    </el-dialog>

    <!--批量赠送优惠券-->
    <el-dialog title="批量赠送优惠券" :visible.sync="dialogVisibleGive" size="tiny" center>
      <el-form :model="giveUser" :rules="rules2" ref="giveUser" label-width="100px">
        <el-form-item label="用户电话" prop="phone">
          <el-input v-model="giveUser.phone"></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="优惠券" prop="elJson">
              <el-cascader :options="options1" clearable :props="props" v-model="giveUser.elJson">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-Item>
          <el-button type="primary" @click="lxhSubmit('giveUser')">提交</el-button>
          <el-button @click="dialogVisibleGive = false">取消</el-button>
        </el-form-Item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import CDateItem from '../../../components/CDateItem/index'
  import CPagination from '../../../components/CPagination/index'
  import CUpload from "../../../components/CUpload/index";
  import {getElCouponList, addCouponForUser, addElCoupon, updateElCoupon,findCoupons,giveUserCoupons} from "../../../api/v3/elCoupon";
  import {allStoreList} from "../../../api/v3/card";

  var moment = require('moment')

  export default {
    name: 'CardList',
    components: {CUpload, CPagination, CDateItem},
    data() {
      return {
        roleId: this.$store.state.user.roleId,
        pictureUrl: process.env.BASE_IMAGES_API,
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        props: { multiple: true },
        loading2: false,
        dialogVisible: false,
        dialogVisibleUser: false,
        dialogVisibleStore: false,
        dialogVisibleDetail: false,
        dialogVisibleGive: false,
        tableData: [],
        tableData3: [],
        ruleForm: {
          title: ''
        },
        form: {
          phone: '',
          quantity: ''
        },
        options1: [],
        picData: {
          pics: [],
          label: '优惠券图',
          maxPic: 1,
          mediaType: 1,
          fileType: ['jpeg', 'png'],
          fileSize: 200 * 1024, // 200KB以内
          sizeTip: '只能上传jpg、png格式图片，200KB以内'
        },
        options: [],
        addForm: {
          title: '',
          summary: '',
          logo: '',
          storeIds: '',
          value4: [],
          day:''
        },
        giveUser: {
          phone: '',
          elJson: '',
        },
        rules: {
          title: [
            {required: true, message: '请输入优惠券标题', trigger: 'blur'}
          ],
          storeIds: [
            {required: true, message: '请选择可使用门店', trigger: 'change'}
          ],

          summary: [
            {required: true, message: '请填写使用说明', trigger: 'blur'}
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
        rules2: {
          phone: [
            {required: true, message: '请输入用户号码', trigger: 'blur'}
          ],
          elJson: [
            {required: true, message: '请选择要赠送的优惠券', trigger: 'change'}
          ]
        },
        detail: '',
        id: '',
        flag: 1
      }
    },
    mounted() {
      this.getList()
      // 可选择门店
      allStoreList().then(re => {
        this.options = re.data.data
      })
      if (this.roleId === 5) {
        findCoupons().then(re => {
          this.options1 = re.data.data
        })
      }
    },
    methods: {
      aa(){
        console.log(this.tableData)
      },
      getList() {
        var search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        search.title = this.ruleForm.title
        getElCouponList(search).then(re => {
          this.tableData = re.data.data
          this.pageData.total = re.data.total
        })
      },
      // 使用说明
      handleItemDetail(row) {
        this.detail = row.summary
        this.dialogVisibleDetail = true
      },
      // 门店
      storeCheck(row) {
        this.dialogVisibleStore = true
        this.tableData3 = row.storeVos
      },
      //批量赠送优惠券
      give(){
        this.dialogVisibleGive = true
        this.giveUser = {
          phone: '',
          elJson: ''
        }

      },
      // 添加
      add() {
        this.dialogVisible = true
        this.addForm = {
          title: '',
          summary: '',
          logo: '',
          storeIds: '',
          value4:[],
          day: ''
        }
        this.flag = 1
        this.picData.pics = []
      },
      addCoupon() {
        const add = {}
        add.title = this.addForm.title
        add.summary = this.addForm.summary
        add.storeIds = this.addForm.storeIds
        if (this.addForm.day !== null) {
          add.day = this.addForm.day

        }
        if (this.addForm.value4.length !== 0) {
          add.startTime = this.addForm.value4[0]
          add.date = this.addForm.value4[1]
        }
        if (this.picData.pics.length !== 0) {
          add.logo = this.picData.pics[0].name
        }
        addElCoupon(add).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getList()
            this.dialogVisible = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisible = false
          }
        })
      },
      // 修改
      editCard(row) {
        this.dialogVisible = true
        this.flag = 2
        this.id = row.id
        this.addForm.title = row.title
        this.addForm.summary = row.summary
        this.addForm.day = row.day
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
        }
      },
      updateCoupon() {
        const add = {}
        add.id = this.id
        add.title = this.addForm.title
        add.summary = this.addForm.summary
        add.storeIds = this.addForm.storeIds
        if (this.addForm.day !== null) {
          add.day = this.addForm.day

        }
        if (this.addForm.value4 !== null) {
          add.startTime = this.addForm.value4[0]
          add.date = this.addForm.value4[1]
        }
        if (this.picData.pics.length !== 0) {
          add.logo = this.picData.pics[0].name
        }
        if (this.picData.pics.length !== 0 ) {
          add.logo = this.picData.pics[0].name
        }
        updateElCoupon(add).then(re => {
          if (re.data.errCode === 0) {
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.getList()
            this.dialogVisible = false
          } else {
            this.$message.error(re.data.msg)
            this.dialogVisible = false
          }
        })
      },
      //提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.flag === 1) {
              this.addCoupon()
            } else {
              this.updateCoupon()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //赠送优惠券
      forUser(row) {
        this.dialogVisibleUser = true
        this.form = {
          phone: '',
          quantity: ''
        }
        this.id = row.id
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const add = {}
            add.couponId = this.id
            add.phone = this.form.phone
            add.quantity = this.form.quantity
            addCouponForUser(add).then(re => {
              if (re.data.errCode === 0) {
                this.$message({
                  message: '赠送成功!',
                  type: 'success'
                })
                this.getList()
                this.dialogVisibleUser = false
              } else {
                this.$message.error(re.data.msg)
                this.dialogVisibleUser = false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      lxhSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const add = {}
            add.phone = this.giveUser.phone
            let list = this.giveUser.elJson
            let arr = ''
            for (let i = 0; i < list.length ; i++) {
              arr += '{'+'couponId:"'+list[i][0]+'",'+'quantity:"'+list[i][1]+'"},'
            }
            let aa = arr.substring(0, arr.length-1)
            let bb = '['+aa+']'
            add.couponJson = bb
            console.log('看着点！！！！'+add.couponJson)
            giveUserCoupons(add).then(re => {
              if (re.data.errCode === 0) {
                this.$message({
                  message: '赠送成功!',
                  type: 'success'
                })
                this.getList()
                this.dialogVisibleUser = false
              } else {
                this.$message.error(re.data.msg)
                this.dialogVisibleUser = false
              }
            });
          }
          else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
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
