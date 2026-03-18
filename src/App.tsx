import { useEffect } from "react";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { initMcpBridge } from "./lib/mcp-bridge";
import UploadPage from "./pages/UploadPage";

function Home(): JSX.Element {
  return (
    <p className="text-slate-600">MCP Widget — use Upload to add media</p>
  );
}

export default function App(): JSX.Element {
  useEffect(() => {
    initMcpBridge();
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 p-4">
        <nav className="mb-6 flex gap-4 border-b border-slate-200 pb-4">
          <Link to="/" className="text-slate-700 hover:text-slate-900 underline">
            Home
          </Link>
          <Link
            to="/upload"
            className="text-slate-700 hover:text-slate-900 underline"
          >
            Upload
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
