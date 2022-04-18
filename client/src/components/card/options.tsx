export type Styles = {
  [className: string]: string;
};

export function getShadowStyle(styleSheet: Styles, style?: string): string[] {
  switch (style) {
    case 'deep':
      return [styleSheet.deepShadow];
    case 'right-to-left':
      return [styleSheet.rightToLeftShadow];
    case 'focus':
      return [styleSheet.focusShadow];
    default:
      return [styleSheet.deepShadow];
  }
}

export function getContentStyle(styleSheet: Styles, style?: string): string[] {
  switch (style) {
    case 'appear':
      return [styleSheet.asAppear];
    default:
      return [];
  }
}

export type Props = {
  shadowStyle?: 'deep' | 'right-to-left' | 'focus';
  contentStyle?: 'appear';
};

export const defaultProps = {
  shadowStyle: undefined,
  contentStyle: 'appear',
};

/*
// What a card should look like
  <div className={styles.wrapper}>
    <div className={classNames([styles.card, ...[getShadowStyle(shadowStyle)]])}>
      <div className={styles.imgBox}>
        <img src={src} alt={imgText} />
      </div>
      <div
        className={classNames([
          styles.infoContent,
          ...[getContentStyle(contentStyle)],
        ])}
      >
      </div>
    </div>
    <div className={styles.outerContent} ></div>
  </div>
*/
