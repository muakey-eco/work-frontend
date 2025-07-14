'use client'

import { randomColor } from '@/libs/utils'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  HomeFilled,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Calendar,
  Divider,
  Table,
  TableProps,
  Tabs,
} from 'antd'
import { createStyles } from 'antd-style'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { times } from 'lodash'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import CheckInScheduleModalForm from './CheckInScheduleModalForm'

import { GLOBAL_BAN } from '@/libs/constant'
import { generateTimestamp } from '@/utils/generateTimestamp'

import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjsLocale from 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import CalendarDropdown from './CalendarDropdown'
import CheckInStatistics from './check-statistics'
import CheckInTableExplanation from './CheckInTableExplanation'

type CheckInTableProps = TableProps & {
  options?: any
  onDateSelect?: (date: any) => void
}

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table {
        .ant-table-container {
          .ant-table-body,
          .ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
    customCalendar: css`
      .ant-picker-panel {
        border: 0 !important;
      }
      .ant-picker-body {
        padding: 0 !important;
        .ant-picker-content {
          tbody {
            tr {
              td {
                padding: 0 !important;
              }
            }
          }
          thead {
            tr {
              th {
                padding: 12px 0;
                font-weight: 600;
              }
              & > :not(:last-child) {
                border-right: solid 1px #0505050f;
              }
            }
          }
        }
      }
    `,
  }
})

