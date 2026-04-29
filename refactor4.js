const fs = require('fs');
const path = 'c:/Users/HP/Documents/GitHub/QAVTIX/qavtix_attendee/src/actions/payout/index.ts';
let content = fs.readFileSync(path, 'utf8');

const regex = /export async function getPaystackBanks\(\): Promise<\{ success: boolean; data\?: BankOption\[\]; message\?: string \}> \{\s*try \{\s*const res = await fetch\(\"https:\/\/api\.paystack\.co\/bank\?country=nigeria&perPage=100\", \{\s*headers: \{ Authorization: `Bearer \$\{process\.env\.PAYSTACK_SECRET_KEY\}` \},\s*next: \{ revalidate: 60 \* 60 \* 24 \},\s*\}\)/;

const newStr = `export async function getPaystackBanks(): Promise<{ success: boolean; data?: BankOption[]; message?: string }> {
    return _getPaystackBanks()
}

async function _getPaystackBanks(): Promise<{ success: boolean; data?: BankOption[]; message?: string }> {
    "use cache"
    cacheTag("paystack_banks")
    try {
        const res = await fetch("https://api.paystack.co/bank?country=nigeria&perPage=100", {
            headers: { Authorization: \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\` },
        })`;

content = content.replace(regex, newStr);
fs.writeFileSync(path, content);
console.log('done');
