"use client";

import React, { useState } from "react";

export default function CheckInApp() {
  const [view, setView] = useState<"login" | "register" | "checkin">("login");
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [userData, setUserData] = useState<any>({ userId: "", password: "", confirmPassword: "", fullName: "", address: "", phone: "", email: "", employeeCode: "" });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [preview, setPreview] = useState<string | null>(null);
  const [showSave, setShowSave] = useState(false);

  const loginUser = async ({ userId, password }: { userId: string; password: string }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      return await res.json();
    } catch {
      return { success: false, message: "Login failed" };
    }
  };

  const registerUser = async (data: any) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, message: "Registration failed" };
    }
  };

  const checkIn = async (data: any) => {
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, message: "Check-in failed" };
    }
  };

  // ... ตัวจัดการฟอร์ม login, register, checkin เช่นเดียวกับตัวอย่างก่อนหน้านี้

  // ตัวอย่างฟังก์ชัน handleLogin
  const handleLogin = async () => {
    if (!loginUserId || !loginPassword) {
      setLoginError("Please fill in User ID and Password");
      return;
    }
    const res = await loginUser({ userId: loginUserId, password: loginPassword });
    if (res.success) {
      setUserData({ ...userData, userId: loginUserId });
      setView("checkin");
      setLoginError("");
    } else {
      setLoginError(res.message || "Invalid credentials");
    }
  };

  function toggleRegister(): void {
    setView((prevView) => (prevView === "login" ? "register" : "login"));
  }
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const password = event.target.value;
    setUserData((prevData) => ({ ...prevData, password }));
    setPasswordMatch(password === userData.confirmPassword);
  }
  async function startCamera(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      setTimeout(() => {
        if (context) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const photo = canvas.toDataURL("image/png");
          setPreview(photo);
          setShowSave(true);
        }
        stream.getTracks().forEach((track) => track.stop());
      }, 3000); // Capture photo after 3 seconds
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access the camera. Please check your permissions.");
    }
  }
  async function register(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (!passwordMatch) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await registerUser(userData);
      if (res.success) {
        alert("Registration successful!");
        setView("login");
      } else {
        alert(res.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  }
  function handleCheckIn(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  function logout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    setView("login");
    setLoginUserId("");
    setLoginPassword("");
    setLoginError("");
    setUserData({
      userId: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      address: "",
      phone: "",
      email: "",
      employeeCode: "",
    });
    setPreview(null);
    setShowSave(false);
    alert("You have been logged out.");
  }
  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1e1e1e] rounded-lg shadow-xl w-full max-w-md p-6 animate-slideUp">
        {view === "login" && (
          <div>
            <h2 className="text-blue-500 text-center text-2xl font-bold mb-6">
              SIAM ROYAL SYSTEM
            </h2>
            <input
              type="text"
              placeholder="User ID"
              className="w-full p-3 mb-3 bg-[#2a2a2a] rounded text-white"
              value={loginUserId}
              onChange={(e) => setLoginUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 bg-[#2a2a2a] rounded text-white"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            {loginError && (
              <p className="text-red-500 text-sm mb-2 text-center">{loginError}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded py-2 text-white"
            >
              Log In
            </button>
            <p className="text-center my-4">or</p>
            <button
              onClick={toggleRegister}
              className="w-full bg-gray-600 hover:bg-gray-500 transition rounded py-2 text-white"
            >
              Register
            </button>
          </div>
        )}

        {view === "register" && (
          <div>
            <h2 className="text-blue-500 text-center text-2xl font-bold mb-6">
              Register
            </h2>
            <input
              type="text"
              placeholder="User ID"
              className="input"
              value={userData.userId}
              onChange={(e) => setUserData({ ...userData, userId: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={userData.password}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className={`input ${!passwordMatch ? "border-red-500" : ""}`}
              value={userData.confirmPassword}
              onChange={(e) => {
                const confirmPassword = e.target.value;
                setUserData((prevData) => ({ ...prevData, confirmPassword }));
                setPasswordMatch(confirmPassword === userData.password);
              }}
            />
            {!passwordMatch && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
            <input
              type="text"
              placeholder="Full Name"
              className="input"
              value={userData.fullName}
              onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              className="input"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="input"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              className="input"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Employee Code"
              className="input"
              value={userData.employeeCode}
              onChange={(e) => setUserData({ ...userData, employeeCode: e.target.value })}
            />
            <button
              onClick={register}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded py-2 text-white mt-2"
              disabled={!passwordMatch}
            >
              Submit
            </button>
            <button
              onClick={toggleRegister}
              className="w-full bg-gray-600 hover:bg-gray-500 transition rounded py-2 text-white mt-2"
            >
              Back
            </button>
          </div>
        )}

        {view === "checkin" && (
          <div>
            <h2 className="text-blue-500 text-center text-2xl font-bold mb-6">
              Check-In
            </h2>
            <button
              onClick={startCamera}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded py-2 text-white mb-2"
            >
              Check-In (Take Photo)
            </button>
            <button
              onClick={handleCheckIn}
              className="w-full bg-green-600 hover:bg-green-700 transition rounded py-2 text-white mb-2"
            >
              Confirm Check-In
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 transition rounded py-2 text-white mb-4"
            >
              Log Out
            </button>

            {preview && (
              <>
                <img src={preview} alt="preview" className="w-full rounded mb-4" />
                {showSave && (
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => alert("Saved successfully!")}
                      className="flex-1 bg-green-600 hover:bg-green-700 transition rounded py-2 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={retakePhoto}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 transition rounded py-2 text-white"
                    >
                      Retake
                    </button>
                  </div>
                )}
                <div className="bg-[#2a2a2a] p-4 rounded mb-4">
                  <h3 className="text-blue-300 text-lg font-semibold mb-2">User Info</h3>
                  <p><strong>User ID:</strong> {userData.userId}</p>
                </div>
                <div className="bg-[#2a2a2a] p-4 rounded">
                  <h3 className="text-blue-300 text-lg font-semibold mb-2">Check-In Info</h3>
                  <img
                    src="https://via.placeholder.com/300x200?text=Place+Photo"
                    alt="place"
                    className="rounded mb-2"
                  />
                  <p><strong>Coordinates:</strong> 13.7563, 100.5018</p>
                  <p><strong>Address:</strong> Bangkok, Thailand</p>
                  <p><strong>Date/Time:</strong> {new Date().toLocaleString()}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
