describe('Service Acquisition Path', () => {
  it('navigates from home to exhibitions, submits the contact form, and returns home', () => {
    // 1. Visit home
    cy.visit('http://localhost:5174');

    // 2. Navigate to Exhibitions page
    cy.contains('Exhibitions').click();

    // 3. Scroll to and click "Contact Us"
    cy.contains(/contact\s*us/i, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click();

    // 4. Fill and submit the form
    cy.get('form.contact__form')
      .should('be.visible')
      .within(() => {
        cy.get('#firstName').type('Jane');
        cy.get('#lastName').type('Doe');
        cy.get('#email').type('jane.doe@example.com');
        cy.get('#message').type('I am interested in exhibitions.');
        cy.contains(/send|submit/i).click();
      });

    // 5. Verify success message
    cy.contains(/thank you|your inquiry has been sent successfully/i, { timeout: 10000 })
      .should('be.visible');

    // 6. Click "Back to Home"
    cy.contains(/back\s*to\s*home/i)
      .should('be.visible')
      .click();

    // 7. Verify we're on the home page again
    cy.contains('Exhibitions').should('be.visible');
  });
});
