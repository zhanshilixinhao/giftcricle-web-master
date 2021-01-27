<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>查询条件</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="砍价标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="砍价标题" type="text"></el-input>
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
        <el-button type="primary" @click="add()">添加砍价</el-button>
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
        label="砍价标题">
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
      <el-table-column
        align="center"
        prop="rebateNew"
        width="100%"
        label="新用户折扣">
      </el-table-column>
      <el-table-column
        align="center"
        prop="rebateOld"
        width="100%"
        label="老用户折扣">
      </el-table-column>
      <el-table-column
        align="center"
        prop="rebate"
        width="100%"
        label="折扣上限">
      </el-table-column>
      <c-date-item prop="created" label="创建时间"/>
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

    <el-dialog title="添加分享券" :visible.sync="dialogVisibles" size="tiny" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="140px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
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
        <el-form-item label="新用户折扣比例" prop="rebateNew">
          <el-input v-model="addForm.rebateNew" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>
        <el-form-item label="老用户折扣比例" prop="rebateOld">
          <el-input v-model="addForm.rebateOld" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
        </el-form-item>
        <el-form-item label="折扣上限" prop="rebate">
          <el-input v-model="addForm.rebate" style="width: 50%" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
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
  import {getRebateCouponList,addRebateCoupon,updateRebateCoupon,deleteRebateCoupon} from "../../../api/v4/RebateCoupon"
  import {allStoreList} from "../../../api/v3/card";
  export default {
    components: {CUpload, CPagination, CDateItem},
    name: 'RebateCoupon',
    data(){
      return{
        roleId: this.$store.state.user.roleId,
        loading2: false,
        ruleForm: {
          title: ''
        },
        rules: {
          title: [
            {required: true, message: '请输入折扣券标题', trigger: 'blur'}
          ],
          storeIds: [
            {required: true, message: '请选择可使用门店', trigger: 'change'}
          ],
          rebateNew: [
            { required: true, message: '请输入新用户折扣', trigger: 'blur' }
          ],
          rebateOld: [
            { required: true, message: '请输入老用户折扣', trigger: 'blur' }
          ],
          rebate: [
            { required: true, message: '请输入折扣上限', trigger: 'blur' }
          ],
        },
        dialogVisibleStore: false,
        dialogVisibles: false,
        tableData: [],
        tableData3: [],
        addForm: {
          title: '',
          storeIds: '',
          rebateNew: '',
          rebateOld: '',
          rebate: ''
        },
        options: [],
        id:'',
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        flag: 1,
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
        const add = {}
        add.title = this.addForm.title
        add.storeIds = this.addForm.storeIds
        add.rebateNew = this.addForm.rebateNew
        add.rebateOld = this.addForm.rebateOld
        add.rebate = this.addForm.rebate
        addRebateCoupon(add).then(re =>{
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
      // 修改
      editCard(row) {
        this.dialogVisibles = true
        this.flag = 2
        this.id = row.id
        this.addForm.title = row.title
        this.addForm.rebateNew = row.rebateNew
        this.addForm.rebateOld = row.rebateOld
        this.addForm.rebate = row.rebate
        if (row.storeIds) {
          const storeIds = row.storeIds.split(',')
          this.addForm.storeIds = []
          for (let i = 0; i < storeIds.length; i++) {
            console.log('啊啊啊', storeIds[i])
            this.addForm.storeIds.push(parseInt(storeIds[i]))
          }
        }
      },
      deleteCard(row){
        const del = {}
        del.id = row.id
        deleteRebateCoupon(del).then(re =>{
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
      updateList(){
        const add = {}
        add.id = this.id
        add.title = this.addForm.title
        add.storeIds = this.addForm.storeIds
        add.rebateNew = this.addForm.rebateNew
        add.rebateOld = this.addForm.rebateOld
        add.rebate = this.addForm.rebate
        updateRebateCoupon(add).then(re =>{
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
      // 添加
      add() {
        this.dialogVisibles = true
        this.addForm = {
          title: '',
          storeIds: '',
          rebateNew: '',
          rebateOld: '',
          rebate: ''
        }
        this.flag = 1
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
        getRebateCouponList(search).then(re => {
          this.tableData = re.data.data.list
          this.pageData.total = re.data.total
        })
      },
      search() {
        this.pageData.pageNum = 1
        this.getList()
      },
      // 门店
      storeCheck(row) {
        this.dialogVisibleStore = true
        this.tableData3 = row.storeVos
      },

    }
  }
</script>


<style scoped>

</style>
