import { requestWithAuthorized } from "./request"

export const getLoginHistory = async (page: number) => {
    return await requestWithAuthorized(`login-histories?page=${page}`)
        .then((data) => data)
        .catch(() => null)
}