const avatarColors = [
  'bg-red-700',
  'bg-blue-700',
  'bg-green-700',
  'bg-purple-700',
  'bg-pink-700',
  'bg-yellow-700',
  'bg-indigo-700',
  'bg-teal-700'
]

export function getAvatarColor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}