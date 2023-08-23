import PostList from "./components/PostList";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom"
import Post from "./components/Post";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="posts/:id" element={<Post />} />
      </Route>
    </Routes>
    
  );
}

export default App;
