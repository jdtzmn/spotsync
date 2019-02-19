import React, { Component } from 'react'
import { runIfIsFn } from './helpers'
import css from '../styles/components/track.scss'

interface TrackProps {
  name: string,
  cover: string,
  artists: string[],
  altText?: string
  onAltClick?: (event) => void
}

class Track extends Component<TrackProps> {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { onAltClick } = this.props
    runIfIsFn(onAltClick)
  }

  render() {
    const { name, cover, artists, altText } = this.props
    const artistsText = artists.join(', ')

    return (
      <div className={css.track}>
        <img
          src={cover}
          className={css.cover}
          alt=""
        />
        <div className={css.detailsContainer}>
          <div className={css.details}>
            <h1 className={css.name}>{name}</h1>
            <sub className={css.artists}>{artistsText}</sub>
          </div>
        </div>
        <div className={css.verticalAlign}>
          {altText ? <div className={css.altText} onClick={this.handleClick}>{altText}</div> : undefined}
        </div>
      </div>
    )
  }
}

export default Track
