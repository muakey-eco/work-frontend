'use client'

import { MarkTaskModalForm } from '@/components'
import MemberList from '@/components/MemberList'
import TaskModalForm from '@/components/TaskModalForm'
import { assignTaskWithoutWorkAction } from '@/components/action'
import {
  DoubleRightOutlined,
  MenuOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { App, Button, Dropdown, Input, MenuProps, Modal, Tag } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { editTaskAction } from '../../actions'
import { deleteTaskAction, moveStageAction } from '../action'

type PageHeaderActionProps = {
  options?: any
}

const PageHeaderAction: React.FC<PageHeaderActionProps> = ({ options }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [assignConfirmOpen, setAssignConfirmOpen] = useState(false)
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const { message, modal } = App.useApp()
  const router = useRouter()

  const { stages, user, failedStageId, completedStageId, ...rest } = options

  const handleStageClick = async (stage: any) => {
    if (rest?.task?.stage_id === stage?.id) return

    if (!rest?.task.account_id && [1].includes(stage?.index)) {
      message.error('Nhiệm vụ chưa được giao.')
      return
    }

    if (!String(user?.role).toLocaleLowerCase().includes('quản trị')) {
      if (rest?.task.account_id !== user?.id) {
        message.error(
          'Không thể kéo nhiệm vụ của người khác hoặc chưa được giao.',
        )
        return
      }
    }

    try {
      const { message: msg, errors } = await moveStageAction(
        rest?.task?.id,
        stage?.id,
      )

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Chuyển giai đoạn thành công')
      router.refresh()
      setDropdownOpen(false)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleAssignWithoutWork = async (id: number) => {
    try {
      const { message: msg, errors } = await assignTaskWithoutWorkAction(
        options?.task?.id,
        {
          account_id: id,
        },
      )

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Nhiệm vụ đã được giao.')
      setAssignConfirmOpen(false)
      router.refresh()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleRemoveExecutor = async (id: number) => {
    if (!String(options?.role).toLowerCase().includes('quản trị')) {
      if (options?.user?.id !== options?.task.account_id) {
        message.error('Không thể gỡ nhiệm vụ của người khác.')
        return
      }
    }

    try {
      const { message: msg, errors } = await editTaskAction(id, {
        account_id: null,
        started_at: null,
      })

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Đã gỡ người thực thi.')
      setRemoveConfirmOpen(false)
      router.refresh()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const { error, success } = await deleteTaskAction(id || 0)

      if (error) {
        message.error(error)

        return
      }

      message.success(success)
      router.push(`/workflows/${options?.workflowId}`)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleAssign = async (id: number) => {
    try {
      const { message: msg, errors } = await editTaskAction(rest?.task?.id, {
        account_id: id,
      })

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Nhận thành công.')
      setAssignConfirmOpen(false)
      router.refresh()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const stageItems: MenuProps['items'] = stages?.map(
    (s: any, index: number) => ({
      key: index,
      label: (
        <div
          className={clsx({
            'text-[#d96c6c]': s?.index === 0,
            'text-[#42bb14]': s?.index === 1,
          })}
          onClick={() => handleStageClick(s)}
        >
          {s?.name}
        </div>
      ),
    }),
  )

  const items: MenuProps['items'] = [
    {
      key: 1,
      label: (
        <TaskModalForm
          title="CHỈNH SỬA NHIỆM VỤ"
          initialValues={{
            ...options?.task,
            members: options?.members,
            userId: user?.id,
          }}
          action="edit"
        >
          Chỉnh sửa nhiệm vụ
        </TaskModalForm>
      ),
    },
    {
      key: 2,
      label: (
        <div
          onClick={(e) => {
            e.preventDefault()
            setAssignConfirmOpen(true)
          }}
        >
          Giao
        </div>
      ),
    },
    {
      key: 3,
      label: (
        <div
          onClick={() => {
            modal.confirm({
              title: 'Xác nhận gỡ người thực thi của nhiệm vụ này?',
              open: removeConfirmOpen,
              width: 600,
              onCancel: () => setRemoveConfirmOpen(false),
              onOk: () => handleRemoveExecutor(options?.task?.id),
            })
          }}
        >
          Gỡ người thực thi
        </div>
      ),
    },
    {
      key: 4,
      label: (
        <MarkTaskModalForm
          options={{
            ...rest,
            stageId: failedStageId,
          }}
        >
          Đánh dấu thất bại
        </MarkTaskModalForm>
      ),
    },
    {
      key: 5,
      label: (
        <div
          className="text-[#cc1111]"
          onClick={() => {
            modal.confirm({
              title: 'Xác nhận xóa nhiệm vụ này?',
              onOk: () => handleDelete(options?.task?.id),
            })
          }}
        >
          Xóa nhiệm vụ
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="flex items-center gap-[8px]">
        {!options?.task?.account_id
          ? !options?.task?.completed_at && (
              <Button
                type="primary"
                onClick={() => {
                  modal.confirm({
                    title: 'Bạn muốn nhận công việc này?',
                    onOk: () => handleAssignWithoutWork(user?.id || 0),
                  })
                }}
              >
                Nhận
              </Button>
            )
          : user?.id === options?.task?.account_id &&
            (options?.task?.started_at ? (
              <Tag
                className="mr-0! h-[32px]! rounded-[8px] px-[12px]! leading-[28px]!"
                color="processing"
                icon={<SyncOutlined />}
              >
                Đang làm
              </Tag>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  modal.confirm({
                    title: 'Bạn muốn nhận công việc này?',
                    onOk: () => handleAssign(user?.id || 0),
                  })
                }}
              >
                Bắt đầu
              </Button>
            ))}
        {!options?.task?.completed_at && (
          <MarkTaskModalForm
            options={{
              ...rest,
              stageId: completedStageId,
            }}
            mark="completed"
            reportRequired={options?.reportRequired}
          >
            <div className="cursor-pointer rounded-[8px] bg-[#D9F7BE] px-[16px] py-[5px] text-[14px] leading-[22px] font-[500] text-nowrap text-[#389E0D] brightness-100 transition-all duration-300 hover:brightness-95">
              Đánh dấu hoàn thành
            </div>
          </MarkTaskModalForm>
        )}
        {!!stages && stages?.length > 0 && (
          <Dropdown
            trigger={['click']}
            rootClassName="z-auto!"
            placement="bottomLeft"
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            menu={{ items: stageItems }}
          >
            <Button icon={<DoubleRightOutlined className="text-[16px]" />} />
          </Dropdown>
        )}
        <Dropdown
          trigger={['click']}
          rootClassName="z-auto!"
          placement="bottomLeft"
          menu={{ items }}
        >
          <Button icon={<MenuOutlined className="text-[16px]" />} />
        </Dropdown>
      </div>

      <Modal
        open={assignConfirmOpen}
        onCancel={() => setAssignConfirmOpen(false)}
        title="LỰA CHỌN NGƯỜI PHỤ TRÁCH NHIỆM VỤ NÀY"
        footer={<></>}
        width={500}
      >
        <div className="-mx-[24px] text-[#b1b1b1]">
          <div className="px-[20px]">
            <Input.Search placeholder="Tìm nhanh" />
          </div>
          <div className="divide-y divide-[#0000001a]">
            {options?.members && (
              <MemberList
                members={options?.members}
                onItemCLick={(userId) => handleAssignWithoutWork(userId)}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PageHeaderAction
