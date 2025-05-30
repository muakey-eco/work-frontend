import { request, requestWithAuthorized } from './request'
import { getSession } from './session'

export const isLoggedIn = async () => {
  const session = await getSession()

  return session.isLoggedIn
}

export const changeLoggedInDate = async () => {
  const session = await getSession()

  const today = new Date().getDate()

  session.firstLoginDate = today
  await session.save()
}

export const loginWidthCredentials = async (data: any) => {
  const { headers: clientHeaders, ...loginData } = data

  return request('login', {
    method: 'POST',
    data: loginData,
    headers: clientHeaders,
  }).then(async (data) => {
    const { token, errors } = data

    const session = await getSession()

    const accessToken = token ? token.split('|')[1] : undefined

    session.accessToken = accessToken
    session.isLoggedIn = !!accessToken
    await session.save()

    return { token: accessToken, errors }
  })
}

export const logout = async () => {
  const session = await getSession()

  session.accessToken = undefined
  session.isLoggedIn = false

  await session.save()
}

export const getIp = async () => {
  return await request('test')
}

export const getLoginHistory = async (page: number, pageSize: number) => {
  return await requestWithAuthorized(
    `login-histories?page=${page}&per_page=${pageSize}`,
  )
    .then((data) => data)
    .catch(() => null)
}
