import * as React from 'react'
import { shallow } from 'enzyme'
import Index from '../../pages/index'

describe('Index', () => {
  let wrapper
  beforeEach(() => {
    window.scrollTo = () => {/* mock scrollTo */}
    wrapper = shallow(<Index />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
