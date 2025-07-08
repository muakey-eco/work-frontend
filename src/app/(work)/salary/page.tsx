import { PageHeader } from '@/components'
import SalaryCollapse from './components/SalaryCollapse'

const SalaryPage = () => {
  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <PageHeader title="Bảng lương" />
      <SalaryCollapse />
    </div>
  )
}

export default SalaryPage
