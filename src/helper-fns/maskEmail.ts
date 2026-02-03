export function maskEmail(email: string): string {
    if (!email || typeof email !== 'string') {
        return email;
    }

    email = email.trim().toLowerCase()

    const [localPart, domain] = email.split('@')

    if (localPart.length < 2) {
        // Not enough characters to mask
        return email;
    }

    const maskedLocal = localPart[0] + '*'.repeat(Math.max(3, localPart.length - 2)) + localPart[localPart.length - 1]

    return `${maskedLocal}@${domain}`;
}