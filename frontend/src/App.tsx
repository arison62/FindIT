import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutPage from "./pages/LayoutPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPages from "./pages/LoginPages";
import SignupPage from "./pages/SignupPage";
import PostView from "./pages/PostView";
import AddPost from "./pages/HomePage/AddPost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route element={<HomePage />} >
            <Route index element={<PostView />} />
            <Route path="profile" element={<div>Profile</div>} />
            <Route path="post" element={<AddPost />} />
            <Route path="message" element={<div>Search</div>} />
        
          </Route>
          <Route path="/login" element={<LoginPages />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
