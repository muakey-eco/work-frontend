import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { input } = req.body

  try {
    const ytRes = await fetch(
      'https://studio.youtube.com/youtubei/v1/gaming/game_title?alt=json',
      {
        method: 'POST',
        credentials: 'include', // để gửi cookie nếu cùng origin
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'SAPISIDHASH ...', 
          'X-Goog-AuthUser': '0',
          'X-Goog-Visitor-Id': 'CgtzNlhCWTFGSmNQZy...gFw%3D%3D',
          Origin: 'https://studio.youtube.com',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 62,
              clientVersion: '1.20250715.05.00',
              hl: 'vi',
              gl: 'VN',
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
              serializedDelegationContext:
                'EhhVQ3dLSHlfNV9FM2F4bkl5cTZfOTRzUXcqAggI',
            },
            clickTracking: {
              visualElement: {
                veType: 31402,
              },
            },
            clientScreenNonce: 'ZXKdn8J8V7TcZS0O',
          },
          userInput: input,
        }),
      },
    )

    const data = await ytRes.json()
    res.status(200).json({ suggestions: data?.suggestions || [] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi lấy tiêu đề game' })
  }
}
