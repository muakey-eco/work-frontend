'use client'

import { arrayMove } from '@/libs/utils'
import { CaretDownFilled } from '@ant-design/icons'
import { App, Dropdown, DropdownProps, MenuProps, Popconfirm } from 'antd'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { deleteStageByIdAction, editStageAction } from '../../../action'
import { StageContext } from '../WorkflowPageLayout'
import StageInstructionsModal from './StageInstructionsModal'
import StageModalForm from './StageModalForm'

type StageDropdownMenuProps = DropdownProps & {
  stage?: any
}

const StageDropdownMenu: React.FC<StageDropdownMenuProps> = ({
  stage,
  ...rest
}) => {
  const { stages, setStages } = useContext(StageContext)
  const { message } = App.useApp()

  const handleDelete = async () => {
    const stageId = Number(String(stage?.id).split('_').pop())

    try {
      const { error, success } = await deleteStageByIdAction(
        stage?.id ? stageId : 0,
      )

      if (error) {
        toast.error(error)
        return false
      }

      setStages((prev: any[]) => prev.filter((s: any) => s?.id !== stage?.id))

      toast.success(success)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 1,
      label: (
        <StageModalForm
          title={`Chỉnh sửa giai đoạn ${stage?.name}`}
          initialValues={stage}
          query={{
            stage_id: Number(String(stage?.id).split('_').pop()),
          }}
          action="edit"
        >
          Chỉnh sửa giai đoạn
        </StageModalForm>
      ),
    },
    {
      key: 2,
      label: 'Di chuyển',
      children: stages
        ?.filter((s: any) => ![0, 1].includes(s?.index) && s?.id !== stage?.id)
        ?.map((s: any, index: number) => ({
          key: `2-${index + 1}`,
          label: (
            <div
              key={s?.id}
              onClick={async (e) => {
                e.preventDefault()

                const oldIndex = stages?.findIndex(
                  (st: any) => st?.id === stage?.id,
                )
                const newIndex = stages?.findIndex(
                  (st: any) => st?.id === s?.id,
                )

                const toStage = stages?.find((st: any) => st?.id === s?.id)

                setStages(arrayMove(stages, oldIndex, newIndex))

                try {
                  const { message: msg, errors } = await editStageAction(
                    +String(stage?.id).split('_')[1],
                    {
                      index: toStage?.index,
                    },
                  )

                  if (errors) {
                    message.error(msg)
                    return
                  }
                } catch (error) {
                  throw new Error(String(error))
                }
              }}
            >
              {s?.index > stage?.index ? 'Trước' : 'Sau'}{' '}
              <span className="font-[500]">{s?.name}</span>
            </div>
          ),
        })),
    },
    {
      key: 6,
      label: (
        <StageInstructionsModal
          inititalValues={{
            description: stage?.description,
            stage_id: Number(String(stage?.id).split('_').pop()),
          }}
          onSubmit={(formData: any) => {
            setStages((prev: any[]) => {
              const newStages = [...prev]

              return newStages.map((s: any) => {
                if (s?.id === stage?.id) {
                  return {
                    ...stage,
                    ...formData,
                    id: stage?.id,
                  }
                }

                return s
              })
            })
          }}
        >
          Hướng dẫn hoàn thành các nhiệm vụ trong giai đoạn
        </StageInstructionsModal>
      ),
    },
    {
      key: 3,
      label: (
        <StageModalForm
          query={{
            right: 1,
            index: stage?.index,
          }}
        >
          Thêm 1 giai đoạn bên phải
        </StageModalForm>
      ),
    },
    {
      key: 4,
      label: (
        <StageModalForm
          query={{
            left: 1,
            index: stage?.index,
          }}
        >
          Thêm 1 giai đoạn bên trái
        </StageModalForm>
      ),
    },
    {
      key: 5,
      label: (
        <Popconfirm
          title={
            <div>
              Xác nhận xóa giai đoạn{' '}
              <span className="font-[500]">{stage?.name}</span>
            </div>
          }
          onConfirm={handleDelete}
        >
          Xóa giai đoạn
        </Popconfirm>
      ),
    },
  ]

  return (
    <Dropdown
      rootClassName="z-auto!"
      placement="bottomRight"
      trigger={['click']}
      menu={{ items, style: { width: 240 } }}
      {...rest}
    >
      <CaretDownFilled className="text-[12px]" />
    </Dropdown>
  )
}

export default StageDropdownMenu
