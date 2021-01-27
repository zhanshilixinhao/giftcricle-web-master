<template>
  <div v-loading="loading2"
       element-loading-text="拼命加载中">
    <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="description">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>

        <el-form-item label="权限集合" prop="permissions">
          <el-card class="box-card">
            <el-tree
              :data="menuData"
              :props="props"
              @check="menuChange"
              ref="tree"
              show-checkbox
              node-key="id">
            </el-tree>
          </el-card>
        </el-form-item>

        <el-row  style="float: left">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
            <el-button type="primary" @click="getBack()">返回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import { addRoleApi, getMenuList } from '@/api/permission/permission'
  import store from '@/store/index'

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
        if (value === '' || value.length === 0) {
          this.$message({
            message: rule.name + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      return {
        props: {
          label: 'name',
          children: 'menuSon'
        },
        loading2: false,
        dialogVisiblePiture: false,
        dialogImageUrl: '',
        menuData: [],
        roleMenu: [],
        roleFunction: [],
        // 表单内容
        ruleForm: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请填写角色名称', trigger: 'blur' },
            { max: 200, message: '角色名称不能超过200个字' }],
          description: [
            { required: true, message: '请填写角色描述', trigger: 'blur' },
            { max: 200, message: '角色描述不能超过200个字' }]
        }
      }
    },
    mounted() {
      // store.dispatch('GenerateMenuUrl', this.$route.path).then(() => {})
      var permissionId = 1123
      getMenuList(permissionId).then(re => {
        this.menuData = re.data.data
        // 初始化菜单表
        for (var i = 0; i < this.menuData.length; i++) {
          if (this.menuData[i].menuSon.length > 0) {
            for (var j = 0; j < this.menuData[i].menuSon.length; j++) {
              if (this.menuData[i].menuSon[j].functionVo.length > 0) {
                this.menuData[i].menuSon[j].menuSon = []
                this.menuData[i].menuSon[j].menuSon = this.menuData[i].menuSon[j].functionVo
              }
            }
          }
        }
      })
      console.log(this.menuData)
    },
    methods: {
      // curNode 当前选择的节点对象 allNode 所有已选择的节点对象
      menuChange(curNode, allNode) {
        this.roleMenu = []
        this.roleFunction = []
        console.log(allNode.checkedNodes)
        var nodes = allNode.checkedNodes
        if (nodes.length > 0) {
          // 将已选择的节点分类 分别加入菜单集合和方法集合
          for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].flag === 1 || nodes[i].flag === 2) {
              this.roleMenu.push(nodes[i])
            }
            if (nodes[i].flag === 3) {
              this.roleFunction.push(nodes[i])
            }
          }
        }
      },
      // 返回角色列表
      getBack() {
        this.$router.push('/permission/roleList')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var length = this.roleMenu.length + this.roleFunction.length
            if (length === 0) {
              this.$message.error('请勾选权限集合!')
              return
            }
            this.addRole()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      addRole() {
        const role = {}
        role.name = this.ruleForm.name
        role.description = this.ruleForm.description
        role.roleMenu = []
        role.roleFunction = []
        role.names = ''
        for (var i = 0; i < this.roleMenu.length; i++) {
          role.roleMenu.push(this.roleMenu[i].id)
        }
        for (var j = 0; j < this.roleFunction.length; j++) {
          role.roleFunction.push(this.roleFunction[j].id)
          role.names = role.names + this.roleFunction[j].name + ' | '
        }
        // 添加角色
        this.loading2 = true
        addRoleApi(role).then(re => {
          this.$data.loading2 = false
          if (re.data.errCode === 0) {
            this.$message({
              message: re.data.msg,
              type: 'success'
            })
            this.$router.push('/permission/roleList')
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
<style>
  .cover {
    width: 40px;
    height: 40px;
  }
</style>
