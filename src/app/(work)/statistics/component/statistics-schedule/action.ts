'use server'

import { getAccounts, getMyAccount } from '@/libs/data'
import { addTodo } from '@/libs/todos'

export const addTodoAction = async (data: any) => {
  return await addTodo(data)
}

export const getAccountsAction = async () => {
  return await getAccounts()
}
