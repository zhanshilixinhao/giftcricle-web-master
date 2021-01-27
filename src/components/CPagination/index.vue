<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="pageData.pageNum"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pageData.pageSize"
    layout="sizes, prev, pager, next, total, jumper"
    :total="pageData.total">
  </el-pagination>
</template>

<script>
  export default {
    name: 'CPagination',
    props: {
      pageData: {
        type: Object,
        default: () => {
          return {
            pageSize: 10,
            pageNum: 1,
            total: 0,
            action: () => {}
          }
        }
      }
    },
    methods: {
      handleSizeChange() {
        this.pageData.action({ pageSize: this.pageData.pageSize, pageNum: this.pageData.pageNum})
      },
      handleCurrentChange() {
        this.pageData.action({ pageSize: this.pageData.pageSize, pageNum: this.pageData.pageNum})
      }
    }
  }
</script>

<style scoped>

</style>
