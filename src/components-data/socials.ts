const QAVTIX_HANDLE = "qavtix"

export const QAVTIX_SOCIALS = {
    FACEBOOK:  `https://www.facebook.com/${QAVTIX_HANDLE}`,
    INSTAGRAM: `https://www.instagram.com/${QAVTIX_HANDLE}`,
    TWITTER:   `https://twitter.com/${QAVTIX_HANDLE}`,
    TIKTOK:    `https://www.tiktok.com/@${QAVTIX_HANDLE}`,
    WHATSAPP:  `https://wa.me/message/${QAVTIX_HANDLE}`,
    YOUTUBE:   `https://www.youtube.com/@${QAVTIX_HANDLE}`,
    LINKEDIN:  `https://www.linkedin.com/company/${QAVTIX_HANDLE}`,
} as const

export type QavTixSocialKey = keyof typeof QAVTIX_SOCIALS