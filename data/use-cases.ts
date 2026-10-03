import type { Locale } from "@/i18n/routing";

/**
 * The four use cases, in the order they appear. Everything a card or a case
 * page shows comes from here, so a fifth use case is one new entry.
 *
 * All four are concept builds: fictional brands that AIVIK designed and built.
 * Copy must not imply clients, results or testimonials.
 */

export type Localised = Record<Locale, string>;

export type UseCase = {
  id: "oravie" | "halverd" | "stielvoll" | "duneline";
  /** Describes the solution, not the fictional brand: ai-receptionist / ki-rezeption. */
  slug: Localised;
  brand: string;
  headline: Localised;
  summary: Localised;
  industry: Localised;
  /** The AIVIK service this build proves, as shown on the badge. */
  proves: Localised;
  /** Which service card links here, and which option the contact form preselects. */
  service: "ai" | "software";
  /** "X is a concept brand we designed and built …" */
  conceptNote: Localised;
  problem: Localised;
  features: { name: Localised; line: Localised }[];
  techNote: Localised;
  stack: string[];
  shows: Localised[];
  video: { src1080: string; src720: string; poster: string; posterWebp: string; teaser: string; seconds: number };
  /** There is no speech in the videos, so this text stands in for captions. */
  videoSummary: Localised;
  chapters: { at: number; label: Localised }[];
  gallery: { src: string; width: number; height: number; alt: Localised }[];
  meta: { description: Localised };
  /** ISO date the video was published, for structured data. */
  published: string;
};

const BLOB = "https://kjceepgtiejodrcf.public.blob.vercel-storage.com/use-cases";

const video = (id: UseCase["id"], seconds: number): UseCase["video"] => ({
  src1080: `${BLOB}/${id}/${id}-1080.mp4`,
  src720: `${BLOB}/${id}/${id}-720.mp4`,
  teaser: `${BLOB}/${id}/${id}-teaser.mp4`,
  poster: `/use-cases/${id}/poster.jpg`,
  posterWebp: `/use-cases/${id}/poster-1280.webp`,
  seconds,
});

