import { Col, Row } from 'antd'
import React from 'react'
import WorkflowCard from './WorkflowCard'

type WorkflowCardListProps = {
  items?: any[]
  options?: any
  cate?: any
}

const WorkflowCardList: React.FC<WorkflowCardListProps> = ({
  items,
  options,
  cate,
}) => {
  const { workflowCategories } = options
  return (
    <Row gutter={[24, 24]} className="pb-[24px]">
      {(items || [])
        .slice()
        .sort(
          (a, b) => (b.is_key_workflow ? 1 : 0) - (a.is_key_workflow ? 1 : 0),
        )
        .map((workflow: any, index: number) => (
          <Col span={6} key={index}>
            <WorkflowCard
              workflowCategories={workflowCategories}
              workflow={workflow}
              cate={cate}
              total={{
                task: workflow.totalTask,
                successTask: workflow.totalSuccessTask,
                failedTask: workflow.totalFailedTask,
              }}
              options={options}
            />
          </Col>
        ))}
    </Row>
  )
}

export default WorkflowCardList
