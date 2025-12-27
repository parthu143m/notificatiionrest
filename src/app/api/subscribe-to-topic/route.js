// app/api/subscribe-to-topic/route.js
import { NextResponse } from "next/server";
import admin from "../../../../lib/firebase-admin";

export async function POST(request) {
  try {
    const { token, restaurantId } = await request.json();
    if (!token || !restaurantId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const topic = `restaurant_${restaurantId}`;
    await admin.messaging().subscribeToTopic(token, topic);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}