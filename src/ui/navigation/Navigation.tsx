'use client'

import clsx from 'clsx'
import { LinkProps } from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import NavigationItem from './NavigationItem'
import { activeNav } from './utils'

export type NavigationMenuType = {
  key?: React.Key
  icon?: React.ReactNode
  label?: React.ReactNode
  href?: LinkProps['href']
  expand?: boolean
  type?: 'filled-rounded' | 'plain'
  taskCount?: number
  shouldRound?: boolean
  children?: NavigationMenuType[]
  exact?: boolean
  matchType?: 'default' | 'prefix' | 'exact'
  className?: string
}

export type NavigationProps = React.ComponentPropsWithoutRef<'ul'> & {
  items?: NavigationMenuType[]
  ghost?: boolean
  exact?: boolean
  matchType?: 'default' | 'prefix' | 'exact'
}

const InternalNavigation: React.ForwardRefRenderFunction<
  HTMLUListElement,
  NavigationProps
> = (
  {
    items,
    ghost = false,
    exact = false,
    matchType = 'default',
    className: customClassName,
    ...props
  },
  ref,
) => {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const [hash, setHash] = useState('')
  const url = {
    pathName,
    searchParams,
  }

  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())

  // Load saved menu states from localStorage on mount
  useEffect(() => {
    const savedMenus = localStorage.getItem('openMenus')
    if (savedMenus) {
      setOpenMenus(new Set(JSON.parse(savedMenus)))
    }
  }, [])

  // Save menu states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('openMenus', JSON.stringify(Array.from(openMenus)))
  }, [openMenus])

  const handleMenuClick = (key: string) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const className = clsx(
    'space-y-[8px] text-[24px] text-[#fff]',
    {
      'space-y-[12px]': ghost,
    },
    customClassName,
  )

  useEffect(() => {
    setHash(location.hash.substring(1))
  }, [searchParams])

  return (
    <ul className={className} ref={ref} {...props}>
      {items?.map((item, index) => {
        const type = item.exact ? 'exact' : item.matchType
        const isActive = activeNav(
          url,
          item.href || '',
          exact,
          hash,
          item.matchType || matchType,
        )
        const menuKey = item.key?.toString() || `menu-${index}`
        const isOpen = openMenus.has(menuKey)

        return (
          <li key={menuKey} className="overflow-hidden rounded-xl">
            <NavigationItem
              key={menuKey}
              item={item}
              active={isActive}
              open={isOpen}
              ghost={ghost}
              exact={exact}
              matchType={type || matchType}
              className={item.className}
              onClick={() => handleMenuClick(menuKey)}
            />
          </li>
        )
      })}
    </ul>
  )
}

const Navigation = React.forwardRef(InternalNavigation)

export default Navigation
