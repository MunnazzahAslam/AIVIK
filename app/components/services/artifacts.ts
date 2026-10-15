import type { ComponentType } from "react";
import type { Service } from "@/data/services";
import SoftwareArtifact from "./SoftwareArtifact";
import WorkflowArtifact from "./WorkflowArtifact";
import CloudArtifact from "./CloudArtifact";
import DataArtifact from "./DataArtifact";
import MarketingArtifact from "./MarketingArtifact";

/** The animated drawing of each service, on its home card and its own page. */
export const SERVICE_ARTIFACTS: Record<Service["id"], ComponentType> = {
  software: SoftwareArtifact,
  ai: WorkflowArtifact,
  cloud: CloudArtifact,
  data: DataArtifact,
  marketing: MarketingArtifact,
};
