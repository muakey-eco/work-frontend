'use client'

import { formatCurrency } from '@/lib/utils'
import {
  App,
  Card,
  Form,
  FormInstance,
  FormProps,
  InputNumber,
  InputNumberProps,
  Modal,
  ModalProps,
} from 'antd'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { updateProfileAction } from '../../../action'

export type JobSalaryModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  initialValues?: any
}

const JobSalaryModalForm: React.FC<JobSalaryModalFormProps> = ({
  children,
  formProps,
  initialValues,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [basicSalary, setBasicSalary] = useState(0)
  const [salaries, setSalaries] = useState({
    travel_allowance: 0,
    eat_allowance: 0,
    kpi: 0,
  })

  const router = useRouter()
  const { message } = App.useApp()
  const formRef = useRef<FormInstance>(null)

  const { salary, position, ...restInitialValues } = initialValues
  const totalSalary =
    salary?.basic_salary +
    salary?.travel_allowance +
    salary?.eat_allowance +
    salary?.kpi

  const DISABLED_SALARY_FIELDS = {
    insurance: 1161000,
    insurance_employee: 567000,
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)

    if (!position) {
      message.error('Phải có chức danh sau đó mới sửa được')
      setLoading(false)
      return
    }

    const { insurance, insurance_employee, ...restValues } = values

    try {
      const { message: msg, errors } = await updateProfileAction(
        restInitialValues?.id,
        {
          salary: {
            id: salary?.id,
            ...restValues,
          },
        },
      )

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Cập nhật thành công')
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(error as string)
    }
  }

  const handleSalariesChange = useCallback((_: any, allValues: any) => {
    const { basic_salary, travel_allowance, eat_allowance, kpi } = allValues

    setBasicSalary(+(basic_salary || 0))

    setSalaries((prev: any) => ({
      ...prev,
      travel_allowance: travel_allowance || 0,
      eat_allowance: eat_allowance || 0,
      kpi: kpi || 0,
    }))
  }, [])

  useEffect(() => {
    const insurance = 1161000
    const insurance_employee = 567000
    const total_salary =
      basicSalary +
      salaries.travel_allowance +
      salaries.eat_allowance +
      salaries.kpi

    formRef.current?.setFieldsValue({
      gross_salary: Number(
        (total_salary + insurance + insurance_employee).toFixed(2),
      ),
      net_salary: Number(total_salary.toFixed(2)),
    })
  }, [salaries, basicSalary])

  const formatProps: Pick<InputNumberProps, 'formatter' | 'parser'> = {
    formatter: formatCurrency,
    parser: (value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number,
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Thành phần lương"
        open={open}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        width={846}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            onFinish={handleSubmit}
            onValuesChange={handleSalariesChange}
            layout="vertical"
            ref={formRef}
            initialValues={{
              ...salary,
              insurance: DISABLED_SALARY_FIELDS.insurance,
              insurance_employee: DISABLED_SALARY_FIELDS.insurance_employee,
              gross_salary: Number(
                totalSalary +
                  Number(DISABLED_SALARY_FIELDS.insurance) +
                  Number(DISABLED_SALARY_FIELDS.insurance_employee),
              ),
              net_salary: Number(totalSalary),
            }}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
        <Card>
          <div className="mb-[16px] text-[14px] leading-[22px] font-[600]">
            Thành phần lương
          </div>

          <div className="flex items-center gap-[16px]">
            <Form.Item
              className="mb-[16px]! flex-1"
              label="Lương cơ bản"
              name="basic_salary"
            >
              <InputNumber
                className="w-full!"
                placeholder="Nhập"
                {...formatProps}
              />
            </Form.Item>

            <Form.Item
              className="mb-[16px]! flex-1"
              label="Phụ cấp đi lại"
              name="travel_allowance"
            >
              <InputNumber
                className="w-full!"
                placeholder="Nhập"
                {...formatProps}
              />
            </Form.Item>
          </div>

          <div className="flex items-center gap-[16px]">
            <Form.Item
              className="mb-[16px]! flex-1"
              label="Phụ cấp ăn uống"
              name="eat_allowance"
            >
              <InputNumber
                className="w-full!"
                placeholder="Nhập"
                {...formatProps}
              />
            </Form.Item>

            <Form.Item
              className="mb-[16px]! flex-1"
              label="Thưởng, KPI"
              name="kpi"
            >
              <InputNumber
                className="w-full!"
                placeholder="Nhập"
                {...formatProps}
              />
            </Form.Item>
          </div>

          <div className="flex items-center gap-[16px]">
            <Form.Item
              className="mb-0! flex-1"
              label="BHXH, BHYT, BHTN do công ty đóng (21,5%)"
              name="insurance"
            >
              <InputNumber
                value={DISABLED_SALARY_FIELDS.insurance}
                className="w-full!"
                placeholder="BHXH, BHYT, BHTN do công ty đóng (21,5%)"
                disabled
                {...formatProps}
              />
            </Form.Item>

            <Form.Item
              className="mb-0! flex-1"
              label="BHXH, BHYT, BHTN do NLĐ đóng (10,5%)"
              name="insurance_employee"
            >
              <InputNumber
                value={DISABLED_SALARY_FIELDS.insurance_employee}
                className="w-full!"
                placeholder="BHXH, BHYT, BHTN do NLĐ đóng (10,5%)"
                disabled
                {...formatProps}
              />
            </Form.Item>
          </div>
        </Card>

        <div className="mt-[16px] flex items-center gap-[16px]">
          <Form.Item
            className="mb-0! flex-1"
            label="Lương Gross (Lương sau khi cộng BHXH, BHYT, BHTN)"
            name="gross_salary"
          >
            <InputNumber
              className="w-full!"
              placeholder="Lương Gross (Lương sau khi cộng BHXH, BHYT, BHTN)"
              disabled
              {...formatProps}
            />
          </Form.Item>

          <Form.Item
            className="mb-0! flex-1"
            label="Lương Net"
            name="net_salary"
          >
            <InputNumber
              className="w-full!"
              placeholder="Lương Net"
              disabled
              {...formatProps}
            />
          </Form.Item>
        </div>
      </Modal>
    </>
  )
}

export default JobSalaryModalForm
