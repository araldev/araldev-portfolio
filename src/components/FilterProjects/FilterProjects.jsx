import { useId } from 'react'
import styles from './FilterProjects.module.css'
import { techIconsDictionary } from '../../data/icons.js'

export function FilterProjects () {
  const idBaseFilter = useId()

  return (
    <form className={styles.form_filter_container}>
      <legend>Search projects by technology used</legend>

      <div className={styles.filter_container}>
        {
        Object.values(techIconsDictionary).map((eachTechIcon, index) => {
          const idFilter = `${idBaseFilter}-${index}`

          return (
            <label className={styles.filter_icon_label} key={index} htmlFor={idFilter}>
              <div className={styles.filter_icon_container}>
                {eachTechIcon}
              </div>
              <input className={styles.filter_icon_checkbox} id={idFilter} type='checkbox' hidden />
            </label>
          )
        })
      }
      </div>
    </form>
  )
}
