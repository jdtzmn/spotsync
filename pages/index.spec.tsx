import * as React from 'react'
import { shallow } from 'enzyme'
import Index from './index'

describe('Index', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Index />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
