<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="礼包标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="礼包标题" type="text"></el-input>
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
        <el-button type="primary" @click="add()">添加优惠券礼包</el-button>
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
        label="优惠券礼包标题">
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
      <c-date-item prop="created" label="创建日期"/>
      <c-date-item prop="updated" label="修改时期"/>
      <el-table-column
        align="center"
        label="有偿无偿"
        width="120%">
        <template scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.thePaid === 1">有偿</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.thePaid === 0">无偿</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="礼包价格"
        width="160%">
        <template scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.price !== null">{{scope.row.price}}</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.price === null">免费礼包</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="礼包类型"
        width="120%">
        <template scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.type === 1">普通礼包</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.type === 0">新人礼包</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="包含优惠券"
        width="150%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="couponCheck(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
      <div v-if="roleId !== 5">
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
      </div>

    </el-table>
    <c-pagination :page-data="pageData"/>

    <el-dialog title="添加礼包" :visible.sync="dialogVisible" size="tiny" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="140px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="使用说明" prop="summary">
          <el-input type="textarea" v-model="addForm.summary"></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="可选择的优惠券" prop="partyPackJson">
              <el-cascader :options="options" clearable :props="props" v-model="addForm.partyPackJson">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="flag ===1">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="礼包类型" prop="listType">
                <el-select v-model="addForm.listType" placeholder="请选择">
                  <el-option
                    v-for="item in tableData3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="addForm.listType === 1">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="是否有偿" prop="isPaid">
                <el-select v-model="addForm.isPaid" placeholder="请选择">
                  <el-option
                    v-for="item in tableData4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="addForm.isPaid==1">
          <el-form-item label="充值金额" prop="money">
            <el-input v-model="addForm.money" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
          </el-form-item>
        </div>
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
    <!--    礼包包含的优惠券-->
    <el-dialog
      :visible.sync="dialogVisibleCoupon" size="tiny" center
    >
      <el-table :data="tableData2"
                stripe
                border>
        <el-table-column align="center"
                         prop="couponName"
                         label="优惠券名称"
                         width="300px">
        </el-table-column>
        <el-table-column align="center"
                         prop="quantity"
                         label="优惠券数量"
                         width="120px">
        </el-table-column>
      </el-table>

    </el-dialog>

  </div>

</template>

<script>
  import CDateItem from '../../../components/CDateItem/index'
  import CPagination from '../../../components/CPagination/index'
  import CUpload from "../../../components/CUpload/index";
  import {getElLists,addElList,updateElList,deleteElList,findElCoupon} from "../../../api/v4/elCouponList"
  export default {
    components: {CUpload, CPagination, CDateItem},
    data(){
      return{
        props: { multiple: true },
        flag: 1,
        id: '',
        roleId: this.$store.state.user.roleId,
        pictureUrl: process.env.BASE_IMAGES_API,
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        detail: '',
        loading2: false,
        dialogVisible: false,
        dialogVisibleDetail: false,
        dialogVisibleCoupon: false,
        options: [],
        name:"帅哥",
        ruleForm: {
          title: ''
        },
        tableData: [],
        tableData2: [],
        listType: '',
        tableData3: [
          {
            value: 0,
            label: '新用户礼包'
          },
          {
            value: 1,
            label: '正常礼包'
          }
        ],
        tableData4: [
          {
            value: 0,
            label: '无偿礼包'
          },
          {
            value: 1,
            label: '有偿礼包'
          }
        ],
        picData: {
          pics: [],
          label: '优惠券图',
          maxPic: 1,
          mediaType: 1,
          fileType: ['jpeg', 'png'],
          fileSize: 200 * 1024, // 200KB以内
          sizeTip: '只能上传jpg、png格式图片，200KB以内'
        },
        rules: {
          title: [
            {required: true, message: '请输入优惠券礼包标题', trigger: 'blur'}
          ],
          partyPackJson: [
            {required: true, message: '请选择可使用优惠券', trigger: 'change'}
          ],
          listType: [
            { required: true, message: '请选择优惠券礼包类型', trigger: 'blur' }
          ],
          isPaid: [
            {required: true, message: '请选择优惠券礼包是否有偿', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请输入优惠券礼包使用说明', trigger: 'blur'}
          ]
        },
        addForm: {
          title: '',
          summary: '',
          logo: '',
          partyPackJson: '',
          value4: [],
          listType: '',
          isPaid:'',
          money:'',
        }
      }
    },
    mounted(){
      this.getList()

      if (this.roleId === 3) {
        findElCoupon().then(re => {
          this.options = re.data.data
        })
      }
    },
    methods:{

      deleteCard(row){
        const del = {}
        del.elCouponListId = row.id
        deleteElList(del).then(re =>{
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
      aa(){
        let list = this.addForm.partyPackJson
        let arr = ''
        for (let i = 0; i < list.length ; i++) {
          arr += '{'+'couponId:"'+list[i][0]+'",'+'quantity:"'+list[i][1]+'"},'
        }
        let aa = arr.substring(0, arr.length-1)
        let bb = '['+aa+']'
        console.log(bb)
      },
      // 修改
      editCard(row) {
        this.dialogVisible = true
        this.flag = 2
        this.id = row.id
        this.addForm.title = row.title
        this.addForm.summary = row.summary
        this.addForm.isPaid = row.thePaid
        this.addForm.listType = row.type
        this.addForm.money = row.price
        if (row.partyPackJson) {
          const partyPackJson = row.partyPackJson.split(',')
          this.addForm.partyPackJson = []
          for (let i = 0; i < partyPackJson.length; i++) {
            this.addForm.partyPackJson.push(parseInt(partyPackJson[i]))
          }
          console.log(this.addForm.partyPackJson)
        }
      },
      updateList(){
        let list = this.addForm.partyPackJson
        let arr = ''
        for (let i = 0; i < list.length ; i++) {
          arr += '{'+'couponId:"'+list[i][0]+'",'+'quantity:"'+list[i][1]+'"},'
        }
        let aa = arr.substring(0, arr.length-1)
        let bb = '['+aa+']'
        const add = {}
        add.id = this.id
        add.title = this.addForm.title
        add.summary = this.addForm.summary
        add.couponJson = bb
        add.partyPackJson = this.addForm.partyPackJson
        if (this.addForm.listType===0){
          add.type = this.addForm.listType
          add.thePaid = 0
        }
        if (this.addForm.listType===1&&this.addForm.isPaid===0){
          add.type = this.addForm.listType
          add.thePaid = this.addForm.isPaid
        }
        if (this.addForm.listType===1&&this.addForm.isPaid===1){
          add.type = this.addForm.listType
          add.thePaid = this.addForm.isPaid
          add.price = this.addForm.money
        }
        updateElList(add).then(re =>{
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
      addList(){
        let list = this.addForm.partyPackJson
        let arr = ''
        for (let i = 0; i < list.length ; i++) {
          arr += '{'+'couponId:"'+list[i][0]+'",'+'quantity:"'+list[i][1]+'"},'
        }
        let aa = arr.substring(0, arr.length-1)
        let bb = '['+aa+']'
        const add = {}
        add.title = this.addForm.title
        add.summary = this.addForm.summary
        add.couponJson = bb
        add.partyPackJson = this.addForm.partyPackJson
        if (this.addForm.listType===0){
          add.type = this.addForm.listType
          add.thePaid = 0
        }
        if (this.addForm.listType===1&&this.addForm.isPaid===0){
          add.type = this.addForm.listType
          add.thePaid = this.addForm.isPaid
        }
        if (this.addForm.listType===1&&this.addForm.isPaid===1){
          add.type = this.addForm.listType
          add.thePaid = this.addForm.isPaid
          add.price = this.addForm.money
        }
        addElList(add).then(re =>{
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

      //礼包包含的优惠券
      couponCheck(row) {
        this.dialogVisibleCoupon = true;
        this.tableData2 = row.elCouponListCoupons;
        console.log(this.tableData2)
      },

      // 使用说明
      handleItemDetail(row) {
        this.detail = row.summary
        this.dialogVisibleDetail = true
      },
      getList() {
        var search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        search.title = this.ruleForm.title
        getElLists(search).then(re => {
          this.tableData = re.data.data.list
          this.pageData.total = re.data.total
        })
      },
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 添加
      add() {
        this.dialogVisible = true
        this.addForm = {
          title: '',
          summary: '',
          logo: '',
          storeIds: '',
          value4:[]
        }
        this.flag = 1
        this.picData.pics = []
      },
    }
  }
</script>

<style scoped>

</style>
