'use client'

import { Form, FormInstance, FormProps, Modal, ModalProps } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  const [salaries, setSalaries] = useState({
    travel_allowance: 0,
    eat_allowance: 0,
    kpi: 0,
  })

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
    formRef.current?.setFieldsValue({
      insurance: Number(basicSalary * 0.215),
      insurance_employee: Number(basicSalary * 0.105),
    })
  }, [basicSalary])

  useEffect(() => {
    const insurance = Number(basicSalary * 0.215)
    const insurance_employee = Number(basicSalary * 0.105)
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

  const handleSubmit = (values: any) => {
    console.log(values)
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
