import { useAsyncEffect } from '@/libs/hook'
import { Col } from '@/ui'
import {
  ExclamationCircleOutlined,
  FilterFilled,
  ReloadOutlined,
} from '@ant-design/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, DatePicker, Dropdown, Form, Input, Tooltip } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { StageContext as WorkflowStageContext } from '../WorkflowPageLayout'
import TaskList from '../task/TaskList'
import StageDropdownMenu from './StageDropdownMenu'
import StageHeader from './StageHeader'
import { getStagesByWorkflowIdRequest, refreshDataAction } from './action'

type StageColumnProps = {
  stage?: any
  userId?: number
  options?: any
}

const StageColumn: React.FC<StageColumnProps> = memo(
  ({ stage, userId, options }) => {
    const { tasks: stageTasks } = stage

    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState<any[]>(stageTasks || [])
    const [filteredValues, setFilteredValues] = useState<any>({
      views: '',
      days: '',
      range: null,
    })

    const now = new Date()
    const [form] = Form.useForm()
    const { setStages } = useContext(WorkflowStageContext)

    const params = useParams()
    const { attributes, setNodeRef, transform, transition, isOver, over } =
      useSortable({
        id: stage?.id,
        data: stage,
      })

    const StageColumnStyle: React.CSSProperties = useMemo(
      () => ({
        transform: CSS.Translate.toString(transform),
        transition: transition || 'all 150ms ease',
        border: isOver ? '2px dashed #1890ff' : '1px solid #eee',
        background: isOver ? 'rgba(24, 144, 255, 0.05)' : undefined,
        willChange: 'transform, border, background',
      }),
      [transform, transition, isOver],
    )

    const handleRefresh = useCallback(async () => {
      setLoading(true)

      try {
        await refreshDataAction({
          workflow_id: params?.id,
        })
        setLoading(false)

        if (typeof window !== undefined) {
          window.location.reload()
        }
      } catch (error) {
        setLoading(false)
        throw new Error(String(error))
      }
    }, [params?.id])

    const stageTasksLength = useMemo(() => stage?.tasks?.length, [stage?.tasks])
    const stageExpiredAfterHours = useMemo(
      () => stage?.expired_after_hours,
      [stage?.expired_after_hours],
    )
    const { views, days: formDays, range } = filteredValues

    useEffect(() => {
      if (!views && !formDays) {
        setTasks(stageTasks || [])
        return
      }

      setTasks(() => {
        if (views && formDays) {
          return [
            ...stageTasks?.filter((t: any) => {
              const days = Math.abs(dayjs(t?.date_posted).diff(now, 'day'))

              return t?.view_count < +views && days >= +formDays
            }),
          ]
        }

        if (views) {
          return [...stageTasks?.filter((t: any) => t?.view_count < +views)]
        }

        if (formDays) {
          return [
            ...stageTasks.filter((t: any) => {
              const days = Math.abs(dayjs(t?.date_posted).diff(now, 'day'))

              return days >= +formDays
            }),
          ]
        }

        return [...stageTasks]
      })
    }, [views, formDays, stageTasks])

    useEffect(() => {
      setTasks(stageTasks)
    }, [stageTasks])

    useAsyncEffect(async () => {
      if (range === null) return

      const res = await getStagesByWorkflowIdRequest({
        workflow_id: params?.id,
        start: range?.[0] ? String(dayjs(range?.[0]).format('YYYY-MM-DD')) : '',
        end: range?.[1] ? String(dayjs(range?.[1]).format('YYYY-MM-DD')) : '',
      })

      setStages(
        res?.map((stage: any) => ({
          ...stage,
          id: `stage_${stage.id}`,
        })),
      )
    }, [range])

    return (
      <Col
        className={clsx('w-[272px] overflow-hidden border-r border-[#eee]', {
          'bg-[#fff3f3]': stage.index === 0,
          'bg-[#fff]': stage.index === 1,
          'bg-[#f6f6f6]': ![0, 1].includes(stage.index),
        })}
        key={stage.id}
        ref={setNodeRef}
        style={StageColumnStyle}
        {...{
          ...attributes,
          role: 'article',
        }}
      >
        <StageHeader
          className={clsx({
            'bg-[#ffe8e8] text-[#c34343]': stage.index === 0,
            'bg-[#deffdb]': stage.index === 1,
            'bg-[#f6f6f6]': ![0, 1].includes(stage.index),
          })}
          title={
            <span>
              {stage.name}{' '}
              {![0, 1].includes(stage.index) && stage?.description && (
                <Tooltip
                  styles={{
                    body: {
                      color: '#000',
                    },
                  }}
                  color="#fff"
                  title={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: stage?.description,
                      }}
                    />
                  }
                  destroyTooltipOnHide
                >
                  <ExclamationCircleOutlined className="text-[12px]" />
                </Tooltip>
              )}
            </span>
          }
          extra={
            <>
              {![0, 1].includes(stage?.index) && (
                <StageDropdownMenu stage={stage} />
              )}
              {[1].includes(stage?.index) && (
                <ReloadOutlined
                  className="cursor-pointer text-[10px]"
                  onClick={handleRefresh}
                />
              )}
              {stage.index === 1 && (
                <Dropdown
                  trigger={['click']}
                  dropdownRender={() => (
                    <div className="max-w-[400px] rounded-[8px] bg-[#fff] p-[12px] shadow-lg">
                      <Form onFinish={setFilteredValues} form={form}>
                        <Form.Item className="mb-[8px]!" name="range">
                          <DatePicker.RangePicker locale={locale} />
                        </Form.Item>
                        <Form.Item className="mb-[8px]!" name="views">
                          <Input placeholder="< Lượt xem" type="number" />
                        </Form.Item>
                        <Form.Item className="mb-[8px]!" name="days">
                          <Input placeholder="> Ngày" type="number" />
                        </Form.Item>
                        <Form.Item className="mb-0!">
                          <div className="flex items-center justify-between">
                            <Button
                              size="small"
                              onClick={() => {
                                form.resetFields()
                                setFilteredValues({
                                  views: '',
                                  days: '',
                                  range: [],
                                })
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              htmlType="submit"
                            >
                              Ok
                            </Button>
                          </div>
                        </Form.Item>
                      </Form>
                    </div>
                  )}
                  placement="bottomRight"
                >
                  <FilterFilled className="ml-[8px] cursor-pointer text-[12px] text-[#00000099]" />
                </Dropdown>
              )}
            </>
          }
        >
          <div className="flex items-center justify-between">
            <span
              className={clsx(
                'text-[12px] leading-none text-[#aaa]',
                stage.index === 0 && 'text-[#c3434399]',
              )}
            >
              {stageTasksLength} Nhiệm vụ
            </span>

            {![0, 1].includes(stage.index) && (
              <span className="text-[12px] leading-none text-[#aaa]">
                {!!stageExpiredAfterHours
                  ? `Thời hạn: ${stageExpiredAfterHours}h`
                  : 'Không thời hạn'}
              </span>
            )}
          </div>
        </StageHeader>

        <div className="no-scroll h-[calc(100vh-171px)] overflow-auto pb-[22px]">
          <TaskList
            tasks={tasks}
            stageId={stage?.id}
            loading={loading}
            userId={userId}
            options={options}
          />
        </div>
      </Col>
    )
  },
)

StageColumn.displayName = 'Stage column'

export default StageColumn
