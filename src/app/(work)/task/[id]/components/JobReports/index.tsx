'use client'

import { extractLinks } from '@/libs/utils'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { App, Card, List, Tooltip } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Converter } from 'showdown'

type JobReportsProps = {
  reports?: any
}

const JobReports: React.FC<JobReportsProps> = ({ reports }) => {
  const { message } = App.useApp()
  const [uri, setUri] = useState('')
  const converter = new Converter()

  useEffect(() => {
    if (uri) {
      setTimeout(() => setUri(''), 2000)
    }
  }, [uri])

  return (
    <div className="mb-[16px] space-y-[6px] overflow-hidden rounded-[6px] bg-[#fff] px-[20px] py-[16px]">
      <div className="mb-[8px] text-[13px] font-[600] text-[#888]">
        DANH SÁCH LINK BÁO CÁO
      </div>

      <List
        dataSource={reports}
        loading={!reports}
        renderItem={(item: any) =>
          item?.fields?.length > 0 && (
            <>
              {item?.fields?.map((i: any) => {
                const urlSeparates = extractLinks(converter.makeHtml(i?.value))

                if (!urlSeparates) return <></>

                return (
                  urlSeparates.length > 0 && (
                    <Card
                      classNames={{
                        body: 'space-y-[8px]',
                      }}
                      key={i?.value}
                      title={item?.name}
                      type="inner"
                    >
                      {urlSeparates.map((url) => {
                        return (
                          <div
                            key={url}
                            className="flex items-center gap-[8px]"
                          >
                            <Tooltip title={url}>
                              <Link
                                className="line-clamp-1 break-all"
                                href={url}
                                target="_blank"
                              >
                                {url}
                              </Link>
                            </Tooltip>
                            {uri === url ? (
                              <CheckOutlined className="text-[#42b814]" />
                            ) : (
                              <CopyOutlined
                                onClick={() => {
                                  navigator.clipboard.writeText(url)
                                  setUri(url)
                                  message.success('Đã sao chép.')
                                }}
                              />
                            )}
                          </div>
                        )
                      })}
                    </Card>
                  )
                )
              })}
            </>
          )
        }
      />
    </div>
  )
}

export default JobReports
