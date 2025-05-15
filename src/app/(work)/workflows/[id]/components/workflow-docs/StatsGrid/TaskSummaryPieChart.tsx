'use client'

import { Card } from 'antd'
import dynamic from 'next/dynamic'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const TaskSummaryPieChart = () => {
  const totalTasks = 23
  const data = [
    { value: 2, name: '2 Trong thời hạn', itemStyle: { color: '#1677FF' } },
    { value: 3, name: '3 Quá hạn', itemStyle: { color: '#FAAD14' } },
    { value: 2, name: '2 Hoàn thành', itemStyle: { color: '#52C41A' } },
    { value: 4, name: '4 Thất bại', itemStyle: { color: '#F5222D' } },
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} nhiệm vụ ({d}%)',
    },

    title: {
      text: 'Thống kê tổng số nhiệm vụ',
      left: 0, // Căn trái
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'Arial, sans-serif',
      },
    },
    legend: {
      orient: 'vertical',
      right: -5,
      top: 'center',
      icon: 'circle',
      itemWidth: 5,
      itemHeight: 5,
      itemGap: 16,
      textStyle: {
        fontSize: 13,
        color: '#333',
        fontFamily: 'Arial, sans-serif',
      },
    },
    series: [
      {
        name: 'Tình trạng nhiệm vụ',
        type: 'pie',
        radius: ['45%', '55%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `{a|${totalTasks}}\n{b|Nhiệm vụ}`,
          rich: {
            a: {
              fontSize: 24,
              fontWeight: '500',
              color: '#111',
              fontFamily: 'Arial, sans-serif',
            },
            b: {
              fontSize: 16,
              color: '#666',
              fontFamily: 'Arial, sans-serif',
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: '500',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  }

  return (
    <Card className="!h-[318px] !w-[523px] !p-0">
      <ReactECharts option={option} style={{ height: 260 }} />
    </Card>
  )
}

export default TaskSummaryPieChart
