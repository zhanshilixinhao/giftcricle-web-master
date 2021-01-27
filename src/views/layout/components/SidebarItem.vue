<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
                   :to="item.path+'/'+item.children[0].path"
                   :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                    :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title"
                slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          <el-badge v-if="item.menu === 'order' && (sidebar.reCount > 0 ||sidebar.itemCount > 0||sidebar.chargeCount > 0||sidebar.viItemCount > 0||sidebar.commentCount > 0)" is-dot class="item">
          </el-badge>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                        :routes="[child]" :key="child.path">
          </sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
              <el-badge v-if="child.menu === 're_item_order' && sidebar.reCount > 0" is-dot class="item">
                <!--                                <el-button size="small">评论</el-button>-->
              </el-badge>
              <el-badge v-if="child.menu === 'item_order' && sidebar.itemCount > 0" is-dot class="item">
                <!--                                <el-button size="small">评论</el-button>-->
              </el-badge>
              <el-badge v-if="child.menu === 'charge_order' && sidebar.chargeCount > 0" is-dot class="item">
                <!--                                <el-button size="small">评论</el-button>-->
              </el-badge>
              <el-badge v-if="child.menu === 'virtual_item_order' && sidebar.viItemCount > 0" is-dot class="item">
                <!--                                <el-button size="small">评论</el-button>-->
              </el-badge>
              <el-badge v-if="child.menu === 're_item_comment' && sidebar.commentCount > 0" is-dot class="item">
                <!--                                <el-button size="small">评论</el-button>-->
              </el-badge>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
  import { getOrderCount } from '../../../api/order/itemOrder'

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        sidebar: {
          chargeCount: '',
          itemCount: '',
          viItemCount: '',
          reCount: '',
          commentCount: ''
        }
      }
    },
    mounted() {
      this.sidebar = this.$store.getters.sidebar
      this.$store.state.app.audio = this.$refs.audio
      this.id = setInterval(() => {
        this.getOrders()
      }, 5000)
    },
    methods: {
      hasOneShowingChildren(children) {
        console.log(this.routes)
        const showingChildren = children.filter(item => {
          return !item.hidden
        })
        if (showingChildren.length === 1) {
          return true
        }
        return false
      },
      getOrders() {
        getOrderCount().then(re => {
          this.sidebar.chargeCount = re.data.data.chargeCount
          this.sidebar.itemCount = re.data.data.itemCount
          this.sidebar.viItemCount = re.data.data.viItemCount
          this.sidebar.reCount = re.data.data.reCount
          this.sidebar.commentCount = re.data.data.commentCount
        })
      }
    }
  }
</script>


<!--<template>
  <div>
    <template v-for="item in routes">
      <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path">
        <el-menu-item :index="item.path+'/'+item.children[0].path">
          <icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.children[0].name}}
        </el-menu-item>
      </router-link>
      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden">
        <template slot="title">
          <icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.name}}
        </template>
        <template v-for="child in item.children" v-if='!child.hidden'>
          <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
          <router-link v-else class="menu-indent" :to="item.path+'/'+child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              {{child.name}}
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    data() {
      return {
      }
    },
    mounted() {
      for (var i = 0; i < this.routes.length; i++) {
        alert(this.routes[i].path)
      }
    },
    props: {
      routes: {
        type: Array
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .svg-icon {
    margin-right: 10px;
  }
  .hideSidebar .menu-indent{
    display: block;
    text-indent: 10px;
  }
</style>-->

