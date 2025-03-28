'use client'

import { mapAsFile } from '@/lib/utils'
import { useAsyncEffect } from '@/libs/hook'
import { App, Form, FormInstance, FormProps, Modal, ModalProps } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import {
  addStaffAction,
  getAccountByIdAction,
  uploadFilesAction,
} from '../action'
import EmployeeSwitchFormItemBox from './employee-switch-form-item-box'
import EmployeeInfomationFormItemBox from './EmployeeInfomationFormItemBox'
import EmployeeResumeFormItemBox from './EmployeeResumeFormItemBox'
import EmployeeSelectFormItemBox from './EmployeeSelectFormItemBox'

export type EmployeeModalFormProps = ModalProps & {
  initialValues?: any
  formProps?: FormProps
  children?: React.ReactNode
}

const genFormArrayValues = (key: string, values: any[]) => {
  const isEmpty =
    values.length === 0 ||
    values.every((value: any) => Object.keys(value).length === 0)

  if (isEmpty) return {}

  const filteredValues = values
    .filter((value) => Object.keys(value)?.some((key) => value[key]))
    .map((val: any) =>
      Object.fromEntries(
        Object.entries(val).filter(([_, value]) => value !== undefined),
      ),
    )

  return {
    [key]: filteredValues?.map((value: any) => {
      const { time_range, ...restValue } = value

      if (!time_range) return restValue

      return {
        ...restValue,
        start_date: time_range?.[0]
          ? String(dayjs(time_range?.[0]).format('YYYY-MM-DD'))
          : null,
        end_date: time_range?.[1]
          ? String(dayjs(time_range?.[1]).format('YYYY-MM-DD'))
          : null,
      }
    }),
  }
}

const calculateSalary = (salary: any) => {
  const { basic_salary, travel_allowance, eat_allowance, kpi } = salary || {}

  const insurance = Number((basic_salary || 0) * 0.215)
  const insurance_employee = Number((basic_salary || 0) * 0.105)
  const total_salary =
    (basic_salary || 0) +
    (travel_allowance || 0) +
    (eat_allowance || 0) +
    (kpi || 0)

  return {
    insurance,
    insurance_employee,
    gross_salary: Number(
      (total_salary + insurance + insurance_employee).toFixed(2),
    ),
    net_salary: Number(total_salary.toFixed(2)),
  }
}

const EmployeeModalForm: React.FC<EmployeeModalFormProps> = ({
  children,
  formProps,
  initialValues,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountId, setAccountId] = useState(0)
  const [switchFormState, setSwitchFormState] = useState({
    shouldShowSalary: false,
    shouldShowLegal: false,
    shouldShowEducation: false,
    shouldShowHistory: false,
    shouldShowContact: false,
  })

  const formRef = useRef<FormInstance>(null)
  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setLoading(true)

    const {
      fileList,
      education_list,
      history_list,
      contact_list,
      ...restValues
    } = values

    const originFileList = fileList ? mapAsFile(fileList) : []

    const formData = new FormData()

    originFileList.forEach((file: any) => {
      formData.append('files[]', file)
    })

    const educations = genFormArrayValues('educations', education_list)
    const histories = genFormArrayValues('work_histories', history_list)
    const contacts = genFormArrayValues('family_members', contact_list)

    const files = fileList ? await uploadFilesAction(formData) : null

    const formValues = {
      ...restValues,
      ...educations,
      ...histories,
      ...contacts,
      birthday: values.birthday
        ? String(dayjs(values.birthday).format('YYYY-MM-DD'))
        : null,
      official_date: values.official_date
        ? String(dayjs(values.official_date).format('YYYY-MM-DD'))
        : null,
      start_date: values.start_date
        ? String(dayjs(values.start_date).format('YYYY-MM-DD'))
        : null,
      personal_documents: files,
    }

    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    )

    try {
      const { message: msg, errors } = await addStaffAction(filteredFormValues)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Thêm nhân sự thành công')
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const handleSalariesChange = useCallback((_: any, allValues: any) => {
    const { account_id, basic_salary, travel_allowance, eat_allowance, kpi } =
      allValues

    setAccountId(account_id || 0)

    const fields = calculateSalary({
      basic_salary,
      travel_allowance,
      eat_allowance,
      kpi,
    })

    formRef.current?.setFieldsValue(fields)
  }, [])

  useAsyncEffect(async () => {
    if (!accountId) return

    const data = await getAccountByIdAction(accountId, {
      include: 'profile',
    })

    const {
      educations,
      work_histories,
      family_members,
      birthday,
      official_date,
      start_date,
      salary,
      ...restData
    } = data || {}

    const salaryFields = calculateSalary(salary)

    const legalInformation: Record<string, any> = {
      tax_code: restData?.tax_code,
      tax_reduced: restData?.tax_reduced,
      BHXH: restData?.BHXH,
      place_of_registration: restData?.place_of_registration,
      salary_scale: restData?.salary_scale,
    }

    const hasLegalInformation = Object.keys(legalInformation).some(
      (key: string) => !!legalInformation?.[key],
    )
    setSwitchFormState({
      shouldShowSalary: !!salary,
      shouldShowLegal: hasLegalInformation,
      shouldShowEducation: !!educations?.length,
      shouldShowHistory: !!work_histories?.length,
      shouldShowContact: !!family_members?.length,
    })

    const fields = {
      ...restData,
      ...salary,
      ...salaryFields,
      birthday: birthday ? dayjs(birthday) : null,
      official_date: official_date ? dayjs(official_date) : null,
      start_date: start_date ? dayjs(start_date) : null,
      education_list: educations?.length
        ? educations?.map((edu: any) => ({
            ...edu,
            time_range: [
              edu?.start_date ? dayjs(edu?.start_date) : null,
              edu?.end_date ? dayjs(edu?.end_date) : null,
            ],
          }))
        : [{}],
      history_list: work_histories?.length
        ? work_histories?.map((history: any) => ({
            ...history,
            time_range: [
              history?.start_date ? dayjs(history?.start_date) : null,
              history?.end_date ? dayjs(history?.end_date) : null,
            ],
          }))
        : [{}],
      contact_list: family_members?.length ? family_members : [{}],
    }

    formRef.current?.setFieldsValue(fields)
  }, [accountId])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Thêm nhân sự mới"
        open={open}
        width={846}
        okText="Thêm"
        cancelText="Hủy"
        onCancel={() => setOpen(false)}
        destroyOnClose
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              bank: 'VietinBank',
            }}
            ref={formRef}
            onValuesChange={handleSalariesChange}
            clearOnDestroy
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
        <div className="divide-y">
          <EmployeeSelectFormItemBox />

          <EmployeeInfomationFormItemBox className="pt-[16px]" />

          <EmployeeResumeFormItemBox className="mb-0! py-[16px]!" />

          <EmployeeSwitchFormItemBox
            className="pt-[16px]"
            state={switchFormState}
          />
        </div>
      </Modal>
    </>
  )
}

export default EmployeeModalForm
