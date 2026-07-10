# Automação de Testes com Playwright (utilizando Sauce Demo)

Este projeto é uma suíte de testes automatizados desenvolvida em Playwright com TypeScript, utilizando o site Sauce Demo para os cenários de teste. 

O objetivo principal foi aplicar boas práticas de automação, estruturando o projeto com o padrão de arquitetura Page Object Model (POM).

## O que já foi desenvolvido
* **Login:** Cenários com credenciais válidas e validação de mensagem de erro com usuário bloqueado.
* **Carrinho:** Adição e remoção de produtos.
* **Ordenação:** Validação lógica do filtro de produtos por preço (menor para maior).
* **Links de Redes Sociais:** Validar se os botões do rodapé redirecionam para as URLs corretas.
* **Página de Detalhes:** Validar a abertura da tela de um produto específico ao clicar em seu nome.
* **Navegação de Retorno:** Testar o botão "Voltar para os produtos" de dentro da tela de detalhes.
* **Interação com Mensagens:** Validar o fechamento da barra de erro de login ao clicar no botão "X".
* **Massa de dados dinâmica:** Utilizar bibliotecas para gerar dados aleatórios nos formulários de checkout.
* **Testes de API:** Automatizar testes de consumo de endpoints utilizando o módulo nativo do Playwright.
* **Relatórios Customizados:** Configurar geradores de relatórios visuais com Allure.

## Gerar relatório
* npm run test
* npm run allure:generate
* npm run allure:open
