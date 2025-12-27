import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { AuthProvider, useAuth } from "./features/auth/context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoadingState from "./components/ui/LoadingState";
import ErrorFallback from "./components/ui/ErrorFallback";

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Lazy Loading des pages

// PUBLIC
const Home = lazy(() => import("./features/public/pages/Home"));

// AUTH (Nouvelle structure)
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const ForgotPassword = lazy(() =>
  import("./features/auth/pages/ForgotPassword")
);
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword"));
const OtpVerify = lazy(() => import("./features/auth/pages/OtpVerify")); // Si utilisé quelque part, sinon optionnel
const OtpValidate = lazy(() => import("./features/auth/pages/OtpValidate"));
const OtpSuccess = lazy(() => import("./features/auth/pages/OtpSuccess"));
const Profile = lazy(() => import("./features/auth/pages/Profile"));

// CHILD
const ChildLibrary = lazy(() => import("./features/child/pages/Library"));
const BookReader = lazy(() => import("./features/story/pages/Reader"));
const Characters = lazy(() => import("./features/child/pages/Characters"));
const CharacterEditor = lazy(() =>
  import("./features/child/pages/CharacterEditor")
);
const PersonalBag = lazy(() => import("./features/child/pages/PersonalBag")); // NEW

// AUTHOR
const AuthorDashboard = lazy(() => import("./features/story/pages/Manager"));
const StoryEditor = lazy(() => import("./features/story/pages/Editor"));
const VisualEditor = lazy(() => import("./features/story/pages/VisualEditor"));


// EDITOR
const EditorDashboard = lazy(() => import("./features/editor/pages/Dashboard"));
const CreateCollection = lazy(() =>
  import("./features/editor/pages/CreateCollection")
);
const EditCollection = lazy(() =>
  import("./features/editor/pages/EditCollection")
);
const CollectionDetails = lazy(() =>
  import("./features/editor/pages/CollectionDetails")
); // Nouvelle page détails
const PendingValidation = lazy(() =>
  import("./features/editor/pages/PendingValidation")
);
const ActivityLogs = lazy(() => import("./features/editor/pages/ActivityLogs"));
const EditorBookCatalog = lazy(() =>
  import("./features/editor/pages/EditorBookCatalog")
); // NEW

// ADMIN
const AdminDashboard = lazy(() => import("./features/admin/pages/Dashboard"));
const AdminUsers = lazy(() => import("./features/admin/pages/Users"));
const AdminBooks = lazy(() => import("./features/admin/pages/Books"));
const AdminCollections = lazy(() =>
  import("./features/admin/pages/Collections")
);
const AdminReports = lazy(() => import("./features/admin/pages/Reports"));

// Composant de redirection pour la page d'accueil
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    const roleRoutes = {
      ENFANT: "/child/library",
      AUTEUR: "/author",
      EDITEUR: "/editor",
      ADMIN: "/admin",
    };
    return <Navigate to={roleRoutes[user.role] || "/profile"} replace />;
  }

  return <Home />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.reload()}
          >
            <Suspense fallback={<LoadingState />}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/otp/verify" element={<OtpVerify />} />
                <Route path="/otp/validate" element={<OtpValidate />} />
                <Route path="/otp/success" element={<OtpSuccess />} />

                {/* PROTECTED SHARED ROUTES */}
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={["ENFANT", "AUTEUR", "EDITEUR", "ADMIN"]}
                    />
                  }
                >
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* CHILD ROUTES */}
                <Route
                  path="/child"
                  element={<ProtectedRoute allowedRoles={["ENFANT"]} />}
                >
                  <Route path="library" element={<ChildLibrary />} />
                  <Route path="characters" element={<Characters />} />
                  <Route
                    path="character/edit/:id?"
                    element={<CharacterEditor />}
                  />
                  <Route path="bag" element={<PersonalBag />} />
                </Route>

                {/* PROTECTED READER ROUTE (for Child, Author and Editor) */}
                <Route
                  path="/read/:bookId"
                  element={
                    <ProtectedRoute allowedRoles={["ENFANT", "AUTEUR", "EDITEUR"]}>
                      <BookReader />
                    </ProtectedRoute>
                  }
                />

                {/* AUTHOR ROUTES */}
                <Route
                  path="/author"
                  element={<ProtectedRoute allowedRoles={["AUTEUR"]} />}
                >
                  <Route index element={<AuthorDashboard />} />
                  <Route path="story/:storyId" element={<StoryEditor />} />
                  <Route
                    path="visual-editor/:storyId"
                    element={<VisualEditor />}
                  />


                </Route>

                {/* EDITOR ROUTES */}
                <Route
                  path="/editor"
                  element={<ProtectedRoute allowedRoles={["EDITEUR"]} />}
                >
                  <Route index element={<EditorDashboard />} />
                  <Route path="validation" element={<PendingValidation />} />
                  <Route path="logs" element={<ActivityLogs />} />
                  <Route
                    path="collections/create"
                    element={<CreateCollection />}
                  />
                  <Route
                    path="collections/edit/:id"
                    element={<EditCollection />}
                  />
                  <Route
                    path="collections/:id"
                    element={<CollectionDetails />}
                  />{" "}
                  {/* Nouvelle Route */}
                  <Route path="catalog" element={<EditorBookCatalog />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route
                  path="/admin"
                  element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="books" element={<AdminBooks />} />
                  <Route path="collections" element={<AdminCollections />} />
                  <Route path="reports" element={<AdminReports />} />
                </Route>

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;