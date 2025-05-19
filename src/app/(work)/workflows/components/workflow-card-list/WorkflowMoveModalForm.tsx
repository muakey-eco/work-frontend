import { FolderFilled } from '@ant-design/icons'
import { App, Modal, Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { moveWorkflowAction } from '../workflow-list/action'

interface WorkflowCategory {
  id: number
  name: string
}

interface Workflow {
  id: number
  name: string
  workflow_category_id: number
}

interface WorkflowMoveModalFormProps {
  children?: React.ReactNode
  workflow?: Workflow
  cate?: {
    label: string
  }
  workflowCategories?: WorkflowCategory[]
  onSuccess?: () => void
}

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingTop: 16,
}

const WorkflowMoveModalForm: React.FC<WorkflowMoveModalFormProps> = ({
  children,
  workflow,
  cate,
  workflowCategories = [],
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [value, setValue] = useState(workflow?.workflow_category_id)
  const router = useRouter()
  const { message } = App.useApp()

  const showModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleOk = useCallback(async () => {
    if (!workflow?.id || !value) return

    try {
      const res = await moveWorkflowAction(workflow.id, {
        workflow_category_id: value,
      })

      if (res) {
        message.success('Di chuyển thành công')
        setIsModalOpen(false)
        onSuccess?.()
        router.refresh()
      } else {
        message.error('Di chuyển thất bại')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi di chuyển')
    }
  }, [workflow?.id, value, message, router, onSuccess])

  const onChange = useCallback((e: RadioChangeEvent) => {
    setValue(e.target.value)
  }, [])

  const options = useMemo(
    () =>
      workflowCategories.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [workflowCategories],
  )

  return (
    <>
      <div onClick={showModal}>{children}</div>
      <Modal
        title={`Di chuyển "${workflow?.name}"`}
        centered
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        okText="Di chuyển"
        cancelText="Hủy"
        onCancel={handleCancel}
      >
        <p className="flex items-center gap-2 text-[14px] leading-[22px]">
          Vị trí hiện tại:{' '}
          <span className="ms-4 flex gap-2 rounded-md border-1 border-[#434343] px-2 py-1">
            <FolderFilled className="!text-[#434343]" />
            {cate?.label}
          </span>
        </p>
        <Radio.Group
          style={style}
          onChange={onChange}
          value={value}
          options={options}
        />
      </Modal>
    </>
  )
}

export default WorkflowMoveModalForm
