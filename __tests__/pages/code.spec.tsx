import * as React from 'react'
import { shallow } from 'enzyme'
import Code from 'pages/Code'

describe('Code', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Code />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
