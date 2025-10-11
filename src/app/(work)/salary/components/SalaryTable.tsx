'use client'

import { useDragScroll } from '@/libs/hook'
import { randomColor } from '@/libs/utils'
import type { TableProps } from 'antd'
import { App, Avatar, Button, Input, Table } from 'antd'
import { createStyles } from 'antd-style'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { reviewSalaryAction } from '../action'

interface DataType {
  id: number
  key: string
  full_name: string
  avatar?: string
  position: string
  departments: string
  salary: string
  salary_detail: {
    basic_salary: number
    working_days: number
    kpi: number
  }
  workday: number
  workday_in_month: number
  actualWorkDays: number
  actualSalary: string
  kpi: number
  otherAllowance: number
  socialInsurance: string
  otherDeduction: number
  note?: string
  status?: string
}

const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table-thead {
      tr {
        th {
          background-color: #fff;
        }
      }
    }
    .ant-table {
      .ant-table-container {
        .ant-table-body,
        .ant-table-content {
          scrollbar-width: none;
          -ms-overflow-style: none;
          &::-webkit-scrollbar {
            display: none;
          }
          */
          
          /* Tùy chọn 2: Hiển thị scrollbar mỏng và đẹp (đang active) */
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
          &::-webkit-scrollbar {
            width: 3px;
            height: 3px;
          }
          &::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 3px;
          }
          &::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
            &:hover {
              background: #9ca3af;
            }
          }
        }
      }
    }
  `,
  dragContainer: css`
    cursor: grab;
    user-select: none;
    width: 100%;
    overflow-x: auto;
    &:active {
      cursor: grabbing;
    }
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
    */
    
    /* Tùy chọn 2: Hiển thị scrollbar mỏng (đang active) */
    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
      &:hover {
        background: #94a3b8;
      }
    }
  `,
}))

const SalaryTable: React.FC<any> = ({
  salaries,
  setSalaries,
  currentMonth,
  monthStr,
  isClosedSalary,
  onMonthClosed,
}) => {
  console.log('salaries', salaries)

  const { message, modal } = App.useApp()

  const { styles } = useStyle()

  const [ref] = useDragScroll()

  const currentYear = dayjs().format('YYYY')

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num)
  }

  const formatNumber3 = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value)

  const formatInteger = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(value)
  const toNumber = (value: string | number | undefined | null) => {
    if (typeof value === 'number') return isFinite(value) ? value : 0
    if (typeof value === 'string') {
      const v = parseFloat(value.replace(/[^\d.-]/g, ''))
      return isNaN(v) ? 0 : v
    }
    return 0
  }

  // Hàm kiểm tra và validate dữ liệu
  const validateSalaryData = (item: DataType) => {
    const issues = []

    if (!item.salary_detail?.basic_salary || item.salary_detail.basic_salary <= 0) {
      issues.push('Lương cơ bản không hợp lệ')
    }

    if (!item.workday_in_month || item.workday_in_month <= 0) {
      issues.push('Ngày công trong tháng không hợp lệ')
    }

    if (typeof item.workday === 'string') {
      issues.push('Ngày công thực tế là string, cần chuyển thành number')
    }

    if (item.workday < 0) {
      issues.push('Ngày công thực tế không thể âm')
    }

    return issues
  }


  // Fallback local state when parent doesn't pass a setter
  const [localSalaries, setLocalSalaries] = useState<any[]>(
    Array.isArray(salaries) ? salaries : [],
  )

  // Keep local state in sync with prop when no external setter
  useEffect(() => {
    if (typeof setSalaries !== 'function' && Array.isArray(salaries)) {
      setLocalSalaries(salaries)
    }
  }, [salaries, setSalaries])

  const data: any[] =
    typeof setSalaries === 'function' && Array.isArray(salaries)
      ? salaries
      : localSalaries

  // Validate dữ liệu khi component mount hoặc data thay đổi
  useEffect(() => {
    if (data && data.length > 0) {
      console.log('=== VALIDATING SALARY DATA ===')
      data.forEach((item: DataType, index: number) => {
        const issues = validateSalaryData(item)
        if (issues.length > 0) {
          console.warn(`Employee ${item.full_name} (index ${index}) has issues:`, issues)
          console.log('Item data:', item)
        }
      })
      console.log('=== END VALIDATION ===')
    }
  }, [data])



  const safeSetSalaries = (updater: any) => {
    if (typeof setSalaries === 'function') {
      setSalaries(updater)
    } else {
      setLocalSalaries((prev) =>
        typeof updater === 'function' ? updater(prev) : updater,
      )
    }
  }

  const handleInputChange = (
    id: number,
    field: keyof Pick<
      DataType,
      'otherAllowance' | 'otherDeduction' | 'socialInsurance'
    >,
    value: string,
  ) => {
    safeSetSalaries((prev: any) =>
      prev.map((item: any) =>
        item.id === id ? { ...item, [field]: value === '' ? '' : toNumber(value) } : item,
      ),
    )
  }

  const handleKpiChange = (id: number, value: string) => {
    safeSetSalaries((prev: any) =>
      prev.map((item: any) =>
        item.id === id
          ? {
            ...item,
            salary_detail: {
              ...item.salary_detail,
              kpi: value === '' ? '' : toNumber(value),
            },
          }
          : item,
      ),
    )
  }

  const calculateActualSalaryRow = (item: DataType) => {
    const basic = toNumber(item.salary_detail?.basic_salary)
    const workdayInMonth = toNumber(item.workday_in_month)
    const workday = toNumber(item.workday)

    // Lương thực tế = (Ngày công thực tế * Lương cơ bản) / Ngày công trong tháng
    if (workdayInMonth <= 0 || basic <= 0) {
      return 0
    }

    const actualSalary = (workday * basic) / workdayInMonth
    return Math.round(actualSalary * 1000) / 1000
  }

  const calculateTotalSalary = () => {
    return data.reduce((total: number, item: DataType) => {
      return (
        total +
        calculateNetForRow(
          item.salary_detail?.basic_salary,
          item.workday_in_month,
          item.workday,
          (item as any).salary?.kpi || item.salary_detail?.kpi, // Sửa: lấy từ salary.kpi trước
          (item as any).salary?.otherAllowance || item.otherAllowance,
          (item as any).salary?.otherDeduction || item.otherDeduction,
          item.socialInsurance,
        )
      )
    }, 0)
  }

  const calculateNetForRow = (
    salary: string | number,
    workday_in_month: string | number,
    workday: string | number,
    kpi: string | number = 0,
    otherAllowance: string | number = 0,
    otherDeduction: string | number = 0,
    socialInsurance: string | number = 0,
  ) => {
    const s = toNumber(salary)
    const wim = toNumber(workday_in_month)
    const wd = toNumber(workday)
    const k = toNumber(kpi)
    const oa = toNumber(otherAllowance)
    const od = toNumber(otherDeduction)
    const si = toNumber(socialInsurance)

    // Debug log để kiểm tra dữ liệu
    console.log('calculateNetForRow:', {
      salary: s,
      workday_in_month: wim,
      workday: wd,
      kpi: k,
      otherAllowance: oa,
      otherDeduction: od,
      socialInsurance: si
    })

    // Tính lương theo tỷ lệ ngày công
    const prorated = wim > 0 && s > 0 ? (s / wim) * wd : 0

    // Tổng lương = Lương theo tỷ lệ + KPI + Phụ cấp - Khấu trừ - Bảo hiểm
    const totalSalary = prorated + k + oa - od - si

    console.log('calculateNetForRow result:', {
      prorated,
      totalSalary
    })

    return Math.round(totalSalary * 1000) / 1000
  }

  const handleReviewSalary = async () => {
    try {
      const dataToSend = data.map((item: any) => {
        const { id, job_position_id, ...rest } = item.salary_detail || {}
        const actualSalaryForRow = calculateActualSalaryRow(item as any)
        const totalSalaryForRow = calculateNetForRow(
          item.salary_detail?.basic_salary,
          item.workday_in_month,
          item.workday,
          item.salary_detail?.kpi,
          item.otherAllowance,
          item.otherDeduction,
          item.socialInsurance,
        )

        return {
          account_id: item.id,
          month: currentMonth,
          year: currentYear,
          salary: {
            ...rest,
            kpi: item.salary_detail?.kpi || 0,
            otherAllowance: item.otherAllowance || 0,
            otherDeduction: item.otherDeduction || 0,
            workday: item.workday || 0,
            workday_in_month: item.workday_in_month || 0,
            actualSalary: actualSalaryForRow,
            totalSalary: totalSalaryForRow,
          },
        }
      })
      const { message: msg, errors } = await reviewSalaryAction(dataToSend)
      if (errors) {
        message.error(msg)
        return
      }
      message.success('Chốt lương tháng thành công')
      if (typeof onMonthClosed === 'function' && monthStr) {
        onMonthClosed(monthStr)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      fixed: 'left' as const,
      width: '250px',
      render: (text: string, record: any) => (
        <div className="flex items-center ms-4 gap-[8px]">
          <Avatar
            src={record?.avatar}
            style={{ backgroundColor: randomColor(String(text)) }}
            alt={String(text)}
            className="shrink-0"
          >
            {String(text).charAt(0).toUpperCase()}
          </Avatar>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.full_name.includes(value as string),
    },
    {
      title: 'Chức danh',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.departments.localeCompare(b.departments),
    },
    {
      title: 'Tổng tiền thực lĩnh',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      render: (_, record) => (
        <span>
          {formatCurrency(
            calculateNetForRow(
              record.salary_detail?.basic_salary,
              record.workday_in_month,
              record.workday,
              (record as any).salary?.kpi || record.salary_detail?.kpi, // Sửa: lấy từ salary.kpi trước
              (record as any).salary?.otherAllowance || record.otherAllowance,
              (record as any).salary?.otherDeduction || record.otherDeduction,
              record.socialInsurance,
            ),
          )}
        </span>
      ),
      sorter: (a, b) =>
        calculateNetForRow(
          a.salary_detail?.basic_salary,
          a.workday_in_month,
          a.workday,
          (a as any).salary?.kpi || a.salary_detail?.kpi,
          (a as any).salary?.otherAllowance || a.otherAllowance,
          (a as any).salary?.otherDeduction || a.otherDeduction,
          a.socialInsurance,
        ) -
        calculateNetForRow(
          b.salary_detail?.basic_salary,
          b.workday_in_month,
          b.workday,
          (b as any).salary?.kpi || b.salary_detail?.kpi,
          (b as any).salary?.otherAllowance || b.otherAllowance,
          (b as any).salary?.otherDeduction || b.otherDeduction,
          b.socialInsurance,
        ),
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'salary_detail.basic_salary',
      key: 'salary_detail.basic_salary',
      render: (_, record) => (
        <span>{formatCurrency(record.salary_detail?.basic_salary || 0)}</span>
      ),
      sorter: (a, b) =>
        (a.salary_detail?.basic_salary || 0) -
        (b.salary_detail?.basic_salary || 0),
    },
    {
      title: 'Ngày công',
      dataIndex: 'workday_in_month',
      key: 'workday_in_month',
      render: (workday_in_month: number) => (
        <span className="font-medium">{workday_in_month || 0}</span>
      ),
      sorter: (a, b) => (a.workday_in_month || 0) - (b.workday_in_month || 0),
    },
    {
      title: 'Ngày công thực tế',
      dataIndex: 'workday',
      key: 'workday',
      render: (text: number) => (
        <span className="font-medium">{text || 0}</span>
      ),
      sorter: (a, b) => (a.workday || 0) - (b.workday || 0),
    },
    {
      title: 'Lương thực tế',
      dataIndex: 'actualSalary',
      key: 'actualSalary',
      render: (_, record) => {
        const value = calculateActualSalaryRow(record)
        return (
          <span className="font-medium">
            {value > 1000
              ? `${formatInteger(value)} đ`
              : `${formatNumber3(value)} đ`}
          </span>
        )
      },
      sorter: (a, b) =>
        Number(calculateActualSalaryRow(a as any)) -
        Number(calculateActualSalaryRow(b as any)),
    },
    {
      title: 'Thưởng, KPI',
      dataIndex: 'kpi',
      key: 'kpi',
      render: (_, record) => {
        const kpiValue = record.salary_detail?.kpi || (record as any).salary?.kpi

        if (isClosedSalary) {
          // Đã chốt lương: hiển thị giá tiền
          return (
            <span className="font-medium">
              {formatCurrency(kpiValue || 0)}
            </span>
          )
        }

        // Chưa chốt: hiển thị input
        return (
          <Input
            value={kpiValue || ''}
            onChange={(e) => handleKpiChange(record.id, e.target.value)}
            placeholder="Nhập thưởng"
            data-no-drag
            onMouseDown={(e) => e.stopPropagation()}
          />
        )
      },
      sorter: (a, b) => (a.salary_detail.kpi || 0) - (b.salary_detail.kpi || 0),
    },
    {
      title: 'Phụ cấp khác',
      dataIndex: 'otherAllowance',
      key: 'otherAllowance',
      render: (text, record) => {
        const allowanceValue = record.otherAllowance || (record as any).salary?.otherAllowance

        if (isClosedSalary) {
          // Đã chốt lương: hiển thị giá tiền
          return (
            <span className="font-medium">
              {formatCurrency(allowanceValue || 0)}
            </span>
          )
        }

        // Chưa chốt: hiển thị input
        return (
          <Input
            value={allowanceValue || ''}
            onChange={(e) =>
              handleInputChange(record.id, 'otherAllowance', e.target.value)
            }
            placeholder="Nhập phụ cấp"
            data-no-drag
            onMouseDown={(e) => e.stopPropagation()}
          />
        )
      },
      sorter: (a, b) => (a.otherAllowance || 0) - (b.otherAllowance || 0),
    },
    {
      title: 'Lương đóng BHXH, BHYT',
      dataIndex: 'socialInsurance',
      key: 'socialInsurance',
      render: (text, record) => {
        const insuranceValue = record.socialInsurance || (record as any).salary?.socialInsurance

        if (isClosedSalary) {
          // Đã chốt lương: hiển thị giá tiền
          return (
            <span className="font-medium">
              {formatCurrency(insuranceValue || 0)}
            </span>
          )
        }

        // Chưa chốt: hiển thị input
        return (
          <Input
            value={insuranceValue || ''}
            onChange={(e) =>
              handleInputChange(record.id, 'socialInsurance', e.target.value)
            }
            placeholder="Nhập lương bảo hiểm xã hội"
            data-no-drag
            onMouseDown={(e) => e.stopPropagation()}
          />
        )
      },
      sorter: (a, b) => (a.socialInsurance || '').localeCompare(b.socialInsurance || ''),
    },
    {
      title: 'Khấu trừ khác',
      dataIndex: 'otherDeduction',
      key: 'otherDeduction',
      render: (text, record) => {
        const deductionValue = record.otherDeduction || (record as any).salary?.otherDeduction

        if (isClosedSalary) {
          // Đã chốt lương: hiển thị giá tiền
          return (
            <span className="font-medium">
              {formatCurrency(deductionValue || 0)}
            </span>
          )
        }

        // Chưa chốt: hiển thị input
        return (
          <Input
            value={deductionValue || ''}
            onChange={(e) =>
              handleInputChange(record.id, 'otherDeduction', e.target.value)
            }
            placeholder="Nhập khấu trừ"
            data-no-drag
            onMouseDown={(e) => e.stopPropagation()}
          />
        )
      },
      sorter: (a, b) => (a.otherDeduction || 0) - (b.otherDeduction || 0),
    },
  ]

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        className={`${styles.customTable} rounded-[16px] border border-[#0505050f] bg-white`}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowKey="key"
      />

      <div className="mt-[12px] flex items-center justify-between gap-[12px]">
        <p className="text-[16px] leading-[24px] font-[700]">
          Tổng lương thực lĩnh: {formatCurrency(calculateTotalSalary())}
        </p>
        {!isClosedSalary && (
          <Button
            type="primary"
            onClick={() =>
              modal.confirm({
                title: `Xác nhận chốt lương tháng ${currentMonth}?`,
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                content: 'Chốt a nhé 🤡, chưa có tính năng sửa đâu a!',
                onOk: () => handleReviewSalary(),
                width: 455,
              })
            }
          >
            Chốt lương tháng {currentMonth}
          </Button>
        )}
      </div>
    </>
  )
}

export default SalaryTable
