'use client'

import { EditOutlined } from '@ant-design/icons'
import { App, List, Switch } from 'antd'
import { useRouter } from 'next/navigation'
import CustomFieldDeleteButton from './CustomFieldDeleteButton'
import CustomFieldsModalForm from './CustomFieldsModalForm'
import { editWorkflowAction } from './action'

type CustomFieldListProps = {
  dataSource?: any
  options?: any
}

const CustomFieldList: React.FC<CustomFieldListProps> = ({
  dataSource,
  options,
}) => {
  const { stages, workflowId } = options as any
  const { message } = App.useApp()
  const router = useRouter()
  const stageIds = Array.from(
    new Set(
      dataSource?.length > 0 ? dataSource?.map((d: any) => d.stage_id) : [],
    ),
  )

  const handleChangeRequired = async (fieldId: number, required: boolean) => {
    try {
      const res = await editWorkflowAction(workflowId, {
        fields: [
          {
            id: fieldId,
            require: !required,
          },
        ],
      })

      if (res) {
        message.success('Cập nhật thành công')
        router.refresh()
      }
    } catch (error) {
      message.error('Có lỗi xảy ra')
    }
  }

  return (
    <div>
      {stageIds?.map((id) => {
        const title = stages?.find((s: any) => s.id === id)?.name
        const filteredFields = dataSource?.filter((d: any) => d.stage_id === id)

        return (
          <>
            <div className="-mx-[24px] border-y border-[#eee] bg-[#f9f9f9] px-[24px] py-[12px] text-[11px] font-[500]">
              {title}
            </div>
            <List
              dataSource={filteredFields}
              renderItem={(item: any, index: number) => {
                return (
                  <>
                    <List.Item
                      className="group"
                      style={{
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <div className="flex items-center gap-[12px]">
                        <p className="text-[14px] font-[500]">{index + 1}.</p>
                        <div className="text-[14px] font-[500]">
                          {item?.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-[12px]">
                        <div className="flex items-center gap-[12px]">
                          <CustomFieldsModalForm
                            action="edit"
                            options={{
                              initialValues: {
                                ...item,
                                require: item?.require === 1 ? true : false,
                              },
                              stages,
                              fieldId: item?.id,
                            }}
                          >
                            <EditOutlined className="hidden cursor-pointer text-[14px] text-[#aaa] group-hover:block" />
                          </CustomFieldsModalForm>
                          <CustomFieldDeleteButton fieldId={item?.id} />
                          <Switch
                            defaultChecked={item?.require === true}
                            onChange={() =>
                              handleChangeRequired(item?.id, item?.require)
                            }
                          />
                          {item?.require === 1 ? (
                            <span className="inline-block w-[110px] cursor-default text-left text-[12px] text-[#c34343]">
                              BẮT BUỘC
                            </span>
                          ) : (
                            <span className="inline-block w-[110px] cursor-default text-left text-[12px] text-[#aaa]">
                              KHÔNG BẮT BUỘC
                            </span>
                          )}
                        </div>
                        <div className="ml-[12px] min-w-[90px] cursor-default rounded-[3px] bg-[#F3EAEA] p-[6px] text-center leading-[20px]">
                          {item?.type}
                        </div>
                      </div>
                    </List.Item>
                  </>
                )
              }}
            />
          </>
        )
      })}
    </div>
  )
}

export default CustomFieldList
