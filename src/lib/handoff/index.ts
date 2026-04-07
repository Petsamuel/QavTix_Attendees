import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM  = "aes-256-gcm"
const SECRET_KEY = Buffer.from(process.env.HANDOFF_SECRET!, "hex")

export function encryptHandoffToken(payload: { access: string; refresh: string }): string {
    const iv         = randomBytes(12)
    const cipher     = createCipheriv(ALGORITHM, SECRET_KEY, iv)
    const encrypted  = Buffer.concat([
        cipher.update(JSON.stringify(payload), "utf8"),
        cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    // iv:authTag:encrypted — all base64url so it's URL-safe
    return [
        iv.toString("base64url"),
        authTag.toString("base64url"),
        encrypted.toString("base64url"),
    ].join(".")
}

export function decryptHandoffToken(token: string): { access: string; refresh: string } {
    const [ivB64, authTagB64, encryptedB64] = token.split(".")
    const iv        = Buffer.from(ivB64, "base64url")
    const authTag   = Buffer.from(authTagB64, "base64url")
    const encrypted = Buffer.from(encryptedB64, "base64url")

    const decipher = createDecipheriv(ALGORITHM, SECRET_KEY, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return JSON.parse(decrypted.toString("utf8"))
}