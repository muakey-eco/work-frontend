import { useEffect, useRef } from 'react'

const useWhyDidYouRender = (name: string, props: any) => {
  const previousProps = useRef<{ [key: string]: any }>({})

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changes: { [key: string]: any } = {}

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changes[key] = {
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changes).length > 0) {
        console.log(`[whyDidYouRender] ${name}`, changes)
      }
    }
    previousProps.current = props
  })
}

export default useWhyDidYouRender
