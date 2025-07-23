'use client'

import { Select } from 'antd'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface SuggestionOption {
  label: string
  value: string
}

interface ApiRequestData {
  context: {
    client: {
      clientName: number
      clientVersion: string
      hl: string
      gl: string
      experimentsToken: string
      utcOffsetMinutes: number
      rolloutToken: string
      userInterfaceTheme: string
      screenWidthPoints: number
      screenHeightPoints: number
      screenPixelDensity: number
      screenDensityFloat: number
    }
    request: {
      returnLogEntry: boolean
      internalExperimentFlags: any[]
      eats: string
      sessionInfo: {
        token: string
      }
      consistencyTokenJars: any[]
    }
    user: {
      delegationContext: {
        externalChannelId: string
        roleType: {
          channelRoleType: string
        }
      }
      serializedDelegationContext: string
    }
    clickTracking?: {
      visualElement: {
        veType: number
      }
    } | null
    clientScreenNonce: string
  }
  userInput: string
}

const GameTitleSuggestion = ({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastQueryRef = useRef('')

  const createRequestData = (userInput: string): ApiRequestData => ({
    context: {
      client: {
        clientName: 62,
        clientVersion: '1.20250715.05.00',
        hl: 'vi',
        gl: 'VN',
        experimentsToken: '',
        utcOffsetMinutes: 420,
        rolloutToken: 'CLe8zdS51cPH6QEQo8Pb0snbiwMYi5-Pku7AjgM%3D',
        userInterfaceTheme: 'USER_INTERFACE_THEME_LIGHT',
        screenWidthPoints: 1920,
        screenHeightPoints: 945,
        screenPixelDensity: 1,
        screenDensityFloat: 1,
      },
      request: {
        returnLogEntry: true,
        internalExperimentFlags: [],
        eats: 'AWSNWa28eJ874jBCsEtu1IV_dBFjFSRZN2nocP1NmmTSxr3ElCnnG4TYUXg4NYCiBIHhONYm5elzdIyE7OMBdEdFQN9Cj8lodJLpbHkeul5sR0KlHLav7Ru7fuZT',
        sessionInfo: {
          token:
            'AVVfbmEaQomUjNdoOn-OLGWcplpLIRHSdHwpQOyrOa9nxc3TYJTrA_40w0-yRt7Jg0JttxgiqQGm1PGLvgAsUqdrIXrpyOI7ZZfB6ko4kIRqSNHxefCFczTjhY1a5IRyxwhcvTMKWgdyLUVK5n27S93rKNNjxj6I1w==',
        },
        consistencyTokenJars: [],
      },
      user: {
        delegationContext: {
          externalChannelId: 'UCwKHy_5_E3axnIyq6_94sQw',
          roleType: {
            channelRoleType: 'CREATOR_CHANNEL_ROLE_TYPE_OWNER',
          },
        },
        serializedDelegationContext: 'EhhVQ3dLSHlfNV9FM2F4bkl5cTZfOTRzUXcqAggI',
      },
      clickTracking: {
        visualElement: {
          veType: 31402,
        },
      },
      clientScreenNonce: 'ZXKdn8J8V7TcZS0O',
    },
    userInput,
  })

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery === lastQueryRef.current) return

    lastQueryRef.current = searchQuery
    setLoading(true)
    setError(null)

    try {
      const requestData = createRequestData(searchQuery)

      const response = await fetch('/api/game-title-suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const formattedSuggestions = (data.suggestions || []).map(
        (suggestion: string) => ({
          label: suggestion,
          value: suggestion,
        }),
      )

      setSuggestions(formattedSuggestions)
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      setError(
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải gợi ý',
      )
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    [fetchSuggestions],
  )

  useEffect(() => {
    debouncedFetchSuggestions(query)

    return () => {
      debouncedFetchSuggestions.cancel()
    }
  }, [query, debouncedFetchSuggestions])

  const handleSearch = (value: string) => {
    setQuery(value)
  }

  const handleSelectChange = (val: string) => {
    onChange?.(val)
  }

  return (
    <Select
      allowClear
      showSearch
      style={{ width: '100%' }}
      placeholder="Chọn tiêu đề trò chơi"
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

export default GameTitleSuggestion
