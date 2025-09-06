import dayjs from 'dayjs'
import { cookies } from 'next/headers'
import { getSalaryByIdAction } from './action'
import SalaryHeader from './components/SalaryHeader'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}

const SalaryStatistics = async ({ params, searchParams }: PageProps) => {
  const { id } = await params
  const { date } = await searchParams
  const formatCurrency = (amount: number | string | undefined | null) => {
    const num =
      typeof amount === 'string'
        ? parseFloat(amount)
        : typeof amount === 'number'
          ? amount
          : 0
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(isNaN(num as number) ? 0 : (num as number))
  }

  const dateInput = date ? date : dayjs().subtract(1, 'month').format('YYYY-MM')
  const salaryData = await getSalaryByIdAction(Number(id), dateInput)

  const cookieStore = await cookies()
  const canViewPayroll = cookieStore.get('can_view_payroll')
  if (!canViewPayroll) {
    return (
      <div className="flex h-[calc(100vh-89px)] flex-col items-center justify-center gap-[12px] bg-[#F6F6F6] p-[16px]">
        <p>
          Bạn không có quyền truy cập trang này. <b>Đăng nhập</b> hoặc nạp vip
          cho Khang để được trải nghiệm dịch vụ này{' '}
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-89px)] flex-col gap-[12px] bg-[#F6F6F6] p-[16px]">
      <SalaryHeader id={id} />

      <div className="rounded-[8px] bg-white !p-[24px]">
        <h2 className="mb-4 text-[16px] leading-[24px] font-[700]">
          Bảng lương Tháng {dayjs(dateInput).format('MM/YYYY')}
        </h2>

        <table className="w-full border-collapse border border-[#e0e0e0] text-[14px]">
          <tbody>
            {/* Thông tin nhân viên */}
            <tr className="font-semibold">
              <td className="w-[25%] border p-2" rowSpan={3}>
                Thông tin nhân viên
              </td>
              <td className="w-[25%] border p-2">Họ và tên</td>
              <td className="w-[25%] border p-2">{salaryData[0]?.full_name}</td>
            </tr>
            <tr>
              <td className="border p-2">Chức danh</td>
              <td className="border p-2">{salaryData[0]?.position}</td>
            </tr>
            <tr>
              <td className="border p-2">Phòng ban</td>
              <td className="border p-2">{salaryData[0]?.department}</td>
            </tr>

            {/* Thông tin về lương cơ bản */}
            <tr className="font-semibold">
              <td className="border p-2" rowSpan={4}>
                Thông tin về lương cơ bản
              </td>
              <td className="border p-2">Lương cơ bản</td>
              <td className="border p-2">
                {formatCurrency(salaryData[0]?.salary?.basic_salary)}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Ngày công</td>
              <td className="border p-2">{salaryData[0]?.salary?.workday}</td>
            </tr>
            <tr>
              <td className="border p-2">Ngày công thực tế</td>
              <td className="border p-2">
                {salaryData[0]?.salary?.workday_in_month}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Lương thực tế</td>
              <td className="border p-2">
                {formatCurrency(salaryData[0]?.salary?.actualSalary)}
              </td>
            </tr>

            {/* Các khoản phụ cấp & thưởng */}
            <tr className="font-semibold">
              <td className="border p-2" rowSpan={2}>
                Các khoản phụ cấp & thưởng
              </td>
              <td className="border p-2">Thưởng, KPI</td>
              <td className="border p-2">
                {formatCurrency(salaryData[0]?.salary?.kpi)}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Phụ cấp khác</td>
              <td className="border p-2">
                {formatCurrency(salaryData[0]?.salary?.otherAllowance)}
              </td>
            </tr>

            {/* Các khoản khấu trừ */}
            <tr className="font-semibold">
              <td className="border p-2" rowSpan={2}>
                Các khoản khấu trừ
              </td>
              <td className="border p-2">Lương đóng BHXH, BHYT</td>
              <td className="border p-2">
                {formatCurrency(
                  salaryData[0]?.salary?.socialInsurance ?? 567000,
                )}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Khấu trừ khác</td>
              <td className="border p-2">
                {formatCurrency(salaryData[0]?.salary?.otherDeduction)}
              </td>
            </tr>

            {/* Tổng tiền thực lĩnh */}
            <tr className="font-semibold">
              <td colSpan={2} className="border p-2">
                Tổng tiền thực lĩnh
              </td>
              <td className="border p-2">
                {formatCurrency(salaryData[0]?.salary?.totalSalary)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalaryStatistics
