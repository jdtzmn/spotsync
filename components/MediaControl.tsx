import React, { Component, CSSProperties } from 'react'

import PlayIcon from 'react-ionicons/lib/IosPlay'
import PauseIcon from 'react-ionicons/lib/IosPause'

const isFn = (fn) => typeof fn === 'function'
const runIfIsFn = (fn, ...args) => {
  if (isFn(fn)) fn(...args)
}

interface MediaControlProps {
  style?: CSSProperties,
  className?: string,
  size?: string,
  color?: string,
  initialState?: string,
  onPlay?: () => void,
  onPause?: () => void,
  onToggle?: () => void,
}

class MediaControl extends Component<MediaControlProps> {
  state = {
    paused: false
  }

  constructor (props) {
    super(props)

    const startsPaused = props.initialState === 'paused'
    this.state = {
      paused: startsPaused
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    // Toggle the paused state
    const { paused } = this.state
    this.setState({ paused: !paused })

    // Emit necessary events
    const { onToggle, onPlay, onPause } = this.props

    // Emit onPlay if paused and onPause if playing
    if (paused) {
      runIfIsFn(onPlay, event)
    } else {
      runIfIsFn(onPause, event)
    }

    // Emit onToggle event either way
    runIfIsFn(onToggle, event)
  }

  render() {
    const { paused } = this.state
    const { size, color, style, className } = this.props

    let icon
    if (paused) {
      icon = (
        <PlayIcon
          fontSize={size}
          color={color}
          onClick={this.handleClick}
        />
      )
    } else {
      icon = (
        <PauseIcon
          fontSize={size}
          color={color}
          onClick={this.handleClick}
        />
      )
    }

    return (
      <div style={style} className={className}>
        {icon}
      </div>
    )
  }
}

export default MediaControl
