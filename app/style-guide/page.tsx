"use client";

import { DesignAudit } from "@design-system-toolkit/react";
import config from "./design-audit.config.json";

export default function Page() {
  return <DesignAudit config={config} title="Style Guide" />;
}
