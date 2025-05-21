import { cn } from '@/lib/utils'
import clsx from 'clsx'
import { uniqueId } from 'lodash'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { NavigationMenuType } from '.'
import { DownOutlined } from '../icons'
import NavigationSubmenu from './NavigationSubmenu'

export type NavigationItemProps = {
  item?: NavigationMenuType
  active?: boolean
  open?: boolean
  children?: React.ReactNode
  ghost?: boolean
  exact?: boolean
  matchType?: 'default' | 'prefix' | 'exact'
  className?: string
  isSubMenu?: boolean
  onClick?: () => void
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  active: initActive,
  open = false,
  children,
  ghost,
  exact,
  matchType = 'default',
  className: customClassName,
  isSubMenu = false,
  onClick,
}) => {
  const pathname = usePathname()
  const isActive = pathname === item?.href

  const layout = clsx({
    'bg-gradient-to-b from-[#FFFFFF]/16 to-[#999999]/16':
      item?.type === 'filled-rounded' && item.children?.length !== 0 && open,
    'mt-[16px]': item?.type === 'plain',
    'rounded-4xl bg-gradient-to-b from-[#FFFFFF]/16 to-[#999999]/16':
      isActive && item?.children?.length === 0,
    'rounded-4xl from-[#FFFFFF]/16 to-[#999999]/16 hover:bg-gradient-to-b':
      (item?.type === 'filled-rounded' && !open) ||
      (item?.children?.length === 0 && item.type != 'plain'),
  })

  const className = cn(
    'inline-block w-full transition-all duration-300 px-[16px] ',
    item?.type === 'plain' ? 'h-[22px]' : 'h-[40px]',
    {
      'py-[12px]': ghost,
    },
    customClassName,
  )

  const node = (
    <div
      className={clsx(
        'flex items-center justify-between gap-[10px]',
        item?.type === 'plain' ? 'h-[22px]' : 'h-[40px]',
        {
          'pb-[12px]': item?.type === 'plain' && open,
        },
      )}
    >
      <div
        className={clsx(
          'flex flex-1 items-center gap-[8px] leading-none',
          ghost ? 'text-[16px]' : 'text-[24px]',
          {
            'text-[#FFFFFF99]': item?.children && item.type === 'plain',
          },
        )}
      >
        {item?.icon}
        <div
          className={clsx(
            'flex items-center',
            item?.type === 'plain' ? 'text-[#FFFFFF99]' : 'text-white',
            {
              'text-white': isActive,
            },
          )}
        >
          <span className="w-full text-[14px]">{item?.label}</span>
        </div>
      </div>

      {item?.children && item.children.length > 0 && (
        <DownOutlined
          className={clsx('text-white', {
            'rotate-0 text-[#fff] transition-all duration-300 ease-in-out':
              !open,
            'rotate-180 text-[#ffffff4d] transition-all duration-300 ease-in-out':
              open,
            'text-[16px]': ghost,
          })}
        />
      )}
    </div>
  )

  return (
    <div className={layout}>
      <div
        key={item?.key}
        className={clsx(
          'cursor-pointer rounded-full text-[14px] leading-none',
          isSubMenu && 'pb-1',
        )}
        onClick={onClick}
      >
        {item?.children && item.children.length > 0 ? (
          <div className={className}>{node}</div>
        ) : (
          <Link className={className} href={item?.href ?? ''}>
            {node}
          </Link>
        )}
        {item?.children && open && (
          <div
            key={item?.key ?? uniqueId()}
            className={clsx('transition-all duration-300', {
              'mt-[12px] rounded-[16px] bg-[#FFFFFF0F] py-[4px] ps-4 pe-2':
                ghost && open,
            })}
          >
            <NavigationSubmenu
              menu={item?.children}
              defaultOpen={open}
              ghost={ghost}
              exact={exact}
              matchType={matchType}
              isSubMenu={isSubMenu}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NavigationItem
