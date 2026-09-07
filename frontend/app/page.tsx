"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";

export default function Home() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    checkBackendHealth()
      .then((data) => {
        setMessage(data.status);
      })
      .catch(() => {
        setMessage("Backend connection failed");
      });
  }, []);

  return (
    <main>
      <h1>Route53 Clone</h1>
      <p>{message}</p>
    </main>
  );
}