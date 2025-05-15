import { getImportantNotification } from '@/libs/data'
import NotificationTable from './NotificationTable'
import SettingHeader from './SettingHeader'

const SettingINotification = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const include = (await searchParams).include
  const notifications = await getImportantNotification(include)
  return (
    <div >
      <SettingHeader notifications={notifications} />
      <NotificationTable data={notifications} />
    </div>
  )
}

export default SettingINotification
