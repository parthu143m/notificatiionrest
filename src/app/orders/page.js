"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { messaging, getToken, onMessage } from "../../../lib/firebase";
import toast from "react-hot-toast";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const prevOrdersRef = useRef([]);

  const enableAudio = () => {
    setAudioEnabled(true);
    new Audio("/noti.mp3").play().catch(() => {});
    toast.success("Sound notifications enabled 🔊");
  };

  const enablePushNotifications = async () => {
    if (!messaging) return toast.error("Push not supported");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return toast.error("Permission denied");

      const token = await getToken(messaging, {
        vapidKey: "BOkelb-ep-EQ6gQ7v1mIMe6nhQcrNUOElTrwNRkuDi6oL0D6CBn5pzpj4Dd2SBWpwgR1Kjm9XJIq3gg8rznKl-k",
      });

      if (!token) return toast.error("No token received");

      const restaurantId = localStorage.getItem("restid");
      if (!restaurantId) return toast.error("No restaurant ID");

      await axios.post("/api/subscribe-to-topic", { token, restaurantId });

      setPushEnabled(true);
      toast.success("Mobile push notifications enabled! 🔔");
    } catch (err) {
      console.error(err);
      toast.error("Failed to enable push");
    }
  };

  useEffect(() => {
    const restaurantId = localStorage.getItem("restid");
    if (!restaurantId) {
      toast.error("No Restaurant ID found. Login again.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders?restaurantId=${restaurantId}`);
        if (res.data.success) {
          const newOrders = res.data.orders;

          // Detect new order
          const prevIds = prevOrdersRef.current.map((o) => o._id);
          const hasNew = newOrders.some((o) => !prevIds.includes(o._id));

          if (hasNew) {
            if (audioEnabled) new Audio("/noti.mp3").play().catch(() => {});
            toast.success(`New Order! ₹${newOrders[0].totalPrice}`, { duration: 8000 });
          }

          setOrders(newOrders);
          prevOrdersRef.current = newOrders;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/api/restaurant-status?restaurantId=${restaurantId}`);
        if (res.data.success) setIsActive(res.data.isActive);
      } catch (err) {}
    };

    fetchStatus();
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [audioEnabled]);

  // Foreground notifications
  useEffect(() => {
    if (!messaging) return;
    return onMessage(messaging, (payload) => {
      toast.success(`🛎 ${payload.notification?.body || "New order arrived!"}`);
      new Audio("/noti.mp3").play().catch(() => {});
    });
  }, []);

  // Your accept/reject functions remain same...

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders for Your Restaurant</h2>

      <div style={{ margin: "20px 0" }}>
        <button onClick={enableAudio} disabled={audioEnabled} style={{ marginRight: "10px", padding: "10px", background: "#ff9800", color: "white", border: "none", borderRadius: "6px" }}>
          Enable Sound 🔊
        </button>

        <button onClick={enablePushNotifications} disabled={pushEnabled} style={{ padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px" }}>
          Enable Mobile Push 🔔
        </button>

        {pushEnabled && <span style={{ marginLeft: "10px", color: "green", fontWeight: "bold" }}>Push Active</span>}
      </div>

      {/* Your existing orders list, accept/reject buttons, etc. */}
      {orders.length === 0 ? <p>No orders yet</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order) => (
            <li key={order._id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p><strong>Items:</strong> {order.items.length}</p>
              <p><strong>Time:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              {/* Add accept/reject buttons here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}