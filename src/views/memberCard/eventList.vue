<template>
  <div class="app-container" v-loading="loading2" element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <h4>条件查询</h4>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="活动标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="活动标题" type="text"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠送类型" prop="type">
                <el-select v-model="ruleForm.type" filterable placeholder="请选择" style="width: 100%"
                           icon="el-icon-search">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
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
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <el-button type="primary" @click="add()">添加活动</el-button>
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
        label="活动标题">
      </el-table-column>
      <el-table-column
        align="center"
        prop="summary"
        label="简介"
        show-overflow-tooltip/>
      <el-table-column
        align="center"
        width="140%"
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
        label="充值金额"
        width="100%">
      </el-table-column>

      <el-table-column
        align="center"
        prop="sendMoney"
        label="赠送金额"
        width="100%">
      </el-table-column>
      <el-table-column
        align="center"
        label="其他赠送物品"
        width="120%"
        show-overflow-tooltip>
        <template scope="scope">
          <div v-if="scope.row.targetName">{{scope.row.targetName+ scope.row.quantity+'张'}}</div>
        </template>
      </el-table-column>

      <c-date-item prop="created" label="创建时间"/>
      <el-table-column label="操作" align="center" width="350px">
        <template scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="editCard(scope.row)">修改
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <c-pagination :page-data="pageData"/>
  </div>
</template>

<script>
  import CDateItem from '../../components/CDateItem/index'
  import CPagination from '../../components/CPagination/index'
  import { getCardEventList, deleteCardEvent } from '../../api/v3/event'

  export default {
    name: 'eventList',
    components: { CDateItem, CPagination },
    data() {
      return {
        typeOptions: [{ value: 1, name: '充钱送钱' }, { value: 2, name: '充钱送优惠券' }, { value: 5, name: '充钱送钱+送优惠券' }],
        ruleForm: {
          title: '',
          type: ''
        },
        pageData: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          action: this.getList
        },
        loading2: false,
        tableData: []
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
        search.title = this.ruleForm.title
        search.type = this.ruleForm.type
        getCardEventList(search).then(re => {
          this.tableData = re.data.data
          this.pageData.total = re.data.total
        })
      },
      add() {
        this.$router.push('/memberCard/addEvent')
      },
      editCard(row) {
        this.$router.push({
          name:'addEvent',
          query: {id:row.id}
        })
      },
      handleDelete(row) {
        this.$confirm('你确定要删除吗?')
          .then(_ => {
            this.loading2 = true
            deleteCardEvent({eventId:row.id}).then(re => {
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

<style scoped>

</style>
