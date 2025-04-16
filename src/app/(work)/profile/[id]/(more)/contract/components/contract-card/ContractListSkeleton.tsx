import { Card, List, Skeleton } from 'antd'
import { times } from 'lodash'

const ContractListSkeleton: React.FC = () => {
  return (
    <List
      dataSource={times(5, () => String)}
      grid={{
        gutter: [16, 16],
        column: 1,
      }}
      renderItem={() => (
        <List.Item className="!mb-0">
          <Card
            classNames={{
              body: '!space-x-[24px] flex items-start',
            }}
          >
            <div className="flex flex-1 items-start gap-[16px]">
              {times(5, (index) => (
                <div
                  className="flex flex-1 flex-col !space-y-[8px]"
                  key={index}
                >
                  <Skeleton.Node active style={{ width: 100, height: 22 }} />
                  <Skeleton.Node active style={{ width: 120, height: 22 }} />
                </div>
              ))}
            </div>
          </Card>
        </List.Item>
      )}
    />
  )
}

export default ContractListSkeleton
