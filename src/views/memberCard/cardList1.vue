<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
<!--            <el-col :span="12">-->
<!--              <el-form-item label="卡号" prop="cardNo">-->
<!--                <el-input v-model="ruleForm.cardNo" placeholder="卡号" type="text"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="会员卡名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="会员卡名称" type="text"></el-input>
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
        label="会员卡名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="会员卡类型"
        width="120px">
        <template slot-scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.type === 1">礼遇圈卡</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.type === 10">储值卡</el-tag>
          <el-tag size="mini" type="danger" v-if="scope.row.type === 11">活动卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100%" label="LOGO" align="center">
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
      <el-table-column
        align="center"
        prop="colour"
        label="颜色"
        width="120px">
        <template scope="scope">
          <div :style="{background: scope.row.colour}">颜色</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="detail"
        align="center"
        width="100%"
        label="简介">
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
        align="center"
        label="会员卡活动"
        width="150%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleCheck(scope.row)">查看
          </el-button>
        </template>
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
        label="会员卡等级"
        width="150%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="gradeCheck(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>

      <c-date-item prop="created" label="创建时间"/>
    </el-table>
    <c-pagination :page-data="pageData"/>

    <!--    会员卡简介-->
    <el-dialog
      title="会员卡简介"
      :visible.sync="dialogVisibleDetail"
      size="small">
      <div v-html="detail"></div>
    </el-dialog>

    <!--    会员卡活动-->
    <el-dialog title="活动列表" :visible.sync="dialogVisible" size="tiny" center>
      <el-table
        :data="tableData4"
        stripe
        border>
        <el-table-column
          align="center"
          prop="title"
          show-overflow-tooltip
          label="活动标题">
        </el-table-column>
        <el-table-column
          align="center"
          width="100%"
          label="类型">
          <template scope="scope">
            <el-tag size="mini" type="primary" v-if="scope.row.type === 1">充钱送钱</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.type === 2">充钱送优惠券</el-tag>
            <el-tag size="mini" type="info" v-if="scope.row.type === 5">充钱送钱+送优惠券</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="rechargeMoney"
          label="充值金额">
        </el-table-column>

        <el-table-column
          align="center"
          prop="sendMoney"
          label="赠送金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="targetName"
          label="其他赠送物品">
        </el-table-column>
      </el-table>
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

    <!--    会员卡等级列表-->
    <el-dialog title="会员卡等级" :visible.sync="dialogVisibleGrade" size="tiny" center width="80%">
      <el-table
        :data="tableData6"
        stripe
        border>
        <el-table-column
          align="center"
          prop="title"
          show-overflow-tooltip
          label="等级标题">
        </el-table-column>
        <el-table-column
          align="center"
          prop="summary"
          label="等级介绍"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="grade"
          label="等级"
          width="120px">
        </el-table-column>
        <c-date-item prop="created" label="创建时间"/>
      </el-table>

    </el-dialog>

  </div>
</template>

<script>
  import CDateItem from '../../components/CDateItem/index'
  import CPagination from '../../components/CPagination/index'
  import { getCardList1} from '../../api/v3/userCard'
  import AddCard from './addCard'
  import { getCardGradeList } from '../../api/v3/event'

  export default {
    name: 'CardList',
    components: { AddCard, CPagination, CDateItem },
    data() {
      return {
        pictureUrl: process.env.BASE_IMAGES_API,
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        loading2: false,
        dialogVisible: false,
        dialogVisibleStore: false,
        dialogVisibleDetail: false,
        dialogVisibleGrade: false,
        detail: '',
        id: '',
        tableData: [],
        tableData3: [],
        tableData4: [],
        tableData6: [],
        ruleForm: {
          cardNo: '',
          title: ''
        },
        form: {}
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        var search = {}
        search.pageNum = this.pageData.pageNum
        search.pageSize = this.pageData.pageSize
        search.cardNo = this.ruleForm.cardNo
        search.title = this.ruleForm.title
        getCardList1(search).then(re => {
          this.tableData = re.data.data
          this.pageData.total = re.data.total
        })
      },
      // 简介
      handleItemDetail(row) {
        this.detail = row.summary
        this.dialogVisibleDetail = true
      },
      // 活动
      handleCheck(row) {
        this.dialogVisible = true
        this.tableData4 = row.eventVos
      },
      // 门店
      storeCheck(row) {
        this.dialogVisibleStore = true
        this.tableData3 = row.storeVos
      },
      //等级
      gradeCheck(row) {
        this.dialogVisibleGrade = true
        this.id = row.id
        this.getGardList()
      },
      getGardList() {
        getCardGradeList({ cardId: this.id }).then(re => {
          this.tableData6 = re.data.data
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
