'use server'

import { getStagesByWorkflowId, refreshData } from '@/libs/data'

export const refreshDataAction = async (query?: any) => refreshData(query)

export const getStagesByWorkflowIdRequest = async (query?: any) =>
  getStagesByWorkflowId(query)
