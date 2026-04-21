async (page) => {
  await page.waitForTimeout(2000);
  const items = await page.$$('li.repo-list-item');
  const results = [];
  for (const item of items) {
    const titleEl = await item.$('a[itemprop="name"]');
    const repoEl = await item.$('p.repo-list-name');
    const metaEl = await item.$('div.hx_hit-meta');
    const title = titleEl ? await titleEl.textContent() : '';
    const repo = repoEl ? await repoEl.textContent() : '';
    const meta = metaEl ? await metaEl.textContent() : '';
    const href = titleEl ? await titleEl.getAttribute('href') : '';
    if (title) results.push({ repo: repo.trim(), title: title.trim(), meta: meta.trim(), url: href });
  }
  return JSON.stringify(results, null, 2);
}
