/// <reference types="cypress" />

describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Renders on the Index page', () => {
    cy
      .get("[data-cy='navbar']")
      .should('be.visible')
  })

  it('Has responsive font size', () => {
    // iPhone 5
    cy.viewport('iphone-5')
    cy
      .get("[data-cy='navbar']")
      .should('have.css', 'font-size', '10px')

    // Macbook Pro 15
    cy.viewport('macbook-15')
    cy
      .get("[data-cy='navbar']")
      .should('have.css', 'font-size', '14px')
  })
})
