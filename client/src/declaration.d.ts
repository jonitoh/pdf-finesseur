declare module '*.css';

declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';

  export const src: string;
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}
