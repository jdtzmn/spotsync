import { isFn, runIfIsFn } from 'components/helpers'

describe('isFn', () => {
  it('should return true if a function is inputted', () => {
    expect(isFn(() => true)).toBe(true)
  })

  it('should return false when anything else is inputted', () => {
    expect(isFn('something else')).toBe(false)
  })
})

describe('runIfIsFn', () => {
  it('should run the function if it is one', () => {
    const fn = jest.fn()
    runIfIsFn(fn)
    expect(fn).toHaveBeenCalled()
  })

  it('should not error if input is not a function', () => {
    const fn = 'not a function'
    runIfIsFn(fn)

    // it would throw an error now if it tried to run it
  })
})
