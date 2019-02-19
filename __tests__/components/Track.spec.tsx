import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import Track from 'components/Track'

describe('ResponsiveParty', () => {
  let wrapper: ShallowWrapper
  beforeEach(() => {
    wrapper = shallow(<Track name='' cover='' artists={[]} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render based on props', () => {
    // set props
    const props = {
      name: 'Test Name',
      cover: 'https://cover.url',
      artists: ['Artist 1', 'Artist 2'],
      altText: 'Test altText'
    }
    wrapper.setProps(props)

    // make sure it renders correctly
    expect(wrapper
      .find('img')
      .prop('src'))
      .toBe(props.cover)
    expect(wrapper
      .find('h1')
      .text())
      .toBe(props.name)
    expect(wrapper
      .find('sub')
      .text())
      .toBe(props.artists.join(', '))
    expect(wrapper
      .find('div')
      .last()
      .text())
      .toBe(props.altText)
  })

  it('should call onAltClick when altText is clicked', () => {
    // setup props
    const onAltClick = jest.fn()
    wrapper.setProps({
      altText: 'click me',
      onAltClick
    })
    wrapper.instance().forceUpdate()

    // click the altText
    wrapper
      .find('div')
      .last()
      .simulate('click')

    expect(onAltClick).toHaveBeenCalled()
  })
})
