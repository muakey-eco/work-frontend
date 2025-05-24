'use server'

import { requestWithAuthorized } from './request'

export const getDepartments = async () =>
  requestWithAuthorized('departments')
    .then((data) => data)
    .catch(() => [])
export const getMembersByDepartmentId = async (department_id: string) =>
  requestWithAuthorized(`departments/${department_id}/members`)
    .then((data) => data)
    .catch(() => [])

export const getDepartmentById = async (id: number) =>
  requestWithAuthorized(`departments/${id}`)
    .then((data) => data)
    .catch(() => [])

export const addDepartment = async (data: any) =>
  requestWithAuthorized('departments', {
    method: 'POST',
    data,
  }).then((data) => data)

export const updateDepartment = async (id: number, data: any) =>
  requestWithAuthorized(`departments/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deleteDepartment = async (id: number) =>
  requestWithAuthorized(`departments/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const addDepartmentSalary = async (data: any) =>
  requestWithAuthorized(`job-positions`, {
    method: 'POST',
    data,
  }).then((data) => data)
