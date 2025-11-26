import { Routes, Route } from "react-router-dom";
import SearchScreen from "./screens/Search/SearchScreen";
import DetailsScreen from "./screens/Details/DetailsScreen";
import FavoritesScreen from "./screens//Favorites/FavoritesScreen";
import NotFoundScreen from "./screens/NotFound/NotFoundScreen";
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
