import { test, expect } from '@playwright/test';

test.describe('Sauce Demo - Fluxo de Compra', () => {
  
  // Executado antes de cada teste
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Deve realizar login com sucesso', async ({ page }) => {
    // Preenche as credenciais padrão do site
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Valida se o login funcionou verificando se a barra de título da loja está visível
    const title = page.locator('.title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Products');
  });

  test('Deve adicionar um item ao carrinho com sucesso', async ({ page }) => {
    // Login rápido
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Adiciona o primeiro produto ("Sauce Labs Backpack") ao carrinho
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Valida se o ícone do carrinho passou a exibir o número "1"
    const shoppingCartBadge = page.locator('.shopping_cart_badge');
    await expect(shoppingCartBadge).toBeVisible();
    await expect(shoppingCartBadge).toHaveText('1');
  });

  test('Deve exibir mensagem de erro ao tentar fazer login com usuário bloqueado', async ({ page }) => {
    // Tenta fazer login com um usuário que está bloqueado no Sauce Demo
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Localiza o container de erro
    const errorMessage = page.locator('[data-test="error"]');
    
    // Valida se o elemento de erro está visível e contém o texto esperado
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Deve ordenar os produtos por preço do menor para o maior', async ({ page }) => {
    // Realiza o login padrão
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Seleciona a opção de ordenação por preço (Low to High) no elemento select
    // O valor 'lohi' corresponde a essa opção no HTML do Sauce Demo
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    // Captura todos os elementos de preço visíveis na página
    const priceLocators = page.locator('.inventory_item_price');
    
    // Obtém os textos de todos os preços e os converte para números
    const allPricesText = await priceLocators.allTextContents();
    const pricesAsNumbers = allPricesText.map(price => parseFloat(price.replace('$', '')));

    // Cria uma cópia da lista de preços e ordena de forma crescente para usar como referência
    const sortedPricesExpected = [...pricesAsNumbers].sort((a, b) => a - b);

    // Valida se a lista capturada na tela está idêntica à nossa lista ordenada esperada
    expect(pricesAsNumbers).toEqual(sortedPricesExpected);
  });

  test('Deve remover um item do carrinho com sucesso', async ({ page }) => {
    // Login e adição inicial
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Valida que o carrinho tem 1 item antes de remover
    const shoppingCartBadge = page.locator('.shopping_cart_badge');
    await expect(shoppingCartBadge).toHaveText('1');

    // Clica no botão de remover (que substitui o botão de adicionar)
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Valida que o contador do carrinho desapareceu da tela (ficou vazio)
    await expect(shoppingCartBadge).not.toBeVisible();
  });

  test('Deve finalizar uma compra com sucesso passando pelo checkout', async ({ page }) => {
    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Adicionar produto e ir para o carrinho
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Avançar para o Checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Preencher dados de envio
    await page.locator('[data-test="firstName"]').fill('Thalita');
    await page.locator('[data-test="lastName"]').fill('Melo');
    await page.locator('[data-test="postalCode"]').fill('50000-000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // Finalizar a compra
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

    // Validar mensagem de sucesso
    const successHeader = page.locator('.complete-header');
    await expect(successHeader).toBeVisible();
    await expect(successHeader).toHaveText('Thank you for your order!');
  });
});