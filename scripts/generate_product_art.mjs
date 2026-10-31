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
const products = raw.map(x => [x[0], x[1], true]).concat(shopierProducts.map(x => [x[0], x[1], false]));
const output = resolve(root, 'assets/products');
mkdirSync(output, { recursive: true });
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

const background = `<rect width="900" height="900" fill="#fff"/><ellipse cx="450" cy="776" rx="242" ry="28" fill="#d5dce2" opacity=".7"/><ellipse cx="450" cy="776" rx="190" ry="18" fill="#edf0f3"/>`;
const defs = `<defs>
  <linearGradient id="glass" x2="1"><stop stop-color="#d8e1e6" stop-opacity=".78"/><stop offset=".16" stop-color="#fff" stop-opacity=".92"/><stop offset=".38" stop-color="#dbe4e8" stop-opacity=".36"/><stop offset=".55" stop-color="#fff" stop-opacity=".92"/><stop offset=".82" stop-color="#b9c8cf" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity=".88"/></linearGradient>
  <linearGradient id="blueCap" x2="0" y2="1"><stop stop-color="#4e91e0"/><stop offset=".42" stop-color="#246bbd"/><stop offset="1" stop-color="#124984"/></linearGradient>
  <linearGradient id="silver" x2="1"><stop stop-color="#7e8990"/><stop offset=".18" stop-color="#f9fbfc"/><stop offset=".48" stop-color="#adb7bd"/><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#727e85"/></linearGradient>
  <linearGradient id="label" x2="0" y2="1"><stop stop-color="#0b2235"/><stop offset="1" stop-color="#071725"/></linearGradient>
  <linearGradient id="powder" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dfe5e8"/></linearGradient>
  <filter id="shadow" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>
</defs>`;

function wrap(text, max = 15, maxLines = 3) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(3, max - 1)).replace(/[+\-\s]+$/g, '')}…`;
  return lines.slice(0, maxLines);
}

function label(name, size, x, y, w, h, small = false, cosmetic = false) {
  const lines = wrap(name.replace(/[|]/g, ' ').toLocaleUpperCase('tr-TR'), small ? 12 : 15, 3);
  const amount = size.split('·')[0].trim().toLocaleUpperCase('tr-TR');
  const nameStart = y + (small ? 91 : 105);
  const nameFont = small ? 16 : 20;
  const amountY = y + h - 56;
  const lineText = lines.map((line, i) => `<text x="${x + w / 2}" y="${nameStart + i * (small ? 23 : 26)}" text-anchor="middle" fill="#f7fbff" font-family="Arial,sans-serif" font-size="${nameFont}" font-weight="800" letter-spacing=".2">${xml(line)}</text>`).join('');
  const useNote = cosmetic ? 'COSMETIC CARE' : 'RESEARCH USE ONLY';
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="url(#label)" stroke="#1eb9df" stroke-width="5"/>
    <circle cx="${x + 31}" cy="${y + 31}" r="15" fill="none" stroke="#34c3e4" stroke-width="2"/>
    <text x="${x + 31}" y="${y + 36}" text-anchor="middle" fill="#62d9f3" font-family="Arial,sans-serif" font-size="11" font-weight="800">LL</text>
    <text x="${x + w / 2 + 22}" y="${y + 29}" text-anchor="middle" fill="#eef5fa" font-family="Arial,sans-serif" font-size="${small ? 10 : 12}" font-weight="800" letter-spacing="1.4">LONGEVITY LABS</text>
    <path d="M${x + 18} ${y + 52}h${w - 36}" stroke="#21b9dc" stroke-opacity=".78"/>
    ${lineText}
    <rect x="${x + 22}" y="${amountY}" width="${w - 44}" height="32" rx="5" fill="#16afd4"/>
    <text x="${x + w / 2}" y="${amountY + 22}" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${small ? 16 : 19}" font-weight="800">${xml(amount)}</text>
    <text x="${x + w / 2}" y="${y + h - 13}" text-anchor="middle" fill="#c4d0d8" font-family="Arial,sans-serif" font-size="${small ? 8 : 9}" font-weight="700" letter-spacing="1.1">${useNote}</text>
  </g>`;
}

