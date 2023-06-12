import React, { useContext } from 'react'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home/Home'
import Register from './pages/register/Register'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Rightbar from './components/rightbar/Rightbar';
import LeftBar from './components/leftbar/LeftBar'
import { DarkModeContext } from './context/darkModeContext'
import { AuthContext } from './context/authContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Search from './pages/Search/Search'

const App = () => {
  const { darkMode } = useContext(DarkModeContext)
  const { currentUser } = useContext(AuthContext)
  const Layout = () => {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <Rightbar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/search",
          element: <Search />,
        },
      ],
    },
    {

      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App