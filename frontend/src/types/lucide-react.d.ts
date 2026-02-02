declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  export const LayoutDashboard: LucideIcon;
  export const Settings: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Sun: LucideIcon;
  export const Moon: LucideIcon;
}
