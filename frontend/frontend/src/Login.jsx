/*import React from "react";
//925682492325-kqgprm0nem7kgo03vrhke8gk70m50de7.apps.googleusercontent.com
export default function Login() {
  const handleGoogleLogin = () => {
    // later you will connect this to Google OAuth
    alert("Redirecting to Google Login...");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          CampusRent
        </h1>

        <p className="text-gray-600 mb-6">
          Secure Campus Rental Platform
        </p>

        {/* Important Note *//*}
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-6 text-sm">
          ⚠️ Please use your <b>college email ID</b> to login
        </div>

        {/* Google Button *//*}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full border-none p-3 hover:bg-gray-200 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="font-medium">Login with Google</span>
        </button>

        {/* Footer *//*}
        <p className="text-xs text-gray-500 mt-6">
          Only verified college students can access this platform
        </p>
      </div>
    </div>
  );
}


import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    const res = await fetch("http://127.0.0.1:8000/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    console.log(data.access_token)

    alert("Login Successful 🚀");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow text-center">

        <h2 className="text-xl font-bold mb-4">CampusRent</h2>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Login Failed")}
        />

      </div>
    </div>
  );
}*/
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader";
import { API_URL } from "./config";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const handleSuccess = async (credentialResponse) => {
    setLoading(true);

    try {
      const token = credentialResponse.credential;
      console.log(token)

      const res = await fetch(`${API_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          token,
          role: isAdmin ? "admin" : "user"
        })
      });
      const data = await res.json();

      /*if (!res.ok) {
        console.error("Backend Response: ",data)
        setErrorMsg(data.detail || "Login Failed");
        setTimeout(() => setErrorMsg(""), 5000);

        return;
      }*/

      if (!res.ok) {
        let errorText = "Login Failed";

        // ✅ Use already parsed data
        errorText = data.detail || errorText;

        // 🔥 Admin-specific message
        if (isAdmin && errorText === "Not an admin") {
          errorText = "❌ You are not authorized as Admin";
        }

        setErrorMsg(errorText);
        setTimeout(() => setErrorMsg(""), 5000);
        return;
      }

      // Save JWT
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      // 🔥 Role-based redirect
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Network Error:", error)
      setErrorMsg("Server not reachable");
      setTimeout(() => setErrorMsg(""), 5000);

    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          CampusRent
        </h1>

        <p className="text-gray-600 mb-6">
          Secure Campus Rental Platform
        </p>

        {/* Warning */}
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-6 text-sm">
          ⚠️ Use your <b>college email only</b>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm animate-pulse">
            {errorMsg}
          </div>
        )}
        
        {loading ? (
          //<p className="text-blue-500 font-semibold">Loading...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Login Failed")}
          />
          <div className="mt-4">
              <b>--------------------------------------------------</b>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`w-full p-2 rounded mt-4 ${
                isAdmin ? "bg-green-600" : "bg-gray-900"
              } text-white`}
            >
              {isAdmin ? "ADMIN MODE ON ✅" : "LOGIN AS ADMIN⬆️"}
            </button>
          </div>
          </>
        )}

        <p className="text-xs text-gray-500 mt-6">
          Only verified students allowed
        </p>

      </div>
    </div>
  );
}