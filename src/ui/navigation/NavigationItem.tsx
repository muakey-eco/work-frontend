import clsx from 'clsx'
import Link from 'next/link'
import React, { useState } from 'react'
import { NavigationMenuType } from '.'
import { DownOutlined } from '../icons'
import NavigationSubmenu from './NavigationSubmenu'
import { cn } from '@/lib/utils'

export type NavigationItemProps = {
  item?: NavigationMenuType
  active?: boolean
  defaultOpen?: boolean
  children?: React.ReactNode
  ghost?: boolean
  exact?: boolean
  matchType?: 'default' | 'prefix' | 'exact'
  className?: string
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  active: initActive,
  defaultOpen,
  children,
  ghost,
  exact,
  matchType = 'default',
  className: customClassName,
}) => {

  const [show, setShow] = useState(true)
  const active = item?.children ? !show : initActive

  const layout = clsx(
    {
      'bg-gradient-to-b from-[#FFFFFF]/16 to-[#999999]/16': item?.type === "filled-rounded" && item.children?.length !== 0 && show,
      'mt-[16px]': item?.type === "plain"
    }
  )

  const className = cn(
    'inline-block w-full transition-all duration-300 px-[16px]',
    item?.type === "plain" ? 'h-[22px]' : 'h-[40px]',
    {
      'bg-[#FFFFFF29]': show && active && !item?.shouldRound,
      'bg-gradient-to-b from-[#FFFFFF]/16 to-[#999999]/16': active && item?.shouldRound,
      'py-[12px]': ghost,
      'rounded-3xl': item?.shouldRound,
      'hover:bg-[#FFFFFF1A]': !ghost && !item?.children && !item?.shouldRound,
      'hover:bg-gradient-to-b from-[#FFFFFF]/16 to-[#999999]/16': item?.shouldRound,
    },
    customClassName,
  )
  const node = (
    <div className={clsx(
      "flex items-center justify-between gap-[10px]",
      item?.type === "plain" ? 'h-[22px]' : 'h-[40px]',
      {
        'pb-[12px]': item?.type === "plain" && show
      }
    )}
    >
      <div
        className={clsx(
          'flex flex-1 items-center gap-[8px] leading-none',
          ghost ? 'text-[16px]' : 'text-[24px]',
          {
            'text-[#FFFFFF99]': item?.children && item.type === "plain",
          },
        )}
      >
        {item?.icon}
        <div className="w-full text-[14px]">{item?.label}</div>
        {item?.taskCount && <p className='rounded-[4px] bg-[#ff5555] px-[6px] pt-[2px] pb-[4px] text-[12px] font-[500]'>{item?.taskCount}</p>}
      </div>

      {item?.children && item.children.length > 0 && (
        <DownOutlined
          className={clsx(
            'text-white',
            {
              'rotate-0 text-[#fff]': !show,
              'rotate-180 text-[#ffffff4d]': show,
              'text-[16px]': ghost,
            })}
        />
      )}
    </div>
  )

  const handleClick = () => {
    if (!item?.children) return;
    setShow(!show);
  }

  return (
    <div className={layout}>
      <li
        key={item?.key}
        className={"cursor-pointer rounded-full text-[16px] leading-none"}
        onClick={handleClick}
      >
        {item?.children ? (
          <div className={className}>{node}</div>
        ) : (
          <Link className={className} href={item?.href ?? ''}>
            {node}
          </Link>
        )}
        {children ??
          (item?.children && (
            <div
              className={clsx('transition-all duration-300', {
                'mt-[12px] rounded-[16px] bg-[#FFFFFF0F] px-4 py-[4px]':
                  ghost && show,
              })}
            >
              <NavigationSubmenu
                menu={item?.children}
                defaultOpen={show}
                ghost={ghost}
                exact={exact}
                matchType={matchType}
              />
            </div>
          ))}
      </li>
    </div >
  )
}

export default NavigationItem
