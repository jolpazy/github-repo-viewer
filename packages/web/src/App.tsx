import "./App.css";
import { useSearchRepositories } from "@repo-viewer/shared/dist";

function App() {
  const { data, isLoading, error } = useSearchRepositories({
    query: "react",
  });

  const count = data?.items?.length ?? 0;

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Something went wrong.</p>;

  return <p>Hi, I fetched {count} projects.</p>;
}

export default App;
