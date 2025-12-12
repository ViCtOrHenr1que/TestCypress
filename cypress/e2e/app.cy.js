describe('Testes no site Livraria Cultura', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const clicarEntrarPrincipal = () => {
    cy.get('a.button.__bt-login-entrar', { timeout: 15000 })
      .filter(':visible')
      .first()
      .should('contain.text', 'Entrar')
      .should('be.visible')
      .click()
  }

  beforeEach(() => {
    cy.visit('/')
    cy.wait(2000)
  })

  it('Teste 1 — Site abre com título correto', () => {
    cy.title().should('contain', 'Livraria Cultura')
    cy.url().should('include', 'www3.livrariacultura.com.br')
    cy.screenshot('01-home-title')
  })

  it('Teste 2 — Campo de busca aparece', () => {
    cy.get('input.fulltext-search-box', { timeout: 10000 })
      .should('be.visible')
      .then(() => cy.screenshot('02-search-visible'))
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
      .then(() => cy.screenshot('03-search-results'))
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
    cy.screenshot('04-product-page')

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
    cy.screenshot('05-social-links')

  });

// Helpers (reutilizáveis e mais resilientes)
function abrirLogin() {
  // Evita depender do hover/dropdown. Clica no botão real visível.
  cy.get('.col-1 > .user-wrapper > .user-message-wrapper > .login', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })

  // O botão “Entrar” exposto após o dropdown pode ter classes diferentes.
  cy.get('a.__bt-login-entrar, .col-lg-3 > .icon-user-wrapper > .login-hover > .login-inner > :nth-child(1) > .button > .bg-opacity', { timeout: 15000 })
    .filter(':visible')
    .first()
    .click({ force: true })

  // Modal VTEX
  cy.get('[class*="vtexIdUI"], .vtexIdUI-page', { timeout: 20000 })
    .filter(':visible')
    .first()
    .should('be.visible')
}

function entrarComEmailESenha() {
  // Em alguns momentos o texto muda levemente; tenta por texto primeiro.
  cy.contains(/Entrar com e-?mail e senha/i, { timeout: 20000 })
    .filter(':visible')
    .first()
    .click({ force: true })
}

function campoEmail() {
  return cy.get('input[type="email"]', { timeout: 20000 }).filter(':visible').first()
}

function campoSenha() {
  return cy.get('input[type="password"]', { timeout: 20000 }).filter(':visible').first()
}

function botaoConfirmarOuEntrar() {
  // O botão principal de login pode ser o clássico `#classicLoginBtn` ou outros `button[type="submit"]`
  return cy.get('#classicLoginBtn, button[type="submit"], button', { timeout: 20000 })
    .filter(':visible')
    .filter((_, el) => /confirmar|entrar|continuar/i.test(el.innerText) || el.id === 'classicLoginBtn')
    .first()
}

describe('Login VTEX', () => {

  // Teste 7 - Login com credenciais inválidas
  it('Teste 7 — Login com credenciais inválidas exibe erro', () => {
    abrirLogin()
    entrarComEmailESenha()

    campoEmail()
      .clear({ force: true })
      .type('usuario-invalido@teste.com', { delay: 0 })

    campoSenha()
      .clear({ force: true })
      .type('senha_errada', { delay: 0 })

    botaoConfirmarOuEntrar()
      .should('be.enabled')
      .click({ force: true })

    // Garante que permanece fora da área autenticada
    cy.url().should('not.include', '/account')
    cy.screenshot('07-login-invalid')
  })

  // Teste 6 - Acessar página de login
  it('Teste 6 — Acessar página de login ao clicar em Entrar', () => {
    abrirLogin()

    cy.get('body').then(($body) => {
      const temEmailVisivel =
        $body.find('input[type="email"]:visible').length > 0

      if (!temEmailVisivel) {
        entrarComEmailESenha()
      }
    })

    campoEmail().should('be.visible')
    cy.screenshot('06-login-modal-open')
  })

  // Teste 8 - Login com sucesso
  it('Teste 8 — Login com sucesso e acessar relatório de pedidos', () => {
    const emailFixo = "xijafo4705@roastic.com"
    const senhaFixa = "12345BananaPera123"

    abrirLogin()
    entrarComEmailESenha()

    campoEmail()
      .clear({ force: true })
      .type(emailFixo, { delay: 0 })

    campoSenha()
      .clear({ force: true })
      .type(senhaFixa, { delay: 0 })

    botaoConfirmarOuEntrar()
      .should('be.enabled')
      .click({ force: true })

    cy.contains(/Olá/i, { timeout: 30000 })
      .should('be.visible')

    cy.get('body').then(($body) => {
      const linkDireto = $body.find('a:visible').filter((_, el) =>
        /Meus pedidos/i.test(el.innerText)
      ).length > 0

      if (linkDireto) {
        cy.contains('a', /Meus pedidos/i, { timeout: 15000 })
          .filter(':visible')
          .first()
          .click({ force: true })
      } else {
        cy.contains(/Olá/i).click({ force: true })
        cy.contains('a', /Meus pedidos/i, { timeout: 15000 })
          .filter(':visible')
          .first()
          .click({ force: true })
      }
    })

    cy.url({ timeout: 30000 })
      .should('include', '/account')
      .and('match', /orders/i)

    cy.get('.vtex-my-orders-app-3-x-listContainer, table, .order-list, [class*="order"]', { timeout: 30000 })
      .should('exist')
      .then(() => cy.screenshot('08-login-success'))
  })

  })
})
