const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding orders...");

  // Products must exist in your Product table with these IDs
  const products = [
    { id: "P01", name: "Pisang Sale 250gr (Kertas)", price: 45000 },
    { id: "P02", name: "Pisang Sale 100gr (Kertas)", price: 20000 },
    { id: "P03", name: "Pisang Sale 300gr (Kertas)", price: 50000 },
  ];

  // Orders to seed for susantodika123@gmail.com
  const ordersToSeed = [
    {
      customerName: "Susanto Dika",
      customerEmail: "susantodika123@gmail.com",
      customerPhone: "08123456789",
      customerAddress: "Jl. Mawar No. 1, Denpasar",
      status: "PENDING",
      subtotal: products[0].price + products[2].price,
      serviceFee: 5000,
      shippingProvider: "JNE",
      shippingCost: 15000,
      totalAmount: products[0].price + products[2].price + 5000 + 15000,
      items: [
        { productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 1 },
        { productId: products[2].id, name: products[2].name, price: products[2].price, quantity: 1 },
      ],
    },
    {
      customerName: "Susanto Dika",
      customerEmail: "susantodika123@gmail.com",
      customerPhone: "08123456789",
      customerAddress: "Jl. Mawar No. 1, Denpasar",
      status: "PENDING",
      subtotal: products[1].price,
      serviceFee: 5000,
      shippingProvider: "J&T",
      shippingCost: 10000,
      totalAmount: products[1].price + 5000 + 10000,
      items: [
        { productId: products[1].id, name: products[1].name, price: products[1].price, quantity: 1 },
      ],
    },
  ];

  for (const order of ordersToSeed) {
    const createdOrder = await prisma.order.create({
      data: {
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        status: order.status,
        subtotal: order.subtotal,
        serviceFee: order.serviceFee,
        shippingProvider: order.shippingProvider,
        shippingCost: order.shippingCost,
        totalAmount: order.totalAmount,
        items: {
          create: order.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    console.log(`Created order (${order.status}) for ${createdOrder.customerEmail} with ${createdOrder.items.length} items.`);
  }

  console.log("Order seeding finished.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });