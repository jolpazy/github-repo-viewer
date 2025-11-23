import { Routes, Route } from "react-router-dom";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchScreen />} />
      <Route path="/repo/:id" element={<DetailsScreen />} />
    </Routes>
  );
}

export default App;
