// app.js
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ContactPage from "@/pages/contact";
import LoginPage from "@/pages/login";
import AdminPage from "@/pages/admin";
import ActivitiesPage from "@/pages/activities";
import TeamPage from "@/pages/team";
import CompanyPage from "@/pages/company";
import CareersPage from "@/pages/careers";
import ProjectsPage from "@/pages/projects";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/activities" component={ActivitiesPage} />
      <Route path="/company" component={CompanyPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin/:section" component={AdminPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
