// app/api/orders/route.js
import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoose";
import Order from "../../../../models/Order";

export async function GET(request) {
  await connectionToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, message: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ restaurantId })
      .sort({ orderDate: -1 })
      .lean(); // Important: use .lean() for better performance

    // Format items properly (in case it's stored as object or string)
    const formattedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      userId: order.userId,
      items: Array.isArray(order.items) ? order.items : [],
      totalCount: order.totalCount || order.items.length,
      totalPrice: order.totalPrice,
      orderId: order.orderId || order._id.toString(),
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      razorpayOrderId: order.razorpayOrderId || "",
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}