[English](README.md) · **Lietuviškai**

# JSONPlaceholder Archive

Nedidelė kelių puslapių svetainė. Ji rodo vartotojus, įrašus, albumus ir komentarus iš nemokamos [JSONPlaceholder](https://jsonplaceholder.typicode.com) API, sudėliotus kaip seno pašto archyve.

**[Gyva demo versija](https://brutall100.github.io/jsonplaceholder-archive/)** · **[Kodas](https://github.com/brutall100/jsonplaceholder-archive)**

![Pagrindinis puslapis, šviesus režimas](docs/screenshot.webp)

<p>
  <img src="docs/screenshot-dark.webp" alt="Pagrindinis puslapis, tamsus režimas" width="560">
  <img src="docs/screenshot-mobile.webp" alt="Albumo galerija telefone" width="200">
</p>

## Apie projektą

Tai kurso užduotis apie `fetch`, `async/await`, URL parametrus ir puslapio kūrimą su JavaScript. Svetainė kreipiasi į tikrą REST API: kiekvienas puslapis paprašo reikalingų duomenų ir iš jų sudeda korteles.

Vėliau svetainei sukūriau savitą išvaizdą: **lempos apšviestą archyvą**. Jame yra kartotekos kortelės su aplankų skirtukais ir pramuštomis skylutėmis, antspaudų formos ženkliukai ir mygtukai, o vietoj nuotraukų – atvirukai.

## Funkcijos

- **Vartotojai**: visi 10 žmonių su įrašų ir albumų skaičiumi. Kiekvienas turi profilio puslapį su kontaktais, adresu (paspaudus atsidaro Google Maps), įmone, įrašais ir albumais.
- **Įrašai**: 100 įrašų su autoriumi ir komentarų skaičiumi, mygtukas „Show more“ ir filtras pagal autorių (`posts.html?user=3`).
- **Įrašo puslapis**: visas tekstas, autorius ir visi komentarai (pavadinimas, tekstas, el. paštas).
- **Albumai**: kiekvieno albumo viršelis, autorius ir nuotraukų skaičius. Albumo puslapyje yra galerija su [PhotoSwipe](https://photoswipe.com) peržiūra.
- **Paieška**: laukelis viršutinėje juostoje ir paieškos puslapis. Jis veikia **neperkraunant puslapio** ir ieško vienoje kategorijoje (įrašai, vartotojai, komentarai, albumai, nuotraukos) arba visose. Rasti žodžiai paryškinami. Jei nieko nerasta, puslapis taip ir parašo.
- **Gyvas fonas**: lėtai siūbuojantis stalinės lempos švytėjimas, šviesoje kylančios dulkelės ir pro šalį plaukiantys vokai, pašto ženklai bei antspaudai. Telefone dalelių perpus mažiau, o įjungus `prefers-reduced-motion` jos išsijungia.
- **Šviesus ir tamsus režimai**: pagal sistemos nustatymą. Perjungimo mygtukas įsimena pasirinkimą, o kraunantis puslapis nesumirga.
- **Mikro-animacijos**: mygtukai pakyla ir nusileidžia su bangele, o antspaudo ikona „trinkteli“. Kortelės pakyla, turinys atsiranda slenkant, skaičiai suskaičiuoja.
- **Prieinamumas**: nuoroda „Skip to content“, matomas fokusas, laukeliai su `<label>`, alt tekstai, spalvų kontrastas patikrintas pagal WCAG AA.
- **Sugeneruoti paveikslėliai**: JSONPlaceholder nuotraukų nuorodos veda į jau nebeveikiančią svetainę. Todėl kiekviena nuotrauka nupiešiama kaip nedidelis SVG peizažas paletės spalvomis. Avatarai yra SVG inicialai.

## Naudota

- HTML, CSS (kintamieji, grid, animacijos) ir paprastas JavaScript (ES moduliai)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com) REST API
- [PhotoSwipe 5](https://photoswipe.com) galerijai (įdėta į `vendor/`)

**Spalvos** (visos yra CSS kintamieji `css/style.css` failo viršuje):

| Spalva | Hex | Kur naudojama |
|---|---|---|
| Popierius | `#f0ece8` | šviesus fonas, tamsaus režimo tekstas |
| Jūrinė mėlyna | `#2f3e4f` | viršutinė juosta, antraštės, mygtukai (šviesiame režime) |
| Smėlis | `#c2b280` | aplankų skirtukai, lempos švytėjimas, akcentai, tamsaus režimo nuorodos ir mygtukai |
| Kakava | `#3b2a24` | šviesaus režimo tekstas |
| Rašalas | `#1f1f1f` | tamsus fonas |
| Tamsus smėlis | `#6f6035` | smėlio spalvos tekstas ant šviesaus fono (paprastas smėlis ten per šviesus skaityti) |

**Šriftai:** [Aclonica](https://fonts.google.com/specimen/Aclonica) antraštėms, [Sansation](https://fonts.google.com/specimen/Sansation) tekstui.

## Ką išmokau

- Kaip vienu metu užkrauti kelis duomenų rinkinius su `Promise.all` ir sujungti juos naršyklėje (pvz., suskaičiuoti komentarus kiekvienam įrašui).
- Kaip iš antraštės `X-Total-Count` gauti kiekį nesiunčiant visų duomenų.
- Kaip perduoti duomenis tarp puslapių URL parametrais (`user.html?id=2`).
- Kaip saugiai kurti elementus su `textContent`, o ne `innerHTML`.
- Kaip visą dizainą laikyti CSS kintamuosiuose, kad šviesus ir tamsus režimai būtų tiesiog du reikšmių rinkiniai.
- Kodėl verta animuoti tik `transform` ir `opacity`: tada net judrus fonas veikia sklandžiai.

## Kaip paleisti savo kompiuteryje

Svetainė statinė: jai nereikia serverio kodo, duomenų bazės ar `.env` failo. Tačiau ES moduliai veikia tik per `http://`, todėl failo tiesiog atidaryti naršyklėje negalima:

```bash
git clone https://github.com/brutall100/jsonplaceholder-archive.git
cd jsonplaceholder-archive
python3 -m http.server 8000     # arba: npx serve .
```

Tada atidaryk <http://localhost:8000>. API ir šriftams reikia interneto.

## Projekto struktūra

```
├── index.html, users.html, posts.html, albums.html
├── user.html, post.html, album.html, search.html
├── css/style.css          # spalvų kintamieji ir visi stiliai
├── js/
│   ├── api.js             # visos API užklausos (su nedideliu podėliu)
│   ├── layout.js          # viršutinė juosta, skirtukai, paieška, režimo mygtukas, poraštė
│   ├── background.js      # gyvas fonas
│   ├── effects.js         # bangelė, atsiradimas slenkant, skaičiavimas
│   ├── art.js             # SVG avatarai ir atvirukai
│   ├── dom.js, icons.js, theme-init.js
│   └── pages/             # po vieną skriptą kiekvienam puslapiui
├── images/favicon.svg
├── vendor/photoswipe/     # PhotoSwipe (MIT)
└── docs/                  # ekrano nuotraukos
```

## Padėkos

- Duomenys: [JSONPlaceholder](https://jsonplaceholder.typicode.com), autorius typicode.
- Galerija: [PhotoSwipe](https://photoswipe.com) © Dmitry Semenov, MIT licencija (žr. `vendor/photoswipe/LICENSE`).
- Šriftai: Aclonica ir Sansation iš Google Fonts (SIL Open Font License).
- Užduočių sąrašas paimtas iš JavaScript kurso užduoties.

## Licencija

[MIT](LICENSE) © 2026 brutall100
