import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import ErrorPage from './error-page.jsx';
import './index.css';
import PageBag from './routes/bag.jsx';
import PageCourses from './routes/courses.jsx';
import PageRounds from './routes/rounds.jsx';
import PageProfile from './routes/profile.jsx';
import AddDiscToBag from './routes/bag-add.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "rounds",
        element: <PageRounds />,
      },
      {
        path: "courses",
        element: <PageCourses />,
      },
      {
        path: "bag",
        element: <PageBag />,
        children: [
          {
            path: "add-disc",
            element: <AddDiscToBag />
          },
        ],
      },
      {
        path: "profile",
        element: <PageProfile />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
