import * as React from 'react'
import Link from 'next/link'
import Page from '../layouts/main'
import css from '../styles/pages/find.scss';

const find = () => {
  const generateRoom = () => Math.random().toString().slice(2, 8)

  const buttonsData = [
    {
      name: 'Use a code',
      icon: 'barcode',
      route: '/code'
    },
    {
      name: 'Create your own',
      icon: 'plus',
      route: `/party/${generateRoom()}`
    }
  ]

  const buttons = buttonsData.map((button, index) => (
    <Link href={button.route} key={index}>
      <button className={css.optionButton}>
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
