export interface PasswordStrengthCheck {
    atLeastOneUppercase: boolean;
    atLeastOneNumber: boolean;
    atLeastEightCharacters: boolean;
    score: number;
    strength: 'weak' | 'medium' | 'strong';
    color: string;
    label: string;
}

export function checkPasswordStrength(password: string): PasswordStrengthCheck {
    const checks = {
        atLeastOneUppercase: /[A-Z]/.test(password),
        atLeastOneNumber: /[0-9]/.test(password),
        atLeastEightCharacters: password.length >= 8
    }

    const score = Object.values(checks).filter(Boolean).length

    let strength: 'weak' | 'medium' | 'strong'
    let color: string
    let label: string

    if (score === 3) {
        strength = 'strong'
        color = '#3EC596'
        label = 'Strong password'
    } else if (score === 2) {
        strength = 'medium'
        color = '#f59e0b'
        label = 'Medium password. Must contain:'
    } else {
        strength = 'weak'
        color = '#ef4444'
        label = 'Weak password. Must contain:'
    }

    return {
        ...checks,
        score,
        strength,
        color,
        label
    }
}