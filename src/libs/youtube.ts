import { requestWithAuthorized } from './request'

//GET
export const getYoutubeChannels = async () => {
  return await requestWithAuthorized('youtube-channels')
    .then((data) => data)
    .catch(() => [])
}

export const getYoutubeUploads = async () => {
  return await requestWithAuthorized('youtube-uploads')
    .then((data) => data)
    .catch(() => [])
}

export const getChannelSuggestions = async (query: string) => {
  return await requestWithAuthorized(`youtube-channels?search=${query}`)
    .then((data) => data)
    .catch(() => [])
}

//POST
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

//PUT
export const updateChannel = async (id: number, data: any) => {
  return await requestWithAuthorized(`youtube-channels/${id}`, {
    method: 'PUT',
    data,
  })
}

export const updateVideo = async (id: number, data: any) => {
  return await requestWithAuthorized(`youtube-uploads/${id}`, {
    method: 'PUT',
    data,
  })
}

//DELETE
export const deleteYoutubeUpload = async (id: number) => {
  return await requestWithAuthorized(`youtube-uploads/${id}`, {
    method: 'DELETE',
  })
}

export const deleteYoutubeChannel = async (id: number) => {
  return await requestWithAuthorized(`youtube-channels/${id}`, {
    method: 'DELETE',
  })
}
