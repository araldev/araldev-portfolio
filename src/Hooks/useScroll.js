import { useContext } from 'react'
import { ScrollContext } from '../contexts/ScrollProvider.jsx'

export const useScroll = () => {
  const { lenis } = useContext(ScrollContext)

  return { lenis }
}
