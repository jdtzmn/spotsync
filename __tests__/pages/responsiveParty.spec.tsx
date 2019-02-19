import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ResponsiveParty from 'pages/responsiveParty'

describe('ResponsiveParty', () => {
  let wrapper: ShallowWrapper
  beforeEach(() => {
    wrapper = shallow(<ResponsiveParty />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should set isMobile to true when less than 768px', () => {
    // Change the viewport to 767px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 767
    })
    window.dispatchEvent(new Event('resize'))

    expect(wrapper.state('isMobile')).toBe(true)
  })

  it('should set isMobile to false when wider than 768px', () => {
    // Change the viewport to 1024px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    })
    window.dispatchEvent(new Event('resize'))

    expect(wrapper.state('isMobile')).toBe(false)
  })

  it('should render MobileParty when less than 768px', () => {
    // Change the viewport to 767px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 767
    })
    window.dispatchEvent(new Event('resize'))

    expect(wrapper.find('MobileParty')).toHaveLength(1)
    expect(wrapper.find('DesktopParty')).toHaveLength(0)
  })

  it('should render DesktopParty when wider than 768px', () => {
    // Change the viewport to 1024px
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    })
    window.dispatchEvent(new Event('resize'))

    expect(wrapper.find('DesktopParty')).toHaveLength(1)
    expect(wrapper.find('MobileParty')).toHaveLength(0)
  })
})
