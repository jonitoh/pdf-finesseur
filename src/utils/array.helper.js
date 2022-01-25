
/*
    Object
    .values(languages)
    .map(v => ({ [v]: require(`./messages/${v}.json`) }))
    .reduce((prev, cur) => ({ ...prev, ...cur }), {})


    Object
    .entries(LANGUAGES)
    .filter(([, v]) => langs.indexOf(v) !== -1)
    .map(([k, v]) => ({[k]: v}))
    .reduce((prev, cur) => ({ ...prev, ...cur }), {})  


    documents
    .map(doc => doc.extractPages())
    .reduce((a, b) => (a.concat(b)), [])


    items.filter(item => item.id === itemId);
    console.log("@@@removedItems", removedItems);
    removePageByIdFromDeletedPages(itemId);
    console.log("@@@pages removed")
    if (removedItems.length > 0) {
      console.log("@@@about to add available page");
      addAvailablePage(removedItems[0]);


      const filterByName = (list, name) => (list.filter(l => l.filename === name))

      get().getElements().filter(e => e.id === itemId)[0]
*/
