import {
  Avatar,
  DatePicker,
  Form,
  Input,
  Radio,
  RadioGroupProps,
  Select,
  SelectProps,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import React from 'react'
import useSWR from 'swr'
import { getBankListRequest } from '../action'

export type EmployeeInfomationFormItemBoxProps = {
  className?: string
}

const EmployeeInfomationFormItemBox: React.FC<
  EmployeeInfomationFormItemBoxProps
> = ({ className }) => {
  const { data: result, isLoading } = useSWR('bank-list', getBankListRequest)

  const { data: bankList } = result || {}

  const options: RadioGroupProps['options'] = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
  ]

  const maritalStatusOptions: SelectProps['options'] = [
    { label: 'Độc thân', value: 'single' },
    { label: 'Đã kết hôn', value: 'married' },
  ]

  const statusOptions: SelectProps['options'] = [
    { label: 'Chính thức', value: 'active' },
    { label: 'Thử việc', value: 'inactive' },
  ]

  const employeeTypeOptions: RadioGroupProps['options'] = [
    { label: 'Full time', value: 'fulltime' },
    { label: 'Part time', value: 'parttime' },
  ]

  const bankOptions: SelectProps['options'] = bankList?.map((bank: any) => ({
    label: (
      <div className="flex items-center gap-[8px]">
        <Avatar
          className="w-max"
          src={bank?.logo}
          alt={String(bank?.shortName)}
        />
        <span>{bank?.shortName}</span>
      </div>
    ),
    value: bank?.shortName,
    logo: bank?.logo,
  }))

  return (
    <div className={className}>
      <div className="mb-[16px] text-[16px] leading-[24px] font-[600]">
        Thông tin cá nhân
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="full_name"
          label="Họ và tên"
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item className="mb-[16px]! flex-1" name="email" label="Email">
          <Input placeholder="Nhập email" disabled />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="username"
          label="Tài khoản"
        >
          <Input placeholder="Nhập tài khoản" disabled />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="phone"
          label="Số điện thoại"
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="birthday"
          label="Ngày tháng năm sinh"
        >
          <DatePicker className="w-full" locale={locale} />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="gender"
          label="Giới tính"
          initialValue="male"
        >
          <Radio.Group options={options} />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item className="mb-[16px]! flex-1" name="cccd" label="CCCD">
          <Input placeholder="Nhập số CCCD" />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="personal_email"
          label="Email cá nhân"
        >
          <Input placeholder="Nhập email cá nhân" />
        </Form.Item>
      </div>

      <Form.Item
        className="mb-[16px]!"
        name="permanent_address"
        label="Địa chỉ thường trú"
      >
        <Input placeholder="Nhập địa chỉ thường trú" />
      </Form.Item>

      <Form.Item
        className="mb-[16px]!"
        name="temporary_address"
        label="Địa chỉ tạm trú"
      >
        <Input placeholder="Nhập địa chỉ tạm trú" />
      </Form.Item>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="passport_number"
          label="Hộ chiếu"
        >
          <Input placeholder="Nhập hộ chiếu" />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="marital_status"
          label="Tình trạng hôn nhân"
          initialValue="single"
        >
          <Select options={maritalStatusOptions} />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item className="mb-[16px]! flex-1" name="bank" label="Ngân hàng">
          <Select
            options={bankOptions}
            placeholder="Chọn ngân hàng"
            loading={isLoading}
            showSearch
          />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="bank_account"
          label="Số tài khoản"
        >
          <Input placeholder="Nhập số tài khoản" />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="department"
          label="Phòng ban"
        >
          <Input placeholder="Nhập phòng ban" />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="position"
          label="Chức danh"
        >
          <Input placeholder="Nhập chức danh" />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="status"
          label="Trạng thái"
          initialValue="active"
        >
          <Select options={statusOptions} placeholder="Chọn trạng thái" />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="employee_type"
          label="Phân loại nhân sự"
          initialValue="full_time"
        >
          <Radio.Group options={employeeTypeOptions} />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          name="start_date"
          label="Ngày bắt đầu"
        >
          <DatePicker className="w-full" locale={locale} />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          name="official_date"
          label="Ngày chính thức"
        >
          <DatePicker className="w-full" locale={locale} />
        </Form.Item>
      </div>
    </div>
  )
}

export default EmployeeInfomationFormItemBox