export const USE_CASES: UseCase[] = [
  {
    id: "oravie",
    slug: { en: "ai-receptionist", de: "ki-rezeption" },
    brand: "Oravie",
    headline: { en: "An AI receptionist that books appointments", de: "Eine KI-Rezeption, die Termine bucht" },
    summary: {
      en: "A dental clinic website where an AI receptionist answers patients' questions and books real appointments, day or night.",
      de: "Eine Zahnarzt-Website, auf der eine KI-Rezeption Fragen von Patienten beantwortet und echte Termine bucht, Tag und Nacht.",
    },
    industry: { en: "Healthcare (dental)", de: "Gesundheitswesen (Zahnmedizin)" },
    proves: { en: "AI chatbots and agents", de: "KI-Chatbots und Agenten" },
    service: "ai",
    conceptNote: {
      en: "Oravie is a concept brand we designed and built to show this kind of product. The clinic and its patients are fictional.",
      de: "Oravie ist eine Konzeptmarke, die wir entworfen und entwickelt haben, um diese Art von Produkt zu zeigen. Die Praxis und ihre Patienten sind fiktiv.",
    },
    problem: {
      en: "Clinics lose patients who want to book outside opening hours or can't get through on the phone. The reception desk is busy during the day and closed at night, which is exactly when many people sit down to book.",
      de: "Praxen verlieren Patienten, die außerhalb der Öffnungszeiten buchen möchten oder telefonisch nicht durchkommen. Tagsüber ist die Rezeption ausgelastet, abends ist sie geschlossen – genau dann, wenn viele Menschen einen Termin buchen möchten.",
    },
    features: [
      {
        name: { en: "Answers from the clinic's own information", de: "Antworten aus den Informationen der Praxis" },
        line: {
          en: "Noor answers questions about treatments, prices and insurance from what the clinic has published, and shows where each answer comes from.",
          de: "Noor beantwortet Fragen zu Behandlungen, Preisen und Versicherungen aus den Angaben der Praxis und zeigt, woher jede Antwort stammt.",
        },
      },
      {
        name: { en: "Real free slots", de: "Echte freie Termine" },
        line: {
          en: "She reads the calendar and offers only times that are actually free, as buttons the patient taps.",
          de: "Sie liest den Kalender und bietet nur Zeiten an, die wirklich frei sind – als Schaltflächen zum Antippen.",
        },
      },
      {
        name: { en: "Books and cancels", de: "Buchen und stornieren" },
        line: {
          en: "A booking takes a name and a phone number, returns a reference, and can be cancelled in the same chat.",
          de: "Für eine Buchung genügen Name und Telefonnummer. Der Patient erhält eine Referenz und kann im selben Chat stornieren.",
        },
      },
      {
        name: { en: "Handles emergencies", de: "Reagiert auf Notfälle" },
        line: {
          en: "Severe pain or swelling gets the clinic's emergency instructions straight away, not a booking flow.",
          de: "Bei starken Schmerzen oder Schwellungen nennt sie sofort die Notfallhinweise der Praxis, statt einen Termin anzubieten.",
        },
      },
      {
        name: { en: "Every booking lands in the clinic admin", de: "Jede Buchung landet in der Praxisverwaltung" },
        line: {
          en: "The team sees the day's appointments and which ones Noor booked overnight.",
          de: "Das Team sieht die Termine des Tages und welche davon Noor über Nacht gebucht hat.",
        },
      },
    ],
    techNote: {
      en: "The assistant can't invent a time or a price: it reads slots and writes bookings only through a small set of server tools, and it is told not to give medical advice.",
      de: "Die Assistentin kann weder Zeiten noch Preise erfinden: Sie liest Termine und schreibt Buchungen ausschließlich über wenige Server-Tools und gibt keine medizinische Beratung.",
    },
    stack: ["Next.js", "Vercel AI SDK", "Claude", "Supabase"],
    shows: [
      {
        en: "We can put an AI assistant in front of real business data: calendars, price lists, bookings.",
        de: "Wir können einen KI-Assistenten vor echte Geschäftsdaten setzen: Kalender, Preislisten, Buchungen.",
      },
      {
        en: "We build it with safe limits: no medical advice, sources shown, no invented availability.",
        de: "Wir bauen ihn mit klaren Grenzen: keine medizinische Beratung, Quellen sichtbar, keine erfundenen Termine.",
      },
      {
        en: "The work the AI does lands where your team already looks, not in a separate inbox.",
        de: "Was die KI erledigt, landet dort, wo Ihr Team ohnehin hinschaut – nicht in einem weiteren Postfach.",
      },
    ],
    video: video("oravie", 34),
    videoSummary: {
      en: "It is 23:47 and the clinic closed at 21:00. A patient opens the clinic's website on a phone and asks Noor for a cleaning on Saturday. Noor offers the free times, the patient picks 10:00 and gives a name and phone number, and the booking is confirmed with a reference. Beside the phone, the same booking appears in the clinic's admin while nobody is on shift. The next morning it is waiting at reception.",
      de: "Es ist 23:47 Uhr, die Praxis hat seit 21:00 Uhr geschlossen. Eine Patientin öffnet die Website der Praxis auf dem Handy und fragt Noor nach einer Zahnreinigung am Samstag. Noor bietet die freien Zeiten an, die Patientin wählt 10:00 Uhr, nennt Name und Telefonnummer, und die Buchung wird mit einer Referenz bestätigt. Neben dem Handy erscheint dieselbe Buchung in der Praxisverwaltung, während niemand im Dienst ist. Am nächsten Morgen liegt sie an der Rezeption bereit.",
    },
    chapters: [
      { at: 0, label: { en: "23:47, clinic closed", de: "23:47 Uhr, Praxis geschlossen" } },
      { at: 4, label: { en: "The clinic's website", de: "Die Website der Praxis" } },
      { at: 8, label: { en: "A question for Noor", de: "Eine Frage an Noor" } },
      { at: 10, label: { en: "Free slots", de: "Freie Termine" } },
      { at: 13, label: { en: "Name and phone", de: "Name und Telefon" } },
      { at: 16, label: { en: "Booking confirmed", de: "Buchung bestätigt" } },
      { at: 18, label: { en: "In the clinic admin", de: "In der Praxisverwaltung" } },
      { at: 24, label: { en: "The next morning", de: "Am nächsten Morgen" } },
    ],
    gallery: [
      { src: "/use-cases/oravie/gallery-1.jpg", width: 1440, height: 800, alt: { en: "Oravie's home page, with Noor offering free appointment times as buttons", de: "Oravies Startseite: Noor bietet freie Termine als Schaltflächen an" } },
      { src: "/use-cases/oravie/gallery-2.jpg", width: 1440, height: 800, alt: { en: "The treatments page with a price and a duration for each treatment", de: "Die Behandlungsseite mit Preis und Dauer jeder Behandlung" } },
      { src: "/use-cases/oravie/gallery-3.jpg", width: 1440, height: 800, alt: { en: "The clinic admin listing today's and upcoming bookings", de: "Die Praxisverwaltung mit heutigen und kommenden Buchungen" } },
    ],
    meta: {
      description: {
        en: "Concept build: a dental clinic website where an AI receptionist answers questions and books real appointments.",
        de: "Konzeptprojekt: eine Zahnarzt-Website, auf der eine KI-Rezeption Fragen beantwortet und echte Termine bucht.",
      },
    },
    published: "2026-10-02",
  },
  {
    id: "halverd",
    slug: { en: "ai-property-search", de: "ki-immobiliensuche" },
    brand: "Halverd",
    headline: { en: "Property search in plain words", de: "Immobiliensuche in eigenen Worten" },
    summary: {
      en: "Buyers describe the home they want in one sentence, and AI turns it into filters over the brokerage's listings.",
      de: "Käufer beschreiben ihr Wunschobjekt in einem Satz, und KI macht daraus Filter über die Inserate des Maklers.",
    },
    industry: { en: "Real estate", de: "Immobilien" },
    proves: { en: "AI integration in a web app", de: "KI-Integration in eine Web-App" },
    service: "ai",
    conceptNote: {
      en: "Halverd is a concept brand we designed and built to show this kind of product. The brokerage, its listings and their permits are fictional.",
      de: "Halverd ist eine Konzeptmarke, die wir entworfen und entwickelt haben, um diese Art von Produkt zu zeigen. Das Maklerbüro, seine Inserate und deren Genehmigungen sind fiktiv.",
    },
    problem: {
      en: "Property filters are tedious, and buyers describe homes in sentences, not dropdowns. \"A three-bed villa with a pool under six million, near a good school\" is one thought for a person and eight clicks on most portals.",
      de: "Immobilienfilter sind mühsam, und Käufer beschreiben ein Zuhause in Sätzen, nicht in Auswahllisten. „Eine Villa mit drei Schlafzimmern und Pool unter sechs Millionen, nahe einer guten Schule“ ist für einen Menschen ein Gedanke – und auf den meisten Portalen acht Klicks.",
    },
    features: [
      {
        name: { en: "One-sentence search", de: "Suche in einem Satz" },
        line: {
          en: "Claude reads the sentence and returns filters, which the server checks against its allowed values before anything is searched.",
          de: "Claude liest den Satz und liefert Filter, die der Server gegen seine zulässigen Werte prüft, bevor gesucht wird.",
        },
      },
      {
        name: { en: "Filters you can see and change", de: "Sichtbare, änderbare Filter" },
        line: {
          en: "Every filter shows as a chip the buyer can edit or remove, with a note where the AI made an assumption.",
          de: "Jeder Filter erscheint als Chip, den der Käufer ändern oder entfernen kann – mit Hinweis, wo die KI etwas angenommen hat.",
        },
      },
      {
        name: { en: "Near misses that explain themselves", de: "Beinahe-Treffer mit Begründung" },
        line: {
          en: "Homes that miss one wish sit below the exact matches and say why: \"No private pool, community pool only\".",
          de: "Objekte, die einen Wunsch verfehlen, stehen unter den exakten Treffern und nennen den Grund: „Kein privater Pool, nur Gemeinschaftspool“.",
        },
      },
      {
        name: { en: "Viewing requests", de: "Besichtigungsanfragen" },
        line: {
          en: "One short form on each listing, saved together with the buyer's original sentence.",
          de: "Ein kurzes Formular auf jedem Inserat, gespeichert zusammen mit dem ursprünglichen Satz des Käufers.",
        },
      },
      {
        name: { en: "An advisor pipeline", de: "Eine Pipeline für Berater" },
        line: {
          en: "Advisors see what was asked for and move each lead from the first call to Sold.",
          de: "Berater sehen, wonach gefragt wurde, und führen jede Anfrage vom ersten Anruf bis zum Verkauf.",
        },
      },
    ],
    techNote: {
      en: "The AI only writes filters; the listings always come from the database, so it can't invent a home, a price or a permit. If the AI is unavailable, a plain word-by-word reader takes over and the page says so.",
      de: "Die KI schreibt nur Filter; die Inserate kommen immer aus der Datenbank. Sie kann also kein Objekt, keinen Preis und keine Genehmigung erfinden. Fällt die KI aus, übernimmt eine einfache Wort-für-Wort-Auswertung, und die Seite weist darauf hin.",
    },
    stack: ["Next.js", "Claude API", "Supabase", "Leaflet"],
    shows: [
      {
        en: "We can add AI to an existing kind of product without handing it the data.",
        de: "Wir können KI in ein bestehendes Produkt einbauen, ohne ihr die Daten zu überlassen.",
      },
      {
        en: "We design for the day the AI is down: the search still works.",
        de: "Wir planen für den Tag, an dem die KI ausfällt: Die Suche funktioniert trotzdem.",
      },
      {
        en: "We build the business side as well: leads, a pipeline and an admin for the team.",
        de: "Wir bauen auch die Geschäftsseite: Anfragen, eine Pipeline und eine Verwaltung für das Team.",
      },
    ],
    video: video("halverd", 55),
    videoSummary: {
      en: "A buyer types \"3-bed villa with a private pool under 6 million\" into the search on Halverd's home page. The sentence turns into chips: Buy, Villa, 3+ beds, up to AED 6M, private pool. The results show exact matches first on a list and a map, then near misses that say what they lack. The buyer opens a listing, looks through its photos and facts, and sends a viewing request. On the advisor's side, the request arrives with the buyer's own sentence, and the lead moves along a pipeline from new request to Sold.",
      de: "Ein Käufer tippt „3-bed villa with a private pool under 6 million“ in die Suche auf Halverds Startseite. Aus dem Satz werden Chips: Kaufen, Villa, 3+ Schlafzimmer, bis 6 Mio. AED, privater Pool. Die Ergebnisse zeigen zuerst exakte Treffer in Liste und Karte, dann Beinahe-Treffer mit dem, was ihnen fehlt. Der Käufer öffnet ein Inserat, sieht sich Fotos und Eckdaten an und sendet eine Besichtigungsanfrage. Beim Berater kommt die Anfrage mit dem Satz des Käufers an, und sie wandert durch eine Pipeline von der neuen Anfrage bis zum Verkauf.",
    },
    chapters: [
      { at: 0, label: { en: "Intro", de: "Intro" } },
      { at: 3, label: { en: "Describe the home", de: "Das Zuhause beschreiben" } },
      { at: 8, label: { en: "What the AI understood", de: "Was die KI verstanden hat" } },
      { at: 15, label: { en: "Results and near misses", de: "Treffer und Beinahe-Treffer" } },
      { at: 21, label: { en: "The listing", de: "Das Inserat" } },
      { at: 27, label: { en: "Viewing request", de: "Besichtigungsanfrage" } },
      { at: 33, label: { en: "The advisor's view", de: "Die Sicht des Beraters" } },
      { at: 37, label: { en: "Pipeline", de: "Pipeline" } },
      { at: 46, label: { en: "Sold", de: "Verkauft" } },
    ],
    gallery: [
      { src: "/use-cases/halverd/gallery-1.jpg", width: 1920, height: 1440, alt: { en: "A search sentence with arrows from its words to the filter chips they became", de: "Ein Suchsatz mit Pfeilen von seinen Wörtern zu den Filter-Chips" } },
      { src: "/use-cases/halverd/gallery-2.jpg", width: 1920, height: 1440, alt: { en: "A villa listing with its photo gallery and the viewing request form", de: "Ein Villen-Inserat mit Fotogalerie und dem Formular für Besichtigungen" } },
      { src: "/use-cases/halverd/gallery-3.jpg", width: 1920, height: 1440, alt: { en: "Search results on desktop and phone, with filter chips, listing cards and a map", de: "Suchergebnisse auf Desktop und Handy mit Filter-Chips, Inseraten und Karte" } },
    ],
    meta: {
      description: {
        en: "Concept build: buyers describe a home in one sentence, and AI turns it into filters over real listings.",
        de: "Konzeptprojekt: Käufer beschreiben ihr Wunschobjekt in einem Satz, und KI macht daraus Filter über echte Inserate.",
      },
    },
    published: "2026-10-02",
  },
  {
    id: "stielvoll",
    slug: { en: "3d-online-shop", de: "3d-onlineshop" },
    brand: "Stielvoll",
    headline: { en: "An online shop with a 3D jelly popsicle", de: "Ein Onlineshop mit wackelndem 3D-Eis am Stiel" },
    summary: {
      en: "An organic popsicle shop with a real-time 3D product you can drag and bite, a box builder and Stripe checkout.",
      de: "Ein Bio-Eis-Shop mit einem Echtzeit-3D-Produkt zum Ziehen und Abbeißen, einem Box-Konfigurator und Stripe-Checkout.",
    },
    industry: { en: "E-commerce (food)", de: "E-Commerce (Lebensmittel)" },
    proves: { en: "MVPs and shops with payments", de: "MVPs und Shops mit Bezahlung" },
    service: "software",
    conceptNote: {
      en: "Stielvoll is a concept brand we designed and built to show this kind of product. The shop takes no real orders, has no real certification, and payments run in Stripe's test mode.",
      de: "Stielvoll ist eine Konzeptmarke, die wir entworfen und entwickelt haben, um diese Art von Produkt zu zeigen. Der Shop nimmt keine echten Bestellungen an, hat keine echte Zertifizierung, und Zahlungen laufen im Testmodus von Stripe.",
    },
    problem: {
      en: "Small food brands need a shop that feels like their brand, not a template. Most shop templates look the same, and the product, the one thing that makes the brand, ends up as a flat photo in a grid.",
      de: "Kleine Lebensmittelmarken brauchen einen Shop, der sich nach ihrer Marke anfühlt, nicht nach einer Vorlage. Die meisten Shop-Vorlagen sehen gleich aus, und das Produkt – das, was die Marke ausmacht – endet als flaches Foto in einem Raster.",
    },
    features: [
      {
        name: { en: "A real-time 3D jelly popsicle", de: "Ein 3D-Eis in Echtzeit" },
        line: {
          en: "Drag it and it wobbles like jelly; tap it and you take a bite. It runs in the browser, on phones too.",
          de: "Ziehen, und es wackelt wie Wackelpudding; antippen, und man beißt ab. Es läuft im Browser, auch auf dem Handy.",
        },
      },
      {
        name: { en: "A box builder with live pricing", de: "Box-Konfigurator mit Live-Preis" },
        line: {
          en: "Mix six or twelve popsicles in any combination and see the price and the saving as you go.",
          de: "Sechs oder zwölf Eis frei kombinieren und dabei Preis und Ersparnis sehen.",
        },
      },
      {
        name: { en: "Stripe checkout", de: "Stripe-Checkout" },
        line: {
          en: "Pickup or same-day delivery in a two-hour slot, paid through Stripe Checkout, with prices worked out on the server.",
          de: "Abholung oder Lieferung am selben Tag im Zwei-Stunden-Fenster, bezahlt über Stripe Checkout; die Preise berechnet der Server.",
        },
      },
      {
        name: { en: "Allergens on every flavour", de: "Allergene bei jeder Sorte" },
        line: {
          en: "Ingredients in order of quantity, with allergens emphasised the way EU labelling expects.",
          de: "Zutaten in der Reihenfolge ihrer Menge, Allergene hervorgehoben, wie es die EU-Kennzeichnung vorsieht.",
        },
      },
      {
        name: { en: "German and English", de: "Deutsch und Englisch" },
        line: {
          en: "Every page and every message in both languages, plus an orders page for the shop.",
          de: "Jede Seite und jede Meldung in beiden Sprachen, dazu eine Bestellübersicht für den Shop.",
        },
      },
    ],
    techNote: {
      en: "The popsicle is a small hand-written soft-body simulation, a lattice of springs, rather than a video or a heavy physics library, which keeps it smooth and light enough for a phone.",
      de: "Das Eis ist eine kleine, selbst geschriebene Soft-Body-Simulation – ein Gitter aus Federn – statt eines Videos oder einer schweren Physik-Bibliothek. So bleibt es flüssig und leicht genug fürs Handy.",
    },
    stack: ["Next.js", "React Three Fiber", "Stripe", "Supabase"],
    shows: [
      {
        en: "We build a complete product, from a playful front end to a paid order in the admin.",
        de: "Wir bauen ein vollständiges Produkt, vom verspielten Frontend bis zur bezahlten Bestellung in der Verwaltung.",
      },
      {
        en: "We can make the product itself the experience, in real-time 3D, without slowing the shop down.",
        de: "Wir können das Produkt selbst zum Erlebnis machen, in Echtzeit-3D, ohne den Shop auszubremsen.",
      },
      {
        en: "We handle the unglamorous parts properly: payments, time slots, allergens, two languages.",
        de: "Wir erledigen auch die unspektakulären Teile sauber: Zahlungen, Zeitfenster, Allergene, zwei Sprachen.",
      },
    ],
    video: video("stielvoll", 43),
    videoSummary: {
      en: "Six flavours appear one after another, each with its own colour. A hand drags the popsicle and it wobbles like jelly, then takes a bite out of it. Choosing a flavour recolours the whole page. Flavour cards squish as popsicles fly into the cart. A box of six is built with a live price, the cart shows allergens on every line, and checkout offers pickup or delivery in a two-hour slot. The order is paid with Stripe in test mode and shows up as a paid order with its number.",
      de: "Sechs Sorten erscheinen nacheinander, jede in ihrer eigenen Farbe. Eine Hand zieht am Eis, es wackelt wie Wackelpudding, dann wird abgebissen. Mit der Sortenwahl färbt sich die ganze Seite um. Sortenkarten geben nach, während Eis in den Warenkorb fliegt. Eine Sechser-Box entsteht mit Live-Preis, der Warenkorb zeigt Allergene in jeder Zeile, und der Checkout bietet Abholung oder Lieferung im Zwei-Stunden-Fenster. Die Bestellung wird mit Stripe im Testmodus bezahlt und erscheint als bezahlte Bestellung mit Nummer.",
    },
    chapters: [
      { at: 1, label: { en: "Six flavours", de: "Sechs Sorten" } },
      { at: 4, label: { en: "Drag the jelly", de: "Am Eis ziehen" } },
      { at: 9, label: { en: "Take a bite", de: "Abbeißen" } },
      { at: 11, label: { en: "Flavour switch", de: "Sortenwechsel" } },
      { at: 14, label: { en: "Cards and cart", de: "Karten und Warenkorb" } },
      { at: 18, label: { en: "Box builder", de: "Box-Konfigurator" } },
      { at: 22, label: { en: "Cart", de: "Warenkorb" } },
      { at: 24, label: { en: "Checkout", de: "Checkout" } },
      { at: 28, label: { en: "Stripe payment", de: "Zahlung mit Stripe" } },
      { at: 31, label: { en: "Paid order", de: "Bezahlte Bestellung" } },
    ],
    gallery: [
      { src: "/use-cases/stielvoll/gallery-1.jpg", width: 1920, height: 1200, alt: { en: "Stielvoll's hero: a glossy red 3D popsicle between the words \"Fruit on a stick. Nothing else.\"", de: "Stielvolls Startbild: ein glänzendes rotes 3D-Eis zwischen den Worten „Fruit on a stick. Nothing else.“" } },
      { src: "/use-cases/stielvoll/gallery-2.jpg", width: 1920, height: 1200, alt: { en: "The box builder with six flavours, counters and the box price", de: "Der Box-Konfigurator mit sechs Sorten, Zählern und dem Boxpreis" } },
      { src: "/use-cases/stielvoll/gallery-3.jpg", width: 1920, height: 1654, alt: { en: "Checkout with delivery, a chosen time slot and the order summary", de: "Checkout mit Lieferung, gewähltem Zeitfenster und Bestellübersicht" } },
    ],
    meta: {
      description: {
        en: "Concept build: an organic popsicle shop with a real-time 3D product, a box builder and Stripe checkout.",
        de: "Konzeptprojekt: ein Bio-Eis-Shop mit Echtzeit-3D-Produkt, Box-Konfigurator und Stripe-Checkout.",
      },
    },
    published: "2026-10-02",
  },
  // {
  //   id: "duneline",
  //   slug: { en: "scroll-animated-website", de: "scroll-animierte-website" },
  //   brand: "Duneline",
  //   headline: { en: "A car rental site you drive through", de: "Eine Mietwagen-Website, durch die man fährt" },
  //   summary: {
  //     en: "A scroll-animated website for a luxury car rental, where scrolling drives a car through Dubai at night, with live booking prices.",
  //     de: "Eine scroll-animierte Website für Luxus-Mietwagen: Beim Scrollen fährt ein Auto durch das nächtliche Dubai, mit Live-Preisen bei der Buchung.",
  //   },
  //   industry: { en: "Mobility", de: "Mobilität" },
  //   proves: { en: "Websites and front-end motion", de: "Websites und Frontend-Animation" },
  //   service: "software",
  //   conceptNote: {
  //     en: "Duneline is a concept brand we designed and built to show this kind of website. The rental company is fictional. It is a front end only: booking requests are not saved, and the booking reference is a placeholder.",
  //     de: "Duneline ist eine Konzeptmarke, die wir entworfen und entwickelt haben, um diese Art von Website zu zeigen. Die Autovermietung ist fiktiv. Es ist ein reines Frontend: Buchungsanfragen werden nicht gespeichert, und die Buchungsreferenz ist ein Platzhalter.",
  //   },
  //   problem: {
  //     en: "Luxury rentals sell a feeling, and a grid of cars doesn't convey one. Every rental site shows the same thumbnails and prices; nothing tells the visitor what it is like to be handed the keys.",
  //     de: "Luxus-Mietwagen verkaufen ein Gefühl, und ein Raster aus Autos vermittelt keines. Jede Mietwagen-Seite zeigt dieselben Vorschaubilder und Preise; nichts vermittelt, wie es ist, die Schlüssel in die Hand zu bekommen.",
  //   },
  //   features: [
  //     {
  //       name: { en: "A scroll-driven drive", de: "Eine Fahrt per Scrollen" },
  //       line: {
  //         en: "The car starts parked in the hero and drives down a night road as you scroll, seen from above.",
  //         de: "Das Auto parkt zunächst im Titelbild und fährt beim Scrollen eine nächtliche Straße entlang, von oben gesehen.",
  //       },
  //     },
  //     {
  //       name: { en: "Four stops", de: "Vier Stopps" },
  //       line: {
  //         en: "The drive pauses at four cards, power, cabin, cover and arrival, each beside the car on the road.",
  //         de: "Die Fahrt hält an vier Karten – Leistung, Innenraum, Absicherung und Ankunft –, jede neben dem Auto auf der Straße.",
  //       },
  //     },
  //     {
  //       name: { en: "Fleet and booking", de: "Flotte und Buchung" },
  //       line: {
  //         en: "Three cars with daily prices, then a booking form with dates, delivery location and add-ons.",
  //         de: "Drei Autos mit Tagespreisen, danach ein Buchungsformular mit Daten, Lieferort und Extras.",
  //       },
  //     },
  //     {
  //       name: { en: "Live pricing with a 7-day discount", de: "Live-Preis mit 7-Tage-Rabatt" },
  //       line: {
  //         en: "The total updates with every change, and a week or more takes ten percent off.",
  //         de: "Die Summe aktualisiert sich bei jeder Änderung, und ab einer Woche gibt es zehn Prozent Rabatt.",
  //       },
  //     },
  //   ],
  //   techNote: {
  //     en: "One timeline drives everything: the scroll position sets the car's place on the road, so the animation stays in step whether you scroll fast, slowly or backwards.",
  //     de: "Eine einzige Zeitleiste steuert alles: Die Scroll-Position bestimmt den Platz des Autos auf der Straße. So bleibt die Animation im Takt, egal ob man schnell, langsam oder rückwärts scrollt.",
  //   },
  //   stack: ["Next.js", "GSAP", "Lenis", "Tailwind"],
  //   shows: [
  //     {
  //       en: "We build high-end motion and polish that still scores well for speed.",
  //       de: "Wir bauen hochwertige Animation und Feinschliff, die trotzdem schnell lädt.",
  //     },
  //     {
  //       en: "We can turn a brand idea, \"Dubai, after dark\", into the way a site behaves.",
  //       de: "Wir können eine Markenidee – „Dubai, after dark“ – in das Verhalten einer Website übersetzen.",
  //     },
  //     {
  //       en: "A concept front end, described as it is: the booking flow is designed and priced, not connected to a back end.",
  //       de: "Ein Konzept-Frontend, so beschrieben, wie es ist: Der Buchungsablauf ist gestaltet und bepreist, aber nicht an ein Backend angebunden.",
  //     },
  //   ],
  //   video: video("duneline", 42),
  //   videoSummary: {
  //     en: "The site opens on \"Dubai, after dark.\" with a car parked on a road at night, seen from above. Scrolling starts the drive: the car follows the road past cards about its power, its cabin and its cover. The page arrives at the fleet, three cars with daily prices. In the booking form, dates, a delivery location and add-ons change the total as they are chosen, including the discount for seven days or more. A \"Request received\" message closes the flow.",
  //     de: "Die Website beginnt mit „Dubai, after dark.“ und einem Auto, das nachts auf einer Straße parkt, von oben gesehen. Mit dem Scrollen beginnt die Fahrt: Das Auto folgt der Straße vorbei an Karten zu Leistung, Innenraum und Absicherung. Die Seite erreicht die Flotte, drei Autos mit Tagespreisen. Im Buchungsformular verändern Daten, Lieferort und Extras die Summe, sobald sie gewählt werden – einschließlich des Rabatts ab sieben Tagen. Eine Meldung „Request received“ schließt den Ablauf ab.",
  //   },
  //   chapters: [
  //     { at: 2, label: { en: "Hero", de: "Titelbild" } },
  //     { at: 7, label: { en: "The drive", de: "Die Fahrt" } },
  //     { at: 17, label: { en: "Fleet", de: "Flotte" } },
  //     { at: 23, label: { en: "Booking", de: "Buchung" } },
  //     { at: 32, label: { en: "Request received", de: "Anfrage eingegangen" } },
  //   ],
  //   gallery: [
  //     { src: "/use-cases/duneline/gallery-1.jpg", width: 1440, height: 800, alt: { en: "The car on the night road beside a card of performance figures", de: "Das Auto auf der nächtlichen Straße neben einer Karte mit Leistungsdaten" } },
  //     { src: "/use-cases/duneline/gallery-2.jpg", width: 1440, height: 800, alt: { en: "Three fleet cards with car silhouettes and daily prices", de: "Drei Flottenkarten mit Auto-Silhouetten und Tagespreisen" } },
  //     { src: "/use-cases/duneline/gallery-3.jpg", width: 1440, height: 800, alt: { en: "The booking form with a live price summary", de: "Das Buchungsformular mit Live-Preisübersicht" } },
  //   ],
  //   meta: {
  //     description: {
  //       en: "Concept build: a scroll-animated luxury car rental website with live booking prices.",
  //       de: "Konzeptprojekt: eine scroll-animierte Website für Luxus-Mietwagen mit Live-Preisen bei der Buchung.",
  //     },
  //   },
  //   published: "2026-10-02",
  // },
];

