/**
 * Estonian-first copy dictionary for the whole site.
 * Structured so an English locale can be added later as `content.en`.
 */
export const content = {
  brand: "Aura & Ood",
  product: "Morning Spirit",
  storyTitle: "Koidiku Kaja",
  storyTitleEn: "The Echo of Dawn",
  domain: "auraood.ee",

  nav: {
    story: "Lugu",
    pyramid: "Lõhnapüramiid",
    product: "Toode",
    shop: "Pood",
    cart: "Ostukorv",
  },

  hero: {
    eyebrow: "Aura & Ood · Uus algus",
    title: "Morning Spirit",
    subtitle: "Koidiku Kaja",
    lead: "Unisex eau de parfum, mis tabab lühikese hetke enne päeva ärkamist — kui valgus alles sünnib.",
    ctaPrimary: "Avasta lõhn",
    ctaSecondary: "Lisa ostukorvi",
    scrollCue: "Keri edasi",
  },

  story: {
    eyebrow: "Koidiku Kaja",
    chapters: [
      {
        kicker: "01 — Vaikus",
        title: "Maailm pole veel ärganud",
        body: "See on lühike hetk varahommikul, mil õhk seisab liikumatult ja jahe kaste katab kõike. Pühendumus sellele vaikusele on Aura & Ood’i algus.",
      },
      {
        kicker: "02 — Kiir",
        title: "Esimene päikesekiir läbi kaste",
        body: "Sidruni teravus lõikab läbi jaheda hommiku nagu esimene valgus. See on äratus — terav, puhas ja täis lubadust.",
      },
      {
        kicker: "03 — Ood",
        title: "Ood uutele võimalustele",
        body: "Lõhn, mis ei küsi sugu ega staatust. See on kingitus neile, kes alustavad päeva ambitsiooniga ja kannavad endas suvist kergust aastaringselt.",
      },
    ],
  },

  pyramid: {
    eyebrow: "Lõhnapüramiid",
    title: "Kolm hetke ühes hingamises",
    lead: "Piisavalt särtsakas, et äratada. Piisavalt sügav, et jääda nahale väärikana kogu päevaks.",
    tiers: [
      {
        id: "top",
        stage: "Tipunoodid",
        name: "Äratus",
        minutes: "Esimesed minutid",
        poem: "Puhas, valge valgus. Sidruni ja bergamoti säde, roheline õun ja musta pipra sähvatus — väike vürtsikas äratuskell, mis teeb lõhna moodsaks ja unisexiks.",
        notes: ["Sitsiilia sidrun", "Bergamott", "Roheline õun", "Musta pipra sähvatus"],
      },
      {
        id: "heart",
        stage: "Südamenoodid",
        name: "Koidiku kuma",
        minutes: "15–30 minutit hiljem",
        poem: "Valge tee lehed toovad kalli hotelli rahu, kadakas põhjamaist karget õhku ja virsikuõis õrna puuviljase nüansi — mitte kunagi liiga lilleline.",
        notes: ["Valge tee lehed", "Kadakamarjad", "Virsikuõis"],
      },
      {
        id: "base",
        stage: "Põhjanoodid",
        name: "Päeva aura",
        minutes: "Tundide kaupa nahal",
        poem: "Valge muskus loob puhta naha ja triigitud särgi tunde, merevaik annab sügavuse ning sandlipuu kreemja, sooja lõpu — luksuslik järelkaja, mis püsib.",
        notes: ["Valge muskus", "Merevaik", "Sandlipuu"],
      },
    ],
  },

  reveal: {
    eyebrow: "Detail",
    title: "Merevaigust pudel, mis hoiab valgust",
    body: "Ribiline merevaigust klaas, soe ümar kork ja kuldne A/D monogramm. Iga detail on loodud hommikuse selguse jaoks.",
    callouts: [
      { label: "Unisex", value: "Eau de Parfum" },
      { label: "Maht", value: "100 ml · 3.3 fl.oz" },
      { label: "Akord", value: "Tsitrus · Valge tee · Muskus" },
      { label: "Loodud", value: "Hommikuse selguse jaoks" },
    ],
  },

  shop: {
    eyebrow: "Pood",
    title: "Too koidik koju",
    lead: "Üks lõhn, lõputu hommik. Morning Spirit eau de parfum, 100 ml — must-kuldses pakendis, valmis ka kingiks.",
    add: "Lisa ostukorvi",
    added: "Lisatud",
    qty: "Kogus",
  },

  why: {
    eyebrow: "Miks Morning Spirit",
    title: "Kerge avang, sügav püsivus",
    items: [
      { title: "Värske avang", body: "Sitrus ja roheline õun ärkavad nahal kohe — hommikune energialaeng." },
      { title: "Unisex tasakaal", body: "Ei mehele, ei naisele — igaühele. Musta pipra ja kadaka moodne kargus." },
      { title: "Elegantne igapäev", body: "Puhas valge tee ja muskus sobivad nii tööpäeva kui ka õhtu jaoks." },
      { title: "Püsiv puhas põhi", body: "Merevaik ja sandlipuu hoiavad lõhna nahal ka pärast lõunat." },
    ],
  },

  packaging: {
    eyebrow: "Pakend",
    title: "Must ja kuld, valmis kinkimiseks",
    body: "Matt-must toos kuldse A/D monogrammiga. Vaikne luksus, mis muudab iga saatmise sündmuseks.",
    points: ["Matt-must silinderpakend", "Kuldne fooliummonogramm", "Valmis kingituseks — ilma lisata"],
  },

  finalCta: {
    eyebrow: "Uus päev",
    title: "Alusta päeva valgusega.",
    body: "Morning Spirit — Koidiku Kaja sinu nahal, aastaringselt.",
    cta: "Telli Morning Spirit",
  },

  cart: {
    title: "Ostukorv",
    empty: "Sinu ostukorv on tühi.",
    emptyCta: "Vaata tooteid",
    subtotal: "Vahesumma",
    checkout: "Vormista tellimus",
    continue: "Jätka ostlemist",
    remove: "Eemalda",
    note: "Tasuta tarne · Demo pood",
  },

  checkout: {
    title: "Vormista tellimus",
    subtitle: "Demo-tellimus — päris makset ei tehta. Tellimus salvestatakse kohalikku andmebaasi.",
    fields: {
      name: "Nimi",
      email: "E-post",
      phone: "Telefon",
      delivery: "Tarneviis",
      comments: "Kommentaarid",
    },
    delivery: {
      courier: "Kuller",
      pickup: "Pakiautomaat",
      store: "Tulen ise järele",
    },
    place: "Kinnita tellimus",
    placing: "Kinnitan…",
    back: "Tagasi poodi",
    successTitle: "Aitäh! Tellimus vastu võetud.",
    successBody: "See on demo-tellimus, päris makset ei tehtud. Sinu tellimuse number on",
    summary: "Tellimuse kokkuvõte",
  },

  footer: {
    tagline: "Ood lühikesele hetkele enne päeva ärkamist.",
    rights: "Kõik õigused kaitstud.",
    madeIn: "Nordic freshness · Made for morning clarity",
  },
} as const;

export type Content = typeof content;
