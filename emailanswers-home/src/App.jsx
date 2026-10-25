
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NeverBounce from "./pages/NeverBounce/NeverBounce";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Original website homepage */}
        <Route path="/" element={<HomePage />} />

        {/* New NeverBounce comparison page */}
        <Route
          path="/alternatives/neverbounce"
          element={<NeverBounce />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
