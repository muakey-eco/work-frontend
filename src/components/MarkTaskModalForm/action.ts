'use server'

import { editTask, moveStage } from '@/libs/data'

export const moveStageAction = async (
  id: number,
  stageId: number,
  data?: any,
) => moveStage(id, stageId, data)

export const editTaskAction = async (id: number, data?: any) =>
  editTask(id, data)
