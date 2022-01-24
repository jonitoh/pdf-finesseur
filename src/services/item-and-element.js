// minimum needed
const generateDNDItemFromElement = (element, order) => ({
    id: element.id,
    order: order,
    url: element.url,
});

// TODO fake implementation
const generateFakeElements = (length) => (
    [...Array(length).keys()]
        .map((i) => ({ id: i, url: "https://picsum.photos/80/45?random&" + i}))
)

const generateFakeDNDItems = (length, returnElements = false) => {
    const elements = generateFakeElements(length)
    const items = elements.map((element, order) => generateDNDItemFromElement(element, order))
    if (returnElements) return [items, elements]
    return items
}

export {
    generateDNDItemFromElement,
    generateFakeElements,
    generateFakeDNDItems,
}
