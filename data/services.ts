import type { Locale } from "@/i18n/routing";
import type { Localised } from "@/data/use-cases";
import { SERVICES_BASE, SERVICE_SLUGS } from "@/data/service-paths";

/**
 * The five services, in the order of the cards on the home page (the cards'
 * short texts are in messages/*.json under Services.list, same order).
 * Everything a service page shows comes from here, so a sixth service is one
 * new entry.
 *
 * Copy must not state prices, timelines, client names or results.
 */

export type Service = {
  /** "software" and "ai" are also what a use case names as its service. */
  id: keyof typeof SERVICE_SLUGS;
  slug: Localised;
  title: Localised;
  /** One line under the title. */
  tagline: Localised;
  intro: Localised;
  /** The four items on the home card, each explained. */
  items: { name: Localised; text: Localised }[];
  /** How a project of this kind runs. */
  approach: { name: Localised; text: Localised }[];
  faq: { q: Localised; a: Localised }[];
  /** Blog articles shown on the page, by slug, where any fit. */
  articles?: string[];
  /** The option the contact form preselects (/?service=…), where it has one. */
  formOption: "software" | "ai" | "cloud" | "data" | null;
  meta: { description: Localised };
};

export const SERVICES: Service[] = [
  {
    id: "software",
    slug: SERVICE_SLUGS.software,
    title: { en: "Custom Software Development", de: "Individuelle Softwareentwicklung" },
    tagline: {
      en: "Web and mobile applications built around how your business works.",
      de: "Web- und Mobilanwendungen, die zu den Abläufen Ihres Unternehmens passen.",
    },
    intro: {
      en: "Standard software fits most companies roughly and none exactly. We build the parts that have to fit: customer-facing apps, internal tools and the systems that connect them. You own the source code from the first day, and you talk directly to the engineers who write it.",
      de: "Standardsoftware passt zu den meisten Unternehmen ungefähr und zu keinem genau. Wir entwickeln die Teile, die genau passen müssen: Anwendungen für Ihre Kunden, interne Werkzeuge und die Systeme, die beides verbinden. Der Quellcode gehört Ihnen vom ersten Tag an, und Sie sprechen direkt mit den Entwicklern, die ihn schreiben.",
    },
    items: [
      {
        name: { en: "Mobile Application Development", de: "Entwicklung mobiler Anwendungen" },
        text: {
          en: "Apps for iOS and Android, from the first prototype to the release in the app stores. We decide with you whether one shared codebase or separate native apps is the better fit.",
          de: "Apps für iOS und Android, vom ersten Prototyp bis zur Veröffentlichung in den App-Stores. Ob eine gemeinsame Codebasis oder getrennte native Apps besser passen, entscheiden wir mit Ihnen.",
        },
      },
      {
        name: { en: "Website Development and Maintenance", de: "Website-Entwicklung und -Wartung" },
        text: {
          en: "Fast, accessible websites and web applications, in more than one language where you need it. After launch we keep them updated, secure and running.",
          de: "Schnelle, barrierearme Websites und Webanwendungen, bei Bedarf mehrsprachig. Nach dem Start halten wir sie aktuell, sicher und verfügbar.",
        },
      },
      {
        name: { en: "Legacy System Modernization", de: "Modernisierung von Altsystemen" },
        text: {
          en: "Older systems often still do important work but are hard to change. We replace them in steps, so your team keeps working while the old parts are retired one by one.",
          de: "Ältere Systeme erledigen oft noch wichtige Aufgaben, lassen sich aber schwer ändern. Wir lösen sie schrittweise ab, sodass Ihr Team weiterarbeitet, während die alten Teile nach und nach abgeschaltet werden.",
        },
      },
      {
        name: { en: "CRM and ERP Platform Development", de: "Entwicklung von CRM- und ERP-Plattformen" },
        text: {
          en: "Platforms for customers, orders, stock and billing, built to your process or connected to the tools you already use.",
          de: "Plattformen für Kunden, Aufträge, Lagerbestand und Abrechnung – nach Ihrem Prozess entwickelt oder an die Werkzeuge angebunden, die Sie bereits nutzen.",
        },
      },
    ],
    approach: [
      {
        name: { en: "We start with the problem", de: "Wir beginnen beim Problem" },
        text: {
          en: "A discovery session maps what the software has to achieve, who uses it and what it has to connect to, before anyone talks about features.",
          de: "In einem Discovery-Termin klären wir, was die Software leisten soll, wer sie nutzt und woran sie angebunden wird – bevor über Funktionen gesprochen wird.",
        },
      },
      {
        name: { en: "You see it running early", de: "Sie sehen früh etwas Laufendes" },
        text: {
          en: "We deliver in short sprints with a live demo at the end of each. You see working software early and can change direction before it gets expensive.",
          de: "Wir liefern in kurzen Sprints, jeweils mit einer Live-Demo am Ende. Sie sehen früh funktionierende Software und können die Richtung ändern, bevor es teuer wird.",
        },
      },
      {
        name: { en: "We stay after launch", de: "Wir bleiben nach dem Start" },
        text: {
          en: "Launch is not the end of the project. We monitor, maintain and extend what we built for as long as you need us.",
          de: "Der Start ist nicht das Ende des Projekts. Wir überwachen, warten und erweitern, was wir gebaut haben, solange Sie uns brauchen.",
        },
      },
    ],
    faq: [
      {
        q: { en: "Who owns the code?", de: "Wem gehört der Code?" },
        a: {
          en: "You do, from day one. The source code and all rights to it are yours, and you can take the project in-house or to another team at any time.",
          de: "Ihnen, vom ersten Tag an. Der Quellcode und alle Rechte daran liegen bei Ihnen, und Sie können das Projekt jederzeit intern oder mit einem anderen Team weiterführen.",
        },
      },
      {
        q: { en: "What does a project cost?", de: "Was kostet ein Projekt?" },
        a: {
          en: "That depends on the scope, so we don't publish prices. After discovery you get a plan with scope and timeline and a quote for it, before any work starts.",
          de: "Das hängt vom Umfang ab, deshalb nennen wir keine Pauschalpreise. Nach der Discovery erhalten Sie einen Plan mit Umfang und Zeitrahmen und ein Angebot dazu, bevor die Arbeit beginnt.",
        },
      },
      {
        q: { en: "Can you work with our existing systems?", de: "Können Sie mit unseren bestehenden Systemen arbeiten?" },
        a: {
          en: "Yes. Most projects connect to something that already exists, such as an ERP, a CRM or a database. We look at those systems during discovery and plan the integration around them.",
          de: "Ja. Die meisten Projekte binden an etwas Bestehendes an, etwa ein ERP, ein CRM oder eine Datenbank. Diese Systeme sehen wir uns in der Discovery an und planen die Integration entsprechend.",
        },
      },
      {
        q: { en: "Do you add AI to the software you build?", de: "Bauen Sie KI in die Software ein?" },
        a: {
          en: "Where it helps, yes. We consider AI from the start of the design, for example for search, support or document handling, and leave it out where a simpler solution does the job.",
          de: "Wo es hilft, ja. Wir denken KI von Beginn an mit, zum Beispiel für Suche, Support oder Dokumentenverarbeitung, und lassen sie weg, wo eine einfachere Lösung genügt.",
        },
      },
    ],
    formOption: "software",
    meta: {
      description: {
        en: "Custom web and mobile applications, legacy modernization and CRM/ERP platforms from AIVIK. You own the source code from day one.",
        de: "Individuelle Web- und Mobilanwendungen, Modernisierung von Altsystemen und CRM-/ERP-Plattformen von AIVIK. Der Quellcode gehört Ihnen vom ersten Tag an.",
      },
    },
  },
  {
    id: "ai",
    slug: SERVICE_SLUGS.ai,
    title: { en: "AI Workflow Automation", de: "KI-Workflow-Automatisierung" },
    tagline: {
      en: "Assistants and agents that take over routine work and know when to hand it to a person.",
      de: "Assistenten und Agenten, die Routinearbeit übernehmen und wissen, wann ein Mensch übernehmen sollte.",
    },
    intro: {
      en: "Much of a working day goes into answering the same questions, moving data between systems and reading documents. We build AI systems that do this work reliably: they answer from your own information, act in your tools and pass a case to your team when it needs a person.",
      de: "Ein großer Teil des Arbeitstags vergeht damit, dieselben Fragen zu beantworten, Daten zwischen Systemen zu übertragen und Dokumente zu lesen. Wir entwickeln KI-Systeme, die diese Arbeit zuverlässig erledigen: Sie antworten aus Ihren eigenen Informationen, handeln in Ihren Werkzeugen und übergeben einen Fall an Ihr Team, wenn er einen Menschen braucht.",
    },
    items: [
      {
        name: { en: "Virtual Assistants and Chatbots", de: "Virtuelle Assistenten und Chatbots" },
        text: {
          en: "Assistants for your website or internal tools that answer from your content, in your tone, and say so when they don't know. The assistant on this site is one we built.",
          de: "Assistenten für Ihre Website oder Ihre internen Werkzeuge, die aus Ihren Inhalten und in Ihrem Ton antworten – und sagen, wenn sie etwas nicht wissen. Den Assistenten auf dieser Website haben wir selbst entwickelt.",
        },
      },
      {
        name: { en: "Agentic Workflows", de: "Agentenbasierte Workflows" },
        text: {
          en: "Agents that carry out a task over several steps, such as checking a calendar, creating a booking or updating a record, with clear limits on what they may do.",
          de: "Agenten, die eine Aufgabe über mehrere Schritte ausführen, etwa einen Kalender prüfen, eine Buchung anlegen oder einen Datensatz aktualisieren – mit klaren Grenzen dafür, was sie tun dürfen.",
        },
      },
      {
        name: { en: "Generative AI Solutions", de: "Generative KI-Lösungen" },
        text: {
          en: "Drafting, summarising, translating and searching across your documents, built into the tools your team already works in.",
          de: "Entwerfen, Zusammenfassen, Übersetzen und Suchen in Ihren Dokumenten, eingebaut in die Werkzeuge, mit denen Ihr Team bereits arbeitet.",
        },
      },
      {
        name: { en: "AI-Powered Customer Support", de: "KI-gestützter Kundensupport" },
        text: {
          en: "First-line support that answers common questions at any hour and hands the conversation, with its full history, to your team when it gets specific.",
          de: "Ein First-Level-Support, der häufige Fragen rund um die Uhr beantwortet und das Gespräch samt Verlauf an Ihr Team übergibt, sobald es konkret wird.",
        },
      },
    ],
    approach: [
      {
        name: { en: "One process first", de: "Zuerst ein Prozess" },
        text: {
          en: "We pick one process where the benefit is easy to see and build that, before automating more.",
          de: "Wir wählen einen Prozess, bei dem der Nutzen leicht zu erkennen ist, und setzen diesen um, bevor wir weitere automatisieren.",
        },
      },
      {
        name: { en: "Grounded in your data", de: "Auf Ihren Daten aufgebaut" },
        text: {
          en: "The system answers from the information you give it and is tested against real questions. What it must never say or do is written down and checked.",
          de: "Das System antwortet aus den Informationen, die Sie bereitstellen, und wird mit echten Fragen getestet. Was es nie sagen oder tun darf, wird festgelegt und überprüft.",
        },
      },
      {
        name: { en: "A person stays in control", de: "Ein Mensch behält die Kontrolle" },
        text: {
          en: "Conversations and actions are logged so your team can review them, and anything sensitive can require a person's approval.",
          de: "Gespräche und Aktionen werden protokolliert, damit Ihr Team sie prüfen kann, und für Sensibles kann die Freigabe durch einen Menschen verlangt werden.",
        },
      },
    ],
    faq: [
      {
        q: { en: "Where does our data go?", de: "Wohin gehen unsere Daten?" },
        a: {
          en: "We agree that with you before anything is built: which model provider is used, where data is processed and what is stored. AIVIK is registered in Germany and plans projects with the GDPR in mind from the start.",
          de: "Das legen wir mit Ihnen fest, bevor etwas gebaut wird: welcher Modellanbieter genutzt wird, wo Daten verarbeitet werden und was gespeichert wird. AIVIK ist in Deutschland registriert und plant Projekte von Anfang an DSGVO-konform.",
        },
      },
      {
        q: { en: "What if the AI gets something wrong?", de: "Was, wenn die KI etwas Falsches sagt?" },
        a: {
          en: "No model is right every time, so the system is designed for that: it answers only from approved information, declines what it can't support and hands over to a person. Logs let you see and correct what happened.",
          de: "Kein Modell liegt immer richtig, deshalb ist das System darauf ausgelegt: Es antwortet nur aus freigegebenen Informationen, lehnt ab, was es nicht belegen kann, und übergibt an einen Menschen. In den Protokollen sehen und korrigieren Sie, was passiert ist.",
        },
      },
      {
        q: { en: "Does it work with the tools we already use?", de: "Funktioniert das mit unseren bestehenden Werkzeugen?" },
        a: {
          en: "Usually, yes. Calendars, CRMs, ticket systems and databases can be connected where they offer an interface. We check this during discovery.",
          de: "In der Regel ja. Kalender, CRM, Ticketsysteme und Datenbanken lassen sich anbinden, sofern sie eine Schnittstelle bieten. Das prüfen wir in der Discovery.",
        },
      },
      {
        q: { en: "Does the EU AI Act affect a project like this?", de: "Betrifft die KI-Verordnung ein solches Projekt?" },
        a: {
          en: "It can, depending on what the system does. Telling people they are talking to an AI is one obligation that applies to chatbots. We consider the rules that apply to your case in the design; this is not legal advice.",
          de: "Das kann sein, je nachdem, was das System tut. Menschen darauf hinzuweisen, dass sie mit einer KI sprechen, ist eine Pflicht, die für Chatbots gilt. Die für Ihren Fall geltenden Regeln berücksichtigen wir im Entwurf; eine Rechtsberatung ist das nicht.",
        },
      },
    ],
    articles: ["ai-trends-2027", "eu-ai-act-german-smes"],
    formOption: "ai",
    meta: {
      description: {
        en: "AI chatbots, agents and generative AI built into your workflows by AIVIK, grounded in your data and planned with the GDPR in mind.",
        de: "KI-Chatbots, Agenten und generative KI in Ihren Abläufen, entwickelt von AIVIK – auf Ihren Daten aufgebaut und DSGVO-konform geplant.",
      },
    },
  },
  {
    id: "cloud",
    slug: SERVICE_SLUGS.cloud,
    title: { en: "Cloud Infrastructure", de: "Cloud-Infrastruktur" },
    tagline: {
      en: "Hosting, databases and security that keep your software available as it grows.",
      de: "Hosting, Datenbanken und Sicherheit, die Ihre Software auch im Wachstum verfügbar halten.",
    },
    intro: {
      en: "Software is only as reliable as what it runs on. We set up and run the infrastructure behind your applications: where they are hosted, how they are deployed, how the data is stored and who can reach it. The setup is documented and yours, not locked to us.",
      de: "Software ist nur so zuverlässig wie die Umgebung, in der sie läuft. Wir richten die Infrastruktur hinter Ihren Anwendungen ein und betreiben sie: wo sie gehostet werden, wie sie ausgeliefert werden, wie die Daten gespeichert sind und wer darauf zugreifen kann. Die Umgebung ist dokumentiert und gehört Ihnen – ohne Bindung an uns.",
    },
    items: [
      {
        name: { en: "Hosting and Deployment", de: "Hosting und Deployment" },
        text: {
          en: "Environments for development, testing and production, with automated releases so a new version goes live in a repeatable way and can be rolled back.",
          de: "Umgebungen für Entwicklung, Test und Produktion mit automatisierten Releases, damit eine neue Version wiederholbar live geht und sich zurücknehmen lässt.",
        },
      },
      {
        name: { en: "Database Management", de: "Datenbankverwaltung" },
        text: {
          en: "Setup, backups, monitoring and tuning of your databases, including tested restores, so a backup is known to work before you need it.",
          de: "Einrichtung, Backups, Überwachung und Optimierung Ihrer Datenbanken, einschließlich getesteter Wiederherstellung – damit feststeht, dass ein Backup funktioniert, bevor Sie es brauchen.",
        },
      },
      {
        name: { en: "Cloud Migration", de: "Cloud-Migration" },
        text: {
          en: "Moving applications and data from your own servers, or from one provider to another, in planned steps with a way back at each one.",
          de: "Umzug von Anwendungen und Daten von eigenen Servern oder von einem Anbieter zum anderen – in geplanten Schritten, jeweils mit einem Weg zurück.",
        },
      },
      {
        name: { en: "Cloud Security Management and Analysis", de: "Cloud-Sicherheitsmanagement und -analyse" },
        text: {
          en: "Access rights, encryption, logging and regular reviews of your setup, with findings written up in plain language and ranked by risk.",
          de: "Zugriffsrechte, Verschlüsselung, Protokollierung und regelmäßige Prüfungen Ihrer Umgebung. Die Ergebnisse erhalten Sie verständlich aufbereitet und nach Risiko geordnet.",
        },
      },
    ],
    approach: [
      {
        name: { en: "We look at what you have", de: "Wir sehen uns den Bestand an" },
        text: {
          en: "We start with a review of the current setup, its costs and its weak points, and agree what actually needs to change.",
          de: "Am Anfang steht eine Bestandsaufnahme der aktuellen Umgebung, ihrer Kosten und ihrer Schwachstellen. Danach legen wir fest, was sich wirklich ändern muss.",
        },
      },
      {
        name: { en: "Infrastructure as code", de: "Infrastruktur als Code" },
        text: {
          en: "The setup is described in code and kept in your repository, so it can be reviewed, repeated and handed over.",
          de: "Die Umgebung ist als Code beschrieben und liegt in Ihrem Repository. So lässt sie sich prüfen, wiederholen und übergeben.",
        },
      },
      {
        name: { en: "Monitoring from day one", de: "Überwachung vom ersten Tag an" },
        text: {
          en: "Alerts and dashboards are part of the setup, so problems are noticed before your users report them.",
          de: "Alarme und Dashboards gehören zur Umgebung, damit Probleme auffallen, bevor Ihre Nutzer sie melden.",
        },
      },
    ],
    faq: [
      {
        q: { en: "Can our data stay in the EU?", de: "Können unsere Daten in der EU bleiben?" },
        a: {
          en: "Yes. Where data is stored and processed is a decision we make with you at the start, and EU regions are available with the major providers.",
          de: "Ja. Wo Daten gespeichert und verarbeitet werden, entscheiden wir zu Beginn gemeinsam mit Ihnen. Die großen Anbieter stellen dafür EU-Regionen bereit.",
        },
      },
      {
        q: { en: "Which cloud provider do you use?", de: "Mit welchem Cloud-Anbieter arbeiten Sie?" },
        a: {
          en: "The one that fits your requirements, existing contracts and team. We are not tied to a provider and explain the trade-offs before you decide.",
          de: "Mit dem, der zu Ihren Anforderungen, bestehenden Verträgen und Ihrem Team passt. Wir sind an keinen Anbieter gebunden und erläutern die Vor- und Nachteile, bevor Sie entscheiden.",
        },
      },
      {
        q: { en: "Will there be downtime during a migration?", de: "Gibt es bei einer Migration Ausfallzeiten?" },
        a: {
          en: "We plan migrations to keep interruptions as short as possible and agree any maintenance window with you in advance. How short depends on the system, which we assess first.",
          de: "Wir planen Migrationen so, dass Unterbrechungen möglichst kurz bleiben, und stimmen jedes Wartungsfenster vorab mit Ihnen ab. Wie kurz, hängt vom System ab – das prüfen wir zuerst.",
        },
      },
      {
        q: { en: "Do you run the infrastructure after setup?", de: "Betreiben Sie die Infrastruktur nach der Einrichtung?" },
        a: {
          en: "If you want us to. We can operate it for you, hand it to your team with documentation, or share the work.",
          de: "Wenn Sie das möchten. Wir können sie für Sie betreiben, sie dokumentiert an Ihr Team übergeben oder die Arbeit aufteilen.",
        },
      },
    ],
    formOption: "cloud",
    meta: {
      description: {
        en: "Hosting, deployment, database management, cloud migration and security from AIVIK. Documented setups that belong to you.",
        de: "Hosting, Deployment, Datenbankverwaltung, Cloud-Migration und Sicherheit von AIVIK. Dokumentierte Umgebungen, die Ihnen gehören.",
      },
    },
  },
  {
    id: "data",
    slug: SERVICE_SLUGS.data,
    title: { en: "Data Analysis", de: "Datenanalyse" },
    tagline: {
      en: "From scattered data to reports and forecasts your team can act on.",
      de: "Von verstreuten Daten zu Berichten und Prognosen, mit denen Ihr Team arbeiten kann.",
    },
    intro: {
      en: "Most companies have more data than they use, spread over systems that don't talk to each other. We bring it together, make it trustworthy and turn it into reports and forecasts that answer the questions your team actually asks.",
      de: "Die meisten Unternehmen haben mehr Daten, als sie nutzen – verteilt auf Systeme, die nicht miteinander sprechen. Wir führen sie zusammen, machen sie verlässlich und entwickeln daraus Berichte und Prognosen, die die Fragen beantworten, die Ihr Team tatsächlich stellt.",
    },
    items: [
      {
        name: { en: "Predictive Analytics", de: "Prädiktive Analysen" },
        text: {
          en: "Forecasts built on your own history, for example of demand, workload or churn, with a clear statement of how reliable each one is.",
          de: "Prognosen auf Basis Ihrer eigenen Daten, zum Beispiel zu Nachfrage, Auslastung oder Abwanderung – jeweils mit einer klaren Angabe, wie belastbar sie sind.",
        },
      },
      {
        name: { en: "Data Infrastructure Setup", de: "Aufbau von Dateninfrastruktur" },
        text: {
          en: "Pipelines that collect data from your systems into one place on a schedule, cleaned and checked, so every report draws on the same numbers.",
          de: "Pipelines, die Daten aus Ihren Systemen regelmäßig an einem Ort zusammenführen, bereinigt und geprüft, damit jeder Bericht auf denselben Zahlen beruht.",
        },
      },
      {
        name: { en: "Data Governance and Access Control", de: "Data Governance und Zugriffskontrolle" },
        text: {
          en: "Rules for who may see which data, how long it is kept and where it came from, set up so they are enforced by the system and can be shown in an audit.",
          de: "Regeln dazu, wer welche Daten sehen darf, wie lange sie aufbewahrt werden und woher sie stammen – so eingerichtet, dass das System sie durchsetzt und sie sich in einem Audit nachweisen lassen.",
        },
      },
      {
        name: { en: "Business Intelligence and Reporting", de: "Business Intelligence und Reporting" },
        text: {
          en: "Dashboards and regular reports for the figures you steer by, built so your team can explore them without asking a developer.",
          de: "Dashboards und regelmäßige Berichte für die Kennzahlen, nach denen Sie steuern – so aufgebaut, dass Ihr Team sie selbst auswerten kann, ohne einen Entwickler zu fragen.",
        },
      },
    ],
    approach: [
      {
        name: { en: "Questions before tools", de: "Fragen vor Werkzeugen" },
        text: {
          en: "We start from the decisions you want to make better and work back to the data they need.",
          de: "Wir gehen von den Entscheidungen aus, die Sie besser treffen möchten, und leiten daraus ab, welche Daten dafür nötig sind.",
        },
      },
      {
        name: { en: "Quality checked at the source", de: "Qualität an der Quelle geprüft" },
        text: {
          en: "Gaps, duplicates and conflicting definitions are found and fixed early, since a report is only as good as the data under it.",
          de: "Lücken, Dubletten und widersprüchliche Definitionen werden früh gefunden und behoben, denn ein Bericht ist nur so gut wie die Daten dahinter.",
        },
      },
      {
        name: { en: "Built for your team", de: "Für Ihr Team gebaut" },
        text: {
          en: "Reports are tested with the people who will use them, and the logic behind each figure is documented.",
          de: "Berichte werden mit den Menschen getestet, die sie nutzen werden, und die Logik hinter jeder Kennzahl ist dokumentiert.",
        },
      },
    ],
    faq: [
      {
        q: { en: "Our data is a mess. Is that a problem?", de: "Unsere Daten sind unordentlich. Ist das ein Problem?" },
        a: {
          en: "It is the normal starting point. Cleaning and connecting the data is usually the first part of the project, and we tell you plainly what it can and can't support.",
          de: "Das ist der übliche Ausgangspunkt. Die Daten zu bereinigen und zu verbinden ist meist der erste Teil des Projekts, und wir sagen Ihnen offen, was sie hergeben und was nicht.",
        },
      },
      {
        q: { en: "Do we need a data warehouse?", de: "Brauchen wir ein Data Warehouse?" },
        a: {
          en: "Not always. For a few sources a simpler setup is often enough. We recommend the smallest setup that answers your questions and can grow later.",
          de: "Nicht immer. Bei wenigen Quellen genügt oft eine einfachere Lösung. Wir empfehlen die kleinste Lösung, die Ihre Fragen beantwortet und später wachsen kann.",
        },
      },
      {
        q: { en: "How do you handle personal data?", de: "Wie gehen Sie mit personenbezogenen Daten um?" },
        a: {
          en: "With the GDPR as the baseline: only the data that is needed, clear access rules, and pseudonymised or aggregated data wherever the analysis allows it.",
          de: "Mit der DSGVO als Grundlage: nur die nötigen Daten, klare Zugriffsregeln und pseudonymisierte oder aggregierte Daten, wo immer die Auswertung es zulässt.",
        },
      },
      {
        q: { en: "Can you work with the reporting tools we have?", de: "Können Sie mit unseren vorhandenen Reporting-Werkzeugen arbeiten?" },
        a: {
          en: "Yes. If your team already uses a reporting tool, we build on it. If you have none, we suggest one that fits your size and budget.",
          de: "Ja. Wenn Ihr Team bereits ein Reporting-Werkzeug nutzt, bauen wir darauf auf. Wenn nicht, schlagen wir eines vor, das zu Größe und Budget passt.",
        },
      },
    ],
    articles: ["ai-adoption-germany-2026"],
    formOption: "data",
    meta: {
      description: {
        en: "Data pipelines, governance, dashboards and forecasts from AIVIK, so your team works from numbers it can trust.",
        de: "Datenpipelines, Governance, Dashboards und Prognosen von AIVIK – damit Ihr Team mit Zahlen arbeitet, denen es vertrauen kann.",
      },
    },
  },
  {
    id: "marketing",
    slug: SERVICE_SLUGS.marketing,
    title: { en: "Digital Marketing", de: "Digitales Marketing" },
    tagline: {
      en: "Search, ads and content that bring the right people to you, measured properly.",
      de: "Suche, Anzeigen und Inhalte, die die richtigen Menschen zu Ihnen bringen – sauber gemessen.",
    },
    intro: {
      en: "A good product still has to be found. We plan and run the channels that bring people to you and measure what they do when they arrive, so the budget goes where it works. Because we also build software, tracking and the website itself are part of the job, not someone else's problem.",
      de: "Auch ein gutes Produkt muss gefunden werden. Wir planen und betreuen die Kanäle, die Menschen zu Ihnen bringen, und messen, was sie dort tun, damit das Budget dorthin fließt, wo es wirkt. Weil wir auch Software entwickeln, gehören Tracking und die Website selbst zur Aufgabe und sind nicht das Problem von jemand anderem.",
    },
    items: [
      {
        name: { en: "SEO and Content Strategy", de: "SEO- und Content-Strategie" },
        text: {
          en: "Technical fixes, page structure and content planned around what your customers search for, in each language you sell in.",
          de: "Technische Verbesserungen, Seitenstruktur und Inhalte, geplant nach dem, wonach Ihre Kunden suchen – in jeder Sprache, in der Sie verkaufen.",
        },
      },
      {
        name: { en: "Paid Advertising Campaigns", de: "Bezahlte Werbekampagnen" },
        text: {
          en: "Search and social campaigns set up, tested and adjusted against agreed goals, with spending you can follow line by line.",
          de: "Such- und Social-Media-Kampagnen, aufgesetzt, getestet und an vereinbarten Zielen ausgerichtet – mit Ausgaben, die Sie Posten für Posten nachvollziehen können.",
        },
      },
      {
        name: { en: "Social Media Management", de: "Social-Media-Management" },
        text: {
          en: "A plan for the channels that matter to your audience, with content produced and published on a regular schedule.",
          de: "Ein Plan für die Kanäle, die für Ihre Zielgruppe zählen, mit Inhalten, die regelmäßig erstellt und veröffentlicht werden.",
        },
      },
      {
        name: { en: "Marketing Analytics and Reporting", de: "Marketing-Analysen und Reporting" },
        text: {
          en: "Tracking that respects visitors' consent, and reports that show which channel brought which enquiry.",
          de: "Tracking, das die Einwilligung der Besucher respektiert, und Berichte, die zeigen, welcher Kanal welche Anfrage gebracht hat.",
        },
      },
    ],
    approach: [
      {
        name: { en: "Goals you can measure", de: "Messbare Ziele" },
        text: {
          en: "We agree what counts as success, such as enquiries or sign-ups, and set up the measurement before the first campaign runs.",
          de: "Wir vereinbaren, was als Erfolg zählt, etwa Anfragen oder Anmeldungen, und richten die Messung ein, bevor die erste Kampagne läuft.",
        },
      },
      {
        name: { en: "Test, then scale", de: "Erst testen, dann ausbauen" },
        text: {
          en: "Channels and messages are tested with small budgets first. What works gets more, what doesn't is stopped.",
          de: "Kanäle und Botschaften werden zuerst mit kleinem Budget getestet. Was funktioniert, wird ausgebaut, was nicht funktioniert, wird beendet.",
        },
      },
      {
        name: { en: "Reports in plain language", de: "Berichte in klarer Sprache" },
        text: {
          en: "You get a regular report that says what was done, what it brought and what we suggest next.",
          de: "Sie erhalten regelmäßig einen Bericht, der zeigt, was getan wurde, was es gebracht hat und was wir als Nächstes vorschlagen.",
        },
      },
    ],
    faq: [
      {
        q: { en: "How soon will we see results?", de: "Wie schnell sehen wir Ergebnisse?" },
        a: {
          en: "It depends on the channel. Paid campaigns show data soon after they start, while search rankings build up over a longer period. We don't promise positions or numbers.",
          de: "Das hängt vom Kanal ab. Bezahlte Kampagnen liefern bald nach dem Start Daten, Suchmaschinen-Rankings bauen sich über einen längeren Zeitraum auf. Positionen oder Zahlen versprechen wir nicht.",
        },
      },
      {
        q: { en: "Is your tracking GDPR-compliant?", de: "Ist Ihr Tracking DSGVO-konform?" },
        a: {
          en: "We set tracking up around consent: analytics and advertising cookies are used only when a visitor agrees. This site works the same way.",
          de: "Wir richten Tracking an der Einwilligung aus: Analyse- und Werbe-Cookies werden nur gesetzt, wenn ein Besucher zustimmt. Diese Website funktioniert genauso.",
        },
      },
      {
        q: { en: "Do you work in German and English?", de: "Arbeiten Sie auf Deutsch und Englisch?" },
        a: {
          en: "Yes. We plan and write for both languages, and treat each market's search behaviour separately instead of translating one into the other.",
          de: "Ja. Wir planen und schreiben für beide Sprachen und betrachten das Suchverhalten jedes Marktes für sich, statt das eine in das andere zu übersetzen.",
        },
      },
      {
        q: { en: "Can you take over existing accounts and campaigns?", de: "Können Sie bestehende Konten und Kampagnen übernehmen?" },
        a: {
          en: "Yes. We review what is running, keep what works and tell you what we would change and why. The accounts stay yours.",
          de: "Ja. Wir prüfen, was läuft, behalten, was funktioniert, und sagen Ihnen, was wir ändern würden und warum. Die Konten bleiben Ihre.",
        },
      },
    ],
    formOption: null,
    meta: {
      description: {
        en: "SEO, content, paid campaigns, social media and consent-based analytics from AIVIK, in English and German.",
        de: "SEO, Content, bezahlte Kampagnen, Social Media und einwilligungsbasierte Analysen von AIVIK – auf Deutsch und Englisch.",
      },
    },
  },
];

export { SERVICES_BASE };

export const servicePath = (locale: Locale, service: Service) => `${SERVICES_BASE[locale]}/${service.slug[locale]}`;

export const findService = (locale: Locale, slug: string) => SERVICES.find((s) => s.slug[locale] === slug) ?? null;
