import { Page, Locator } from '@playwright/test';

export class LoginPage {
  // Definir os tipos dos locators
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // Inicializar os locators no construtor
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Criar os métodos de ação
  async entrarPagina() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async realizarLogin(usuario: string, senha?: string) {
    await this.usernameInput.fill(usuario);
    // Se não passar a senha, usa a padrão do site
    await this.passwordInput.fill(senha || 'secret_sauce');
    await this.loginButton.click();
  }
}