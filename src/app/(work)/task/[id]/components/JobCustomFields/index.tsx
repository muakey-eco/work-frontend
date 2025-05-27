'use client'

import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse, Flex, Image, Tag } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import JobCustomFieldModalForm from '../JobCustomFieldModalForm'

type JobCustomFieldsProps = {
  query?: any
}

const generateValue = (type: string, value: any) => {
  if (!value) return value

  switch (type) {
    case 'date':
      return dayjs(value).format('DD-MM-YYYY')

    case 'file':
      return <Image src={value} width="100%" height="100%" alt="" />

    case 'list':
      return (
        <Flex wrap gap={8}>
          {value.map((v: any) => (
            <Tag className="m-0!" key={v}>
              {v}
            </Tag>
          ))}
        </Flex>
      )

    default:
      return value
  }
}

const JobCustomFields: React.FC<JobCustomFieldsProps> = ({ query }) => {
  const [fields, setFields] = useState<any[]>([])

  return (
    <div className="mt-[24px]">
      <div className="text-[12px] font-[500] text-[#42b814]">
        TRƯỜNG TÙY CHỈNH
      </div>

      <Collapse
        className="mt-[16px] rounded-[4px]! bg-[#fff]"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            className={clsx(isActive ? 'rotate-90' : 'rotate-0')}
          />
        )}
        items={fields?.map((field: any) => {
          const value = generateValue(field?.type, field?.value)

          return {
            label: (
              <div className="group flex items-center justify-between gap-[16px]">
                <span className="text-[12px] font-[500] text-[#888]">
                  {String(field?.name).toLocaleUpperCase()}
                </span>
                <JobCustomFieldModalForm
                  initialValues={{
                    ...field,
                    require: field?.require === 1 ? true : false,
                    taskId: field?.task_id,
                  }}
                >
                  <span className="hidden cursor-pointer text-[13px] text-[#267cde] group-hover:inline-block hover:underline">
                    Chỉnh sửa
                  </span>
                </JobCustomFieldModalForm>
              </div>
            ),
            children: (
              <div className="pl-[24px] text-[#888]">
                {value || `Không có ${field?.name}`}
              </div>
            ),
            style: {
              marginBottom: 4,
              borderRadius: 4,
              backgroundColor: '#f6f6f6',
              border: 'none',
            },
          }
        })}
        bordered={false}
      />
    </div>
  )
}

export default JobCustomFields