const CheckInTable: React.FC<CheckInTableProps> = ({
  options,
  onDateSelect,
  className: customClassName,
  ...props
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const today = useMemo(() => new Date(), [])
  const todayFormatted = dayjs(today).format('YYYY-MM')

  const [mode, setMode] = useState('dashboard')
  const [date, setDate] = useState<any>(dayjs(today))

  const { styles } = useStyle()
  const year = new Date().getFullYear()
  const month = options?.month || new Date().getMonth() + 1

  dayjs.extend(relativeTime)
  dayjs.locale(dayjsLocale)

  const dateParams = searchParams?.get('date')
  const dateNumber = new Date(year, month, 0).getDate()

  const checkInColumns: TableProps['columns'] = [
    {
      title: 'Thành viên',
      dataIndex: 'member',
      fixed: true,
      width: 300,
      render: (value: any) => {
        return (
          <div className="flex flex-col !gap-2 !px-6 !py-4 !text-[14px]">
            <div className="flex items-center gap-2">
              <Avatar
                src={value?.avatar}
                style={{
                  backgroundColor: randomColor(value?.fullName || ''),
                }}
                size={32}
              >
                {String(value?.fullName).charAt(0).toLocaleUpperCase()}
              </Avatar>
              <span>{value?.fullName}</span>
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2">
                <Image src="/All.svg" alt="check-in" width={16} height={16} />
                {Number(value?.workDay) || 0}
              </div>
              <div className="flex gap-2">
                <Image src="/Clock.svg" alt="ot" width={16} height={16} />
                {Number(value?.ot) || 0}
              </div>
              <div className="flex gap-2">
                <Image src="/Home.svg" alt="wfh" width={16} height={16} />
                {Number(value?.wfh) || 0}
              </div>
            </div>
          </div>
        )
      },
    },
    ...times(dateNumber, (num): any => {
      const date = dayjs(
        `${year}-${month > 9 ? month : `0${month}-${num + 1 > 9 ? num + 1 : `0${num + 1}`}`}`,
      )

      return {
        title: (
          <div className="!h-full !w-full">
            <div>{String(date.format('dd'))}</div>
            <div>{String(date.format('DD/MM'))}</div>
          </div>
        ),
        dataIndex: `${num + 1}/${month}`,
        width: 120,
        align: 'center',
        onCell: (row: any) => {
          const dayObj = row[`${num + 1}/${month}`]
          return {
            className:
              typeof dayObj?.hoursPerDay === 'number' &&
              dayObj.hoursPerDay < 7.5 &&
              dayObj.hoursPerDay > 0
                ? '!bg-[#FFF1F0]'
                : '',
          }
        },
        render: (value: any) => {
          const checkIn = value.checkInValue
          const wfh = value.wfh
          const timeOff = value.timeOff
          const dayWorking = value.dayWorking
          const roleMember = value.roleMember
          const isEditDay = value.isEditDay
          const isEdited = isEditDay.length > 0
          return (
            <div className="flex !h-full !w-full flex-col gap-[4px]">
              {checkIn &&
                checkIn?.map((c: any, index: number) => (
                  <div key={`${c[0]}-${c[1]}-${index}`}>
                    {index > 0 && <Divider className="my-[4px]!" />}
                    <div className="flex items-center justify-center gap-2">
                      {isEdited && (
                        <EditFilled className="!text-[14px] !text-[#faad14]" />
                      )}
                      {c[0]} - {c[1] ? c[1] : '--:--'}
                    </div>
                  </div>
                ))}
              {Array.isArray(wfh) &&
                wfh.filter((w) => w != null && w.length > 0).length > 0 &&
                wfh
                  .filter((w) => w != null && w.length > 0)
                  .map((w: any, index: number) => (
                    <div
                      key={`${w?.[0]}-${w?.[1]}-${index}`}
                      className="flex !items-center !justify-center gap-2 !text-center"
                    >
                      <HomeFilled className="!text-[#1677FF]" />
                      WFH
                    </div>
                  ))}
              {Array.isArray(timeOff) &&
                timeOff.filter((w) => w != null && w.length > 0).length > 0 &&
                timeOff
                  .filter((w) => w != null && w.length > 0)
                  .map((w: any, index: number) => (
                    <div
                      key={`${w?.[0]}-${w?.[1]}-${index}`}
                      className="flex !w-fit !items-center !justify-center gap-2 !text-center text-[14px]"
                    >
                      <CheckCircleFilled className="!text-[#52C41A]" />
                      <p className="whitespace-nowrap">Nghỉ có phép</p>
                    </div>
                  ))}
              {/* Hiển thị "Nghỉ không phép" khi working day = 1 và không có time off */}
              {dayWorking === 1 &&
                date < dayjs() &&
                roleMember !== 'Admin' &&
                checkIn === null &&
                (!Array.isArray(timeOff) ||
                  timeOff.filter((w) => w != null && w.length > 0).length ===
                    0) && (
                  <div className="flex !w-fit !items-center !justify-center gap-2 !text-center text-[14px]">
                    <CloseCircleFilled className="!text-[#FF4D4F]" />
                    <p className="whitespace-nowrap">Nghỉ không phép</p>
                  </div>
                )}
              {dayWorking === 0 && (
                <div className="mx-auto flex !w-fit flex-col items-center justify-center gap-2 !text-center text-[14px]">
                  <p className="font-bold whitespace-nowrap text-[#8C8C8C]">
                    Nghỉ
                  </p>
                  <Image
                    src="/image2.gif"
                    alt="nghỉ cuối tuần"
                    width={18}
                    height={18}
                  />
                </div>
              )}
            </div>
          )
        },
      }
    }),
  ]

  const { user, workSchedule, attendances } = options
  console.log('attendances', attendances)

  const checkInDataSource = options?.members
    ?.filter((m: any) => !GLOBAL_BAN.includes(m?.full_name))
    ?.map((m: any) => {
      const checkInHistories = attendances?.attendances?.filter(
        (a: any) => a?.account_id === m?.id,
      )
      const otPropose = attendances?.ot_and_holiday
        .filter((p: any) => p?.name_category === 'Đăng ký OT')
        .filter((p: any) => p?.account_id === m.id)

      const timeOffPropose = attendances?.ot_and_holiday
        .filter((p: any) => p?.name_category === 'Đăng ký nghỉ')
        .filter((p: any) => p?.account_id === m.id)

      const wfhPropose = attendances?.ot_and_holiday
        .filter((p: any) => p?.name === 'Đăng ký WFH')
        .filter((p: any) => p?.account_id === m.id)

      const fields = times(dateNumber, (num): any => {
        const currentDate = num + 1

        const checkIn = checkInHistories?.filter(
          (c: any) => new Date(c?.checkin).getDate() == num + 1,
        )
        const isEditDay = checkIn?.filter((c: any) => c?.edited_at !== null)

        const checkInValue =
          checkIn?.length >= 1
            ? checkIn?.map((c: any) => [
                dayjs(c?.checkin).format('HH:mm'),
                c?.checkout ? dayjs(c?.checkout).format('HH:mm') : null,
              ])
            : null

        const timeOff = timeOffPropose?.map((t: any) =>
          generateTimestamp(
            t?.start_date,
            t?.end_date,
            `${dateParams ? dateParams : todayFormatted}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          ),
        )

        const ot = otPropose?.map((t: any) =>
          generateTimestamp(
            t?.start_date,
            t?.end_date,
            `${dateParams ? dateParams : todayFormatted}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          ),
        )

        const wfh = wfhPropose?.map((t: any) =>
          generateTimestamp(
            t?.start_date,
            t?.end_date,
            `${dateParams ? dateParams : todayFormatted}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          ),
        )

        const hoursPerDay = checkIn?.reduce((total: number, curr: any) => {
          return total + (+curr?.hours || 0)
        }, 0)

        const dayWorking =
          options?.workSchedule?.find(
            (s: any) =>
              s?.day_of_week ===
              `${year}-${month > 9 ? month : `0${month}`}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          )?.go_to_work || 0
        const timeWork =
          attendances?.attendances?.find(
            (s: any) =>
              s?.account_id === m?.id &&
              new Date(s?.checkin).getDate() === currentDate &&
              new Date(s?.checkin).getMonth() + 1 === month &&
              new Date(s?.checkin).getFullYear() === year,
          )?.workday || 0

        const roundedTimeWork = Number(timeWork) === 1 ? 1 : timeWork

        const roleMember = options?.members?.find(
          (mem: any) => mem?.id === m?.id,
        )?.role

        return [
          `${currentDate}/${month}`,
          {
            checkInValue,
            isEditDay,
            timeOff,
            ot,
            wfh,
            hoursPerDay,
            dayWorking,
            roleMember,
            timeWork: roundedTimeWork,
            plan_time: checkIn?.[0]
              ? [
                  dayjs(checkIn?.[0]?.checkin).format('HH:mm'),
                  dayjs(checkIn?.[0]?.check_out_regulation).format('HH:mm'),
                ]
              : [],
          },
        ]
      })

      return {
        member: {
          fullName: m?.full_name,
          avatar: m?.avatar,
          workDay: m?.workday,
          ot: m?.hours_over_time,
          wfh: wfhPropose?.length || 0,
        },
        ...Object.fromEntries(fields),
      }
    })

  useEffect(() => {
    setDate(dayjs(searchParams?.get('date') || today))
  }, [today, searchParams])

  const checkInData = checkInDataSource?.find(
    (c: any) => c?.member?.fullName === user?.full_name,
  )
  const checkInStatisticsItems = [
    {
      title: 'Công chuẩn',
      value: Number(attendances?.standard_work),
    },
    {
      title: 'Công làm việc thực tế',
      value: Number(attendances?.number_of_working_days),
    },
    {
      title: 'Nghỉ có hưởng lương',
      value: Number(attendances?.day_off_with_pay),
    },
    {
      title: 'Nghỉ không hưởng lương',
      value: Number(attendances?.day_off_without_pay),
    },
    {
      title: 'Tổng OT',
      value: Number(attendances?.total_over_time),
    },
    {
      title: 'Tổng công hưởng lương',
      value: Number(attendances?.day_off_account),
    },
  ]

  return (
    <div>
      {user?.role === 'Admin' ? (
        <div className="rounded-sm bg-[#fff]">
          <Tabs
            tabBarExtraContent={
              <div className="mx-6 mt-[11px] flex items-center justify-center gap-2">
                <CheckInScheduleModalForm initialValues={{ workSchedule }}>
                  <div className="flex h-full items-center justify-center px-4">
                    <SettingOutlined className="cursor-pointer text-[18px]" />
                  </div>
                </CheckInScheduleModalForm>

                <Button
                  className="flex h-full w-full items-center"
                  type="primary"
                  onClick={() => {
                    router.push('/salary')
                  }}
                >
                  Khởi tạo bảng lương tháng 6
                </Button>
              </div>
            }
            items={[
              {
                key: 'dashboard',
                label: <div className="px-[16px]">Tổng quan</div>,
                children: (
                  <Table
                    className={clsx(styles.customTable, customClassName)}
                    columns={checkInColumns}
                    dataSource={checkInDataSource}
                    rowHoverable={false}
                    {...props}
                  />
                ),
              },
              {
                key: 'schedule',
                label: <div className="px-[16px]">Lịch làm việc</div>,
                children: (
                  <>
                    <div className="mb-[16px]">
                      <CheckInStatistics
                        items={checkInStatisticsItems}
                        role="admin"
                      />
                    </div>
                    <div className="h-[70vh] overflow-y-auto">
                      <Calendar
                        rootClassName="border border-[#0505050f]"
                        headerRender={() => <></>}
                        fullCellRender={(current) => {
                          const timestamp = dayjs(current).format('D/M')

                          const info = checkInData?.[String(timestamp)]

                          const date = String(
                            dayjs(current).format('YYYY-MM-DD'),
                          )

                          const month = workSchedule?.find(
                            (s: any) => s?.day_of_week === date,
                          )

                          const isCurrentMonth =
                            String(dayjs(current).format('YYYY-MM')) ===
                            (dateParams || dayjs(new Date()).format('YYYY-MM'))

                          return (
                            <CalendarDropdown
                              currentDate={current}
                              month={month}
                              options={{
                                isCurrentMonth,
                                info,
                              }}
                              onDateClick={(date) => onDateSelect?.(date)}
                            />
                          )
                        }}
                        value={date}
                        locale={locale}
                      />
                    </div>
                  </>
                ),
              },
            ]}
            onChange={(key) => {
              if (key === 'schedule') {
                setMode(key)
                onDateSelect?.(dayjs(new Date()))
              }
            }}
          />
        </div>
      ) : (
        <div className="space-y-[16px]">
          {/* Bảng công thống kê */}
          <CheckInStatistics items={checkInStatisticsItems} />
          <div className="h-[70vh] space-y-[24px] overflow-y-auto rounded-[16px] bg-[#fff] p-[16px]">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-[500]">Chi tiết ngày công</span>
              <CheckInTableExplanation
                items={[
                  {
                    label: 'Giờ kế hoạch',
                    className: 'bg-[#1890FF]',
                  },
                  {
                    label: 'Giờ thực tế',
                    className: 'bg-[#237804]',
                  },
                  {
                    label: 'Lỗi chấm công',
                    className: 'bg-[#F5222D]',
                  },
                  {
                    label: 'Nghỉ',
                    className: 'bg-[#FA8C16]',
                  },
                  {
                    label: 'OT',
                    className: 'bg-[#722ED1]',
                  },
                  {
                    label: 'WFH',
                    className: 'bg-[#8C8C8C]',
                  },
                ]}
              />
            </div>
            <Calendar
              className={clsx(
                'overflow-hidden border border-[#0505050f]',
                styles.customCalendar,
              )}
              headerRender={() => <></>}
              fullCellRender={(current) => {
                const timestamp = dayjs(current).format('D/M')
                const info = checkInData?.[String(timestamp)] || []

                const date = String(dayjs(current).format('YYYY-MM-DD'))

                const month = workSchedule?.find(
                  (s: any) => s?.day_of_week === date,
                )

                const isCurrentMonth =
                  String(dayjs(current).format('YYYY-MM')) ===
                  (dateParams || dayjs(new Date()).format('YYYY-MM'))

                return (
                  <CalendarDropdown
                    currentDate={current}
                    month={month}
                    options={{
                      isCurrentMonth,
                      info,
                    }}
                    onDateClick={(date) => onDateSelect?.(date)}
                  />
                )
              }}
              value={date}
              locale={locale}
              fullscreen={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInTable
