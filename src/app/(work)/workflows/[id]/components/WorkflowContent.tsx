import React from 'react'
import CustomFields from './custom-fields'
import ReportFields from './report-fields'
import StageList from './stage'
import WorkflowDocs from './workflow-docs'
import WorkflowStatistics from './workflow-statistics'

type WorkflowContentProps = {
  options?: any
}

const WorkflowContent: React.FC<WorkflowContentProps> = ({ options }) => {
  const filteredStages =
    options?.stages?.length >= 0
      ? options?.stages?.filter((stage: any) => ![0, 1].includes(stage.index))
      : []

  switch (options?.type) {
    case 'custom-field':
      return (
        <CustomFields
          stages={filteredStages}
          workflowId={options?.workflow?.id}
        />
      )

    case 'docs':
      return <WorkflowDocs stages={filteredStages} />

    case 'statistics':
      return (
        <WorkflowStatistics
          workflowId={options?.workflow?.id}
          params={{
            date: options?.date || '',
            tag_id:
              !!options.tag && options.tag !== ''
                ? String(options.tag).split(',')
                : [],
          }}
        />
      )

    case 'report-field':
      return (
        <ReportFields
          stages={filteredStages}
          workflowId={options?.workflow?.id}
        />
      )

    default:
      return (
        <StageList
          members={options?.workflow?.members}
          stages={options?.stages}
          options={{
            user: options?.user,
            requiredLink: options?.workflow?.require_link_youtube === 1,
            isKeyWorkflow: options?.workflow?.is_key_workflow === 1,
            workflowsForProcess: options?.workflowsForProcess,
            workflowId: options?.workflow?.id,
          }}
        />
      )
  }
}

export default WorkflowContent
