/*
State management for theming in the application.
*/
import { THEME } from "../utils/constants";

const themeSlice = (set, get) => ({
    //states
    theme: process.env.THEME || THEME.LIGHT,
    themeTagName: "data-theme",
    //actions
    getAllThemesAsList: () => (Object.values(THEME)),
    getAllThemesAsOptions: translator => (
        Object
            .values(THEME)
            .map(v => ({ value: v, label: translator(`${v}-theme`) }))
    ),
    updateTheme: theme => set({ theme: theme }),
    setDocumentTheme: () => document.documentElement.setAttribute(get().themeTagName, get().theme),
    setLocalStorageTheme: () => (localStorage.setItem(get().themeTagName, JSON.stringify(get().theme))),
    setTheme: theme => {
        get().updateTheme(theme);
        get().setDocumentTheme();
        get().setLocalStorageTheme();
    },
    initiateTheme: () => {
        if (!localStorage.getItem(get().themeTagName)) {
            get().setLocalStorageTheme(get().theme);
        } else {
            get().updateTheme(JSON.parse(localStorage.getItem(get().themeTagName)))
        }
        get().setDocumentTheme()
    }
})

export default themeSlice