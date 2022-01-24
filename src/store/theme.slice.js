const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
    SUNNY: 'sunny',
}

const themeSlice = (set, get) => ({
    //states
    theme: process.env.DEFAULT_THEME || THEME.LIGHT,
    //actions
    getAllThemesAsList: () => (Object.values(THEME)),
    getAllThemesAsOptions: translator => (
        Object
            .values(THEME)
            .map(v => ({ value: v, label: translator(`${v}-theme`) }))
    ),
    updateTheme: theme => set({ theme: theme }),
    setDocumentTheme: () => document.documentElement.setAttribute("data-theme", get().theme),
    setLocalStorageTheme: () => (localStorage.setItem("data-theme", JSON.stringify(get().theme))),
    setTheme: theme => {
        get().updateTheme(theme);
        get().setDocumentTheme();
        get().setLocalStorageTheme();
    },
    initiateTheme: () => {
        if (!localStorage.getItem("data-theme")) {
            get().setLocalStorageTheme(get().theme);
        } else {
            get().updateTheme(JSON.parse(localStorage.getItem("data-theme")))
        }
        get().setDocumentTheme()
    }
})

export default themeSlice