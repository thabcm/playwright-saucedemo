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
});