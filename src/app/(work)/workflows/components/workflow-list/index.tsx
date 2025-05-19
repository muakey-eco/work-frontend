import { withSuspense } from '@/hoc'
import { getMe, getWorkflows } from '@/libs/data'
import { List } from '@/ui'
import React from 'react'
import WorkflowItem from './WorkflowItem'
import WorkflowListSkeleton from './WorkflowListSkeleton'

export type WorkflowListProps = {
  query?: any
}

const WorkflowList: React.FC<WorkflowListProps> = async ({ query }) => {
  const { type, searchParams, departments, workflowCategories } = query

  const [workflows, user] = await Promise.all([
    getWorkflows({
      type: !type || type === 'all' ? '' : type || 'open',
      search: searchParams?.q || '',
    }),
    getMe(),
  ])

  const dataSource =
    workflowCategories?.length > 0
      ? workflowCategories?.map((cate: any) => ({
          id: cate?.id,
          label: cate?.name,
          workflows: workflows.filter(
            (w: any) => w.workflow_category_id === cate.id,
          ),
          members: cate?.members || [],
        }))
      : []

  const cateIds = workflowCategories?.map((w: any) => w.id)

  return (
    <List
      className="divide-y divide-[#DDDDDD] pb-[40px]"
      dataSource={dataSource}
      renderItem={(cate) => {
        return (
          <WorkflowItem
            cate={cate}
            options={{
              cateIds,
              user,
              departments,
              workflowCategories,
            }}
          />
        )
      }}
    />
  )
}

export default withSuspense(WorkflowList, {
  fallback: () => <WorkflowListSkeleton />,
})
