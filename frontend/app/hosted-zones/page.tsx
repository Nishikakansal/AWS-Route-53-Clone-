"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  isAuthenticated,
  removeToken,
} from "@/lib/auth";

import { apiRequest } from "@/lib/api";


export default function HostedZonesPage() {
  const router = useRouter();

  const [hostedZones, setHostedZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadHostedZones();
  }, []);


  async function loadHostedZones() {
    try {
      const data = await apiRequest("/hosted-zones");

      setHostedZones(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  function handleLogout() {
    removeToken();

    router.push("/login");
  }


  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <main style={{ padding: "40px" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Hosted Zones</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>


      <h2>Your Hosted Zones</h2>


      {hostedZones.length === 0 ? (
        <p>No Hosted Zones found.</p>
      ) : (
        <ul>
          {hostedZones.map((zone) => (
            <li key={zone.id}>
              {zone.name}
            </li>
          ))}
        </ul>
      )}

    </main>
  );
}