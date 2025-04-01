export interface Asset {
  id: string
  name: string
  brand: {
    name: string
  }
  status:
    | 'using'
    | 'unused'
    | 'warranty'
    | 'broken'
    | 'liquidated'
    | undefined
    | string
  asset_category: {
    name: string
  }
  buyer: {
    full_name: string
  }
  code: string
  price: number
  buy_date: string
  sell_price: number
  seller: {
    full_name: string
  }
  warranty_date: string
  account: {
    full_name: string
  }
  start_date: string
  sell_date: string
  description: string
  created_at: string
  updated_at: string
  history_assets: [
    {
      updated_at: string
      account: {
        full_name: string
      }
    },
  ]

  // Thêm các trường khác tùy theo API của bạn
}

export interface AssetFull extends Asset {
  current_page: number
  data: Asset[]
  per_page: number
  total: number
}

export interface TotalStatus {
  status?: string
  count?: number
  total?: number
}
