import React, { Component } from 'react'
import Page from '../layouts/main'
import MobileParty from '../components/MobileParty'
import DesktopParty from '../components/DesktopParty'

class ResponsiveParty extends Component {
  state = {
    isMobile: true
  }

  constructor (props) {
    super(props)

    this.handleResize = this.handleResize.bind(this)
  }

  render() {
    const { isMobile } = this.state
    return (
      <Page>
        {isMobile ? <MobileParty /> : <DesktopParty />}
      </Page>
    )
  }

  handleResize () {
    const currentState = this.state.isMobile
    const isMobile = window.innerWidth < 768

    // Only update the state if there is a change
    if (isMobile !== currentState) {
      this.setState({ isMobile })
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }
}

export default ResponsiveParty
