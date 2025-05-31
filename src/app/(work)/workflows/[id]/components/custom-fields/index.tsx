import CustomFieldHeader from './CustomFieldHeader'
import CustomFieldList from './CustomFieldList'

type CustomFieldsProps = {
  stages?: any[]
  customFields?: any[]
  workflowId?: number
}

const CustomFields: React.FC<CustomFieldsProps> = ({
  stages,
  customFields,
  workflowId,
}) => {
  return (
    <div className="h-[calc(100vh-82px)] overflow-auto bg-[#eee] p-[20px]">
      <div className="mx-auto w-[860px] rounded-[9px] bg-[#fff] p-[24px] shadow-[0_2px_6px_0_#0000000f]">
        <CustomFieldHeader stages={stages || []} />

        <CustomFieldList
          dataSource={customFields}
          options={{
            stages,
            workflowId,
          }}
        />
      </div>
    </div>
  )
}

export default CustomFields
