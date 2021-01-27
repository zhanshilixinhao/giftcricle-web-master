<template>
  <el-table-column
    :formatter="dateFormat"
    :prop="prop"
    :label="label"
    :width="width"
    align="center"/>
</template>

<script>

  var moment = require('moment')
  export default {
    name: 'CDateItem',
    props:{
      prop: {
        type: String
      },
      label: {
        type: String
      },
      width: {
        type: Number,
        default: 180
      }
    },
    methods: {
      // 时间格式化
      dateFormat: function (row, column) {
        const date = row[column.property]
        if (date === undefined || date === null) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
</script>

<style scoped>

</style>
