import { test, expect } from '@playwright/test';
test('fluxo completo com localização simulada apenas no teste', async ({
  page,
  context,
}, testInfo) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: -23.5505, longitude: -46.6333, accuracy: 12 });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Seu primeiro registro começa aqui' }),
  ).toBeVisible();
  await page.screenshot({
    path: 'test-results/dashboard-' + testInfo.project.name + '.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Criar primeira vistoria', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Salvar auto de vistoria' })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Nome do restaurante' }).fill('Restaurante de teste');
  await page.getByRole('textbox', { name: 'Fiscal responsável' }).fill('Fiscal de teste');
  await page.getByRole('button', { name: 'Capturar localização GPS' }).click();
  await expect(page.getByText('-23.550500', { exact: true })).toBeVisible();
  await page.screenshot({
    path: 'test-results/form-' + testInfo.project.name + '.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Salvar auto de vistoria' }).click();
  await expect(
    page.getByRole('heading', { name: 'Restaurante de teste', exact: true }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole('navigation', {
      name: testInfo.project.name === 'mobile' ? 'Navegação mobile' : 'Navegação principal',
      exact: true,
    })
    .getByRole('button', { name: /Histórico/ })
    .click();
  await page.getByRole('textbox', { name: 'Pesquisar estabelecimento' }).fill('inexistente');
  await expect(
    page.getByRole('heading', { name: 'Nenhum estabelecimento encontrado' }),
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Pesquisar estabelecimento' }).fill('Restaurante');
  await page.getByRole('button', { name: 'Ver detalhes de Restaurante de teste' }).click();
  await page.getByRole('button', { name: 'Excluir registro', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Restaurante de teste', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Excluir registro', exact: true }).click();
  await page.getByRole('button', { name: 'Excluir vistoria', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nenhuma vistoria registrada' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('permissão negada não cria coordenadas e permite tentar novamente', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'permissions', {
      value: { query: async () => ({ state: 'denied' }) },
    });
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (_ok: unknown, fail: (v: unknown) => void) => fail({ code: 1 }),
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Criar primeira vistoria', exact: true }).click();
  await page.getByRole('button', { name: 'Capturar localização GPS' }).click();
  await expect(page.getByRole('alert')).toContainText('Permissão');
  await expect(page.getByRole('button', { name: 'Salvar auto de vistoria' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Capturar localização GPS' })).toBeEnabled();
});
