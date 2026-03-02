import { useState } from 'react'
import LandingPage from "./pages/LandingPage/LandingPage"
import WorkspacePage from "./pages/WorkspacePage"
import { Routes, Route } from "react-router-dom";
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace/:templateId" element={<WorkspacePage />} />
      </Routes>
    </>
  )
}

export default App
