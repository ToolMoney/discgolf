export function apiTarget() {
    return import.meta.env.DEV ? 'http://127.0.0.1:5000' : 'https://api.disc4days.stanleyhicks.me'
}