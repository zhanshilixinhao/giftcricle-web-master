<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/appUser">
          <el-dropdown-item>
            返回主页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided><span @click="updatePass" style="display:block;">修改密码</span></el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px" :rules="rules" ref="form">
        <el-form-item label="原密码" :label-width="30" prop="oldPassword">
          <el-input v-model="form.oldPassword" auto-complete="off" type="password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="30" prop="newPassword">
          <el-input v-model="form.newPassword" auto-complete="off" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/webUser/webUser'

var MD5 = require('md5.js')
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePass }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePass }]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    updatePass() {
      this.dialogFormVisible = true
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmSumbit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmSumbit() {
      this.$confirm('你确定要提交吗?修改成功后将退出当前账号！')
        .then(_ => {
          var newPassword = new MD5().update(this.form.oldPassword).digest('hex').toUpperCase()
          var oldPassword = new MD5().update(this.form.newPassword).digest('hex').toUpperCase()
          updatePassword(newPassword, oldPassword).then(re => {
            this.$message({
              message: '恭喜你，修改成功！',
              type: 'success'
            })
            this.logout()
          })
        })
        .catch(_ => {
        })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

