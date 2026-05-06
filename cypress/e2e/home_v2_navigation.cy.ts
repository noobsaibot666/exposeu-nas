describe('Home V2 navigation', () => {
  const homeUrl = Cypress.config('baseUrl') ?? 'http://localhost:5173/'

  it('keeps the desktop navigation visible over and after the fullscreen video hero', () => {
    cy.viewport(1280, 800)
    cy.visit(homeUrl)

    cy.get('.home--v2 .top-nav__bar').should('be.visible')
    cy.contains('.top-nav__brand', 'expose.u').should('be.visible')
    cy.contains('.top-nav__link', 'Work').should('be.visible')
    cy.contains('.top-nav__link', 'Contact').should('be.visible')

    cy.scrollTo(0, 900)

    cy.get('.home--v2 .top-nav__bar').should('be.visible')
    cy.contains('.top-nav__brand', 'expose.u').should('be.visible')
  })

  it('shows the mobile menu toggle over the fullscreen video hero', () => {
    cy.viewport(390, 844)
    cy.visit(homeUrl)

    cy.get('.home--v2 .top-nav__toggle')
      .should('be.visible')
      .click()

    cy.get('.top-nav__drawer.is-open').should('be.visible')
    cy.contains('.top-nav__drawer-link .top-nav__link', 'Contact').should('be.visible')
  })
})
