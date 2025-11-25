import { Routes, Route } from "react-router-dom";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchScreen />} />
      <Route path="/repo/:id" element={<DetailsScreen />} />
      <Route path="/favorites" element={<FavoritesScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default App;
