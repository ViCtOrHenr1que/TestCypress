describe('Testes no site Livraria Cultura', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    cy.visit('/')
    cy.wait(2000)
  })

  it('Teste 1 — Site abre com título correto', () => {
    cy.title().should('contain', 'Livraria Cultura')
    cy.url().should('include', 'www3.livrariacultura.com.br')
  })

  it('Teste 2 — Campo de busca aparece', () => {
    cy.get('input.fulltext-search-box', { timeout: 10000 })
      .should('be.visible')
  })

  it('Teste 3 — Buscar um termo e abrir resultados', () => {
    cy.get('input.fulltext-search-box', { timeout: 10000 })
      .should('be.visible')
      .type('Harry Potter')

    cy.get('input.btn-buscar')
      .should('be.visible')
      .click()

    cy.url().should('include', '/busca/')
    cy.url().should('include', 'ft=')

    cy.get('.prateleiraProduto', { timeout: 15000 })
      .should('exist')
  })

  it('Teste 4 — Verificar se clicar no card abre a página do produto', () => {

    cy.visit('/');

    cy.get('input.fulltext-search-box', { timeout: 10000 })
      .should('be.visible')
      .type('A CIÊNCIA DE HARRY POTTER');

    cy.get('input.btn-buscar').click();

    cy.get('.prateleiraProduto[data-product-id="10751723"]', { timeout: 15000 })
      .should('be.visible')
      .as('cardProduto');

    cy.get('@cardProduto')
      .find('a[title="A CIÊNCIA DE HARRY POTTER"]')
      .first()
      .click({ force: true });

    cy.url({ timeout: 10000 })
      .should('include', '/a-ciencia-de-harry-potter-2112264835/p');

    cy.contains('A CIÊNCIA DE HARRY POTTER')
      .should('be.visible');

  });

  it('Teste 5 - Verifica se todos os links das redes sociais estão ativos', () => {

    const redes = [
      { nome: 'Facebook', selector: 'a[href*="facebook"]' },
      { nome: 'Instagram', selector: 'a[href*="instagram"]' },
      { nome: 'YouTube', selector: 'a[href*="youtube"]' },
      { nome: 'TikTok', selector: 'a[href*="tiktok"]' }
    ];

    cy.visit('/');

    redes.forEach((rede) => {

      cy.get(rede.selector)
        .should('exist')
        .and('have.attr', 'href')
        .and('not.be.empty')
        .then((href) => {
          cy.log(`✔ ${rede.nome} configurado: ${href}`);
        });
    });

  });

})
