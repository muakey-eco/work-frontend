export type Notification = {
  id: number
  title: string
  message: string
  created_at: string
  seen: number
  link?: string
  status?: string
  manager?: {
    full_name: string
    avatar?: string
  }
}