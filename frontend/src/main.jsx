import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import App from "./App.jsx";
import "./index.css";
import "allotment/dist/style.css";
/* Fonts */
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-grotesk/600.css";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        fontFamily: "Inter, sans-serif",
        headings: {
          fontFamily: "Space Grotesk, sans-serif",
        },
      }}
    >
      <App />
    </MantineProvider>
  </BrowserRouter>
);