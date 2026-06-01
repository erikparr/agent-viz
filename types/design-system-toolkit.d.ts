declare module "@design-system-toolkit/react" {
  import type { ComponentType } from "react";
  export const DesignAudit: ComponentType<{
    config: unknown;
    title?: string;
  }>;
}

declare module "@design-system-toolkit/core";
declare module "@design-system-toolkit/cli";
