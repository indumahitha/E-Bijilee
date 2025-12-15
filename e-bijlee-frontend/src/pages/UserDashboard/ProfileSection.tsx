// src/pages/UserDashboard/ProfileSection.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import ErrorAlert from "../../components/ErrorAlert";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  meterId: string;
  createdAt?: string;
  updatedAt?: string;
}

const ProfileSection: React.FC = () => {
  const { user, token } = useAuth(); // used below
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !token) return; // guard
      setLoading(true);
      setError("");
      try {
        // If your axiosClient already injects token, you could call /user/profile directly.
        // Here we show explicit header in case it's needed:
        const res = await axiosClient.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res?.data?.data) {
          setProfile(res.data.data);
        } else {
          setError("Failed to load profile.");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, token]);

  if (loading) return <Loader />;

  return (
    <section>
      <h2 style={{ textAlign: "center", margin: "1rem 0" }}>My Profile</h2>

      {error ? <ErrorAlert message={error} /> : null}

      {!profile && !error ? (
        <Card>
          <div>No profile information available.</div>
        </Card>
      ) : null}

      {profile ? (
        <Card>
          <div style={{ display: "grid", gap: 8 }}>
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Meter ID:</strong> {profile.meterId}</div>
            <div><strong>Role:</strong> {profile.role}</div>
            {profile.createdAt && <div><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleString()}</div>}
          </div>
        </Card>
      ) : null}
    </section>
  );
};

export default ProfileSection;
