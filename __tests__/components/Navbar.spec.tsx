import * as React from 'react'
import { shallow } from 'enzyme'
import Navbar from 'components/Navbar'

describe('Code', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Navbar />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
