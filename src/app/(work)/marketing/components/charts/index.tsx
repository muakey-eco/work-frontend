'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React from 'react'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const data = [
  { time: '08:30', value: 3 },
  { time: '09:30', value: 2 },
  { time: '10:30', value: 3.2 },
  { time: '11:30', value: 3 },
  { time: '12:30', value: 1.8 },
  { time: '13:30', value: 3.5 },
  { time: '14:30', value: 3.8 },
  { time: '15:30', value: 5 },
  { time: '16:30', value: 3 },
  { time: '17:30', value: 3 },
]
type ChartPageProps = {
  title?: string
  total?: number
  options?: any[]

  // data: {
  //   time: string
  //   value: number
  // }[]
}

const ChartPage: React.FC<ChartPageProps> = ({ title, total, options }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 0, right: 0, top: 10, bottom: 20, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.time),
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    yAxis: {
      type: 'value',
      max: 6,
      splitLine: { lineStyle: { type: 'dashed' } },
      axisLabel: {
        margin: 20,
      },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        barWidth: '40%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#007bff' },
              { offset: 1, color: '#66ccff' },
            ],
          },
        },
      },
    ],
  }

  return (
    <div className={clsx('rounded-lg', options ? 'px-4 !pt-0' : 'p-4')}>
      <ReactECharts option={option} style={{ height: 200 }} />
    </div>
  )
}

export default ChartPage
