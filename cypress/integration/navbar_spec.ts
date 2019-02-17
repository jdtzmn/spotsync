/// <reference types="cypress" />

const boxShadowCss = 'rgba(77, 77, 77, 0.5) 0px 2px 4px 0px'

describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Renders on the Index page', () => {
    cy
      .get("[data-cy='navbar']")
      .should('be.visible')
  })

  it("Doesn't have a box-shadow", () => {
    cy
      .get("[data-cy='navbar']")
      .should('not.have.css', 'box-shadow', boxShadowCss)
  })

  it('Has a box-shadow on scroll', () => {
    cy
      .scrollTo(0, 10)
      .get("[data-cy='navbar']")
      .should('have.css', 'box-shadow', boxShadowCss)
  })
})
