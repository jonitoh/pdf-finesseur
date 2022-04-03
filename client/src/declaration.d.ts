declare module '*.css';

declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';

  export const src: string;
  function SVG(props: SVGProps<SVGSVGElement>): ReactElement;
  export default SVG;
}
