// Seed script — generates mock Policy data into db.json for json-server.
// Run with: npm run seed   (or: node scripts/seed.mjs)
// No external dependencies — uses Node's built-in crypto + fs.

import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RECORD_COUNT = 200;

const LINE_OF_BUSINESS = ['Property', 'Casualty', 'A&H', 'Marine'];
const STATUS = ['Active', 'Expired', 'Pending', 'Cancelled'];
const CURRENCY = ['USD', 'SGD', 'HKD', 'AUD', 'JPY', 'THB'];
const REGION = [
  'Singapore',
  'Hong Kong',
  'Australia',
  'Japan',
  'Thailand',
  'Indonesia',
  'Malaysia',
  'Philippines',
];

const PREMIUM_MIN = 1_000;
const PREMIUM_MAX = 5_000_000;

// Realistic APAC policyholder + underwriter names across the served regions.
const FIRST_NAMES = [
  'Wei', 'Mei', 'Jun', 'Li', 'Hua', 'Xin', 'Ying', 'Chen',
  'Hiroshi', 'Yuki', 'Sakura', 'Takeshi', 'Aiko', 'Kenji', 'Haruka',
  'Siti', 'Ahmad', 'Nurul', 'Farah', 'Iskandar', 'Aishah',
  'Somchai', 'Suda', 'Niran', 'Apinya', 'Chai',
  'Jose', 'Maria', 'Andres', 'Liwayway', 'Ramon',
  'Putri', 'Budi', 'Dewi', 'Agus', 'Wayan',
  'Liam', 'Charlotte', 'Noah', 'Olivia', 'Jack',
];

const LAST_NAMES = [
  'Tan', 'Lim', 'Lee', 'Wong', 'Ng', 'Chan', 'Goh', 'Teo',
  'Yamamoto', 'Sato', 'Suzuki', 'Tanaka', 'Watanabe', 'Nakamura',
  'bin Abdullah', 'binti Hassan', 'Rahman', 'Ismail',
  'Saetang', 'Wattana', 'Charoenpong',
  'Santos', 'Reyes', 'Dela Cruz', 'Garcia', 'Bautista',
  'Wijaya', 'Susanto', 'Pratama', 'Halim',
  'Smith', 'Williams', 'Nguyen', 'Patel',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function uniquePolicyNumbers(count) {
  const set = new Set();
  while (set.size < count) {
    set.add(`POL-${String(randomInt(0, 999_999)).padStart(6, '0')}`);
  }
  return [...set];
}

function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function randomDates() {
  // Effective date within the last ~2 years; policy term of 6–24 months.
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - randomInt(0, 730));

  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + randomInt(6, 24));

  return { effectiveDate: toIsoDate(start), expiryDate: toIsoDate(expiry) };
}

function randomPremium() {
  // Two-decimal precision within the allowed range.
  return Math.round((Math.random() * (PREMIUM_MAX - PREMIUM_MIN) + PREMIUM_MIN) * 100) / 100;
}

function createPolicy(policyNumber) {
  const { effectiveDate, expiryDate } = randomDates();
  return {
    id: randomUUID(),
    policyNumber,
    policyholderName: randomName(),
    lineOfBusiness: pick(LINE_OF_BUSINESS),
    status: pick(STATUS),
    premiumAmount: randomPremium(),
    currency: pick(CURRENCY),
    effectiveDate,
    expiryDate,
    region: pick(REGION),
    underwriter: randomName(),
    // ~15% flagged for review, default otherwise false.
    flaggedForReview: Math.random() < 0.15,
  };
}

function main() {
  const policyNumbers = uniquePolicyNumbers(RECORD_COUNT);
  const policies = policyNumbers.map((num) => createPolicy(num));

  const db = { policies };

  const here = dirname(fileURLToPath(import.meta.url));
  const outPath = join(here, '..', 'db.json');
  writeFileSync(outPath, JSON.stringify(db, null, 2) + '\n', 'utf8');

  console.log(`Seeded ${policies.length} policies → ${outPath}`);
}

main();
