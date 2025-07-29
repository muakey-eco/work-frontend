'use server'

import { deleteYoutubeChannel, deleteYoutubeUpload } from '@/libs/youtube'
import { revalidatePath } from 'next/cache'

export const deleteYoutubeUploadAction = async (id: number) => {
  await deleteYoutubeUpload(id)
  revalidatePath('/department/[department_id]/manage-video')
}

export const deleteYoutubeChannelAction = async (id: number) => {
  await deleteYoutubeChannel(id)
}
