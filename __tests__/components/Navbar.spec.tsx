import * as React from 'react'
import { shallow } from 'enzyme'
import Navbar from 'components/Navbar'

describe('Navbar', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Navbar />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
