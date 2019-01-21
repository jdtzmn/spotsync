import * as React from 'react'
import Head from 'next/head'
import Fade from 'react-reveal/Fade'

import css from '../styles/pages/index.scss';
import artwork from '../static/index/phone_artwork.svg'

const Index = () => {
  return (
    <div className={css.container}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      </Head>
      <img
        className={css.artwork}
        src={artwork}
        alt=""
      />
        <div className={css.padding}>
          <Fade bottom>
            <h1 className={css.hero}>Spotify in sync</h1>
          </Fade>
          <Fade bottom delay={100}>
            <sub className={css.subtitle}>Spotsync makes multi-device listening a breeze</sub>
          </Fade>
        </div>
        <div className={css.buttonGroup}>
          <Fade bottom delay={175}>
            <button className={css.getStarted}>
              Get Started
            </button>
          </Fade>
          <Fade bottom delay={350}>
            <sub className={css.getStartedDescription}>By logging in with Spotify</sub>
          </Fade>
        </div>
    </div>
  )
}

export default Index
