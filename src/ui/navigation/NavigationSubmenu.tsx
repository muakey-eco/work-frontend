import clsx from 'clsx'
import { uniqueId } from 'lodash'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLayoutEffect, useState } from 'react'
import { NavigationProps, type NavigationMenuType } from '.'
import NavigationItem from './NavigationItem'
import { activeNav } from './utils'

const NavigationSubmenu: React.FC<{
  menu?: NavigationMenuType[]
  defaultOpen?: boolean
  ghost?: boolean
  exact?: boolean
  matchType: NavigationProps['matchType']
  isSubMenu?: boolean
  level?: number
}> = ({
  menu,
  defaultOpen,
  ghost,
  exact,
  matchType = 'default',
  level = 0,
  isSubMenu = false,
}) => {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const [hash, setHash] = useState('')
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set())
  const url = {
    pathName,
    searchParams,
  }

  useLayoutEffect(() => {
    setHash(location.hash.substring(1))
  }, [searchParams])

  const handleSubmenuClick = (key: string) => {
    setOpenSubmenus((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  return (
    <ul
      className={clsx(
        'transition-all duration-300',
        defaultOpen ? 'h-auto' : 'h-0 overflow-hidden',
        {
          'ml-4': level > 0,
        },
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {menu?.map((child) => {
        const active = activeNav(url, child.href || '', exact, hash, matchType)
        const hasChildren = child.children && child.children.length > 0
        const childKey = child.key?.toString() || uniqueId()
        const activeChild = child.children?.find((c) =>
          activeNav(url, c.href || '', exact, hash, matchType),
        )
        const isOpen = openSubmenus.has(childKey) || child.expand
        const lastItem = menu?.length - 1

        return (
          <li key={childKey}>
            <div
              className={clsx({
                'bg-[#FFFFFF29]': active && !child?.shouldRound,

                'hover:bg-[#FFFFFF29]': !isSubMenu && !hasChildren,
                'mx-1 mt-1 rounded-md hover:bg-[#FFFFFF29]':
                  isSubMenu && !isOpen && level === 0 && !hasChildren,

                'mx-1 rounded-md bg-gradient-to-b from-[#FFFFFF29]/10 to-[#999999]/10':
                  active && isSubMenu,
                'bg-gradient-to-b from-[#FFFFFF29]/10 to-[#999999]/10':
                  active && !isSubMenu,

                'rounded-4xl from-[#FFFFFF29]/16 to-[#999999]/16 hover:bg-gradient-to-b':
                  child?.shouldRound && !child?.children && !isOpen,

                'bg-gradient-to-b from-[rgba(255,255,255,0.10)] to-[rgba(213,213,213,0.16)]':
                  hasChildren && isOpen,
                'rounded-4xl bg-gradient-to-b from-[#FFFFFF29]/16 to-[#999999]/16 px-1':
                  activeChild && child?.shouldRound,

                'rounded-b-2xl':
                  childKey === menu[lastItem]?.key?.toString() ||
                  childKey === menu[lastItem]?.key,
              })}
            >
              <NavigationItem
                item={child}
                active={active}
                open={isOpen}
                ghost={ghost}
                exact={exact}
                matchType={
                  matchType as 'prefix' | 'default' | 'exact' | 'overview-base'
                }
                isSubMenu={true}
                onClick={() => hasChildren && handleSubmenuClick(childKey)}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default NavigationSubmenu
