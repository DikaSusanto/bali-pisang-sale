const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productsToSeed = [
    { id: "P01", name: "Pisang Sale Original", price: 40000, weight: "250 gr", image: "/img/1685364484811.png" },
    { id: "P02", name: "Pisang Sale Mini Pack", price: 20000, weight: "100 gr", image: "/img/1685364484811.png" },
    { id: "P03", name: "Pisang Sale Special", price: 50000, weight: "300 gr", image: "/img/1685364484811.png" }, 
];

async function main() {
    console.log("Start seeding products...");
    for (const p of productsToSeed) {
        const product = await prisma.product.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
        console.log(`Created/updated product with id: ${product.id}`);
    }
    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });