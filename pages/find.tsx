import * as React from 'react'
import Link from 'next/link'
import Page from '../layouts/main'
import css from '../styles/pages/find.scss'

import CodeIcon from 'react-ionicons/lib/IosBarcodeOutline'
import PlusIcon from 'react-ionicons/lib/IosAdd'

// A little helper to generate a random room number
const generateRoom = () => Math.random().toString().slice(2, 8)

const find = () => {
  const buttonsData = [
    {
      name: 'Use a code',
      icon: CodeIcon,
      route: '/code'
    },
    {
      name: 'Create your own',
      icon: PlusIcon,
      route: `/party/${generateRoom()}`
    }
  ]

  const buttons = buttonsData.map((button, index) => (
    <Link href={button.route} key={index}>
      <button className={css.optionButton}>
        <button.icon fontSize='60px' color='#7A7A7A' />
        <h3 className={css.buttonFont}>{button.name}</h3>
      </button>
    </Link>
  ))

  return (
    <Page>
      <div className={css.container}>
        <div className={css.flexContainer}>
          <h1 className={css.hero}>Find a Party</h1>
          <sub className={css.subtitle}>Choose an option below</sub>
          <div className={css.fourButtonGrid}>
            {buttons}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default find
