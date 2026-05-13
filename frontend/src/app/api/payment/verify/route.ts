import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const user = session.user;
    const { paymentId, orderId, signature, items, phoneNumber, street, city, state, pincode } = await req.json();

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Same logic as your COD order
    type OrderItemInput = { variantId: string; quantity: number };

    const orderItems: { variantId: string; quantity: number; price: number }[] = [];
    let totalAmount = 0;

    const variantIds = (items as OrderItemInput[]).map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, price: true, offerPrice: true, qty: true },
    });

    for (const it of items as OrderItemInput[]) {
      const v = variants.find((vv) => vv.id === it.variantId);
      const priceToUse = v?.offerPrice ?? v?.price ?? 0;
      orderItems.push({ variantId: v!.id, quantity: it.quantity, price: priceToUse });
      totalAmount += priceToUse * it.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        paymentMethod: "ONLINE",
        totalAmount,
        status: "PAID",
        phoneNumber,
        street,
        city,
        state,
        pincode,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        items: {
          create: orderItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    for (const item of orderItems) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { qty: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ error: "Payment error" }, { status: 500 });
  }
}
