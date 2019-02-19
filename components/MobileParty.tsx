import React, { Component } from 'react'
import MediaControl from './MediaControl'
import ProgressBar from './ProgressBar'
import Track from './Track'
import css from '../styles/components/mobileParty.scss'

const sampleTracks = [
  {
    name: 'Riptide',
    artists: ['Vance Joy'],
    cover: 'https://i.scdn.co/image/cefc7b35a2000f0dcfc676cee8bd9af26b6c751b',
    altText: '+5'
  },
  {
    name: 'Hey Brother',
    artists: ['Avicii'],
    cover: 'https://i.scdn.co/image/98c5699709d8c2497f34a177d159e1b1733f25bb',
    altText: '+2'
  }
]

class MobileParty extends Component {
  render() {
    const tracks = sampleTracks.map((track) => <Track {...track} key={track.name} />)

    return (
      <div>
        {/* --- song status --- */}
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
          {/* progress bar */}
          <ProgressBar percent={20} />
        </div>
        {/* --- queue --- */}
        <div className={css.container}>
          {tracks}
        </div>
      </div>
    )
  }
}

export default MobileParty
