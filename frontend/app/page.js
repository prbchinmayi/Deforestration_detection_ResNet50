"use client";

import { useState } from "react";
import Overview from "./components/Overview";
import LiveDemo from "./components/LiveDemo";

export default function Page() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="container">
      <header className="site">
        <h1>Deforestation Detection</h1>
        <nav className="tabs">
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={tab === "demo" ? "active" : ""}
            onClick={() => setTab("demo")}
          >
            Live Demo
          </button>
        </nav>
      </header>

      {tab === "overview" ? <Overview /> : <LiveDemo />}
    </div>
  );
}