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
    <div className="scrollbar-hide !h-[664px] overflow-y-auto">
      {todos.length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có việc nào
        </div>
      ) : (
        Array.from(todos)?.map((todo: any) => (
          <Link
            key={todo.id}
            href={`/workflows/${todo?.workflow_id}`}
            className="!line-clamp-1 text-[12px] text-[#555]"
          >
            <div className="group flex w-full items-start gap-[12px] !px-6 py-2 !text-[14px] !text-[#000] hover:bg-[#F5FCFF]">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="!line-clamp-1 text-[14px] font-[600]">
                    {todo?.name}
                  </p>
                </div>
                <p className="!line-clamp-1 text-[12px] text-[#555]">
                  {todo?.workflow_name}
                </p>
                <div className="flex items-center justify-between !text-[12px] text-[#555]">
                  <span>
                    {dayjs(todo?.created_at).format('HH:mm DD/MM/YYYY')}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )

  const overdueList = (
    <div className="scrollbar-hide !h-[664px] overflow-y-auto">
      {Array.from(todos).filter((todo: any) => todo?.status === 'overdue')
        .length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có việc nào
        </div>
      ) : (
        Array.from(todos)
          .filter((todo: any) => todo?.status === 'overdue')
          .map((todo: any) => (
            <div
              key={todo.id}
              className="group flex w-full items-start gap-[12px] !px-6 py-2 !text-[14px] !text-[#000] hover:bg-[#F5FCFF]"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="!line-clamp-1 text-[14px] font-[600]">
                    {todo?.name}
                  </p>
                  <div className="size-[10px] rounded-full bg-[#ff4d4f]" />
                </div>
                <Link
                  href={`/workflows/${todo?.workflow_id}`}
                  className="!line-clamp-1 text-[12px] text-[#555]"
                >
                  {todo?.workflow_name}
                </Link>
                <div className="flex items-center justify-between !text-[12px] text-[#555]">
                  <span>
                    {dayjs(todo?.created_at).format('HH:mm DD/MM/YYYY')}
                  </span>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  )

  const popoverContent = (
    <div className="!z-[1000] !w-[549px] overflow-y-auto !rounded-3xl !pt-5">
      <div className="flex items-center justify-between px-6">
        <span className="text-lg font-semibold">Nhắc việc</span>
        <Button
          type="text"
          onClick={handleClose}
          className="cursor-pointer items-center text-2xl text-gray-400 hover:text-gray-600"
          style={{ lineHeight: 1 }}
          icon={<CloseOutlined />}
        />
      </div>

      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          marginBottom: 0,
          fontSize: 14,
        }}
        tabBarExtraContent={{
          right: (
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#f0f0f0]" />
          ),
        }}
        items={[
          {
            key: '1',
            label: `Hôm nay (${todos.length})`,
            children: reminderList,
          },
          {
            key: '2',
            label: `Quá hạn (${Array.from(todos).filter((todo: any) => todo?.status === 'overdue').length})`,
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
          width: 549,
          marginLeft: -7,
        }}
      >
        <FloatButton
          icon={<FileDoneOutlined size={24} />}
          type="primary"
          style={{ bottom: 32, left: 35, width: 52, height: 52, margin: 8 }}
          badge={{
            count: todos?.length,
            color: 'red',
            style: {
              fontSize: 14,
              border: 'none',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            },
          }}
          shape="circle"
        />
      </Popover>
    </>
  )
}

export default ViewWorkFB
