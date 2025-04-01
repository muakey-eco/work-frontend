'use client'

import clsx from 'clsx'
import { uniqueId } from 'lodash'
import { LinkProps } from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import NavigationItem from './NavigationItem'
import { activeNav, urlMatch } from './utils'

export type NavigationMenuType = {
  key?: React.Key
  icon?: React.ReactNode
  label?: React.ReactNode
  href?: LinkProps['href'];
  expand?: boolean;
  type?: 'filled-rounded' | 'plain';
  taskCount?: number,
  shouldRound?: boolean,
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

    const className = clsx(
      'space-y-[8px] text-[24px] text-[#fff]',
      {
        // 'rounded-[24px]': !ghost,
        'space-y-[12px]': ghost,
      },
      customClassName,
    )

    useEffect(() => {
      setHash(location.hash.substring(1))
    }, [searchParams])

    return (
      <ul className={className} ref={ref} {...props}>
        {items?.map((item) => {
          const type = item.exact ? 'exact' : item.matchType
          const active = activeNav(
            url,
            item.href || '',
            exact,
            hash,
            type || matchType,
          )

          return (
            <div className='rounded-xl overflow-hidden'>
              <NavigationItem
                key={item.key ?? uniqueId()}
                item={item}
                active={active}
                defaultOpen={
                  item.expand ||
                  urlMatch(item.children || [], pathName, searchParams, exact)
                }
                ghost={ghost}
                exact={exact}
                matchType={type || matchType}
                className={item.className}
              />
            </div>
          )
        })}
      </ul>
    )
  }

const Navigation = React.forwardRef(InternalNavigation)

export default Navigation
