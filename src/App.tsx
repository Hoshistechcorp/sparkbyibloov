import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import Spark from "./pages/Spark";
import SparkPrograms from "./pages/SparkPrograms";
import SparkProgramDetails from "./pages/SparkProgramDetails";
import SparkMedia from "./pages/SparkMedia";
import SparkEvents from "./pages/SparkEvents";
import SparkNews from "./pages/SparkNews";
import SparkAdmin from "./pages/SparkAdmin";
import SparkAuth from "./pages/SparkAuth";
import SparkPartners from "./pages/SparkPartners";
import NotFound from "./pages/NotFound";
const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Navigate to="/spark" replace />} />
      <Route path="/spark" element={<Spark />} />
      <Route path="/spark/programs" element={<SparkPrograms />} />
      <Route path="/spark/programs/:id" element={<SparkProgramDetails />} />
      <Route path="/spark/media" element={<SparkMedia />} />
      <Route path="/spark/events" element={<SparkEvents />} />
      <Route path="/spark/news" element={<SparkNews />} />
      <Route path="/spark/admin" element={<SparkAdmin />} />
      <Route path="/spark/auth" element={<SparkAuth />} />
      <Route path="/spark/partners" element={<SparkPartners />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
