import { LucideIcon } from "lucide-react";

export interface LinkItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
}