import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ProgressBar from 'components/ProgressBar'

describe('Progress', () => {
  let wrapper: ShallowWrapper
  beforeEach(() => {
    wrapper = shallow(<ProgressBar percent={0} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render the correct default props', () => {
    expect(wrapper.prop('style'))
      .toEqual({
        backgroundColor: '#403EBE',
        height: 2,
        width: 0
      })
  })

  it('should render according to props', () => {
    wrapper.setProps({
      color: 'blue',
      height: 4,
      percent: 5
    })

    expect(wrapper.prop('style'))
      .toEqual({
        backgroundColor: 'blue',
        height: 4,
        width: '5%'
      })
  })

  it('should allow custom props to be added to the div', () => {
    wrapper.setProps({ test: 'prop' })

    expect(wrapper.prop('test')).toBe('prop')
  })
})
