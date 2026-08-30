export type Pillar = "data" | "ai" | "cloud" | "marketing";

export type CaseStudyEntry = {
  label: string;
  headline: string;
  body: string;
  source: string;
};

export type PillarContent = {
  pillar: Pillar;
  label: string;
  h1: string;
  entries: CaseStudyEntry[];
};

export const PILLARS: Pillar[] = ["data", "ai", "cloud", "marketing"];

export const CASE_STUDIES: Record<Pillar, PillarContent> = {
  data: {
    pillar: "data",
    label: "DATA",
    h1: "The data layer is where AI ROI is won or lost.",
    entries: [
      {
        label: "MANUFACTURING · EUROPE",
        headline: "200% average ROI, but only when the data is right.",
        body: "Manufacturers who underestimate data infrastructure costs in their business case achieve only 85% of projected ROI. The shortfall traces back to the same place every time: data quality and integration problems that were never scoped. By 2026, 45% of G2000 manufacturers are connecting field and engineering data via AI, but the technology is only as reliable as the data feeding it.",
        source: "Capgemini Smart Factories Report 2025 · IDC Manufacturing FutureScape 2026",
      },
      {
        label: "SMEs · CROSS-SECTOR",
        headline: "70–90% reduction in manual data entry. If the systems connect.",
        body: "McKinsey's November 2025 report found that software and IT functions using AI for data work report 10 to 20% cost reductions. AI-driven data consolidation tools cut manual entry time by 70 to 90%, but only in organisations where the source systems are integrated. Disconnected ERPs, CRMs, and spreadsheets remain the single most common reason automation projects underdeliver.",
        source: "McKinsey Global Institute, Nov 2025 · AI Hub Landau 2026",
      },
      {
        label: "PROFESSIONAL SERVICES · GERMANY",
        headline: "43% of German SMEs cite poor data quality as their top AI barrier.",
        body: "Among German SMEs that have attempted AI projects, 43% name poor data quality and lack of technical maturity as the primary reason they stalled. The solution isn't a better model. It's a cleaner data layer built before the AI is introduced. The businesses achieving measurable AI outcomes in Germany are those that treated data infrastructure as a first-phase investment, not an afterthought.",
        source: "Bitkom AI Adoption Report 2025 · German SME Digital Transformation Study 2025",
      },
    ],
  },
  ai: {
    pillar: "ai",
    label: "AI",
    h1: "Intelligence that earns its keep.",
    entries: [
      {
        label: "PROFESSIONAL SERVICES · ENTERPRISE",
        headline: "40–60 minutes saved per person, per day.",
        body: "OpenAI's December 2025 enterprise report found users save 40 to 60 minutes per day through AI workflow automation. For a team of ten, that's a full-time equivalent recovered every week without a new hire. The highest-return automations are rarely the visible ones. They're the repetitive, manual, invisible tasks that consume skilled people's time.",
        source: "OpenAI Enterprise Report, December 2025 · UiPath Agentic AI Report 2025",
      },
      {
        label: "OPERATIONS · SMEs",
        headline: "76% first-year ROI. Seven-month payback.",
        body: "Document processing automation cuts manual processing time by up to 45%. For an SME processing 800 invoices per month, AI automation saves 107 hours monthly, at a fully-loaded cost of £35 per hour, that's £3,745 per month recovered. At a £28,000 implementation cost, payback arrives in seven months. Year 3 cumulative ROI: 428%.",
        source: "Regrello 2025 · 7code SME Automation Guide 2026",
      },
      {
        label: "MANUFACTURING · GLOBAL",
        headline: "69% of AI projects stall between pilot and production.",
        body: "The model works in the demo. The integration doesn't survive contact with the real ERP, the legacy data format, or the team that wasn't trained. Deloitte's 2025 survey found 24% of manufacturers have deployed generative AI at scale, and 38% are still piloting. The gap between piloting and shipping is where most AI investment disappears.",
        source: "Deloitte Manufacturing AI Survey 2025 · Unlocking Tech 2026",
      },
    ],
  },
  cloud: {
    pillar: "cloud",
    label: "CLOUD",
    h1: "Where your data lives is a compliance decision.",
    entries: [
      {
        label: "HEALTHCARE · UAE",
        headline: "UAE pixel data cannot leave the country. Full stop.",
        body: "UAE regulation prohibits medical imaging data, including CT scans, ultrasound, and any pixel-level patient data, from being processed outside the country. The Central Bank of the UAE launched the world's first sovereign financial cloud in February 2026. For hospitals running clinical AI, the compliance requirement is architecture-level, not contractual. Choosing the right cloud provider is the starting point, not the end point.",
        source: "UAE Central Bank, February 2026 · DHA / DoH Data Residency Framework",
      },
      {
        label: "REGULATED SECTORS · GCC",
        headline: "$80 billion in sovereign cloud spending in 2026. 89% growth in the Middle East.",
        body: "Gartner forecasts worldwide sovereign cloud IaaS spending to reach $80 billion in 2026, with the Middle East and Africa recording the fastest regional growth at 89%. Saudi Arabia's PDPL has been fully enforceable since September 2024, with 48 enforcement decisions already issued. The question for enterprise leaders is no longer whether to adopt sovereign cloud. It's how quickly the architecture can be built.",
        source: "Gartner Sovereign Cloud Forecast 2026 · SDAIA Enforcement Report 2025–2026",
      },
      {
        label: "ENTERPRISE · EU",
        headline: "If your cloud provider is US-incorporated, you do not have full data sovereignty.",
        body: "GDPR Article 48 provides no valid legal basis for compliance with US government data demands. If your cloud provider is US-incorporated, data stored in Europe can still be compelled under the US CLOUD Act, creating a direct conflict between US and EU law. The EU AI Act Article 10 requires documented data governance for high-risk AI systems. Most off-the-shelf cloud APIs do not provide the audit trails a compliance review expects.",
        source: "NeuralTrust Data Sovereignty Guide 2026 · EDPB Report, April 2025",
      },
    ],
  },
  marketing: {
    pillar: "marketing",
    label: "MARKETING",
    h1: "Growth, driven by data.",
    entries: [
      {
        label: "SMEs · CROSS-SECTOR",
        headline: "80% more leads. 77% higher conversion rates.",
        body: "Businesses using marketing automation see an 80% increase in lead volume and 77% higher conversion rates compared to manual outreach. Harvard Business Review found that businesses using AI for lead response see 50% higher conversion rates. Lead response time improvements are visible within the first week of implementation. Full ROI measurement is most reliable at the six-month mark.",
        source: "HubSpot Marketing Automation Report 2026 · Harvard Business Review 2023",
      },
      {
        label: "SMBs · MICROSOFT STUDY",
        headline: "353% ROI. 30% lower customer acquisition cost.",
        body: "Microsoft's study of small and mid-sized businesses using AI marketing tools found a 353% ROI, 30% reduction in customer acquisition costs, and 20% higher conversions. The compound effect comes from multiple sources simultaneously: content creation that previously took hours takes minutes, personalised campaigns at scale, automated reporting, and AI-assisted customer communication.",
        source: "Microsoft SMB AI Study 2025 · SUPALABS Analysis 2025",
      },
      {
        label: "MARKETING TEAMS · GLOBAL",
        headline: "92% of marketers are using AI tools. The gap is in how.",
        body: "92% of marketers report using AI tools as part of their marketing efforts. But McKinsey's State of AI report found that companies with fully integrated AI marketing functions, not just subscribed to tools, report revenue uplifts of 3 to 15% and sales ROI improvements of 10 to 20%. The difference is strategic configuration versus passive default settings. Mid-market businesses (10 to 100 employees) sit at 38% full adoption, the fastest-growing segment, and the largest untapped opportunity.",
        source: "McKinsey State of AI 2025 · Gartner Marketing Technology Report 2026",
      },
    ],
  },
};
