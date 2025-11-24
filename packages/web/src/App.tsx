import { Routes, Route } from "react-router-dom";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchScreen />} />
      <Route path="/repo/:id" element={<DetailsScreen />} />{" "}
      <Route path="/favorites" element={<FavoritesScreen />} />
    </Routes>
  );
}

export default App;
