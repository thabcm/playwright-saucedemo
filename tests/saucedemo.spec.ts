import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

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
});