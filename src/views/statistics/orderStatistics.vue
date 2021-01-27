<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <el-tabs v-model="editableTabsValue" type="card" @tab-click="handleClick">
          <el-tab-pane
            :key="item.name"
            v-for="(item, index) in editableTabs"
            :label="item.title"
            :name="item.name">
          </el-tab-pane>
        </el-tabs>
        <div class="block" align="center">
          <span class="demonstration">请选择时间</span>
          <el-date-picker
            v-model="startTime"
            type="datetime"
            align="right"
            default-time="00:00:00"
            placeholder="开始日期">
          </el-date-picker>
          <span class="demonstration"> -- </span>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            align="right"
            default-time="23:59:59"
            placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </div>
        <br/>
        <br/>
        <br/>
        <div id="myChart" :style="{ height: '500px', width: '100%'}"></div>
        <br/>
        <br/>
        <div id="myChartPie" :style="{ height: '400px', width: '100%'}"></div>
      </el-card>
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
  import { getItemOrderData } from '@/api/statistics/statistics'

  require('echarts/theme/macarons') // echarts theme 主题
  require('echarts/theme/vintage') // echarts theme 主题
  require('echarts/theme/dark') // echarts theme 主题
  require('echarts/theme/shine') // echarts theme 主题

  var moment = require('moment')
  export default {
    name: 'hello',
    data() {
      return {
        loading2: false,
        startTime: null,
        endTime: null,
        orderData: '',
        orderType: '1',
        orderTitle: '商品订单',
        editableTabsValue: '1',
        editableTabs: [{
          title: '商品订单',
          name: '1',
          content: '商品订单'
        }, {
          title: '充值订单',
          name: '2',
          content: '充值订单'
        }],
        tabIndex: 2,
        ruleForm: {
          name: '',
          description: ''
        }
      }
    },
    mounted() {
      this.handleSearch()
    },

    methods: {
      handleClick(tab, event) {
        console.log(tab)
        // tab订单的类型
        this.orderType = tab.name
        // tab订单的标题
        this.orderTitle = tab.label
        this.handleSearch()
      },
      handleSearch() {
        var start = ''
        var end = ''
        var title = '全部' + this.orderTitle + '统计'
        if (this.startTime === null && this.endTime !== null) {
          this.$message.error('请选择开始日期!')
          return
        }
        if (this.startTime !== null && this.endTime === null) {
          this.$message.error('请选择结束日期!')
          return
        }
        if (this.startTime !== null && this.endTime !== null) {
          if (this.startTime >= this.endTime) {
            this.$message.error('开始日期需大于结束日期!')
            return
          }
          start = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss')
          end = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss')
          title = start + '到' + end + this.orderTitle + '统计'
        }
        this.loading2 = true
        getItemOrderData(this.orderType, start, end).then(re => {
          this.loading2 = false
          this.orderData = re.data.data
          this.drawLine(title)
        })
      },
      drawLine(title) {
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(document.getElementById('myChart'), 'vintage')
        const myChartPie = this.$echarts.init(document.getElementById('myChartPie'), 'vintage')
        var barSeries = []
        var pieSeries = []
        var barLegendData = []
        // 如果订单类型是商品订单
        if (this.orderType === '1') {
          var pieItemData = []
          var pieVirItemData = []
          var pieConItemData = []
          // 组装饼图商品订单数据
          for (let i = 0; i < this.orderData.itemOrders.length; i++) {
            const obj = {}
            obj.value = this.orderData.itemOrders[i]
            obj.name = this.orderData.title[i]
            pieItemData.push(obj)
          }
          // 组装饼图虚拟商品订单数据
          for (let i = 0; i < this.orderData.virItemOrders.length; i++) {
            const obj = {}
            obj.value = this.orderData.virItemOrders[i]
            obj.name = this.orderData.title[i]
            pieVirItemData.push(obj)
          }
          // 组装饼图寄售台订单数据
          for (let j = 0; j < this.orderData.conOrders.length; j++) {
            const obj = {}
            obj.value = this.orderData.conOrders[j]
            obj.name = this.orderData.title[j]
            pieConItemData.push(obj)
          }
          // 柱形统计图说明
          barLegendData = ['商品订单', '虚拟商品订单', '寄售台订单']
          // 柱形统计图数据
          barSeries =
            [{ name: '商品订单', type: 'bar', label: { normal: { show: true, position: 'top' }}, // label 必须要在data的上方才起作用
              data: this.orderData.itemOrders, barMaxWidth: '100' // 最大宽度
            },
            { name: '虚拟商品订单', type: 'bar', label: { normal: { show: true, position: 'top' }}, // label 必须要在data的上方才起作用
              data: this.orderData.virItemOrders, barMaxWidth: '100' // 最大宽度
            },
            { name: '寄售台订单', type: 'bar', label: { normal: { show: true, position: 'top' }}, // label 必须要在data的上方才起作用
              data: this.orderData.conOrders, barMaxWidth: '100' // 最大宽度
            }]
          // 饼图数据
          pieSeries = [{ name: '商品订单', type: 'pie', radius: '55%', center: ['25%', '50%'], data: pieItemData },
            { name: '虚拟商品订单', type: 'pie', radius: '55%', center: ['50%', '50%'], data: pieVirItemData },
            { name: '寄售台订单', type: 'pie', radius: '55%', center: ['75%', '50%'], data: pieConItemData }]
        }
        // 如果订单类型是充值订单
        if (this.orderType === '2') {
          var pieChargeData = []
          for (let i = 0; i < this.orderData.chargeOrders.length; i++) {
            const obj = {}
            obj.value = this.orderData.chargeOrders[i]
            obj.name = this.orderData.title[i]
            pieChargeData.push(obj)
          }
          barLegendData = ['充值订单']
          // label 必须要在data的上方才起作用
          barSeries =
            [{ name: '充值订单', type: 'bar', label: { normal: { show: true, position: 'top' }}, // label 必须要在data的上方才起作用
              data: this.orderData.chargeOrders, barMaxWidth: '100' // 最大宽度
            }]
          pieSeries = [{ name: '充值订单', type: 'pie', radius: '55%', center: ['50%', '50%'], data: pieChargeData }]
        }
        // 绘制图表
        var optionBar = {
          title: {
            text: title,
            subtext: '订单数量'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: barLegendData
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.orderData.title
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: barSeries
        }
        var optionPie = {
          title: {
            text: title,
            subtext: '订单数量',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: this.orderData.title
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left',
                    max: 1548
                  }
                }
              },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          series: pieSeries
        }
        // 画柱状图
        myChart.setOption(optionBar, true)
        // 画饼图
        myChartPie.setOption(optionPie, true)
      }
    }
  }
</script>
