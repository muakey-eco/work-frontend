import { NextRequest, NextResponse } from 'next/server'

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
    clickTracking: {
      visualElement: {
        veType: number
      }
    }
    clientScreenNonce: string
  }
  userInput: string
}

interface GameTitle {
  title: string
  year?: string
  mid: string
}

interface YouTubeResponse {
  responseContext?: any
  gameTitles?: GameTitle[]
  suggestions?: string[]
  results?: any[]
}

export async function POST(request: NextRequest) {
  let body: ApiRequestData = { context: {} as any, userInput: '' }

  try {
    body = await request.json()

    const { userInput } = body

    if (!userInput || userInput.trim() === '') {
      return NextResponse.json({
        suggestions: [],
        message: 'User input is required',
      })
    }

    // Gọi YouTube Gaming API
    const youtubeResponse = await fetch(
      'https://studio.youtube.com/youtubei/v1/gaming/game_title?alt=json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'application/json',
          'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
          Origin: 'https://studio.youtube.com',
          Referer: 'https://studio.youtube.com/',
        },
        body: JSON.stringify({
          context: body.context,
          userInput: userInput,
        }),
      },
    )

    if (!youtubeResponse.ok) {
      console.error(
        'YouTube API error:',
        youtubeResponse.status,
        youtubeResponse.statusText,
      )
      throw new Error(`YouTube API error: ${youtubeResponse.status}`)
    }

    const youtubeData: YouTubeResponse = await youtubeResponse.json()

    // Extract gameTitles from YouTube response
    let suggestions: string[] = []

    if (youtubeData.gameTitles && Array.isArray(youtubeData.gameTitles)) {
      // Convert GameTitle objects to strings
      suggestions = youtubeData.gameTitles.map((game: GameTitle) => {
        const title = game.title || ''
        const year = game.year ? ` (${game.year})` : ''
        return `${title}${year}`
      })
    } else if (youtubeData.suggestions) {
      suggestions = youtubeData.suggestions
    } else if (youtubeData.results) {
      suggestions = youtubeData.results.map((item: any) => {
        if (typeof item === 'string') return item
        return item.title || item.name || String(item)
      })
    } else {
      // Fallback nếu không có suggestions từ YouTube API
      suggestions = []
    }

    // Limit to 10 suggestions
    const finalSuggestions = suggestions.slice(0, 10)

    return NextResponse.json({
      suggestions: finalSuggestions,
      success: true,
      userInput,
      timestamp: new Date().toISOString(),
      source: 'youtube-gaming-api',
    })
  } catch (error) {
    console.error('Error processing game title suggestion:', error)

    // Fallback to mock data if YouTube API fails
    const mockSuggestions = [
      'Valorant',
      'League of Legends',
      'Counter-Strike 2',
      'Dota 2',
      'Fortnite',
      'PUBG',
      'Apex Legends',
      'Overwatch 2',
      'Rocket League',
      'FIFA 24',
    ]
      .filter((game) =>
        game.toLowerCase().includes(body.userInput?.toLowerCase() || ''),
      )
      .slice(0, 10)

    return NextResponse.json({
      suggestions: mockSuggestions,
      success: false,
      error: 'YouTube API unavailable, using fallback data',
      userInput: body.userInput,
      timestamp: new Date().toISOString(),
      source: 'fallback',
    })
  }
}
