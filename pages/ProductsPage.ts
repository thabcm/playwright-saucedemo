import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  // Definir os tipos dos locators
  readonly page: Page;
  readonly tituloPagina: Locator;
  readonly botaoAdicionarMochila: Locator;
  readonly botaoRemoverMochila: Locator;
  readonly iconeCarrinhoBadge: Locator;
  readonly seletorOrdenacao: Locator;
  readonly precosProdutos: Locator;
  readonly linkTwitter: Locator;
  readonly linkFacebook: Locator;

  // Inicializar os locators no construtor
  constructor(page: Page) {
    this.page = page;
    this.tituloPagina = page.locator('.title');
    this.botaoAdicionarMochila = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.botaoRemoverMochila = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.iconeCarrinhoBadge = page.locator('.shopping_cart_badge');
    this.seletorOrdenacao = page.locator('[data-test="product-sort-container"]');
    this.precosProdutos = page.locator('.inventory_item_price');
    this.linkTwitter = page.locator('.social_twitter a');
    this.linkFacebook = page.locator('.social_facebook a');
  }

  // Criar os métodos de ação
  async adicionarMochilaAoCarrinho() {
    await this.botaoAdicionarMochila.click();
  }

  async removerMochilaDoCarrinho() {
    await this.botaoRemoverMochila.click();
  }

  async ordenarPor(opcao: string) {
    await this.seletorOrdenacao.selectOption(opcao);
  }

  async obterPrecosComoNumeros(): Promise<number[]> {
    const todosPrecosTexto = await this.precosProdutos.allTextContents();
    return todosPrecosTexto.map(preco => parseFloat(preco.replace('$', '')));
  }
}