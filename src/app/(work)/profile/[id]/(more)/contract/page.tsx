import { getUserAccount } from '@/libs/data'
import React from 'react'
import ContractCard from './components/contract-card'
import ContractDocumentCard from './components/contract-document-card'

const ContractPage: React.FC<{ params: { id: string } }> = async ({
  params,
}) => {
  const user = await getUserAccount(Number(params.id))
  console.log('user', user)

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <ContractCard title="Tất cả hợp đồng" items={user} />
      <ContractDocumentCard title="Giấy tờ nhân sự" items={user} />
    </div>
  )
}

export default ContractPage
