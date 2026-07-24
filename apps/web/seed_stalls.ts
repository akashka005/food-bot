import { PrismaClient, StallCategory, DietaryType, MealCategory } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Reading INFO.md...');
  const infoPath = path.join(__dirname, '../../INFO.md');
  const content = fs.readFileSync(infoPath, 'utf8');

  const sections = content.split('## ');

  console.log('Clearing existing stalls and menus...');
  await prisma.menuItem.deleteMany();
  await prisma.foodStall.deleteMany();

  // Create a default vendor
  let vendor = await prisma.vendor.findFirst({ where: { email: 'vendor@smartfood.com' } });
  if (!vendor) {
    vendor = await prisma.vendor.create({
      data: {
        name: 'Main Vendor',
        email: 'vendor@smartfood.com',
        phone: '9999999999',
        passwordHash: 'dummy',
        businessName: 'LPU Stalls',
        status: 'ACTIVE',
      }
    });
  }

  for (const section of sections) {
    if (!section.trim()) continue;

    const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const stallName = lines[0].replace(/[^a-zA-Z0-9 &'-]/g, '').trim();
    if (!stallName || stallName.toLowerCase().includes('lpu smartfood')) continue; // Skip non-stalls

    console.log(`Processing stall: ${stallName}`);

    const stall = await prisma.foodStall.create({
      data: {
        vendorId: vendor.id,
        name: stallName,
        description: `Authentic food from ${stallName}`,
        category: 'MIXED',
        location: 'LPU Campus',
        openingTime: '09:00',
        closingTime: '22:00',
        status: 'OPEN',
      }
    });

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Skip headers
      if (line.toLowerCase().includes('item') && line.toLowerCase().includes('price')) continue;
      
      // Attempt to split by tab or multiple spaces
      const parts = line.split(/\t{1,}|\s{2,}/);
      let itemName = '';
      let priceStr = '';

      if (parts.length >= 2) {
        itemName = parts[0].trim();
        priceStr = parts[1].trim();
      } else {
        // Try regex if no clear tabs
        const match = line.match(/^(.+?)\s+(\d+(?:\.\d+)?)$/);
        if (match) {
          itemName = match[1].trim();
          priceStr = match[2].trim();
        }
      }

      const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      if (itemName && !isNaN(price)) {
        await prisma.menuItem.create({
          data: {
            stallId: stall.id,
            name: itemName.substring(0, 200),
            price: price,
            dietaryType: itemName.toLowerCase().includes('chicken') || itemName.toLowerCase().includes('mutton') || itemName.toLowerCase().includes('egg') || itemName.toLowerCase().includes('fish') ? 'NON_VEG' : 'VEG',
            status: 'AVAILABLE',
          }
        });
      }
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
