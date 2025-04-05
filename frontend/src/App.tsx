import { Toaster } from "@/components/ui/sonner"

import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
// import { AuthProvider, RequireAuth } from "@/contexts/AuthContext";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/auth/NotFound";
import PyCalculatorPage from "./pages/Ex1_PyCalculator/PyCalculatorPage";
import RStatsCalculatorPage from "./pages/Ex2_RStatsCalculator/RstatsCalculatorPage";
import ChatPage from "./pages/Ex1_ChatPage/ChatPage";



const App = () => (
    // <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="w-screen h-screen">
        <BrowserRouter>
          <Routes>
            {/* Public Authetication routes */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> */}

            {/* Example 1: Python Calculator */}
            <Route path="/pycalculator" element={<PyCalculatorPage />} />

            {/* Example 2: R Statistics Calculator */}
            <Route path="/rstatscalculator" element={<RStatsCalculatorPage />} />

            {/* Example 3: Chat with AI */}
            <Route path="/chat" element={<ChatPage />} />

            {/* Protected routes */}
            {/* <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <RequireAuth>
                  <ProjectDetails />
                </RequireAuth>
              }
            /> */}
            
            {/* Redirects */}
            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </div>
      </TooltipProvider>
    // </AuthProvider>
);

export default App;
