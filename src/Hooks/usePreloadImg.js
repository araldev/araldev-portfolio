import { useEffect } from 'react'

export function usePreloadImg (img) {
  useEffect(() => {
    const imgLoaded = new Image()
    imgLoaded.src = img
  }, [])
}
