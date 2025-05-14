'use client'

import { App, Form, FormInstance, FormProps, Modal, ModalProps } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { addDepartmentSalaryRequest } from '../../action'
import JobProgressDecisionInformationFormCard from './components/job-progress-decision-information-form-card'
import JobProgressInfomationFormCard from './components/job-progress-infomation-form-card'
import JobProgressNewInfomationFormCard from './components/job-progress-new-infomation-form-card'

export type JobProgressModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  initialValues?: any
}

const JobProgressModalForm: React.FC<JobProgressModalFormProps> = ({
  children,
  formProps,
  initialValues,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [basicSalary, setBasicSalary] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [salaries, setSalaries] = useState({
    travel_allowance: 0,
    eat_allowance: 0,
    kpi: 0,
  })
  const { message } = App.useApp()

  const formRef = useRef<FormInstance>(null)

  const handleSalariesChange = useCallback((_: any, allValues: any) => {
    const { basic_salary, travel_allowance, eat_allowance, kpi } = allValues

    setBasicSalary(basic_salary)

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const values = await formRef.current?.validateFields()

      const formData = {
        ...values,
        account_id: initialValues?.id,
      }
      const res = await addDepartmentSalaryRequest(formData)
      if (res) {
        message.success('Tạo mới quyết định bổ nhiệm, tăng lương thành công!')
        setOpen(false)
        formRef.current?.resetFields()
      }
    } catch (error: any) {
      console.error('Form validation failed:', error)
      message.error(error?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        classNames={{
          body: '!space-y-[16px]',
        }}
        title="Tạo mới quyết định bổ nhiệm, tăng lương"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        width={846}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading: isLoading,
        }}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            initialValues={{
              ...initialValues,
              gross_salary: 0,
              net_salary: 0,
            }}
            onValuesChange={handleSalariesChange}
            ref={formRef}
            // onFinish={handleSubmit}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
        <JobProgressInfomationFormCard
          title="Thông tin chung"
          shouldCall={open}
        />

        <JobProgressNewInfomationFormCard title="Thành phần lương mới" />

        <JobProgressDecisionInformationFormCard title="Thông tin quyết định" />
      </Modal>
    </>
  )
}

export default JobProgressModalForm
