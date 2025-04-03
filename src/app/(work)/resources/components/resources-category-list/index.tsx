import { withSuspense } from '@/hoc'
import { getResourceCategories } from '@/libs/resources'
import { Collapse, CollapseProps, Empty } from 'antd'
import React from 'react'
import ResourcesList from '../resources-list'
import ResourcesCategoryListSkeleton from './ResourcesCategoryListSkeleton'
import ResourcesExtra from './ResourcesExtra'

type ResourcesCategoryListProps = {
  search?: string
}

const ResourcesCategoryList: React.FC<ResourcesCategoryListProps> = async ({
  search,
}) => {
  const resourcesCategories = await getResourceCategories(search || '')

  const items: CollapseProps['items'] = resourcesCategories.map(
    (item: any) => ({
      key: item.id,
      label: (
        <span className="text-[20px] leading-[28px] font-[700]">
          {item.name}
        </span>
      ),
      children: <ResourcesList resources={item.resources} />,
      extra: (
        <ResourcesExtra resource={item} options={{ resourcesCategories }} />
      ),
      style: {
        border: 'none',
      },
      styles: {
        header: {
          alignItems: 'center',
          padding: '0 16px 16px',
        },
      },
    }),
  )

  if (resourcesCategories?.length <= 0) {
    return (
      <Empty className="p-[60px]" description="Không có danh mục tài liệu" />
    )
  }

  return (
    <div className="h-[calc(100vh-190px)] overflow-y-auto py-[12px]">
      <Collapse
        items={items}
        className="border-none bg-transparent"
        rootClassName="border-none bg-transparent"
        bordered={false}
        defaultActiveKey={resourcesCategories?.map((item: any) => item.id)}
        collapsible="icon"
      />
    </div>
  )
}

export default withSuspense(ResourcesCategoryList, {
  fallback: () => <ResourcesCategoryListSkeleton />,
})
