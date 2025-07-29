import { requestWithAuthorized } from './request'

export const createChannel = async (data: any) => {
  return await requestWithAuthorized('youtube-channels', {
    method: 'POST',
    data,
  })
}
export const createVideo = async (data: any) => {
  return await requestWithAuthorized('youtube-uploads', {
    method: 'POST',
    data,
  })
}
export const getYoutubeChannels = async () => {
  return await requestWithAuthorized('youtube-channels', {
    method: 'GET',
  })
}
export const deleteYoutubeUpload = async (id: number) => {
  return await requestWithAuthorized(`youtube-uploads/${id}`, {
    method: 'DELETE',
  })
}
export const getYoutubeUploads = async () => {
  return await requestWithAuthorized('youtube-uploads', {
    method: 'GET',
  })
}

export const deleteYoutubeChannel = async (id: number) => {
  return await requestWithAuthorized(`youtube-channels/${id}`, {
    method: 'DELETE',
  })
}
export const getChannelSuggestions = async (query: string) => {
  return await requestWithAuthorized(`youtube-channels?search=${query}`, {
    method: 'GET',
  })
}
