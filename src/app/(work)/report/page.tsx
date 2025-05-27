import { getMarketingData } from '@/libs/marketing'
import OverviewHeader from '../department/[department_id]/overview/overview-header'
import DataCard from './components/data-card'
import ReportDetail from './components/report-detail'
import MarketingFilter from './components/report-filter'

type ReportPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ReportPage: React.FC<ReportPageProps> = async ({ searchParams }) => {
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
  const marketingData = await getMarketingData()

  return (
    <>
      <OverviewHeader />
      <div className="scrollbar-hide flex h-[100vh] flex-col gap-4 overflow-y-auto bg-[#f6f6f6] p-[16px]">
        <MarketingFilter />
        <div className="flex gap-4">
          <DataCard title="Số lượng Video" value="4" data={marketingData} />
          <DataCard
            title="Số liệu"
            value="4"
            options={options}
            data={marketingData}
          />
          <DataCard
            title="Doanh thu"
            value="2,300,000 đ"
            data={marketingData}
          />
          <DataCard title="Hoa hồng" value="1,240,000 đ" data={marketingData} />
        </div>
        <ReportDetail data={marketingData?.data} />
      </div>
    </>
  )
}

export default ReportPage
