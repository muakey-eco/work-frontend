import { BackButton } from '@/components'
import {
  getMe,
  getStagesByWorkflowId,
  getTaskById,
  getTimeStagesByTaskId,
  getWorkflowById,
  getWorkflowCategories,
} from '@/libs/data'
import { getStageById } from '@/libs/stage'
import { ArrowLeftOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Col, Row, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { Metadata } from 'next'
import React from 'react'
import JobComments from './components/JobComments'
import JobCustomFields from './components/JobCustomFields'
import JobDescription from './components/JobDescription'
import JobHistory from './components/JobHistory'
import JobOverView from './components/JobOverview'
import JobProgress from './components/JobProgress'
import JobProgressTime from './components/JobProgressTime'
import JobReview from './components/JobReview'
import PageHeader from './components/PageHeader'
import PageHeaderAction from './components/PageHeaderAction'

export const generateMetadata = async (props: { params: any }) => {
  const params = await props.params

  const task = await getTaskById(params?.id)

  const metadata: Metadata = {
    title: `Job: ${task?.name}`,
  }

  return metadata
}

const generateStatus = (stage: any, stageIndex: number) => {
  if (stage?.index === stageIndex) {
    return 'pending'
  }

  if (stage?.index > stageIndex) {
    return 'completed'
  }

  return ''
}

const page: React.FC<any> = async (props: {
  params: any
  searchParams: any
}) => {
  const params = await props.params

  const task = await getTaskById(params?.id)
  console.log('task', task)

  const stage = await getStageById(task?.stage_id)

  const [stages, workflow, user, workflowCategories] = await Promise.all([
    getStagesByWorkflowId({
      workflow_id: stage?.workflow_id,
    }),
    getWorkflowById(stage?.workflow_id),
    getMe(),
    getWorkflowCategories(),
  ])

  const timeStages = await getTimeStagesByTaskId(task?.id)

  const filteredStages = stages?.filter(
    (stage: any) => ![0, 1].includes(stage.index),
  )
  const workflowsForProcess = Array.from(workflowCategories)?.filter(
    (w: any) => w?.id === workflow?.workflow_category_id,
  )

  const failedStageId = stages?.find((stage: any) => stage.index === 0)?.['id']
  const completedStageId = stages?.find((stage: any) => stage.index === 1)?.[
    'id'
  ]
  const currentStage = stages?.find((stage: any) => stage.id === task?.stage_id)

  let INDEX: number = 0

  return (
    <Row>
      <Col className="max-h-[100vh]" span={17}>
        <div className="flex h-full flex-col items-start px-[20px] pt-[12px]">
          <PageHeader
            className="h-[58px] w-full"
            title={
              <div className="flex items-start gap-[8px] font-[500]">
                <BackButton>
                  <ArrowLeftOutlined className="cursor-pointer text-[20px] text-[#aaa]" />
                </BackButton>
                <Tooltip title={task?.name}>
                  <span className="line-clamp-1 text-[20px] leading-[24px]">
                    {task?.name}
                  </span>
                </Tooltip>
              </div>
            }
            extra={
              <PageHeaderAction
                options={{
                  failedStageId,
                  completedStageId,
                  task,
                  stages,
                  user,
                  members: workflow?.members,
                  workflowId: stage?.workflow_id,
                  reportRequired: workflow?.require_link_youtube === 1,
                  workflowsForProcess,
                  isKeyWorkflow: workflow?.is_key_workflow === 1,
                }}
              />
            }
          />
          <div className="w-full flex-1 overflow-auto">
            <h2 className="mt-[16px] text-[24px]">{task?.name}</h2>

            <div className="mt-[8px] flex items-center gap-[8px] text-[#999]">
              <ExclamationCircleFilled className="text-[14px]" />
              <span className="text-[13px]">
                Không có tổng quan ngắn về nhiệm vụ
              </span>
            </div>

            <div className="mt-[4px] flex items-center gap-[8px] text-[#999]">
              <ExclamationCircleFilled className="text-[14px]" />
              <span className="text-[13px]">
                Thời hạn nhiệm vụ:{' '}
                <span className="text-[#000]">
                  {task?.expired
                    ? dayjs(task?.expired).format('HH:mm DD/MM/YYYY')
                    : 'Không thời hạn'}
                </span>
              </span>
            </div>

            <JobProgress
              steps={filteredStages?.map((stage: any) => {
                const failedStage = stages?.find((s: any) => s?.index === 0)

                if (stage?.id === task?.stage_id) {
                  INDEX = stage?.index
                }

                return {
                  name: stage?.name,
                  status:
                    failedStage?.id === task?.stage_id
                      ? 'failed'
                      : generateStatus(stage, INDEX),
                }
              })}
            />

            <JobDescription
              value={task?.description}
              params={{
                taskId: task?.id,
                task,
              }}
            />

            <JobCustomFields
              query={{
                workflow_id: stage?.workflow_id,
                task_id: task?.id,
                fields: task?.fields,
              }}
            />

            <JobComments
              query={{
                taskId: params?.id,
              }}
            />
          </div>
        </div>
      </Col>
      <Col className="h-[100vh] overflow-auto" span={7}>
        <div className="h-max min-h-[100vh] bg-[#eee] p-[16px]">
          {task?.link_youtube && (
            <JobReview
              task={task}
              query={{
                workflowId: stage?.workflow_id,
              }}
            />
          )}

          <JobOverView
            task={task}
            members={workflow?.members}
            currentStage={currentStage?.name}
          />

          {timeStages?.length > 0 && (
            <JobProgressTime
              timestamp={String(
                dayjs(new Date(task?.created_at)).format('HH:mm DD/MM/YYYY'),
              )}
              stages={
                timeStages?.length > 0
                  ? timeStages?.map((stage: any) => {
                      const failedStage = stages?.find(
                        (s: any) => s?.index === 0,
                      )

                      if (stage?.id === task?.stage_id) {
                        INDEX = stage?.index
                      }

                      return {
                        ...stage,
                        status:
                          failedStage?.id === task?.stage_id
                            ? 'failed'
                            : generateStatus(stage, INDEX),
                      }
                    })
                  : []
              }
              total={timeStages.reduce((total: number, current: any) => {
                return Number(
                  (total += current?.hours + current?.minutes / 60),
                ).toFixed(2)
              }, 0)}
            />
          )}

          <JobHistory taskId={params?.id} />
        </div>
      </Col>
    </Row>
  )
}

export default page
