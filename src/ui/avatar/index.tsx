/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx'
import React, { useMemo } from 'react'
import Badge, { BadgeProps } from '../badge'

export type AvatarProps = React.ComponentPropsWithoutRef<'div'> & {
  src?: string
  alt?: string
  size?: 'default' | 'small' | 'large' | number
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | boolean
}

const stringToHex = (s: string) => {
  let hash = 0
  for (var i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash)
  }

  var c = (hash & 0x00ffffff).toString(16).toUpperCase()

  return '#' + '00000'.substring(0, 6 - c.length) + c
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  shape = 'square',
  size = 'default',
  status = false,
  children,
  className: customClassName,
  style: customStyle,
  ...rest
}) => {
  const sizes = {
    default: 32,
    small: 24,
    large: 40,
  }
  const className = clsx(
    'relative flex items-center justify-center overflow-hidden bg-gray-200 text-[#fff]',
    {
      'rounded-full': shape === 'circle',
      'rounded-[4px]': shape === 'square',
    },
    customClassName,
  )

  const value = typeof size === 'number' ? size : sizes[size]

  const backgroundColor = useMemo(
    () => (typeof children === 'string' ? stringToHex(children) : undefined),
    [children],
  )

  const avatarStyle: React.CSSProperties = {
    width: value,
    height: value,
    backgroundColor,
    ...customStyle,
  }
  const offset: BadgeProps['offset'] =
    shape === 'circle' ? [value - 3, value / 6] : [value, 0]

  if (!status) {
    return (
      <div className={className} style={avatarStyle} {...rest}>
        {src ? (
          <img src={src} alt={alt} />
        ) : typeof children === 'string' ? (
          <span className="inline-block align-middle text-[12px] font-[400]">
            {children.charAt(0).toUpperCase()}
          </span>
        ) : (
          children
        )}
      </div>
    )
  }

  return (
    <Badge
      type="dot"
      size="small"
      color={status === 'online' ? '#2DB517' : '#fff9'}
      offset={offset}
    >
      <div className={className} style={avatarStyle} {...rest}>
        {src ? (
          <img src={src} alt={alt} />
        ) : typeof children === 'string' ? (
          <span className="inline-block align-middle text-[12px] font-[400]">
            {children.charAt(0).toUpperCase()}
          </span>
        ) : (
          children
        )}
      </div>
    </Badge>
  )
}

export default Avatar
