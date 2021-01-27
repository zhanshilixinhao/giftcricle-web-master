<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <div>
        <el-card :body-style="{ padding: '12px' }">
          <el-button type="primary" @click="getBack()">返 回</el-button>
        </el-card>
      </div>
      <br/>
      <el-table
        :data="tableValueData"
        stripe
        border>
        <el-table-column type="expand"
                         prop="name"
                         align="center">
          <template scope="scope">
            <el-table :data="scope.row.itemValueVos">
              <el-table-column property="value" label="商品属性值" align="center"></el-table-column>
              <el-table-column label="修 改" align="center">
                <template scope="prop">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="edit"
                    @click="handleEditValue(prop.$index, prop.row)">修改
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column  prop="name" label="商品属性名称" align="center">
        </el-table-column>
      </el-table>
      <el-dialog title="修改商品属性值" :visible.sync="dialogVisible" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-input v-model="productValue" placeholder="商品属性值" type="text"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backValue()">取 消</el-button>
          <el-button type="primary" @click="submitValue()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import { getFeatureValueApi, editValueApi } from '@/api/gift/item/group'
  export default {
    components: { ElRow },
    data() {
      return {
        tableValueData: [],
        featureOptions: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loading2: false,
        dialogVisible: false,
        productValue: '',
        productValueId: ''
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      // 返回sku商品列表
      getBack() {
        this.$router.push('/item/skuList/' + this.$route.params.id)
      },
      // 获取列表
      getList() {
        getFeatureValueApi(this.$route.params.id).then(re => {
          this.tableValueData = re.data.data
        })
      },
      // 修改商品属性值
      handleEditValue(index, row) {
        this.productValue = row.value
        this.productValueId = row.id
        this.dialogVisible = true
      },
      // 返回商品属性列表
      backValue() {
        this.productValue = ''
        this.productValueId = ''
        this.dialogVisible = false
      },
      // 提交商品属性值
      submitValue() {
        if (this.productValue.toString().trim() === '') {
          this.$message.error('请填写商品属性值')
          return
        }
        this.loading2 = true
        editValueApi(this.productValueId, this.productValue).then(re => {
          this.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
            this.productValue = ''
            this.productValueId = ''
          } else {
            this.dialogVisible = false
            this.$message.error(re.data.msg)
          }
        })
      }
    }
  }
</script>
