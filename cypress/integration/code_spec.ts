/// <reference types="cypress" />

describe('Code', () => {
  beforeEach(() => {
    cy.visit('/code')
  })

  const getNumber = (index) => cy.get(`[data-cy="number-${index}"]`)

  it('Should autofocus the first input', () => {
    cy.visit('/')
    cy.visit('/code')
    cy
      .focused()
      .should('have.attr', 'data-cy', 'number-0')
  })

  it('Should not allow typing letters', () => {
    // Type a letter
    getNumber(0)
      .type('a')
      .should('have.value', '')

    // Type a number
    getNumber(0)
      .type('1')
      .should('have.value', '1')
  })

  it('Should focus the last input on backspace', () => {
    getNumber(1)
      .focus()
      .type('{backspace}')
    cy
      .focused()
      .should('have.attr', 'data-cy', 'number-0')
  })

  it('Should redirect upon typing all numbers', () => {
    // type in all the numbers
    const numbers = '314159'.split('')

    for (let i = 0; i < numbers.length; i++) {
      getNumber(i).type(numbers[i])
    }

    cy.location('pathname', { timeout: 30000 })
      .should('include', '/party/314159')
  })
})
