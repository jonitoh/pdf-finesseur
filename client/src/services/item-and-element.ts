/*
Service for Drag And Drop interaction in the application.
*/
export type DNDItem = {
  id: string;
  order: number;
};

// export type DNDElement<T> = T extends { id: string } ? T : never;

function hasElementProps(element: unknown): element is { id: string } {
  if (typeof element !== 'object' || !element) {
    return false;
  }
  return 'id' in element;
}

export function generateDNDItemFromElement(element: unknown, order: number) {
  if (!hasElementProps(element)) {
    throw new Error('element should be AT LEAST an object with a proprty named `id`');
  }
  return {
    id: element.id,
    order,
  };
}
