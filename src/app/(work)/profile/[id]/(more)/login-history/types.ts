export enum PaginationType {
  DEFAULT = 'DEFAULT',
}

export const PaginationMap = {
  [PaginationType.DEFAULT]: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
}

export const defaultPagination = PaginationMap[PaginationType.DEFAULT]
