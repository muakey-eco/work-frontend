import clsx from 'clsx'
import React from 'react'
import Divider from '../divider'

export type CardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> & {
  title?: React.ReactNode
  extra?: React.ReactNode
  cover?: React.ReactNode
  size?: 'default' | 'small'
  loading?: boolean
  actions?: Array<React.ReactNode>
  headStyle?: React.CSSProperties
  headerBordered?: boolean
  headerClassName?: string
  bodyStyle?: React.CSSProperties
  bodyClassName?: string
  ghost?: boolean
}

const InternalCard: React.ForwardRefRenderFunction<
  HTMLDivElement,
  CardProps
> = (
  {
    title,
    extra,
    cover,
    size = 'default',
    loading,
    actions,
    className: customClassName,
    headStyle,
    headerBordered,
    headerClassName,
    bodyStyle,
    bodyClassName,
    ghost,
    children,
    ...rest
  },
  ref,
) => {
  const className = clsx(
    'w-full overflow-hidden text-[#000]',
    {
      'rounded-[8px] p-[20px]': size === 'default' && !ghost,
      'rounded-[4px] p-[16px]': size === 'small' && !ghost,
      'bg-[#fff]': !ghost,
      'bg-transparent': ghost,
    },
    customClassName,
  )

  const headerClass = clsx(
    'flex items-center justify-between leading-none',
    ghost && 'mb-[24px]',
    headerClassName,
  )
  const bodyClass = clsx('text-[14px]', bodyClassName)

  return (
    <div {...rest} className={className} ref={ref}>
      {(title || extra) && (
        <div className={headerClass} style={headStyle}>
          <div className="text-[18px] font-[400]">{title}</div>
          <div>{extra}</div>
        </div>
      )}
      {headerBordered && (title || extra) && (
        <Divider className="mt-[12px] border-[#ffffff1f]" />
      )}
      <div
        className={clsx('w-full', {
          'mt-[12px]': !ghost && (title || extra || (title && extra)),
        })}
      >
        {cover}
        {children && (
          <div style={bodyStyle} className={bodyClass}>
            {loading || children}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex items-center border-t border-[#5081FF8F] pt-[12px]">
          {actions?.map((a, index) => (
            <div
              className="relative flex h-full items-center justify-center"
              style={{
                width: actions ? `calc(100% / ${actions.length})` : '100%',
              }}
              key={index}
            >
              {a}
              {actions.indexOf(a) !== actions.length - 1 && (
                <Divider
                  className="absolute top-[50%] right-0 translate-y-[-50%]"
                  type="vertical"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const Card = React.forwardRef(InternalCard)

export default Card