function vial(name, size, index) {
  return `${background}
  <ellipse cx="450" cy="748" rx="168" ry="19" fill="#7d8d98" opacity=".19" filter="url(#shadow)"/>
  <g>
    <path d="M350 683c21-13 36-10 51-4 15 6 27 4 41-1 19-7 34-6 49 2 15 8 32 6 59 0v23c0 8-7 14-15 14H364c-8 0-14-6-14-14z" fill="url(#powder)" stroke="#cfd8dd" stroke-width="1.5"/>
    <circle cx="380" cy="688" r="3" fill="#e5e9eb"/><circle cx="407" cy="698" r="2.5" fill="#e5e9eb"/><circle cx="522" cy="691" r="3" fill="#e3e8eb"/>
    <rect x="354" y="230" width="192" height="84" rx="10" fill="url(#silver)" stroke="#87939a" stroke-width="3"/>
    <path d="M366 253h168M366 267h168M366 281h168" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
    <rect x="328" y="151" width="244" height="88" rx="25" fill="url(#blueCap)" stroke="#164f8b" stroke-width="4"/>
    <path d="M345 169Q450 143 555 169" fill="none" stroke="#b9dcff" stroke-width="8" stroke-linecap="round" opacity=".74"/>
    <g stroke="#9dc7ef" stroke-opacity=".2" stroke-width="2"><path d="M350 160v72M370 156v78M393 153v82M417 152v84M441 151v85M465 151v85M489 152v84M513 153v82M536 156v78M550 160v72"/></g>
    <rect x="328" y="287" width="244" height="430" rx="62" fill="url(#glass)" stroke="#87979f" stroke-width="4"/>
    <rect x="338" y="300" width="224" height="406" rx="52" fill="url(#glass)" opacity=".28"/>
    <path d="M349 330Q338 493 350 666" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".82"/>
    <path d="M366 316Q359 445 366 558" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".68"/>
    <path d="M546 330Q557 493 545 666" fill="none" stroke="#71818a" stroke-width="6" stroke-linecap="round" opacity=".24"/>
    <ellipse cx="450" cy="706" rx="101" ry="8" fill="#82929b" opacity=".2"/>
    ${label(name, size, 339, 397, 222, 245)}
    <rect x="344" y="402" width="212" height="235" rx="4" fill="none" stroke="#87dff0" stroke-opacity=".33"/>
  </g>`;
}

function spray(name, size) {
  return `${background}
  <ellipse cx="450" cy="749" rx="154" ry="18" fill="#7d8d98" opacity=".18" filter="url(#shadow)"/>
  <g>
    <rect x="363" y="346" width="174" height="370" rx="42" fill="url(#glass)" stroke="#8d9ba2" stroke-width="4"/>
    <path d="M383 386v250" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".74"/>
    <rect x="379" y="313" width="142" height="68" rx="15" fill="url(#silver)" stroke="#75838b" stroke-width="3"/>
    <rect x="405" y="274" width="90" height="50" rx="10" fill="url(#blueCap)" stroke="#164f8b" stroke-width="3"/>
    <path d="M429 274v-47q20-16 42 0v51" fill="#f8fcff" fill-opacity=".62" stroke="#8e9ca4" stroke-width="3"/>
    ${label(name, size, 373, 398, 154, 240, true)}
  </g>`;
}

function jar(name, size) {
  return `${background}
  <ellipse cx="450" cy="722" rx="226" ry="24" fill="#7d8d98" opacity=".17" filter="url(#shadow)"/>
  <g>
    <rect x="280" y="402" width="340" height="290" rx="46" fill="url(#glass)" stroke="#96a3aa" stroke-width="4"/>
    <path d="M306 447v183" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".72"/>
    <rect x="267" y="342" width="366" height="95" rx="24" fill="url(#blueCap)" stroke="#174f87" stroke-width="4"/>
    <path d="M294 360q154-32 312 0" fill="none" stroke="#b4d9ff" stroke-width="8" stroke-linecap="round" opacity=".65"/>
    ${label(name, size, 315, 456, 270, 202, true, true)}
  </g>`;
}

function serum(name, size, cosmetic = false) {
  return `${background}
  <ellipse cx="450" cy="749" rx="156" ry="19" fill="#7d8d98" opacity=".18" filter="url(#shadow)"/>
  <g>
    <rect x="352" y="342" width="196" height="374" rx="43" fill="url(#glass)" stroke="#8d9ba2" stroke-width="4"/>
    <path d="M374 376v270" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".78"/>
    <rect x="389" y="274" width="122" height="93" rx="18" fill="url(#silver)" stroke="#7f8b92" stroke-width="3"/>
    <rect x="378" y="217" width="144" height="73" rx="21" fill="url(#blueCap)" stroke="#164f8b" stroke-width="3"/>
    <path d="M399 230q51-20 102 0" fill="none" stroke="#b7d9fb" stroke-width="8" stroke-linecap="round" opacity=".74"/>
    ${label(name, size, 370, 398, 160, 240, true, cosmetic)}
  </g>`;
}

function render([name, size, research], index) {
  const isSpray = /nasal|sprey/i.test(name);
  const isJar = /krem/i.test(name);
  const cosmetic = /le peptide|topikal|bakım kremi|saç toniği|saç serumu|yüz serumu/i.test(name);
  const art = isSpray ? spray(name, size) : isJar ? jar(name, size) : research ? vial(name, size, index) : serum(name, size, cosmetic);
  const desc = `${name}, ${size} için Longevity Labs konsept ambalaj illüstrasyonu.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" role="img" aria-labelledby="title desc"><title id="title">${xml(name)} — Longevity Labs</title><desc id="desc">${xml(desc)}</desc>${defs}${art}</svg>`;
}

products.forEach((product, index) => writeFileSync(resolve(output, `item-${index}.svg`), render(product, index), 'utf8'));
console.log(`Created ${products.length} branded package illustrations.`);
