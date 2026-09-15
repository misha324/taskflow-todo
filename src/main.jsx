
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { useSelector, useDispatch } from "react-redux";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Provider } from "react-redux";

import { store } from "./store";

import { ThemeProvider } from "./ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

import App from "./App.jsx";

import "./i18n";
import "./App.css";


const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {

  const isLoggedIn = useSelector(
    (state) => state.auth.isLoggedIn
  );

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;
}


// ==========================================
// PUBLIC ROUTE
// ==========================================

function PublicRoute({ children }) {

  const isLoggedIn = useSelector(
    (state) => state.auth.isLoggedIn
  );

  if (isLoggedIn) {

    return (
      <Navigate
        to="/todo"
        replace
      />
    );

  }

  return children;
}


// ==========================================
// APP
// ==========================================

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <ErrorBoundary>

      <Provider store={store}>

        <BrowserRouter>

          <ThemeProvider>

            <Suspense
              fallback={
                <p>Loading...</p>
              }
            >

              <Routes>

                {/* ==========================
                    HOME
                ========================== */}

                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />


                {/* ==========================
                    LOGIN
                ========================== */}

                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />


                {/* ==========================
                    SIGNUP
                ========================== */}

                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  }
                />


                {/* ==========================
                    TODO
                ========================== */}

                <Route
                  path="/todo"
                  element={
                    <ProtectedRoute>
                      <App />
                    </ProtectedRoute>
                  }
                />


                {/* ==========================
                    UNKNOWN ROUTE
                ========================== */}

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />

              </Routes>

            </Suspense>

          </ThemeProvider>

        </BrowserRouter>

      </Provider>

    </ErrorBoundary>

  </StrictMode>

);
