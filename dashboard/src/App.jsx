import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from "./Pages/Login";
import MainLayout from "./LayOut/MainLayout";
import Signup from "./Pages/Singup";
import Home from "./Pages/DashBoardHome";
import EditProduct from "./Pages/EditProduct";
import DragSorting from "./Components/New";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/drag" element={<DragSorting />} />
      <Route path="/edit-product" element={<EditProduct />} />
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
