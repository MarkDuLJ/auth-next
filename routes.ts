/** 
 * all routes dont't need authentication, put into this array
 * @type {string[]}
 * */

export const publicRoutes = [
    "/",
]

/**
 * which routes need authentication
 * will direct logged in user to settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

/**
 * this prefix to determine if this api route need authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/settings"