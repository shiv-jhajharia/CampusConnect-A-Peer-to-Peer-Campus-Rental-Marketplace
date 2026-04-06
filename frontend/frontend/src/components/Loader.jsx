import React from "react";

export default function Loader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold animate-pulse">
        Loading...
      </h2>
    </div>
  );
}