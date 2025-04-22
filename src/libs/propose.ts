import { requestWithAuthorized } from './request'

export const getProposes = async (query?: any) =>
  requestWithAuthorized('proposes?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])

export const getProposesWithQuery = async (query?: any) =>
  requestWithAuthorized('proposes?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])

export const getProposeById = async (id: number) =>
  requestWithAuthorized(`proposes/${id}`)
    .then((data) => data)
    .catch(() => [])

export const addPropose = async (data: any) =>
  requestWithAuthorized('proposes', {
    method: 'POST',
    data,
  }).then((data) => data)

export const updatePropose = async (id: number, data: any) =>
  requestWithAuthorized(`proposes/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deletePropose = async (id: number) =>
  requestWithAuthorized(`proposes/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const getProposeCategories = async () =>
  requestWithAuthorized('propose-categories')
    .then((data) => data)
    .catch(() => [])

export const addProposeCategory = async (data: any) =>
  requestWithAuthorized('propose-categories', {
    method: 'POST',
    data,
  }).then((data) => data)

export const updateProposeCategory = async (id: number, data: any) =>
  requestWithAuthorized(`propose-categories/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deleteProposeCategory = async (id: number) =>
  requestWithAuthorized(`propose-categories/${id}`, {
    method: 'DELETE',
  }).then((data) => data)
