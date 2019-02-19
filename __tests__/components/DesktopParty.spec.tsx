import * as React from 'react'
import { shallow } from 'enzyme'
import DesktopParty from 'components/DesktopParty'

describe('DesktopParty', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<DesktopParty />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
