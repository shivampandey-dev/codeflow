import { useState } from 'react'
import LandingPage from "./pages/LandingPage/LandingPage"
import WorkspacePage from "./pages/WorkspacePage"
import { Routes, Route } from "react-router-dom";
import PreviewPage from "./pages/PreviewPage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace/:templateId" element={<WorkspacePage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </>
  )
}

export default App
