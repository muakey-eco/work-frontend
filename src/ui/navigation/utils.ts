import { LinkProps } from 'next/link'
import { NavigationMenuType, NavigationProps } from './Navigation'

type Url = {
  pathName: string
  searchParams: URLSearchParams
}

export const activeNav = (
  url: Url,
  href: LinkProps['href'],
  exact: boolean = false,
  hash?: string,
  matchType: NavigationProps['matchType'] = 'default',
) => {
  const { pathName, searchParams } = url

  const hrefPathName =
    typeof href === 'string' ? href.split('?')[0] : href.pathname
  const queryParams =
    typeof href === 'string'
      ? href.split('?')[1]
      : new URLSearchParams(Object.entries(href.query || {}) as []).toString()

  const isHashMatch =
    hrefPathName?.includes('#') && !!hash && hrefPathName.split('#')[1] === hash
  const exactMatch =
    pathName === hrefPathName &&
    (`${searchParams}` === (queryParams || '') || isHashMatch)
  const type = exact ? 'exact' : matchType

  // Special case for department routes
  if (pathName.includes('/department/')) {
    const pathParts = pathName.split('/')
    const hrefParts = hrefPathName?.split('/') || []

    // For overview route, check if it's exactly the overview route
    if (pathName.includes('/overview')) {
      return pathName === hrefPathName
    }

    // For other department routes, check exact match
    if (pathParts.length >= 3 && hrefParts.length >= 3) {
      return pathName === hrefPathName
    }
  }

  switch (type) {
    case 'exact':
      return exactMatch

    case 'prefix':
      return pathName.startsWith(hrefPathName || '')

    case 'overview-base': {
      const trimmedPath = pathName?.split('/').slice(0, 3).join('/')
      const trimmedHref = hrefPathName?.split('/').slice(0, 3).join('/')
      return trimmedPath === trimmedHref
    }

    default:
      return pathName === (hrefPathName || '')
  }
}

export const urlMatch = (
  menu: NavigationMenuType[],
  pathName: string,
  searchParams: URLSearchParams,
  exact?: boolean,
  matchType: NavigationProps['matchType'] = 'default',
) => {
  if (!menu || menu.length <= 0) {
    return false
  }

  for (const item of menu) {
    if (
      activeNav({ pathName, searchParams }, item.href || '', exact, matchType)
    ) {
      return true
    }

    if (item.children) {
      if (urlMatch(item.children, pathName, searchParams)) {
        return true
      }
    }
  }

  return false
}
