import * as React from 'react'
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme'
import MediaControl from 'components/MediaControl'

describe('MediaControl', () => {
  let wrapper: ShallowWrapper
  beforeEach(() => {
    wrapper = shallow(<MediaControl />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with the correct initialState', () => {
    expect(wrapper.state('paused')).toBe(false)

    const testWrapper = shallow(<MediaControl initialState='paused' />)
    expect(testWrapper.state('paused')).toBe(true)
  })
})

describe('mounted MediaControl', () => {
  let wrapper: ReactWrapper
  beforeEach(() => {
    wrapper = mount(<MediaControl />)
  })

  it('should adjust size based on size prop', () => {
    expect(wrapper.find('svg').prop('width')).toBe('22px')

    wrapper.setProps({ size: '50px' })
    expect(wrapper.find('svg').prop('width')).toBe('50px')
  })

  it('should call onToggle when clicked', () => {
    const onToggle = jest.fn()
    wrapper.setProps({ onToggle })

    wrapper.find('svg').simulate('click')
    expect(onToggle).toHaveBeenCalled()
  })

  it('should only call onPlay when paused', () => {
    // set props
    const onPlay = jest.fn()
    const onPause = jest.fn()
    wrapper.setProps({ onPlay, onPause })

    // set state
    wrapper.setState({ paused: true })

    // simulate click
    wrapper.find('svg').simulate('click')

    expect(onPlay).toHaveBeenCalled()
    expect(onPause).not.toHaveBeenCalled()
  })

  it('should only call onPause when playing', () => {
    // set props
    const onPlay = jest.fn()
    const onPause = jest.fn()
    wrapper.setProps({ onPlay, onPause })

    // set state
    wrapper.setState({ paused: false })

    // simulate click
    wrapper.find('svg').simulate('click')

    expect(onPause).toHaveBeenCalled()
    expect(onPlay).not.toHaveBeenCalled()
  })

  it('should not error when props are not provided', () => {
    // simulate click
    wrapper.find('svg').simulate('click')

    // jest will catch an error if one occurs
  })
})
