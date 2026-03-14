"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getBuyerOrders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    orderBy: [desc(orders.createdAt)],
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  
  // Revalidate seller paths
  revalidatePath(`/dashboard/seller/orders/${orderId}`);
  revalidatePath("/dashboard/seller/orders");
  revalidatePath("/dashboard/seller");
  
  // Revalidate buyer paths
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/buyer");
  revalidatePath(`/dashboard/buyer/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}/invoice`);
}

export async function getOrderDetail(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    throw new Error("Order not found or access denied");
  }

  return order;
}

export async function createOrder(items: any[], total: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const userId = session.user.id;
  const orderId = crypto.randomUUID();

  await db.transaction(async (tx) => {
    // 1. Create the order
    await tx.insert(orders).values({
      id: orderId,
      userId: userId,
      total,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Create order items
    for (const item of items) {
      await tx.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      });
    }
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/buyer");
  
  return { id: orderId };
}
