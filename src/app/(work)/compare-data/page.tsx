import { PageHeader } from '@/components'
import CompareDataAction from './components/compare-data-action'
import CompareDataDetail from './components/compare-data-detail'

const CompareData = () => {
  return (
    <>
      <PageHeader title="So sánh dữ liệu" />
      <div className="flex h-[100vh] flex-col gap-4 bg-[#f6f6f6] p-[16px]">
        <CompareDataAction />
        <CompareDataDetail />
      </div>
    </>
  )
}

export default CompareData
