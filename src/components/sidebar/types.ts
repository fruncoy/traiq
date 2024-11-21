import { ComponentType } from "react";

export interface LinkItem {
  name: string;
  path: string;
  icon: ComponentType<any>;
  badge?: number;
}