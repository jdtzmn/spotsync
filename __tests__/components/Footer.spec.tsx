import * as React from 'react'
import { shallow } from 'enzyme'
import Footer from 'components/Navbar'

describe('Footer', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Footer />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
