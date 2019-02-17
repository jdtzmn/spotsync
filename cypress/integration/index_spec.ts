/// <reference types="cypress" />

describe('Index', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Finds the Get Started button', () => {
    cy.get("[data-cy='get-started']")
  })

  it('Has elements fade into view', () => {
    cy
      .get('[data-cy="party-icon"]')
      .should('have.css', 'opacity', '0')
      .scrollIntoView()
      .should('have.css', 'opacity', '1')
  })

  const getArtwork = () => cy.get('[data-cy="artwork"]')
  const getRender = () => cy.get('[data-cy="render"]')

  it('Renders a different image for mobile than desktop', () => {
    // iPhone 5
    cy.viewport('iphone-5')
    getArtwork().should('be.visible')
    getRender().should('not.be.visible')

    // Macbook Pro 15
    cy.viewport('macbook-15')
    getRender().should('be.visible')
    getArtwork().should('not.be.visible')
  })
})
