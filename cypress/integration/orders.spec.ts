describe('Orders', () => {
  beforeEach(() => {
    cy.visit('/orders/1/addOrder');
  });
  it('should navigate to login', () => {
    cy.url().should('include', '/login');
  });
  it('should show errors with invalid fields', () => {
    cy.get('[name="email"]').type('test@test.com');
    cy.get('[name="password').type('password1');
    cy.get('.btn-success').click();

    const productNameSelector = '[name="productName"]';
    const priceSelector = '[name="itemCost"]';
    cy.get(productNameSelector).type('1').clear();
    cy.get(productNameSelector).blur();
    cy.get('[name="name-error"]').should('contain', 'Product Name is required');
    cy.get(priceSelector).type('1').clear();
    cy.get(priceSelector).blur();
    cy.get('[name="password-error"]').should('contain', 'Price is required');
  });
  it('should navigate to orders', () => {
    cy.get('[name="email"]').type('test@test.com');
    cy.get('[name="password').type('password1');
    cy.get('.btn-success').click();

    cy.get('[id="addAnotherProduct"]').click();
    cy.get('[name="productName"]').type('test');
    cy.get('[name="itemCost"]').type('50');
    cy.get('.btn-success').click();
    cy.url().should('include', '/orders');
  })
});
