import { useState, createContext } from 'react'

export const IsIconCheckFilterContex = createContext()

export function IsIconCheckFilterProvider ({ children }) {
  const [isIconCheck, setIsIconCheck] = useState({
    js: false,
    react: false,
    css: false,
    html: false,
    ts: false,
    git: false,
    gitHub: false,
    gsap: false
  })

  return (
    <IsIconCheckFilterContex.Provider value={{ isIconCheck, setIsIconCheck }}>
      {children}
    </IsIconCheckFilterContex.Provider>
  )
}
