import * as React from 'react'
import { shallow } from 'enzyme'
import Find from 'pages/Find'

describe('Find', () => {
  let wrapper
  beforeEach(() => {
    // Mock Math.random()
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.000000
    global.Math = mockMath

    wrapper = shallow(<Find />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
