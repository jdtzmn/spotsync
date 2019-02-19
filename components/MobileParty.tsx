import React, { Component } from 'react'
import MediaControl from './MediaControl'
import css from '../styles/components/mobileParty.scss'

class MobileParty extends Component {
  render() {
    return (
      <div>
        <div className={css.status}>
          <div className={css.container}>
            {/* top row */}
            <div className={css.topRow}>
              <div>
                #000000
              </div>
              <div className={css.position}>
                3:07
              </div>
            </div>
            {/* song status */}
            <div className={css.songStatus}>
              <div className={css.verticalAlign}>
                <div className={css.songImage} />
              </div>
              <div className={css.songDetails}>
                <h1 className={css.songName}>Believer</h1>
                <sub className={css.artistName}>Imagine Dragons</sub>
              </div>
              <MediaControl
                className={css.mediaControl}
                size='40px'
                color='#515151'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MobileParty
