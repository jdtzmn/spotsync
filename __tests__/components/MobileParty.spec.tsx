import * as React from 'react'
import { shallow } from 'enzyme'
import MobileParty from 'components/MobileParty'

describe('MobileParty', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<MobileParty />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
