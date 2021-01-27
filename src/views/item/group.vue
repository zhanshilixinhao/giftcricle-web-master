<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-dialog title="添加商品属性" :visible.sync="dialogVisibleFeature" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-select v-model="productFeature" filterable placeholder="请选择" icon="el-icon-search">
          <el-option
            v-for="item in featureOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backFeature()">取 消</el-button>
          <el-button type="primary" @click="submitFeature()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加修改商品属性值" :visible.sync="dialogVisibleValue" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          :closable="true"
          :close-transition="false"
          @close="handleClose(tag)">
          {{tag.value + "&nbsp;"}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="mini"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else size="small" @click="showInput">+ 添加属性值</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backValue()">取 消</el-button>
          <el-button type="primary" @click="submitValue()">确 定</el-button>
        </div>
      </el-dialog>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div>
          <el-card :body-style="{ padding: '12px' }">
            <el-button type="primary" @click="addFeature()">选择商品属性</el-button>
          </el-card>
        </div>
        <br/>
        <div>
          <el-card :body-style="{ padding: '12px' }">
            <el-table
              :data="tableData3"
              stripe
              border
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                label="商品属性名称">
              </el-table-column>
              <el-table-column
                prop="values"
                align="center"
                label="商品属性值"
                :formatter="valuesFormat">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="plus"
                    @click="handleAdd(scope.$index, scope.row)">添加或修改属性值
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    icon="delete"
                    @click="handleDelete(scope.$index, scope.row)">删除属性
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <br/>
        <div>
          <el-card :body-style="{ padding: '12px' }">
            <el-table
              :data="tableSkuData"
              stripe
              border
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="images"
                align="center"
                label="商品图片">
                <template scope="scope">
                  <div>
                    <img class="cover"
                         :src="pictureUrl + scope.row.images[0]"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="price"
                align="center"
                label="商品价格">
              </el-table-column>
              <el-table-column
                prop="group"
                align="center"
                label="组合内容"
                :formatter="groupFormat">
                <template scope="scope">
                  <el-popover
                    ref="popover4"
                    placement="right"
                    width="400"
                    trigger="click">
                    <el-table :data="scope.row.group">
                      <el-table-column property="parentId" label="商品属性名称" :formatter="featureFormat"></el-table-column>
                      <el-table-column property="value" label="商品属性值"></el-table-column>
                    </el-table>
                    <el-button slot="reference">点击查看</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="stock"
                align="center"
                label="库存">
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="plus"
                    @click="handleEditProduct(scope.$index, scope.row)">修改商品属性值
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <el-dialog title="修改商品" :visible.sync="dialogVisibleProduct" size="tiny"  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="price">
            <el-input v-model="ruleForm.price" type="number" onkeyup="value=value.replace(/[^\d]+\./g,'');
this.value=/^\d+\.?\d{0,2}$/.test(this.value) ?
this.value : this.value.split('.')[1].length==1?
this.value:this.value=this.value.split('.')[0]+'.'+this.value.split('.')[1].substr(0,1);"></el-input>
          </el-form-item>

          <el-form-item label="商品库存" prop="stock">
            <el-input v-model="ruleForm.stock" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" prop="imageUriList">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :file-list="images"
              :on-preview="handlePictureCardPreview"
              :on-success="handleSuccess"
              :before-upload="handleBeforeUpload"
              :data="imageData"
              :on-error="handleError"
              :on-remove="handleRemove">
              <i v-if="ruleForm.imageUriList.length < 1" class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传200KB以内的jpg、png格式图片（建议图片尺寸是280x200</div>
            </el-upload>
          </el-form-item>
          <div slot="footer" class="dialog-footer">
            <el-button @click="backProduct()">返 回</el-button>
            <el-button type="primary" @click="submitProduct()">确 定</el-button>
          </div>
        </el-dialog>
        <br>
        <el-card :body-style="{ padding: '12px' }">
          <el-button type="primary" @click="submitForm()">立即创建</el-button>
          <el-button type="primary" @click="getBack()">返回</el-button>
        </el-card>
      </el-form>

      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  import { getAllFeatureApi } from '@/api/gift/item/itemFeature'
  import { addskuApi } from '@/api/gift/item/group'
  // var moment = require('moment')
  var featureId = 0
  var index = ''
  var tempImage = []
  var id = 1
  export default {
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
    },
    data() {
      // 验证文本必传项
      const validateRequire = (rule, value, callback) => {
        if (value === null || value === undefined || value.toString().trim() === '') {
          this.$message({
            message: rule.name + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const numberValidator = (rule, value, callback) => {
        // var patrn = /^[0-9]{1,20}$/
        var patrn = /^\d+(\.\d+)?$/
        if (!patrn.exec(value)) {
          callback(new Error('请输入正确的' + rule.name + '格式!'))
        } else {
          callback()
        }
      }
      const integerValidator = (rule, value, callback) => {
        var patrn = /^[0-9]+$/
        if (value === null || value === '' || value === undefined) {
          callback()
        } else {
          if (!patrn.exec(value)) {
            callback(new Error('请输入正确的' + rule.name + '格式!'))
          } else {
            if (this.ruleForm.maxAge !== '' && this.ruleForm.minAge !== null && this.ruleForm.maxAge <= this.ruleForm.minAge) {
              callback(new Error('推荐最大年龄需大于推荐最小年龄!'))
            } else {
              callback()
            }
          }
        }
      }
      // 验证图片列表
//      const validateRequireImges = (rule, value, callback) => {
//        if (value.length === 0) {
//          this.$message({
//            message: '至少要上传一张图片!',
//            type: 'error'
//          })
//          callback(null)
//        } else {
//          callback()
//        }
//      }
      return {
        pictureUrl: process.env.BASE_IMAGES_API,
        // 标签属性
        dynamicTags: [],
        tableSkuData: [],
        inputVisible: false,
        inputValue: '',
        // 图片上传路径
        uploadUrl: process.env.BASE_API + '/manage/upload/image?module=1',
        loading2: false,
        dialogVisible: false,
        // 添加商品属性窗口
        dialogVisibleFeature: false,
        // 添加修改商品属性值窗口
        dialogVisibleValue: false,
        // 修改商品窗口
        dialogVisibleProduct: false,
        dialogImageUrl: '',
        checkAll: false,
        tableData3: [],
        featureOptions: [],
        productFeature: '',
        isIndeterminate: false,
        imageData: {
          width: 280,
          height: 200
        },
        // 商品图片
        images: [],
        // 表单内容
        ruleForm: {
          name: '',
          price: '',
          stock: '',
          imageUriList: []
        },
        rules: {
          name: [{ validator: validateRequire, name: '商品名称' }],
          price: [{ validator: validateRequire, name: '商品价格' }, { validator: numberValidator, name: '商品价格' }],
          stock: [{ validator: validateRequire, name: '库存' }, { validator: integerValidator, name: '库存' }]
        }
      }
    },
    mounted() {
      var permissionId = 1036
      getAllFeatureApi(permissionId).then(re => {
        this.featureOptions = re.data.data
      })
    },
    methods: {
      // 标签操作
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      // 标签操作
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 标签操作
      handleInputConfirm() {
        var inputValue = this.inputValue
        if (inputValue) {
          var value = {}
          value.id = id++
          value.value = inputValue
          this.dynamicTags.push(value)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      // 打开分类窗口
      addFeature() {
        this.dialogVisibleFeature = true
      },
      // 返回分类列表
      backFeature() {
        this.productFeature = ''
        this.dialogVisibleFeature = false
      },
      // 删除商品属性
      handleDelete(index, row) {
        this.$confirm('你确定要删除该商品属性吗?删除后将重置组合!')
          .then(_ => {
            this.$message({
              message: '恭喜你，商品属性删除成功！',
              type: 'success'
            })
            for (var i in this.tableData3) {
              if (this.tableData3[i].id === row.id) {
                this.tableData3.splice(i, 1)
                this.addValueTable()
                break
              }
            }
          })
      },
      // 打开修改商品窗口
      handleEditProduct(index1, row) {
        this.dialogVisibleProduct = true
        this.ruleForm.imageUriList = []
        this.$data.images = []
        index = index1
        this.ruleForm.name = row.name
        this.ruleForm.price = row.price.toString()
        this.ruleForm.stock = row.stock.toString()
        this.ruleForm.imageUriList.push(row.images[0])
        tempImage = []
        if (row.images) {
          var obj
          for (var i = 0; i < row.images.length; i++) {
            console.log('aaaaaa')
            tempImage.push(row.images[i])
            obj = {}
            obj.name = row.images[i]
            obj.url = process.env.BASE_IMAGES_API + row.images[i]
            this.$data.images.push(obj)
            break
          }
        }
      },
      // 修改商品按钮
      submitProduct() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.tableSkuData[index].images.length === 0 && this.ruleForm.imageUriList.length === 0) {
              this.$message.error('商品图片为必传项!')
              return
            }
            for (var i = 0; i < this.ruleForm.imageUriList.length; i++) {
              this.tableSkuData[index].images.push(this.ruleForm.imageUriList[i])
            }
            this.tableSkuData[index].name = this.ruleForm.name
            this.tableSkuData[index].price = this.ruleForm.price
            this.tableSkuData[index].stock = this.ruleForm.stock
            this.dialogVisibleProduct = false
            this.$data.images = []
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 取消修改商品按钮
      backProduct() {
        this.dialogVisibleProduct = false
        this.$data.images = []
        this.ruleForm.imageUriList = []
        this.tableSkuData[index].images = tempImage
      },
      // 打开添加属性值窗口
      handleAdd(index, row) {
        featureId = row.id
        for (var a = 0; a < this.tableData3.length; a++) {
          if (this.tableData3[a].id === featureId) {
            if (this.tableData3[a].values === undefined) {
              this.tableData3[a].values = []
            }
            this.dynamicTags = this.tableData3[a].values
          }
        }
        this.dialogVisibleValue = true
      },
      // 从添加属性值窗口返回列表
      backValue() {
        featureId = 0
        this.dynamicTags = []
        this.dialogVisibleValue = false
      },
      // 提交商品属性值
      submitValue() {
        for (var a = 0; a < this.tableData3.length; a++) {
          if (this.tableData3[a].id === featureId) {
            this.tableData3[a].values = []
            for (var i = 0; i < this.dynamicTags.length; i++) {
              this.tableData3[a].values.push(this.dynamicTags[i])
            }
            this.dialogVisibleValue = false
            // 刷新表中values的值
            this.tableData3.push('')
            this.tableData3.splice(this.tableData3.length - 1, 1)
            this.dynamicTags = []
            this.addValueTable()
          }
        }
      },
      // 组合商品方法
      addValueTable() {
        this.tableSkuData = []

        var array = []
        var group = []
        for (var i = 0; i < this.tableData3.length; i++) {
          for (var j = 0; j < this.tableData3[i].values.length; j++) {
            var groupValue = {}
            groupValue.id = this.tableData3[i].values[j].id
            groupValue.parentId = this.tableData3[i].id
            groupValue.value = this.tableData3[i].values[j].value
            group.push(groupValue)
          }
          array[i] = group
          group = []
        }
        var skuData = {}
        for (var b = 0; b < array[0].length; b++) {
          skuData.group = []
          skuData.group.push(array[0][b])
          skuData.images = []
          skuData.images.push(this.$route.query.cover)
          skuData.name = this.$route.query.productName
          skuData.productId = this.$route.query.productId
          skuData.price = 0
          skuData.stock = 0
          this.tableSkuData.push(skuData)
          skuData = {}
        }
        var z = 1
        skuData = {}
        while (z < array.length) {
          var d = this.tableSkuData.length
          if (array.length > 1) {
            for (var x = 0; x < d; x++) {
              for (var y = 0; y < array[z].length; y++) {
                // skuData.group = this.tableSkuData[x].group
                var group1 = this.tableSkuData[x].group.slice(0, z)
                skuData.images = []
                skuData.images.push(this.$route.query.cover)
                skuData.name = this.$route.query.productName
                skuData.productId = this.$route.query.productId
                skuData.price = 0
                skuData.stock = 0
                // alert('array[z][y] = ' + array[z][y].value + '-----' + 'z = ' + z + '   y = ' + y)
                group1.push(array[z][y])
                skuData.group = group1
                this.tableSkuData.push(skuData)
                console.log(this.tableSkuData)
                skuData = {}
              }
            }
            this.tableSkuData.splice(0, d)
          }
          z++
        }
        console.log(this.tableSkuData)
      },
      // 提交商品属性
      submitFeature() {
        if (this.productFeature === '') {
          this.$message.error('请选择商品属性!')
          return ''
        }
        for (var a = 0; a < this.tableData3.length; a++) {
          if (this.tableData3[a].id === this.productFeature) {
            this.$message.error('该商品属性已被添加!')
            return
          }
        }
        var feature = {}
        for (var i = 0; i < this.featureOptions.length; i++) {
          if (this.featureOptions[i].id === this.productFeature) {
            feature.id = this.featureOptions[i].id
            feature.name = this.featureOptions[i].name
            feature.values = []
            this.tableData3.push(feature)
            this.dialogVisibleFeature = false
            // this.productFeature = ''
          }
        }
        featureId = this.productFeature
        // 每选一次商品属性都要刷新列表
        this.submitValue()
      },
      // 商品属性值格式化
      valuesFormat: function(row, column) {
        var values = row[column.property]
        var value = ''
        if (values === undefined || values === null || values.length === 0) {
          return ''
        }
        for (var i = 0; i < values.length; i++) {
          if (values.length - 1 !== i) {
            value = value + values[i].value + ' | '
          } else {
            value = value + values[i].value
          }
        }
        return value
      },
      // 商品属性格式化
      featureFormat: function(row, column) {
        var id = row[column.property]
        if (id === undefined || id === null || id.length === 0) {
          return ''
        }
        for (var i = 0; i < this.featureOptions.length; i++) {
          if (id === this.featureOptions[i].id) {
            id = this.featureOptions[i].name
            return id
          }
        }
        return id
      },
      // 组合内容格式化
      groupFormat: function(row, column) {
        var values = row[column.property]
        var value = ''
        if (values === undefined || values === null || values.length === 0) {
          return ''
        }
        for (var i = 0; i < values.length; i++) {
          if (values.length - 1 !== i) {
            value = value + values[i].value + ' | '
          } else {
            value = value + values[i].value
          }
        }
        return value
      },
      // 图片上传失败
      handleError(errors, file, fileList) {
        this.$message.error('图片的尺寸必须是280x200')
      },
      // 图片上传之前
      handleBeforeUpload(file) {
        if (this.ruleForm.imageUriList.length < 1) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 0.2
          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或png 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 200KB!')
          }
          return isJPG && isLt2M
        } else {
          this.$message({
            message: '最多上传1张照片',
            type: 'error'
          })
          return false
        }
      },
      // 移除一张图片
      handleRemove(file, fileList) {
        console.log(this.ruleForm.imageUriList)
        // 将删除的这张图从图片列表中移除
        for (let i = 0; i < this.ruleForm.imageUriList.length; i++) {
          // 如果存在这张图
          if (this.ruleForm.imageUriList[i] === file.name) {
            // 移除
            this.ruleForm.imageUriList.splice(i, 1)
          }
        }
        for (let i = 0; i < this.tableSkuData[index].images.length; i++) {
          // 如果存在这张图
          if (this.tableSkuData[index].images[i] === file.name) {
            // 移除
            this.tableSkuData[index].images.splice(i, 1)
          }
        }
        console.log(this.ruleForm.imageUriList)
      },
      // 图片上传成功
      handleSuccess(re, file, fileList) {
        file.name = re.name
        this.ruleForm.imageUriList.push(re.name)
        console.log(this.ruleForm.imageUriList)
      },
      // 图片预览
      handlePictureCardPreview(file, fileList) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 返回商品列表
      getBack() {
        this.$router.push('/item/list')
      },
      // 提交表单
      submitForm() {
        if (this.tableData3.length === 0) {
          this.$message.error('请选择商品属性!')
          return
        }
        for (var i = 0; i < this.tableData3.length; i++) {
          if (this.tableData3[i].values.length === 0) {
            this.$message.error('商品属性值不能为空!')
            return
          }
        }
        // alert(this.tableSkuData[0].group[1].id)
        this.addsku()
      },
      addsku() {
        const productValue = this.tableData3
        const productSKU = this.tableSkuData
        // 添加组合
        this.loading2 = true
        addskuApi(productValue, productSKU, this.$route.query.productId).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.$router.push('/item/list')
          } else {
            this.$message.error(re.data.msg)
          }
          this.$data.loading2 = false
        }).catch(_ => {
          this.$data.loading2 = false
        })
      }
    }
  }
</script>
