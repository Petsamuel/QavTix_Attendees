const fs = require('fs');
const path = require('path');

const filesToProcess = [
  { path: 'src/actions/settings/profile/index.ts', tag: 'PROFILE', func: 'getProfile' },
  { path: 'src/actions/settings/privacy/index.ts', tag: 'PRIVACY_SETTINGS', func: 'getPrivacySettings' },
  { path: 'src/actions/settings/notification/index.ts', tag: 'NOTIFICATION_SETTINGS', func: 'getNotificationSettings' },
  { path: 'src/actions/payout/index.ts', tag: 'PAYOUT_ACCOUNTS', func: 'getPayoutAccounts' },
  { path: 'src/actions/payment/index.ts', tag: 'PAYMENT_ACCOUNTS', func: 'getPaymentAccounts' },
  { path: 'src/actions/payment/index.ts', tag: 'PAYMENT_METHODS', func: 'getPaymentMethods' },
  { path: 'src/actions/groups/index.ts', tag: 'GROUPS', func: 'getGroups' },
  { path: 'src/actions/filters/index.ts', tag: 'CATEGORIES', func: 'getCategories' },
  { path: 'src/actions/affiliates/index.ts', tag: 'tag', func: 'getAffiliates' }
];

for (const item of filesToProcess) {
  const fullPath = path.join('c:/Users/HP/Documents/GitHub/QAVTIX/qavtix_attendee', item.path);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already has "use cache"
  if (content.includes('"use cache"')) {
      console.log('Skipping ' + item.path + ' - already has use cache');
      continue;
  }

  // Add cacheTag import if missing
  if (!content.includes('cacheTag')) {
    if (content.includes('import { revalidateTag } from \"next/cache\"')) {
        content = content.replace('import { revalidateTag } from \"next/cache\"', 'import { revalidateTag, cacheTag } from \"next/cache\"');
    } else if (content.includes('import { revalidateTag } from \'next/cache\'')) {
        content = content.replace('import { revalidateTag } from \'next/cache\'', 'import { revalidateTag, cacheTag } from \'next/cache\'');
    } else {
        content = content.replace(/import/, 'import { cacheTag } from \"next/cache\"\nimport');
    }
  }

  // Handle special case for tag vs CACHE_TAGS.tag
  const cacheTagStr = item.tag === 'tag' ? 'tag' : 'CACHE_TAGS.' + item.tag;

  // Refactor function
  const funcRegex = new RegExp(`export async function ${item.func}\\((.*?)\\)(.*?)\\{([\\s\\S]*?)(try \\{[\\s\\S]*?\\} catch .*?\\{[\\s\\S]*?\\})`);
  
  const match = content.match(funcRegex);
  if (match) {
     const args = match[1];
     const retType = match[2];
     const bodyPrefix = match[3];
     const bodyMain = match[4];

     // Extra passedArgs handling
     const argNames = args.split(',').map(a => a.split(':')[0].split('=')[0].trim()).filter(a => a);
     const passedArgs = ['accessToken', ...argNames].join(', ');

     let newFunc = `export async function ${item.func}(${args})${retType}{\n    const accessToken = (await cookies()).get(\"access_token\")?.value;\n    return _${item.func}(${passedArgs});\n}\n\nasync function _${item.func}(accessToken: string | undefined${args ? ', ' + args : ''})${retType}{\n    \"use cache\"\n    cacheTag(${cacheTagStr})\n    try {`;

     // Remove next: { tags: ... } from body
     let newBodyMain = bodyMain.replace(/\s*next:\s*\{\s*tags:\s*\[.*?\](?:,\s*revalidate:\s*\d+)?\s*\}(?:,\s*revalidate:\s*\d+)?\s*?,?/g, '');
     newBodyMain = newBodyMain.replace(/try \{/, '');
     
     content = content.replace(funcRegex, newFunc + newBodyMain);
     fs.writeFileSync(fullPath, content);
     console.log('Refactored ' + item.path + ' - ' + item.func);
  } else {
     console.log('Could not match ' + item.path + ' - ' + item.func);
  }
}
