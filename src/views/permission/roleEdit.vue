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

        <!--:default-checked-keys="ids"-->
        <el-form-item label="权限集合" prop="permissions">
          <el-card class="box-card">
            <el-tree
              :data="menuData"
              :props="props"
              @check="menuChange"
              @check-change="menuCheckChange"
              ref="tree"
              show-checkbox
              node-key="id">
            </el-tree>
          </el-card>
        </el-form-item>

        <el-row  style="float: left">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即修改</el-button>
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
  import { updateRoleApi, getMenuList, getRoleDetail } from '@/api/permission/permission'

  export default {
    components: {
      ElForm,
      ElCol,
      ElRow,
      ElFormItem
    },
    data() {
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
        ids: [],
        // 是否修改了树 0 未修改 1 修改了
        isChangeTree: 0,
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
      this.getDetail()
    },
    methods: {
      getDetail() {
        getRoleDetail(this.$route.params.id).then(re => {
          var data = re.data.data
          this.ruleForm.name = data.name
          this.ruleForm.description = data.description
          for (var i = 0; i < data.permissions.length; i++) {
            this.ids.push(data.permissions[i].sysFunctionPermissionId)
          }
          this.$refs.tree.setCheckedKeys(this.ids, false)
          var permissionId = 1126
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
        })
      },
      // curNode 当前选择的节点对象 allNode 所有已选择的节点对象
      menuChange(curNode, allNode) {
        this.roleMenu = []
        this.roleFunction = []
        this.isChangeTree = 1
        console.log(allNode.checkedNodes)
        console.log(allNode.halfCheckedKeys)
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
          if (allNode.halfCheckedNodes.length > 0) {
            for (var k = 0; k < allNode.halfCheckedNodes.length; k++) {
              console.log(allNode.halfCheckedNodes[k])
              this.roleMenu.push(allNode.halfCheckedNodes[k])
            }
          }
        }
        var menus = ''
        for (var j = 0; j < this.roleMenu.length; j++) {
          menus = menus + this.roleMenu[j].id + ','
        }
        console.log(menus)
      },
      // 返回角色列表
      getBack() {
        this.$router.push('/permission/roleList')
      },
      // 提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // 如果树改变了，那么就需要判断是否勾选了权限集合
            if (this.isChangeTree === 1) {
              var length = this.roleMenu.length + this.roleFunction.length
              if (length === 0) {
                this.$message.error('请勾选权限集合!')
                return
              }
              this.updateRole()
            } else { // 若树没有改变，则直接修改
              this.updateRole()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateRole() {
        const role = {}
        role.id = this.$route.params.id
        role.name = this.ruleForm.name
        role.description = this.ruleForm.description
        role.isChangeTree = this.isChangeTree
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
        updateRoleApi(role).then(re => {
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
