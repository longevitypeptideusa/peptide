import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'app.js'), 'utf8');
const rawStart = source.indexOf('var raw=');
const rawEnd = source.indexOf('\nfunction cat', rawStart);
const raw = new Function(`${source.slice(rawStart, rawEnd)}; return raw;`)();
const shopStart = source.indexOf('var shopierProducts=');
const shopEnd = source.indexOf('];', shopStart) + 1;
const shopierProducts = new Function(`${source.slice(shopStart, shopEnd)}; return shopierProducts;`)();
const products = raw.map(x => [x[0], x[1]]).concat(shopierProducts.map(x => [x[0], x[1]]));
const output = resolve(root, 'assets/products');
mkdirSync(output, { recursive: true });
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

function render([name, size], index) {
  const isJar = /krem/i.test(name);
  const isSpray = /sprey|toniği/i.test(name);
  const isCare = /le peptide|serum|krem|sprey|toniği/i.test(name);
  const form = isJar ? 'CREAM' : isSpray ? 'MIST' : isCare ? 'SERUM' : 'RESEARCH';
  const shortName = name.replace(/[^\p{L}\p{N}+.-]+/gu, ' ').trim().toLocaleUpperCase('tr-TR').slice(0, 25);
  const accent = index % 3 === 0 ? '#d6c18b' : '#bba06a';
  const brand = name.startsWith('Le Peptide') ? 'LONGEVITY LABS USA · LE PEPTIDE' : 'LONGEVITY LABS USA';
  const packageArt = isJar
    ? `<g><rect x="300" y="400" width="300" height="255" rx="42" fill="url(#glass)" stroke="#aa9158" stroke-width="3"/><rect x="285" y="360" width="330" height="75" rx="20" fill="url(#metal)"/><path d="M323 468h254v145q0 27-30 27H353q-30 0-30-27z" fill="#05090a" stroke="#75613a" stroke-width="2"/><text x="450" y="510" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="16" letter-spacing="2">${xml(brand)}</text><path d="M375 530h150" stroke="${accent}" opacity=".65"/><text x="450" y="575" text-anchor="middle" fill="#f3f0e8" font-family="Arial,sans-serif" font-size="24" font-weight="700">${xml(shortName)}</text><text x="450" y="609" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="17">${xml(size)}</text></g>`
    : `<g><rect x="327" y="286" width="246" height="402" rx="38" fill="url(#glass)" stroke="#a7905a" stroke-width="3"/><rect x="352" y="310" width="15" height="345" rx="7" fill="#fff" opacity=".07"/><rect x="340" y="264" width="220" height="55" rx="14" fill="url(#metal)"/><path d="M342 330h216v295q0 35-35 35H377q-35 0-35-35z" fill="#05090a" stroke="#75613a" stroke-width="2"/>${isSpray ? '<rect x="410" y="225" width="80" height="42" rx="8" fill="url(#metal)"/><rect x="433" y="208" width="34" height="18" rx="4" fill="#d2d0c6"/>' : ''}<text x="450" y="385" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="15" letter-spacing="1.5">${xml(brand)}</text><path d="M380 403h140" stroke="${accent}" opacity=".65"/><text x="450" y="478" text-anchor="middle" fill="#f3f0e8" font-family="Arial,sans-serif" font-size="25" font-weight="700">${xml(shortName)}</text><text x="450" y="520" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="19" letter-spacing="2">${form}</text><path d="M380 542h140" stroke="${accent}" opacity=".45"/><text x="450" y="585" text-anchor="middle" fill="#d9d5c9" font-family="Arial,sans-serif" font-size="18">${xml(size)}</text><text x="450" y="615" text-anchor="middle" fill="#857959" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">PREMIUM COLLECTION</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" role="img" aria-labelledby="title desc"><title id="title">${xml(name)} — Longevity Labs USA</title><desc id="desc">${xml(name)}, ${xml(size)} ürün illüstrasyonu.</desc><defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#11191c"/><stop offset="1" stop-color="#050809"/></linearGradient><radialGradient id="glow"><stop stop-color="#6f5a2e" stop-opacity=".42"/><stop offset="1" stop-color="#050809" stop-opacity="0"/></radialGradient><linearGradient id="glass" x2="1"><stop stop-color="#101719"/><stop offset=".28" stop-color="#253033"/><stop offset=".52" stop-color="#0b1012"/><stop offset=".78" stop-color="#1e292b"/><stop offset="1" stop-color="#080c0d"/></linearGradient><linearGradient id="metal" x2="1"><stop stop-color="#806a3e"/><stop offset=".25" stop-color="#ead6a1"/><stop offset=".52" stop-color="#7a6337"/><stop offset=".78" stop-color="#d9c18a"/><stop offset="1" stop-color="#685530"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#312a1c"/><stop offset="1" stop-color="#090c0d"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="25"/></filter></defs><rect width="900" height="900" fill="url(#bg)"/><ellipse cx="450" cy="442" rx="380" ry="370" fill="url(#glow)"/><g fill="none" stroke="${accent}" opacity=".24"><circle cx="450" cy="430" r="318"/><circle cx="450" cy="430" r="288" stroke-dasharray="2 13"/><path d="M95 580C270 520 270 335 450 290s180 150 355 90"/><path d="M95 620C270 560 270 375 450 330s180 150 355 90"/></g><ellipse cx="450" cy="770" rx="255" ry="54" fill="#000" opacity=".8" filter="url(#blur)"/><ellipse cx="450" cy="746" rx="245" ry="48" fill="url(#floor)" stroke="#7b673e" stroke-opacity=".7"/><ellipse cx="450" cy="733" rx="210" ry="30" fill="#111719" stroke="#c6a75d" stroke-opacity=".4"/>${packageArt}<g text-anchor="middle" font-family="Arial,sans-serif"><text x="450" y="110" fill="${accent}" font-size="13" letter-spacing="5">LONGEVITY · SCIENCE · DESIGN</text><text x="450" y="842" fill="#bbb29c" font-size="13" letter-spacing="4">${form} / ${String(index + 1).padStart(2, '0')}</text></g></svg>`;
}

products.forEach((product, index) => writeFileSync(resolve(output, `item-${index}.svg`), render(product, index), 'utf8'));
console.log(`Created ${products.length} unique product illustrations.`);
