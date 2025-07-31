'use client'

import { getChannelSuggestionsAction } from '@/components/action'
import { Select } from 'antd'
import debounce from 'lodash/debounce'
import { useCallback, useMemo, useRef, useState } from 'react'

interface SuggestionOption {
  label: string
  value: string
  id: string
}

const NameTitleSuggestion = ({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string, id: string) => void
}) => {
  const [suggestions, setSuggestions] = useState<SuggestionOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lastQueryRef = useRef('')

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim()
    // if (!trimmed || trimmed === lastQueryRef.current) return

    lastQueryRef.current = trimmed
    setLoading(true)
    setError(null)

    try {
      const data = await getChannelSuggestionsAction(trimmed)
      const formatted = (data || []).map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item.id,
      }))
      setSuggestions(formatted)
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      setError(err instanceof Error ? err.message : 'Lỗi khi tải gợi ý')
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce fetchSuggestions trong 400ms
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 100),
    [fetchSuggestions],
  )

  const handleSearch = (value: string) => {
    debouncedFetchSuggestions(value)
  }

  const handleSelectChange = (val: string) => {
    const selected = suggestions.find((item) => item.value === val)
    onChange?.(val, selected?.id || '')
  }

  return (
    <Select
      allowClear
      showSearch
      style={{ width: '100%' }}
      placeholder="Nhập tên kênh"
      value={value}
      onChange={handleSelectChange}
      onSearch={handleSearch}
      options={suggestions}
      loading={loading}
      notFoundContent={error ? `Lỗi: ${error}` : 'Không tìm thấy gợi ý'}
      filterOption={false}
    />
  )
}

export default NameTitleSuggestion
