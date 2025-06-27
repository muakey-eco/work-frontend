import {
  getCustomFieldsByWorkflowId,
  getMe,
  getStagesByWorkflowId,
  getWorkflowById,
  getWorkflowCategories,
} from '@/libs/data'
import { getDepartments } from '@/libs/department'
import { Metadata } from 'next'
import React from 'react'
import WorkflowPageLayout from './components/WorkflowPageLayout'

export const generateMetadata = async (props: { params: any }) => {
  const params = await props.params
  const workflowId = params?.id

  const workflow = await getWorkflowById(workflowId)

  const metadata: Metadata = {
    title: `Muakey | ${workflow?.name}`,
  }

  return metadata
}

const Page: React.FC<any> = async (prop: {
  params: any
  searchParams: any
}) => {
  const params = await prop.params
  const searchParams = await prop.searchParams
  const workflowId = params?.id
  const date = searchParams?.date
  const tag = searchParams?.tag

  const [
    workflow,
    workflowCategories,
    stages,
    user,
    customFields,
    departments,
  ] = await Promise.all([
    getWorkflowById(workflowId),
    getWorkflowCategories(),
    getStagesByWorkflowId({
      workflow_id: workflowId,
    }),
    getMe(),
    getCustomFieldsByWorkflowId({
      workflow_id: workflowId,
    }),
    getDepartments(),
  ])

  return (
    <WorkflowPageLayout
      workflow={workflow}
      workflowCategories={workflowCategories}
      type={searchParams?.type || 'table'}
      options={{
        stages,
        user,
        date,
        tag,
        customFields,
        departments,
      }}
    />
  )
}

export default Page
