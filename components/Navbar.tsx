import * as React from 'react'
import css from '../styles/components/navbar.scss';

class Navbar extends React.Component {
  state = {
    hasScrolled: false
  }

  constructor (props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
  }

  render () {
    const { hasScrolled } = this.state

    return (
      <div className={css.navbar}>
        <div className={hasScrolled ? css.fixed : css.default}>
          <h1 className={css.navbarTitle}>Spotsync.</h1>
        </div>
      </div>
    )
  }

  handleScroll () {
    const hasScrolled = window.scrollY > 0
    this.setState({
      hasScrolled
    })
  }

  componentDidMount () {
    document.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScroll)
  }
}

export default Navbar