/* ---------- Paths ---------- */

/** The section's path per language, without the locale prefix (next-intl's Link adds "/de"). */
export const USE_CASES_BASE: Localised = { en: "/use-cases", de: "/anwendungsfaelle" };

export const useCasePath = (locale: Locale, useCase: UseCase) => `${USE_CASES_BASE[locale]}/${useCase.slug[locale]}`;

/** Full URL for metadata, hreflang and the sitemap. English is unprefixed, German lives under /de. */
export const siteUrl = (locale: Locale, path: string) => `https://aivik.eu${locale === "de" ? "/de" : ""}${path}`;

export const findUseCase = (locale: Locale, slug: string) => USE_CASES.find((u) => u.slug[locale] === slug) ?? null;

export const nextUseCase = (useCase: UseCase) => USE_CASES[(USE_CASES.indexOf(useCase) + 1) % USE_CASES.length];

/**
 * The same page in the other language, for the nav's language switch. Use-case
 * paths differ per language, so the path can't just be reused like elsewhere.
 */
export function pathInLocale(pathname: string, from: Locale, to: Locale) {
  const base = USE_CASES_BASE[from];
  if (pathname !== base && !pathname.startsWith(`${base}/`)) return pathname;
  const slug = pathname.slice(base.length + 1).replace(/\/$/, "");
  if (!slug) return USE_CASES_BASE[to];
  const useCase = findUseCase(from, slug);
  return useCase ? useCasePath(to, useCase) : USE_CASES_BASE[to];
}
