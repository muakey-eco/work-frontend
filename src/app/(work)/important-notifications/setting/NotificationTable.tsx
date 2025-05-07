import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import type { TableColumnsType, TableProps } from 'antd'
import { App, Button, Table } from 'antd'
import React from 'react'
import INotificationModalForm from '../components/INotificationModalForm'
import { cardData } from '../data'
const columns: TableColumnsType<any> = [
  {
    title: 'Thông báo',
    dataIndex: 'notification',
    width: 676,
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    width: 692,
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: 128,
  },
]

const onChange: TableProps<any>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra,
) => {
  console.log('params', pagination, filters, sorter, extra)
}

const NotificationTable: React.FC<{ data: any[] }> = ({ data }) => {
  const { modal } = App.useApp()
  const dataConfig = cardData.map((item) => ({
    key: item.id,
    notification: (
      <div className="flex items-center gap-2">
        <img
          src={item.image}
          alt=""
          style={{
            minWidth: 88,
            height: 42,
            borderRadius: 8,
          }}
          className="object-cover"
        />
        <div>
          <p className="text-[14px] font-[600]">{item.title}</p>
          <p className="line-clamp-1 text-[12px] font-[400] text-gray-500">
            {item.description}
          </p>
        </div>
      </div>
    ),
    time: item.time,
    action: (
      <div className="flex items-center gap-2">
        <INotificationModalForm action="update">
          <Button
            type="text"
            className="!text-blue-500"
            icon={<EditOutlined style={{ fontSize: 20 }} />}
          />
        </INotificationModalForm>
        <Button
          type="text"
          className="!text-yellow-500"
          icon={<EyeInvisibleOutlined style={{ fontSize: 20 }} />}
          onClick={() => {
            modal.confirm({
              title: 'Bạn có chắc chắn muốn ẩn thông báo này không?',
              okText: 'Ẩn',
              cancelText: 'Hủy',
              content:
                'User sẽ không thể xem được thông báo này, bạn có chắc chắn muốn ẩn ?',
              onOk: () => {
                console.log('ok')
              },
            })
          }}
        />
        <Button
          type="text"
          className="!text-red-500"
          icon={<DeleteOutlined style={{ fontSize: 20 }} />}
          onClick={() => {
            modal.confirm({
              title: 'Bạn có chắc chắn muốn xóa thông báo này không?',
              okText: 'Xóa',
              cancelText: 'Hủy',
              icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
              content:
                'Thông báo này sẽ không thể khôi phục, bạn có chắc chắn muốn xóa ?',
              onOk: () => {
                console.log('ok')
              },
            })
          }}
        />
      </div>
    ),
  }))

  return (
    <div className="h-[calc(100vh-89px)] bg-[#F6F6F6] p-[16px]">
      <Table<any>
        columns={columns}
        dataSource={dataConfig}
        onChange={onChange}
      />
    </div>
  )
}

export default NotificationTable
