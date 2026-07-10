import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { faker } from '@faker-js/faker';

test.describe('Sauce Demo - Fluxo de Compra', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  // Instancia as páginas antes de cada teste
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.entrarPagina();
  });

  test('Deve realizar login com sucesso', async () => {
    await loginPage.realizarLogin('standard_user');
    
    await expect(productsPage.tituloPagina).toBeVisible();
    await expect(productsPage.tituloPagina).toHaveText('Products');
  });

  test('Deve exibir mensagem de erro ao tentar fazer login com usuário bloqueado', async () => {
    await loginPage.realizarLogin('locked_out_user');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Deve adicionar um item ao carrinho com sucesso', async () => {
    await loginPage.realizarLogin('standard_user');
    await productsPage.adicionarMochilaAoCarrinho();

    await expect(productsPage.iconeCarrinhoBadge).toBeVisible();
    await expect(productsPage.iconeCarrinhoBadge).toHaveText('1');
  });

  test('Deve remover um item do carrinho com sucesso', async () => {
    await loginPage.realizarLogin('standard_user');
    await productsPage.adicionarMochilaAoCarrinho();
    await expect(productsPage.iconeCarrinhoBadge).toHaveText('1');

    await productsPage.removerMochilaDoCarrinho();
    await expect(productsPage.iconeCarrinhoBadge).not.toBeVisible();
  });

  test('Deve ordenar os produtos por preço do menor para o maior', async () => {
    await loginPage.realizarLogin('standard_user');
    await productsPage.ordenarPor('lohi');

    const precosNaTela = await productsPage.obterPrecosComoNumeros();
    const precosOrdenadosEsperados = [...precosNaTela].sort((a, b) => a - b);

    expect(precosNaTela).toEqual(precosOrdenadosEsperados);
  });

  test('Deve conter os links corretos para as redes sociais no rodape', async () => {
    await loginPage.realizarLogin('standard_user');

    // Valida se os atributos 'href' dos links contêm as URLs corretas das redes sociais
    await expect(productsPage.linkTwitter).toHaveAttribute('href', 'https://twitter.com/saucelabs');
    await expect(productsPage.linkFacebook).toHaveAttribute('href', 'https://www.facebook.com/saucelabs');
  });

  test('Deve abrir a pagina de detalhes ao clicar no nome de um produto', async ({ page }) => {
    await loginPage.realizarLogin('standard_user');

    // Clica no link do primeiro produto mapeado na nossa Page
    await productsPage.primeiroProdutoLink.click();

    // Valida se a URL mudou para a página interna de detalhes do item
    await expect(page).toHaveURL(/.*inventory-item.html/);

    // Valida se o título principal que aparece na nova tela corresponde ao produto
    const nomeProdutoDetalhe = page.locator('[data-test="inventory-item-name"]');
    await expect(nomeProdutoDetalhe).toHaveText('Sauce Labs Backpack');
  });

  test('Deve voltar para a lista de produtos ao clicar no botao voltar', async ({ page }) => {
    await loginPage.realizarLogin('standard_user');
    
    // Entra na página de detalhes do produto
    await productsPage.primeiroProdutoLink.click();
    await expect(page).toHaveURL(/.*inventory-item.html/);

    // Usa a nova ação do POM para voltar
    await productsPage.voltarParaProdutos();

    // Valida se voltou para a página principal da loja
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Deve fechar a mensagem de erro de login ao clicar no botao X', async () => {
    // Força o erro fazendo login com usuário bloqueado
    await loginPage.realizarLogin('locked_out_user');
    await expect(loginPage.errorMessage).toBeVisible();

    // Clica no "X" usando o método do POM
    await loginPage.fecharMensagemErro();

    // Valida que o container de erro sumiu da tela
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('Deve preencher os dados de checkout usando massa de dados dinamica', async ({ page }) => {
    await loginPage.realizarLogin('standard_user');
    await productsPage.adicionarMochilaAoCarrinho();
    
    // Navega até o carrinho e avança para o checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Gerando os dados aleatórios com o Faker
    const nomeAleatorio = faker.person.firstName();
    const sobrenomeAleatorio = faker.person.lastName();
    const cepAleatorio = faker.location.zipCode('#####-###');

    // Preenche os campos usando as variáveis dinâmicas
    await page.locator('[data-test="firstName"]').fill(nomeAleatorio);
    await page.locator('[data-test="lastName"]').fill(sobrenomeAleatorio);
    await page.locator('[data-test="postalCode"]').fill(cepAleatorio);
    
    // Avança e finaliza a compra
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    // Valida a tela de sucesso
    const sucessoHeader = page.locator('.complete-header');
    await expect(sucessoHeader).toBeVisible();
    await expect(sucessoHeader).toHaveText('Thank you for your order!');
  });
});