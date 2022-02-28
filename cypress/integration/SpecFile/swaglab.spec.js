/// <reference types="cypress" />

describe('Login Test', () => {


  it('Verify UI of login page', () => {
    //Open the link
    cy.visit('https://www.saucedemo.com/')
    //Verify placeholder and button content
    cy.get('.login_logo').should('exist')
    cy.get('#user-name').invoke('attr', 'placeholder').should('contain', 'Username')
    cy.get('#password').invoke('attr', 'placeholder').should('contain', 'Password')
    cy.get('#login-button').should('have.value', 'Login')
    cy.get('.bot_column').should('exist')
  })
  it('Verify when user login with standard user', () => {
    //Enter username and password and login
    cy.get('#user-name').type(Cypress.env('std_user'))
    cy.get('#password').type(Cypress.env('pwd'))
    cy.get('#login-button').click()
    cy.get('#inventory_container').should('exist')
  })
  it('Verify UI of home page', () => {

    cy.get('.app_logo').should('have.css', 'background-image').and('include', '/static/media/logo3x.096bf4a7.svg')
    cy.get('#react-burger-menu-btn').should('exist')
    cy.get('.title').should('have.text', 'Products')
    cy.get('.peek').should('have.css', 'background-image').and('include', '/static/media/headerBot3x.db38f1aa.svg')
    cy.get('.product_sort_container').should('exist')
    cy.get('.inventory_item').should('have.length', '6')
    cy.get('.inventory_item .inventory_item_img .inventory_item_img').should('have.attr', 'alt').should('not.be.empty')
    cy.get('.inventory_item .inventory_item_name').should('have.length', '6').should('not.be.empty')
    cy.get('.inventory_item .inventory_item_desc').should('have.length', '6').should('not.be.empty')
    cy.get('.inventory_item .inventory_item_price').should('have.length', '6').should('contain', "$")
    cy.get('[id^=add-to-cart]').should('have.length', '6').should('contain', "Add to cart")
    cy.get('.footer .social_twitter a').should('exist').should('have.attr', 'href').and('include', 'twitter.com')
    cy.get('.footer .social_facebook a').should('exist').should('have.attr', 'href').and('include', 'facebook.com')
    cy.get('.footer .social_linkedin a').should('exist').should('have.attr', 'href').and('include', 'linkedin.com')
    cy.get('.footer_copy').should('exist')
  })
  it('Verify when user clicks on add to cart from home page', () => {
    //Check badge is empty
    cy.get('.shopping_cart_link .shopping_cart_badge').should('not.exist')

    cy.get('[id^=add-to-cart]').first().click()

    cy.get('.shopping_cart_link .shopping_cart_badge').should('exist')
    //check cart has 1 element
    cy.get('.shopping_cart_link .shopping_cart_badge').should('contain', '1')
    cy.get('[id^=add-to-cart]').first().click()
    cy.get('.shopping_cart_link .shopping_cart_badge').should('exist')
    //check cart has 2 element
    cy.get('.shopping_cart_link .shopping_cart_badge').should('contain', '2')

  })
  it('Verify when user clicks on Reset app status', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('#reset_sidebar_link').should('exist').should('contain', 'Reset App State')
    cy.get('#reset_sidebar_link').click()
    cy.get('.shopping_cart_link .shopping_cart_badge').should('not.exist')

  })
  it('Verify the link of About', () => {
    //Check the url of about icon
    cy.get('#about_sidebar_link').should('exist').should('contain', 'About').should('have.attr', 'href', 'https://saucelabs.com/')


  })

  it('Verify when user click on close', () => {

    cy.get('#react-burger-cross-btn').should('exist').click()
    cy.get('#react-burger-menu-btn').should('exist')
    cy.get('#react-burger-cross-btn').should('not.visible')
  })
  it('Verify filter works as expected', () => {
    //click on filter by name a to z
    cy.get('.product_sort_container').select('az')
    //Saving the 1st item name in variable
    cy.get('.inventory_item_name').first().then(($firstElementName) => {

      const txt = $firstElementName.text()
      //click on filter by name z to a
      cy.get('.product_sort_container').select('za')
      //saving the last item in varibale and comparing with variable retrived earlier
      cy.get('.inventory_item_name').last().should(($lastElementName) => {
        expect($lastElementName.text()).to.eq(txt)

      })
    })
    //click on filter price low to high
    cy.get('.product_sort_container').select('lohi')
    //Saving the 1st item price
    cy.get('.inventory_item_price').first().then(($firstElementPrice) => {


      const txt = $firstElementPrice.text()
      //click on filter price high to low
      cy.get('.product_sort_container').select('hilo')

      // compare the two price and
      // make sure they are same
      cy.get('.inventory_item_price').last().should(($lastElementPrice) => {
        expect($lastElementPrice.text()).to.eq(txt)

      })
    })
  })
  it('Verify checkout flow', () => {
    //login with std user
    cy.visit('https://www.saucedemo.com/')
    cy.get('#user-name').type(Cypress.env('std_user'))
    cy.get('#password').type(Cypress.env('pwd'))
    cy.get('#login-button').click()
    cy.get('#inventory_container').should('exist')
    cy.get('.inventory_item_name').first().then(($firstElementName) => {
      const name = $firstElementName.text()
      cy.get('.inventory_item_price').first().then(($firstElementPrice) => {
        const price = $firstElementPrice.text()
        cy.get('.inventory_item_desc').first().then(($firstElementDesc) => {
          const desc = $firstElementDesc.text()
          cy.get('[id^=add-to-cart]').first().click()
          //Add one element to cart and check the value,name and desc is same
          cy.get('.shopping_cart_link .shopping_cart_badge').should('exist')
          cy.get('#remove-sauce-labs-backpack').should('exist').should('contain', 'Remove')
          cy.get('.shopping_cart_link').click()
          cy.get('.title').should('contain', 'Your Cart')
          cy.get('.cart_quantity_label').should('contain', 'QTY')
          cy.get('.cart_desc_label').should('contain', 'DESCRIPTION')
          cy.get('.cart_quantity').should('contain', '1')
          cy.get('#remove-sauce-labs-backpack').should('contain', 'Remove')
          cy.get('.inventory_item_name').invoke('text').should('equal', name)

          cy.get('.inventory_item_price').invoke('text').should('equal', price)
          cy.get('.inventory_item_desc').invoke('text').should('equal', desc)
          cy.get('#checkout').should('contain', 'Checkout').click()
          //enter the name and postal code
          cy.get('#first-name').should('have.attr', 'placeholder', 'First Name').type('abc')
          cy.get('#last-name').should('have.attr', 'placeholder', 'Last Name').type('def')
          cy.get('#postal-code').should('have.attr', 'placeholder', 'Zip/Postal Code').type('1234')
          cy.get('#continue').should('have.value', 'Continue').click()


          cy.get('.title').should('contain', 'Checkout: Overview')
          cy.get('.cart_quantity_label').should('contain', 'QTY')
          cy.get('.cart_desc_label').should('contain', 'DESCRIPTION')
          cy.get('.cart_quantity').should('contain', '1')
          cy.get('.inventory_item_name').invoke('text').should('equal', name)

          cy.get('.inventory_item_price').invoke('text').should('equal', price)
          cy.get('.inventory_item_desc').invoke('text').should('equal', desc)



          cy.get('.summary_info_label').first().should('contain', 'Payment Information:')
          cy.get('.summary_value_label').first().should('contain', 'SauceCard #31337')
          cy.get('.summary_info_label').last().should('contain', 'Shipping Information:')
          cy.get('.summary_value_label').last().should('contain', 'FREE PONY EXPRESS DELIVERY!')


          cy.get('.summary_subtotal_label').should('contain', 'Item total: $')
          cy.get('.summary_tax_label').should('contain', 'Tax: $')
          cy.get('.summary_total_label').should('contain', 'Total: $')

          cy.get('#finish').should('contain', 'Finish').click()
          cy.get('.complete-header').should('contain', 'THANK YOU FOR YOUR ORDER')
          cy.get('#back-to-products').should('contain', 'Back Home').click()

          cy.get('#inventory_container').should('exist')

        })

      })
    })
  })
})
