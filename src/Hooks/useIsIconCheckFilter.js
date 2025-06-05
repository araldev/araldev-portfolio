import { useContext } from 'react'
import { IsIconCheckFilterContex } from '../contexts/IsIconCheckFilter.jsx'

export function useIsIconCheckFilter () {
  const { isIconCheck, setIsIconCheck } = useContext(IsIconCheckFilterContex)

  return { isIconCheck, setIsIconCheck }
}
