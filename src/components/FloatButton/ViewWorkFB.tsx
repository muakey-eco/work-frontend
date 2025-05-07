'use client'
import { CloseOutlined, FileDoneOutlined } from '@ant-design/icons'
import { Button, FloatButton, Popover, Tabs } from 'antd'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getTodosAction } from '../action'

type ViewWorkFBProps = {}

const ViewWorkFB: React.FC<ViewWorkFBProps> = (props) => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTodosAction().then((res) => setTodos(res))
    setLoading(false)
  }, [])

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const reminderList = (
    <div className="!h-[664px] overflow-y-auto">
      {todos.length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có việc nào
        </div>
      ) : (
        todos.map((todo: any, index: number) => (
          <div
            key={todo.id}
            className={
              index === 0
                ? 'border-b border-gray-200 pb-2'
                : 'border-b border-gray-200 py-2'
            }
          >
            <div className="!text-[14px] font-bold">{todo?.name}</div>
            <Link
              href={`/workflow/${todo?.workflow_id}`}
              className="!text-[12px]"
            >
              {todo?.workflow_name}
            </Link>
            <div className="!text-[12px] text-gray-400">
              {dayjs(todo?.created_at).format('HH:mm - DD/MM/YYYY')}
            </div>
          </div>
        ))
      )}
    </div>
  )

  const overdueList = (
    <div className="!h-[664px] overflow-y-auto">
      {todos.filter((todo: any) => todo?.status === 'overdue').length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có việc nào
        </div>
      ) : (
        todos
          .filter((todo: any) => todo?.status === 'overdue')
          .map((todo: any, index: number) => (
            <div
              key={todo.id}
              className={
                index === 0
                  ? 'border-b border-gray-200 pb-2'
                  : 'border-b border-gray-200 py-2'
              }
            >
              <div className="flex items-center justify-between !text-[14px] font-bold">
                {todo?.name}
                <span className="text-2xl text-red-500">•</span>
              </div>
              <Link
                href={`/workflow/${todo?.workflow_id}`}
                className="!text-[12px]"
              >
                {todo?.workflow_name}
              </Link>
              <div className="!text-[12px] text-gray-400">
                {dayjs(todo?.created_at).format('HH:mm - DD/MM/YYYY')}
              </div>
            </div>
          ))
      )}
    </div>
  )

  const popoverContent = (
    <div className="!h-[664x] !w-[501px] overflow-y-auto !rounded-2xl !pt-5">
      <div className="flex items-center justify-between px-6">
        <span className="text-lg font-semibold">Nhắc việc</span>
        <Button
          type="text"
          onClick={handleClose}
          className="cursor-pointer text-2xl text-gray-400 hover:text-gray-600"
          style={{ lineHeight: 1 }}
          icon={<CloseOutlined />}
        />
      </div>

      <Tabs
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: `Hôm nay (${todos.length})`,
            children: reminderList,
          },
          {
            key: '2',
            label: `Quá hạn (${todos.filter((todo: any) => todo?.status === 'overdue').length})`,
            children: overdueList,
          },
        ]}
      />
    </div>
  )
  return (
    <>
      <Popover
        placement="topLeft"
        trigger="click"
        content={popoverContent}
        open={open}
        onOpenChange={handleOpenChange}
        overlayInnerStyle={{
          padding: 0,
          borderRadius: 24,
          width: 501,
          marginLeft: -7,
        }}
      >
        <FloatButton
          icon={<FileDoneOutlined />}
          type="primary"
          className="!bottom-8 !left-8"
          badge={{
            count: todos?.length,
            color: 'red',
          }}
          shape="circle"
        />
      </Popover>
    </>
  )
}

export default ViewWorkFB
