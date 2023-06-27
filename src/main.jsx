import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useParams, } from 'react-router-dom';
import App from './App.jsx';
import ErrorPage from './error-page.jsx';
import './index.css';
import PageBag from './routes/bag.jsx';
import PageCourses from './routes/courses.jsx';
import PageRounds from './routes/rounds.jsx';
import PageProfile from './routes/profile.jsx';
import AddDiscForm from './routes/bag-add.jsx';
import AddCourseForm from './routes/course-add.jsx';
import CoursePage from './routes/course.jsx';
import AddHoleForm from './routes/hole-add.jsx';
import AddRoundForm from './routes/round-add.jsx';
import RoundPage from './routes/round.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "rounds",
        element: <PageRounds />,
        children: [
          {
            path: "add-round",
            element: <AddRoundForm />
          }
        ]
      },
      {
        path: "rounds/:id",
        element: <RoundPage />,
      },
      {
        path: "courses",
        element: <PageCourses />,
        children: [
          {
            path: "add-course",
            element: <AddCourseForm />
          },
        ]
      },
      {
        path: "courses/:id",
        element: <CoursePage />,
        children: [
          {
            path: "add-hole",
            element: <AddHoleForm />
          },
        ]
      },
      {
        path: "bag",
        element: <PageBag />,
        children: [
          {
            path: "add-disc",
            element: <AddDiscForm />
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
