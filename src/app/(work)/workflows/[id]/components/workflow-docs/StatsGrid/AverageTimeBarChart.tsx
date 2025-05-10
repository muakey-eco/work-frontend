'use client'

import { Card } from 'antd'
import dynamic from 'next/dynamic'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

type EChartsOption = echarts.EChartsOption

const AverageTimeBarChart = () => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) =>
        params.map((p: any) => `${p.seriesName}: ${p.data}h`).join('<br/>'),
    },
    title: {
      text: 'Thời gian trung bình hoàn thành công việc theo từng giai đoạn',
      left: 0,
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'Arial, sans-serif',
      },
    },
    legend: {
      right: 0,
      top: 10,
      icon: 'circle',
      itemWidth: 5,
      itemHeight: 5,
      textStyle: {
        fontSize: 13,
        fontFamily: 'Arial, sans-serif',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [
        'Giai đoạn 1',
        'Giai đoạn 2',
        'Giai đoạn 3',
        'Giai đoạn 4',
        'Giai đoạn 5',
        'Giai đoạn 6',
        'Giai đoạn 7',
      ],
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    yAxis: {
      type: 'value',
      name: '',
      splitLine: { lineStyle: { type: 'dashed' } },
      axisLabel: { margin: 10 },
    },
    series: [
      {
        name: 'Thực tế',
        type: 'bar',
        data: [2, 3, 7, 5, 6, 5, 4],
        itemStyle: {
          borderRadius: [12, 12, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0D99FF' },
              { offset: 1, color: '#61CCEC' },
            ],
          },
        },
        barGap: '30%',
        barWidth: 20,
      },
      {
        name: 'Dự kiến',
        type: 'bar',
        data: [2, 2, 5, 5, 3, 4, 6],
        itemStyle: {
          borderRadius: [12, 12, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#30C01D' },
              { offset: 1, color: '#A0DC92' },
            ],
          },
        },
        barGap: '30%',
        barWidth: 20,
      },
    ],
  }

  return (
    <Card className="!h-[318px] !w-full !p-0">
      <ReactECharts option={option} style={{ height: 260 }} />
    </Card>
  )
}

export default AverageTimeBarChart
