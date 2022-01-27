/*
Service for Drag And Drop interaction in the application.
*/
const generateDNDItemFromElement = (element, order) => ({
    id: element.id,
    order: order,
});

export {
    generateDNDItemFromElement
}
