import React from 'react'
import PageHeader from './components/PageHeader'
import ResourcesCategoryList from './components/resources-category-list'

const ResourcesPage: React.FC = async ({ searchParams }: any) => {
  const params = await searchParams
  const search = params?.search || ''

  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <PageHeader />
      <ResourcesCategoryList suspense search={search} />
    </div>
  )
}

export default ResourcesPage
