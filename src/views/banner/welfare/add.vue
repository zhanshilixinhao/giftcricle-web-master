<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="福利标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请填写福利标题"/>
        </el-form-item>
        <br/>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="福利物品总数" prop="quantity">
              <el-input v-model="ruleForm.quantity" type="number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <br/>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否扫码" prop="isCode">
              <el-select v-model="ruleForm.isCode" placeholder="请选择">
                <el-option label="app福利(不需要扫码)" value="1"></el-option>
                <el-option label="微信福利(需要扫码)" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <br/>


        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="福利生效时间" prop="targetDate">
              <el-date-picker
                v-model="ruleForm.targetDate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="福利展示时间" prop="targetDate">
              <el-date-picker
                v-model="ruleForm.value4"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <br/>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="福利物品选择" prop="type">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search" @change="categoryChange">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          <el-form-item >
          <el-button v-if="ruleForm.type&&ruleForm.type!==''"  type="primary" @click="addItem()" size="small" >选择物品</el-button>
          </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="物品" prop="detail" v-if="itemId || skuId">
          <el-input  v-model="ruleForm.detail" disabled/>
        </el-form-item>
        <br/>
        <br/>
        <br/>
        <el-row style="float: left">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

     <!--商品选择-->
    <el-dialog :title="type" :visible.sync="dialogVisibleItem" size="tiny" >
      <el-form :model="addForm4" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="物品名称" prop="name">
              <el-input v-model="addForm4.name" placeholder="物品名称" type="text" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="itemSearch4()">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="tableData4"
        stripe
        border>
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column width="100" label="商品封面" align="center">
          <template scope="scope">
          <el-popover trigger="click" placement="right">
            <img
              :src="pictureUrl + scope.row.cover"/>
            <div slot="reference" class="name-wrapper">
              <img class="cover"
                   :src="pictureUrl + scope.row.cover"/>
            </div>
          </el-popover>
        </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title"
          show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          width="160%"
          label="商品价格">
        </el-table-column>
        <el-table-column
          align="center"
          width="160%"
          label="商品sku集合">
          <template scope="scope">
            <el-button type="primary" size="small" @click="skuList(scope.$index, scope.row)">选择sku</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="width: 100%;float: right;margin-top: 16px;margin-bottom: 16px">
        <el-pagination
          @size-change="handleSizeChange4"
          @current-change="handleCurrentChange4"
          :current-page.sync="pageNum4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize4"
          layout="sizes, prev, pager, next, total, jumper"
          :total="total4">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBack4()" type="primary">取消</el-button>
      </span>
    </el-dialog>
    <!--虚拟商品和优惠券选择-->
    <el-dialog :title="type" :visible.sync="dialogVisible" size="tiny"  >
      <el-form :model="addForm5" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm5.name" placeholder="商品名称" type="text" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="itemSearch5()">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="tableData5"
        stripe
        border>
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column width="100" label="商品封面" align="center">
          <template scope="scope">
            <el-popover trigger="click" placement="right">
              <img
                :src="pictureUrl + scope.row.cover"/>
              <div slot="reference" class="name-wrapper">
                <img class="cover"
                     :src="pictureUrl + scope.row.cover"/>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title"
          show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          width="160%"
          label="商品价格">
        </el-table-column>
        <el-table-column
          align="center"
          width="160%"
          label="选择">
          <template scope="scope">
            <el-button type="primary" size="small" @click="confirm5(scope.row)">确定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="width: 100%;float: right;margin-top: 16px;margin-bottom: 16px">
        <el-pagination
          @size-change="handleSizeChange5"
          @current-change="handleCurrentChange5"
          :current-page.sync="pageNum5"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize5"
          layout="sizes, prev, pager, next, total, jumper"
          :total="total5">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBack5()" type="primary">取消</el-button>
      </span>
    </el-dialog>
      <!--sku列表-->
    <el-dialog :title="type" :visible.sync="dialogVisibleSku" size="tiny"  >
      <el-table
        :data="tableData6"
        stripe
        border>
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column width="100" label="商品封面" align="center">
          <template scope="scope">
            <el-popover trigger="click" placement="right">
              <img
                :src="pictureUrl + scope.row.cover"/>
              <div slot="reference" class="name-wrapper">
                <img class="cover"
                     :src="pictureUrl + scope.row.cover"/>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title"
          show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="price"
          width="160%"
          label="商品价格">
        </el-table-column>
        <el-table-column
          align="center"
          width="160%"
          label="选择">
          <template scope="scope">
            <el-button type="primary" size="small" @click="confirm6(scope.row)">确定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBack6()" type="primary">取消</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import { addWelfare, getAllItemList, getSkuList, itemDetail } from '../../../api/home/banner/welfare'

  var moment = require('moment')
  export default {
    data() {
      return {
        typeOptions: [{ value: 1, name: '商品' }, { value: 2, name: '虚拟物品' },
          // { value: 3, name: '优惠券' }
          ],
        startTime: '',
        loading: false,
        endTime: '',
        itemId: '',
        skuId: '',
        pictureUrl: process.env.BASE_IMAGES_API,
        dialogVisible: false,
        dialogVisibleItem: false,
        dialogVisibleSku: false,
        pageNum4: 1,
        pageSize4: 10,
        total4: 0,
        pageNum5: 1,
        pageSize5: 10,
        total5: 0,
        ruleForm: {
          title: '',
          quantity: '',
          targetDate: '',
          value4: [],
          type: '',
          isCode: '',
          detail: ''
        },
        multipleTable: [],
        tableData4: [],
        tableData5: [],
        tableData6: [],
        addForm4: {
          name: ''
        },
        addForm5: {
          name: ''
        },
        rules: {
          title: [
            { required: true, message: '请填写福利标题', trigger: 'blur' },
            { max: 50, message: '横幅标题不能超过50个字' }],
          quantity: [
            { required: true, message: '请填写物品数量', trigger: 'blur' }],
          targetDate: [
            { required: true, message: '请选择福利生效时间', trigger: 'blur' }],
          value4: [
            { required: true, message: '请选择福利展示时间', trigger: 'blur' }],
          type: [
            { required: true, message: '请选择物品类型', trigger: 'blur' }],
          isCode: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
        }
      }
    },
    mounted() {
    },
    methods: {
      // 添加返回
      getBack() {
        this.$router.push('/banner/welfare')
      },
      // 选择商品返回
      addBack4() {
        this.dialogVisibleItem = false
      },
      addBack5() {
        this.dialogVisible = false
      },
      addBack6() {
        this.dialogVisibleSku = false
      },
      // 确定
      confirm5(row) {
        this.dialogVisible = false
        this.itemId = row.id
        itemDetail({ type: this.ruleForm.type, id: row.id}).then(re => {
          this.ruleForm.detail = re.data.data
        })
      },
      confirm6(row) {
        this.dialogVisibleSku = false
        this.dialogVisibleItem = false
        this.skuId = row.id
        itemDetail({ type: this.ruleForm.type, id: row.id}).then(re => {
          this.ruleForm.detail = re.data.data
        })
      },
      // 搜索
      itemSearch4() {
        this.pageNum4 = 1
        this.getList()
      },
      itemSearch5() {
        this.pageNum5 = 1
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
      handleSizeChange4(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize4 = val
        this.pageNum4 = 1
        this.getList()
      },
      handleSizeChange5(val) {
        console.log(`每页 ${val} 条`)
        this.pageSize5 = val
        this.pageNum5 = 1
        this.getList()
      },
      // 调整分页
      handleCurrentChange4(val) {
        console.log(`当前页: ${val}`)
        this.pageNum4 = val
        this.getList()
      },
      handleCurrentChange5(val) {
        console.log(`当前页: ${val}`)
        this.pageNum5 = val
        this.getList()
      },
      // 添加物品
      addItem() {
        if (this.ruleForm.type === '') {
          this.$message.error('请先选择物品类型')
          return
        }
        this.getList()
      },
      getList() {
        if (this.ruleForm.type === 1) {
          this.dialogVisibleItem = true
          getAllItemList(this.ruleForm.type, this.pageNum4, this.pageSize4, this.addForm4.name).then(re => {
            this.tableData4 = re.data.data
            this.total4 = re.data.data
          })
        } else {
          this.dialogVisible = true
          getAllItemList(this.ruleForm.type, this.pageNum5, this.pageSize5, this.addForm5.name).then(re => {
            this.tableData5 = re.data.data
            this.total5 = re.data.data
          })
        }
      },
      // sku列表
      skuList(index, row) {
        getSkuList(row.id).then(re => {
          this.dialogVisibleSku = true
          this.tableData6 = re.data.data
        })
      },
      // 立即创建
      submitForm() {
        var wel = {}
        wel.title = this.ruleForm.title
        wel.type = this.ruleForm.type
        wel.quantity = this.ruleForm.quantity
        wel.targetDate = this.ruleForm.targetDate
        wel.count = this.ruleForm.quantity
        wel.isCode = this.ruleForm.isCode
        if (this.ruleForm.type === 1) {
          if (!this.skuId || this.skuId === '') {
            this.$message.error('请先选择商品')
          } else {
            wel.targetId = this.skuId
          }
        } else {
          if (!this.itemId || this.itemId === '') {
            this.$message.error('请先选择商品')
          } else {
            wel.targetId = this.itemId
          }
        }
        wel.startTime = this.ruleForm.value4[0]
        wel.endTime = this.ruleForm.value4[1]
        addWelfare(wel).then(re => {
          if (re.data.errCode === 0) {
            this.$message.success(re.data.msg)
            this.ruleForm = ''
            this.$router.push('/banner/welfare')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
