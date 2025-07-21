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
export const getChannels = async () => {
  return await requestWithAuthorized('youtube-channels', {
    method: 'GET',
  })
}
export const getChannelSuggestions = async (query: string) => {
  return await requestWithAuthorized(`youtube-channels?search=${query}`, {
    method: 'GET',
  })
}
