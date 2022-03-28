import localizeFilter from '../filters/localize.filter'

export default {
    install(app, options) {

        const message = html => {
            const ms = localizeFilter(html)
            M.toast({html: ms})
        }

        const error = html => {
            const ms = localizeFilter(html)
            M.toast({html: `[${localizeFilter('Error')}]: ${ms}`})
        }

        app.provide('plMessage', message)
        app.provide('plError', error)
    }
}