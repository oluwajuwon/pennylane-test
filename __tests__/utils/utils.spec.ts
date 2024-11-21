import { isDatePassed } from '../../src/utils'

describe('isDatePassed tests', () => {
  it('Should return true if the date is in the past, hence passed', () => {
    const pastDate = '2023-01-01'
    expect(isDatePassed(pastDate)).toBe(true)
  })

  it('Should return false if the date is in the future, hence not passed', () => {
    const futureDate = '2100-01-01'
    expect(isDatePassed(futureDate)).toBe(false)
  })
})
