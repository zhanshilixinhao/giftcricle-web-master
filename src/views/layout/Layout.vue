<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from './components'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
    name: 'Layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>



<!--<template>-->
<!--  <div class="app-wrapper" :class="classObj">-->
<!--    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>-->
<!--    <sidebar class="sidebar-container"></sidebar>-->
<!--    <div class="main-container">-->
<!--      <navbar></navbar>-->
<!--      <app-main></app-main>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--&lt;!&ndash;<template>-->
<!--  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">-->
<!--    <div class="sidebar-wrapper">-->
<!--      <sidebar class="sidebar-container"></sidebar>-->
<!--    </div>-->
<!--    <div class="main-container">-->
<!--      <navbar></navbar>-->
<!--      <app-main></app-main>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>&ndash;&gt;-->

<!--<script>-->
<!--import { Navbar, Sidebar, AppMain } from './components'-->
<!--import ResizeMixin from './mixin/ResizeHandler'-->

<!--export default {-->
<!--  name: 'layout',-->
<!--  components: {-->
<!--    Navbar,-->
<!--    Sidebar,-->
<!--    AppMain-->
<!--  },-->
<!--  mixins: [ResizeMixin],-->
<!--  computed: {-->
<!--    sidebar() {-->
<!--      return this.$store.state.app.sidebar-->
<!--    },-->
<!--    device() {-->
<!--      return this.$store.state.app.device-->
<!--    },-->
<!--    classObj() {-->
<!--      return {-->
<!--        hideSidebar: !this.sidebar.opened,-->
<!--        withoutAnimation: this.sidebar.withoutAnimation,-->
<!--        mobile: this.device === 'mobile'-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    handleClickOutside() {-->
<!--      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style rel="stylesheet/scss" lang="scss" scoped>-->
<!--  @import "src/styles/mixin.scss";-->
<!--  .app-wrapper {-->
<!--    @include clearfix;-->
<!--    position: relative;-->
<!--    height: 100%;-->
<!--    width: 100%;-->
<!--  }-->
<!--  .drawer-bg {-->
<!--    background: #000;-->
<!--    opacity: 0.3;-->
<!--    width: 100%;-->
<!--    top: 0;-->
<!--    height: 100%;-->
<!--    position: absolute;-->
<!--    z-index: 999;-->
<!--  }-->
<!--</style>-->

<!--&lt;!&ndash;<style rel="stylesheet/scss" lang="scss" scoped>-->
<!--  @import "src/styles/mixin.scss";-->
<!--  .app-wrapper {-->
<!--    @include clearfix;-->
<!--    position: relative;-->
<!--    height: 100%;-->
<!--    width: 100%;-->
<!--    &.hideSidebar {-->
<!--      .sidebar-wrapper {-->
<!--        transform: translate(-140px, 0);-->
<!--        .sidebar-container {-->
<!--          transform: translate(132px, 0);-->
<!--        }-->
<!--        &:hover {-->
<!--          transform: translate(0, 0);-->
<!--          .sidebar-container {-->
<!--            transform: translate(0, 0);-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--      .main-container {-->
<!--        margin-left: 40px;-->
<!--      }-->
<!--    }-->
<!--    .sidebar-wrapper {-->
<!--      width: 180px;-->
<!--      position: fixed;-->
<!--      top: 0;-->
<!--      bottom: 0;-->
<!--      left: 0;-->
<!--      z-index: 1001;-->
<!--      overflow: hidden;-->
<!--      transition: all .28s ease-out;-->
<!--    }-->
<!--    .sidebar-container {-->
<!--      transition: all .28s ease-out;-->
<!--      position: absolute;-->
<!--      top: 0;-->
<!--      bottom: 0;-->
<!--      left: 0;-->
<!--      right: -17px;-->
<!--      overflow-y: scroll;-->
<!--    }-->
<!--    .main-container {-->
<!--      min-height: 100%;-->
<!--      transition: all .28s ease-out;-->
<!--      margin-left: 180px;-->
<!--    }-->
<!--  }-->
<!--</style>&ndash;&gt;-->
