import getYoutubeVideoId from '@/libs/utils'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const getThumbnailFromYoutubeUrl = (url: string, size?: string) => {
  if (!url) return ''

  const videoId = getYoutubeVideoId(url)
  size = size === null ? 'big' : size

  if (size === 'small') {
    return `https://img.youtube.com/vi/${videoId}/2.jpg`
  }

  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

export const formatCurrency = (value: any) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const updateQueryParam = (
  searchParams: URLSearchParams,
  key: string,
  value: string | null,
) => {
  const params = new URLSearchParams(searchParams.toString())

  if (value) {
    params.set(key, value) // Thêm hoặc cập nhật param
  } else {
    params.delete(key) // Nếu giá trị null hoặc rỗng, xóa param đó
  }

  return `?${params.toString()}`
}

export const updateQueryParams = (
  searchParams: URLSearchParams,
  updates: Record<string, string | null>,
) => {
  const params = new URLSearchParams(searchParams.toString())

  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
  })

  return `?${params.toString()}`
}

export const mapAsFile = (files: any[]) => {
  return files.map((file) => file.originFileObj || file)
}

export const convertToSlug = (text: string): string => {
  return text
    .normalize('NFD') // Tách dấu (é -> e + ́)
    .replace(/[\u0300-\u036f]/g, '') // Xoá dấu
    .toLowerCase() // Chuyển lowercase
    .trim() // Xoá khoảng trắng đầu/cuối
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch ngang
    .replace(/[^\w\-]+/g, '') // Xoá ký tự đặc biệt (ngoại trừ gạch ngang)
    .replace(/\-\-+/g, '-') // Gộp nhiều gạch thành một
}

export const handleUploadChange = (
  info: any,
  setUploadErrors: (errors: string[]) => void,
) => {
  const errors: string[] = []

  info.fileList.forEach((file: any) => {
    // Ví dụ: kiểm tra dung lượng quá lớn (>2MB)
    if (file.size / 1024 / 1024 > 2) {
      errors.push(`${file.name} - File too large (max 2MB)`)
    }

    if (file.status === 'error') {
      errors.push(`${file.name} - Upload failed`)
    }
  })

  setUploadErrors(errors)
}
