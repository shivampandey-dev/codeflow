
import { createRoot } from 'react-dom/client'
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import App from './App.jsx'
import "./index.css";
createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="dark">
    <App />
  </MantineProvider>
)
