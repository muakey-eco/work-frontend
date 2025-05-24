'use client'

import React from 'react'
import { createPortal } from 'react-dom'

const PORTAL_HOLDER_ID = 'portals'

export type PortalProps = {
  children: React.ReactElement
}

export const PortalHolder = () => <div id={PORTAL_HOLDER_ID}></div>

const Portal: React.FC<PortalProps> = ({ children }) => {
  return createPortal(
    children,
    document.getElementById(PORTAL_HOLDER_ID) || document.body,
  )
}

export default Portal
