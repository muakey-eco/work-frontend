'use server'

import { editWorkflow, getCustomFieldsByWorkflowId } from '@/libs/data'

export const getCustomFieldsByWorkflowIdAction = async (workflowId: number) => {
  return await getCustomFieldsByWorkflowId({
    workflow_id: workflowId,
  })
}

export const editWorkflowAction = async (workflowId: number, data: any) => {
  return await editWorkflow(workflowId, {
    ...data,
  })
}
