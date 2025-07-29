import { getYoutubeChannels, getYoutubeUploads } from '@/libs/youtube'
import ManageVideoHeader from './ManageVideoHeader'
import TiktokUploadsTable from './TiktokUploadsTable'
import YoutubeChannelsTable from './YoutubeChannelsTable'
import YoutubeUploadsTable from './YoutubeUploadsTable'

const ManageVideo = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>
}) => {
  const { tab } = await searchParams

  const activeTab = (tab as string) || 'youtube-channels'
  const [YoutubeChannelsData, YoutubeUploadsData] = await Promise.all([
    getYoutubeChannels(),
    getYoutubeUploads(),
  ])

  const tabComponents = {
    'youtube-channels': <YoutubeChannelsTable data={YoutubeChannelsData} />,
    'youtube-uploads': <YoutubeUploadsTable data={YoutubeUploadsData} />,
    'tiktok-uploads': <TiktokUploadsTable data={[]} />,
  }

  return (
    <>
      <ManageVideoHeader />
      {tabComponents[activeTab as keyof typeof tabComponents] ||
        tabComponents['youtube-channels']}
    </>
  )
}

export default ManageVideo
