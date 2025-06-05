import { useId } from 'react'
import styles from './FilterProjects.module.css'
import { techIconsDictionary } from '../../data/icons.js'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'

function TechIcons () {
  const { setIsIconCheck } = useIsIconCheckFilter()
  const idBaseFilter = useId()

  function handleClick (event) {
    const key = event.currentTarget.getAttribute('data-key')
    setIsIconCheck(prevState => {
      const newState = { ...prevState }
      if (key) {
        for (const prevKey in newState) {
          if (prevKey === key) newState[prevKey] = !newState[prevKey]
        }
        return newState
      }
    })
  }

  return (
    <>
      {
        Object.entries(techIconsDictionary).map(([key, eachTechIcon], index) => {
          const idFilter = `${idBaseFilter}-${index}`

          return (
            <label className={styles.filter_icon_label} key={index} htmlFor={idFilter}>
              <input
                data-key={key}
                onClick={handleClick}
                className={styles.filter_icon_checkbox}
                id={idFilter}
                type='checkbox'
                hidden
              />
              <div className={styles.filter_icon_container}>
                {eachTechIcon}
              </div>
            </label>
          )
        })
      }
    </>
  )
}

export function FilterProjects () {
  return (
    <form className={styles.form_filter_container}>
      <legend>Search projects by technology used</legend>
      <div className={styles.filter_container}>
        <TechIcons />
      </div>
    </form>
  )
}
