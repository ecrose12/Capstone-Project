"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParentMode } from "@/context/ParentModeContext";
import { createClient } from "@/lib/supabase/client";
import "./account-page.css";

export default function AccountPage() {
  const { mode, loading: modeLoading } = useParentMode();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  const isParent = mode === "parent";

  useEffect(() => {
    if (modeLoading) return;
    if (!isParent) {
      router.push("/login");
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    fetch("/api/family/saved-data")
      .then((res) => res.json())
      .then((result) => setDevices(result.devices || []))
      .finally(() => setLoadingDevices(false));
  }, [modeLoading, isParent]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (modeLoading || !isParent) return null;

  return (
    <main className="account-page">
      <h1 className="account-page__title">My Account</h1>

      <section className="account-page__section">
        <h2>Signed in as</h2>
        <p>{email || "…"}</p>
        <button type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </section>

      <section className="account-page__section">
        <h2>Paired Devices &amp; Saved Data</h2>
        {loadingDevices ? (
          <p>Loading…</p>
        ) : devices.length === 0 ? (
          <p>No devices paired yet.</p>
        ) : (
          <ul className="account-page__device-list">
            {devices.map((device) => (
              <li key={device.id} className="account-page__device">
                <div className="account-page__device-header">
                  <span className="account-page__device-name">{device.deviceName}</span>
                  <span className="account-page__device-meta">
                    Last active {new Date(device.lastSeenAt).toLocaleDateString()}
                  </span>
                </div>

                {device.savedTemplates.length === 0 ? (
                  <p className="account-page__no-saved">
                    Nothing saved specifically for this device yet.
                  </p>
                ) : (
                  <ul className="account-page__saved-list">
                    {device.savedTemplates.map((template) => (
                      <li key={template.categoryId} className="account-page__saved-item">
                        <a href={`/category/${template.categoryId}`}>{template.categoryName}</a>
                        <span className="account-page__saved-meta">
                          Updated {new Date(template.updatedAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="account-page__hint">
          To pair a new device, go to <a href="/settings">Settings</a>.
        </p>
      </section>
    </main>
  );
}