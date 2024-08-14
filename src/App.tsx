import { PocketProvider } from "./contexts/PocketContext";
import { HashRouter, Routes, Route } from "react-router-dom";

import { Index } from "./pages/Index";
import { Counter } from "./pages/Counter";
import { Admin } from "./pages/Admin";
import { RequireAuth } from "./components/RequireAuth";

import './App.css'

function App() {
  return (
    <PocketProvider>
      <HashRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/c/:itemId" element={<Counter />} />
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </HashRouter>
    </PocketProvider>
  )
}

export default App
