import { cookies } from 'next/headers'
import SalaryHeader from './components/SalaryHeader'

const SalaryStatistics = async () => {
  const cookieStore = await cookies()
  const canViewPayroll = cookieStore.get('can_view_payroll')
  if (!canViewPayroll) {
    return (
      <div className="flex h-[calc(100vh-89px)] flex-col items-center justify-center gap-[12px] bg-[#F6F6F6] p-[16px]">
        <p>
          Bạn không có quyền truy cập trang này. Đăng nhập hoặc nạp vip cho
          Khang để được trải nghiệm dịch vụ này{' '}
        </p>
      </div>
    )
  }
  const salaryData = {
    fullName: 'Đỗ Minh Nguyệt',
    position: 'Chuyên viên nhân sự',
    department: 'Phòng nhân sự',
    baseSalary: '8,000,000 đ',
    workDays: 24,
    actualWorkDays: 20,
    actualSalary: '6,666,666 đ',
    bonus: '1,000,000 đ',
    otherAllowance: '0 đ',
    socialInsurance: '567,000 đ',
    otherDeduction: '0 đ',
    totalReceived: '7,099,666 đ',
  }

  return (
    <div className="flex h-[calc(100vh-89px)] flex-col gap-[12px] bg-[#F6F6F6] p-[16px]">
      <SalaryHeader />

      <div className="rounded-[8px] bg-white !p-[24px]">
        <h2 className="mb-4 text-[16px] leading-[24px] font-[700]">
          Bảng lương Tháng 7/2025
        </h2>

        <table className="w-full border-collapse border border-[#e0e0e0] text-[14px]">
          <tbody>
            {/* Thông tin nhân viên */}
            <tr className="font-semibold">
              <td className="w-[25%] border p-2" rowSpan={3}>
                Thông tin nhân viên
              </td>
              <td className="w-[25%] border p-2">Họ và tên</td>
              <td className="w-[25%] border p-2">{salaryData.fullName}</td>
            </tr>
            <tr>
              <td className="border p-2">Chức danh</td>
              <td className="border p-2">{salaryData.position}</td>
            </tr>
            <tr>
              <td className="border p-2">Phòng ban</td>
              <td className="border p-2">{salaryData.department}</td>
            </tr>

            {/* Thông tin về lương cơ bản */}
            <tr className="font-semibold">
              <td className="border p-2" rowSpan={4}>
                Thông tin về lương cơ bản
              </td>
              <td className="border p-2">Lương cơ bản</td>
              <td className="border p-2">{salaryData.baseSalary}</td>
            </tr>
            <tr>
              <td className="border p-2">Ngày công</td>
              <td className="border p-2">{salaryData.workDays}</td>
            </tr>
            <tr>
              <td className="border p-2">Ngày công thực tế</td>
              <td className="border p-2">{salaryData.actualWorkDays}</td>
            </tr>
            <tr>
              <td className="border p-2">Lương thực tế</td>
              <td className="border p-2">{salaryData.actualSalary}</td>
            </tr>

            {/* Các khoản phụ cấp & thưởng */}
            <tr className="font-semibold">
              <td className="border p-2" rowSpan={2}>
                Các khoản phụ cấp & thưởng
              </td>
              <td className="border p-2">Thưởng, KPI</td>
              <td className="border p-2">{salaryData.bonus}</td>
            </tr>
            <tr>
              <td className="border p-2">Phụ cấp khác</td>
              <td className="border p-2">{salaryData.otherAllowance}</td>
            </tr>

            {/* Các khoản khấu trừ */}
            <tr className="font-semibold">
              <td className="border p-2" rowSpan={2}>
                Các khoản khấu trừ
              </td>
              <td className="border p-2">Lương đóng BHXH, BHYT</td>
              <td className="border p-2">{salaryData.socialInsurance}</td>
            </tr>
            <tr>
              <td className="border p-2">Khấu trừ khác</td>
              <td className="border p-2">{salaryData.otherDeduction}</td>
            </tr>

            {/* Tổng tiền thực lĩnh */}
            <tr className="font-semibold">
              <td colSpan={2} className="border p-2">
                Tổng tiền thực lĩnh
              </td>
              <td className="border p-2">{salaryData.totalReceived}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalaryStatistics
