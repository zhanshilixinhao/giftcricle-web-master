<template>
  <div class="app-container" v-loading="loading2"
       element-loading-text="拼命加载中">
    <div>
      <el-card :body-style="{ padding: '12px' }">
        <div id="myChart" :style="{ height: '700px', width: '100%'}"></div>
      </el-card>
    </div>
  </div>

</template>

<script>
  import { getInfo } from '@/api/login'

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
        adminData: ''
      }
    },
    mounted() {
      this.handleSearch()
    },

    methods: {
      handleSearch() {
        this.loading2 = true
        getInfo().then(re => {
          this.loading2 = false
          this.adminData = re.data.data.sysAdmin
          this.drawLine()
        })
        // this.drawLine(title)
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(document.getElementById('myChart'), 'macarons')
        // 准备好数据
        // 以下为节点数据，每一个{}里面为一个节点，category（该节点类别），name（关系连接的关键字，可以理解为键值中的键，可为数字）
        // value(节点的值，可以设置节点半径与该值的关系)，label（该字段是我用来显示该节点标签的，可以改名），大家也可以自己设置其他字段
        var graph = {} // 数据
        var gender = '男'
        if (this.adminData.gender === 2) { gender = '女' }
        if (this.adminData.gender === 3) { gender = '保密' }
        graph.nodes = [
          { category: 0, name: '用户名', value: 10, label: this.adminData.username },
          { category: 1, name: 'qq', value: 5, label: this.adminData.qq },
          { category: 2, name: 'email', value: 5, label: this.adminData.email },
          { category: 3, name: '登录次数', value: 5, label: this.adminData.loginCount },
          { category: 4, name: '性别', value: 5, label: gender },
          { category: 5, name: '创建时间', value: 5, label: moment(this.adminData.created).format('YYYY-MM-DD HH:mm:ss') }
        ]
        // 以下为连线关系数据，每一个{}里面为一个关系，source（起点，对应上面的name），target（终点，对应上面的name）
        // value(起点到终点的距离，值越大，权重越大，距离越短)
        graph.links = [
          { source: 0, target: 1, value: 5, label: '用户的email' },
          { source: 0, target: 2, value: 2, label: '用户的qq' },
          { source: 0, target: 3, value: 2, label: '用户的登录次数' },
          { source: 0, target: 4, value: 2, label: '用户的性别' },
          { source: 0, target: 5, value: 2, label: '用户的创建时间' }
        ]
        // categories为node节点分类，categoriesshort为显示图例，后者比前者短，可以使得图例中没有主干人物
        graph.categories = [{ name: '用户名' }, { name: 'qq' }, { name: 'email' }, { name: '登陆次数' },
          { name: '性别' }, { name: '创建时间' }]
        graph.categoriesshort = [{ name: '用户名' }, { name: 'qq' }, { name: 'email' }, { name: '登陆次数' },
          { name: '性别' }, { name: '创建时间' }]

        // 设置关系图节点标记的大小
        graph.nodes.forEach(function(node) {
          node.symbolSize = node.value * 3
        })
        var option = {
          title: {
            text: '用户信息网络图', // 标题
            subtext: '用户信息', // 标题副标题
            top: 'top', // 相对在y轴上的位置
            left: 'right'// 相对在x轴上的位置
          },
          tooltip: { // 提示框，鼠标悬浮交互时的信息提示
            trigger: 'item', // 数据触发类型
            formatter: function(params) { // 触发之后返回的参数，这个函数是关键
              console.log(params)
              if (params.data.category !== undefined) { // 如果触发节点
                return params.data.name + ':' + params.data.label // 返回标签
              } else { // 如果触发边
                return '关系:' + params.data.label
              }
            }
          },
          // 工具箱，每个图表最多仅有一个工具箱
          toolbox: {
            show: true,
            feature: { // 启用功能
              // dataView数据视图，打开数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能
              dataView: { show: true, readOnly: true },
              restore: { show: true }, // restore，还原，复位原始图表
              saveAsImage: { show: true } // saveAsImage，保存图片
            }
          },
          // 全局颜色，图例、节点、边的颜色都是从这里取，按照之前划分的种类依序选取
          color: ['rgb(194,53,49)', 'rgb(178,144,137)', 'rgb(97,160,168)'],
          // 图例，每个图表最多仅有一个图例
          legend: [{
            x: 'left', // 图例位置
            // 图例的名称，这里返回短名称，即不包含第一个，当然你也可以包含第一个，这样就可以在图例中选择主干人物
            data: graph.categoriesshort.map(function(a) {
              return a.name
            })
          }],
          // sereis的数据: 用于设置图表数据之用
          series: [
            {
              name: '用户信息', // 系列名称
              type: 'graph', // 图表类型
              layout: 'force', // echarts3的变化，force是力向图，ccularir是和弦图
              draggable: true, // 指示节点是否可以拖动
              data: graph.nodes, // 节点数据
              links: graph.links, // 边、联系数据
              categories: graph.categories, // 节点种类
              focusNodeAdjacency: true, // 当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点
              roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
              label: { // 图形上的文本标签，可用于说明图形的一些数据信息
                normal: {
                  show: true, // 显示
                  fontSize: 20, // 控制显示字大小
                  position: 'right', // 相对于节点标签的位置
                  // 回调函数，你期望节点标签上显示什么
                  formatter: function(params) {
                    return params.data.label
                  }
                }
              },
              // 节点的style
              itemStyle: {
                normal: {
                  opacity: 0.9 // 设置透明度为0.8，为0时不绘制
                }
              },
              // 关系边的公用线条样式
              lineStyle: {
                normal: {
                  show: true,
                  width: 5, // 控制线的粗细
                  color: 'target', // 决定边的颜色是与起点相同还是与终点相同
                  curveness: 0// 边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                }
              },
              force: {
                edgeLength: [100, 100], // 线的长度，这个距离也会受 repulsion，支持设置成数组表达边长的范围
                repulsion: 8000 // 节点之间的斥力因子。值越大则斥力越大
              }
            }
          ]
        }

        myChart.setOption(option)
      }
    }
  }
</script>
