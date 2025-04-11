import { PageHeader } from '@/components'
import DataCard from './components/data-card'
import MarketingDetail from './components/marketing-detail'
import MarketingFilter from './components/marketing-filter'

const MarketingPage = () => {
  const options = [
    {
      label: 'Views',
      value: 'views',
    },
    {
      label: 'Likes',
      value: 'likes',
    },
    {
      label: 'Comments',
      value: 'comments',
    },
    {
      label: 'Clicks',
      value: 'clicks',
    },
    {
      label: 'Đơn hàng TC',
      value: 'success_order',
    },
  ]
  return (
    <>
      <PageHeader title="Tổng quan" />
      <div className="flex h-[100vh] flex-col gap-4 bg-[#f6f6f6] p-[16px]">
        <MarketingFilter />
        <div className="flex gap-4">
          <DataCard title="Số lượng Video" value="4" />
          <DataCard title="Số liệu" value="4" options={options} />
          <DataCard title="Doanh thu" value="2,300,000 đ" />
          <DataCard title="Hoa hồng" value="1,240,000 đ" />
        </div>
        <MarketingDetail />
      </div>
    </>
  )
}

export default MarketingPage
