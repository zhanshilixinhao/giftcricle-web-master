<template>
  <div class="app-container"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <div id="main" :style="{height: '500px', width: '100%' }"></div>
        <br/>
        <br/>
        <div id="myChartPie" :style="{ height: '400px', width: '100%'}"></div>
      </el-card>
    </div>
  </div>
</template>
<script>
  // import ElRow from 'element-ui/packages/row/src/row'
  import { userNumber } from '@/api/statistics/userStatistics'
  // 主题
  require('echarts/theme/macarons') // echarts theme
  require('echarts/theme/dark') // echarts theme

  export default {
    name: 'hello',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        ecoption: {
          title: {
            text: '统计所有用户量',
            subtext: 'APP用户量'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['启用', '禁用', '总数']
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar', 'tiled'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['总数', '启用', '禁用']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '总数',
              type: 'bar',
              data: []
            }
          ]
        }
      }
    },
    mounted() {
      this.getUserNumber()
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
        if (tab.name === 'first') {
          this.getDays()
        } else {
          this.getMonth()
        }
      },
      drawLine(option, optionPie) {
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(document.getElementById('main'), 'dark')
        const myChartPie = this.$echarts.init(document.getElementById('myChartPie'), 'dark')
        // 绘制图表
        myChart.setOption(option)
        // 绘制饼图
        myChartPie.setOption(optionPie)
      },
      getUserNumber() {
        userNumber().then(re => {
          console.log(re)
          var data1 = []
          var data2 = [
            [], [], []
          ]
          re.data.data.forEach(item => {
            if (data1.length === 0) {
              data1.push('总数')
              data2[0].push(item.countAll)
            }
            if (item.status === 1) {
              data1.push('启用')
            }
            if (item.status === 2) {
              data1.push('禁用')
            }
            data2[0].push(item.count)
          })
          this.drawLine({ //  绘制图表
            title: {
              text: '统计所有用户量',
              subtext: 'APP用户'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['数量']
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                data: data1
              }
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                max: data2[0][0] * 1.2
              }
            ],
            series: [
              {
                name: '数量',
                type: 'bar',
                data: data2[0],
                barMaxWidth: 80,
                markPoint: {
                  data: [
                    { name: '总数', value: data2[0][0], xAxis: 0, yAxis: data2[0][0] },
                    { name: '启用', value: data2[0][1], xAxis: 1, yAxis: data2[0][1] },
                    { name: '禁用', value: data2[0][2], xAxis: 2, yAxis: data2[0][2] }
                  ]
                }
                // itemStyle: {
                //   normal: {
                //     color: function(params) {
                //       // build a color map as your need.
                //       const colorList = [
                //         '#6CD7D9', '#6CD7D9', '#CBBDE7'
                //       ]
                //       return colorList[params.dataIndex]
                //     }
                //   }
                // }
              }
            ]
          }, { // 绘制饼图
            title: {
              text: '统计所有用户量',
              subtext: 'APP用户',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['启用', '禁用']
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
            series: [
              {
                name: 'APP用户',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                  { value: data2[0][1], name: '启用' },
                  { value: data2[0][2], name: '禁用' }
                ]
              }
            ]
          })
        })
      }
    }
  }
</script>
