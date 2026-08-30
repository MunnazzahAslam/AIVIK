import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, PILLARS, type Pillar } from "../data";
import CaseStudyContent from "./CaseStudyContent";

type Props = {
  params: { pillar: string };
};

function isPillar(value: string): value is Pillar {
  return (PILLARS as string[]).includes(value);
}

export function generateStaticParams() {
  return PILLARS.map((pillar) => ({ pillar }));
}

const TITLE_LABEL: Record<Pillar, string> = {
  data: "Data",
  ai: "AI",
  cloud: "Cloud",
  marketing: "Marketing",
};

export function generateMetadata({ params }: Props): Metadata {
  if (!isPillar(params.pillar)) return {};
  return {
    title: `${TITLE_LABEL[params.pillar]} Case Studies`,
    description:
      "Documented industry outcomes, not Aivik case studies. The problems our clients face and the returns others have achieved solving them.",
    alternates: {
      canonical: `https://aivik.eu/case-studies/${params.pillar}`,
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  if (!isPillar(params.pillar)) notFound();
  return <CaseStudyContent content={CASE_STUDIES[params.pillar]} />;
}
