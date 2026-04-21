async (page) => {
  await page.waitForTimeout(2000);
  const results = [];
  const cards = document.querySelectorAll('a[href^="/posts/"]');
  const seen = new Set();
  cards.forEach(a => {
    const href = a.getAttribute('href');
    if (seen.has(href)) return;
    seen.add(href);
    const parent = a.closest('[class*="product"]') || a.parentElement;
    results.push({
      name: a.textContent.trim(),
      url: 'https://producthunt.com' + href,
      desc: parent ? parent.textContent.substring(0, 200) : ''
    });
  });
  return JSON.stringify(results.slice(0, 15), null, 2);
}
