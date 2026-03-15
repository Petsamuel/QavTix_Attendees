export function isAppleDevice() {
    return /iP(hone|ad|od)|Macintosh/.test(navigator.userAgent)
}