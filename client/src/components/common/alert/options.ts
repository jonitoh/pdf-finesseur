const toastElement = document.getElementById('toast') as HTMLElement;

export function initiate() {
  const classes = [
    process.env.NOTIFICATION_ORDER,
    process.env.NOTIFICATION_POSITION ? `position-${process.env.NOTIFICATION_POSITION}` : undefined,
  ].filter((cl) => typeof cl === 'string') as string[];

  if (toastElement.className) {
    toastElement.classList.add(...classes);
  } else {
    toastElement.className = classes.join(' ');
  }
}
