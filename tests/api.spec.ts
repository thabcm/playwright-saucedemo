import { test, expect } from '@playwright/test';

// SauceDemo não possui integração com backend para testar chamadas a APIs. 
// Simulando chamadas apenas para estudo com Playwright.

test.describe('Testes de API - Integração com ServeRest', () => {

  test('Deve buscar a lista de produtos cadastrados', async ({ request }) => {
    // Faz a requisição GET para listar os produtos do e-commerce simulado
    const resposta = await request.get('https://serverest.dev/produtos');

    // Valida se o status code é 200
    expect(resposta.status()).toBe(200);

    const corpoResposta = await resposta.json();
    
    // Valida se a API retornou a propriedade 'quantidade' e se ela é maior que zero
    expect(corpoResposta.quantidade).toBeGreaterThan(0);
    expect(corpoResposta.produtos.length).toBeGreaterThan(0);
  });

  test('Deve buscar um produto específico de forma dinâmica pelo ID', async ({ request }) => {
    // Garantindo que o ID é válido e ativo
    const listaResposta = await request.get('https://serverest.dev/produtos');
    const corpoLista = await listaResposta.json();
    
    // Pega ID do primeiro produto da lista
    const idProdutoValido = corpoLista.produtos[0]._id;

    // Faz a busca usando o ID dinâmico
    const respostaItem = await request.get(`https://serverest.dev/produtos/${idProdutoValido}`);

    // Valida se o status code é 200
    expect(respostaItem.status()).toBe(200);

    const corpoRespostaItem = await respostaItem.json();
    
    // Valida se o ID retornado é o mesmo enviado na URL
    expect(corpoRespostaItem._id).toBe(idProdutoValido);
    expect(corpoRespostaItem.nome).toBeDefined();
  });
});