import clsx from 'clsx'
import { uniqueId } from 'lodash'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLayoutEffect, useState } from 'react'
import { NavigationProps, type NavigationMenuType } from '.'
import NavigationItem from './NavigationItem'
import { activeNav, urlMatch } from './utils'

const NavigationSubmenu: React.FC<{
  menu?: NavigationMenuType[]
  defaultOpen?: boolean
  ghost?: boolean
  exact?: boolean
  matchType: NavigationProps['matchType']
}> = ({ menu, defaultOpen, ghost, exact, matchType = 'default' }) => {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const [hash, setHash] = useState('')
  const url = {
    pathName,
    searchParams,
  }

  useLayoutEffect(() => {
    setHash(location.hash.substring(1))
  }, [searchParams])

  return (
    <ul
      className={clsx(
        'transition-all duration-300',
        defaultOpen ? 'h-auto' : 'h-0 overflow-hidden',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {menu?.map((child) => {
        const active = activeNav(url, child.href || '', exact, hash, matchType)

        return (
          <NavigationItem
            key={child?.key ?? uniqueId()}
            item={child}
            active={active}
            defaultOpen={
              child.expand ||
              urlMatch(
                child.children || [],
                pathName,
                searchParams,
                exact,
                matchType,
              )
            }
            ghost={ghost}
            matchType={matchType}
            className="leading-[22px]"
          />
        )
      })}
    </ul>
  )
}

export default NavigationSubmenu
