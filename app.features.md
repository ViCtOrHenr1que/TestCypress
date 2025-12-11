# Feature: Testes no site Livraria Cultura

## Scenario: Verificar se o site abre com o título correto
**Given** que estou na página inicial da Livraria Cultura  
**When** o site carregar  
**Then** o título da aba deve conter "Livraria Cultura"  
**And** a URL deve incluir "www3.livrariacultura.com.br"  

---

## Scenario: Verificar se o campo de busca aparece na página inicial
**Given** que estou na página inicial da Livraria Cultura  
**When** o site terminar de carregar  
**Then** o campo de busca deve ser exibido na página  

---

## Scenario: Buscar um termo e abrir a página de resultados
**Given** que estou na página inicial da Livraria Cultura  
**When** eu digito "Harry Potter" no campo de busca  
**And** clico no botão de buscar  
**Then** a URL deve conter "/busca/"  
**And** a URL deve conter "ft="  
**And** a lista de resultados deve ser exibida  

---

## Scenario: Clicar em um card e abrir a página de detalhes do produto
**Given** que estou na página inicial da Livraria Cultura  
**When** eu digito "A CIÊNCIA DE HARRY POTTER" no campo de busca  
**And** clico no botão de buscar  
**Then** o card do produto deve aparecer na lista de resultados  
**When** eu clico no card do produto  
**Then** devo ser redirecionado para a página do produto  
**And** o título "A CIÊNCIA DE HARRY POTTER" deve ser exibido na página de detalhes  

---

## Scenario: Verificar se todos os links das redes sociais possuem um href configurado
**Given** que estou na página inicial da Livraria Cultura  
**When** eu navego até o rodapé do site  
**Then** deve existir um link configurado para Facebook  
**And** deve existir um link configurado para Instagram  
**And** deve existir um link configurado para YouTube  
**And** deve existir um link configurado para TikTok  
**And** cada link deve possuir um atributo "href" preenchido  
