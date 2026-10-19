declare module "*.png" {
  const value: any;
  export default value;
}


declare module 'lucide-react-native' {
  import { FC, SVGProps } from 'react';
  
  // This tells TypeScript to accept any props for Lucide icons
  export const Home: FC<any>;
  export const Settings: FC<any>;
  export const Calendar: FC<any>;
  export const ShieldCheck: FC<any>;
  export const Video: FC<any>;
  export const CreditCard: FC<any>;
  export const ChevronRight: FC<any>;
  export const Clock: FC<any>;
  export const Star: FC<any>;
  export const Play: FC<any>;
  export const Bell: FC<any>;
  export const MessageSquare: FC<any>;
  export const User: FC<any>;
  export const Feather: FC<any>;
  export const ArrowRight: FC<any>;
  export const ChevronLeft: FC<any>;
}
