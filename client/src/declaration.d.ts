declare module '*.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}
declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';

declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';

  export const src: string;
  function SVG(props: SVGProps<SVGSVGElement>): ReactElement;
  export default SVG;
}
