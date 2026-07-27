import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Login from './pages/Login';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider, useAuth } from './lib/auth';

import Dashboard from './pages/Dashboard';
import EpisodeDetail from './pages/EpisodeDetail';
import NewEpisode from './pages/NewEpisode';
import Building from './pages/Building';
import PreviewQueue from './pages/PreviewQueue';
import Scheduled from './pages/Scheduled';
import Published from './pages/Published';
import AnalyticsPage from './pages/Analytics';
import SocialStatus from './pages/SocialStatus';
import SocialSetup from './pages/SocialSetup';

const queryClient = new QueryClient();

function Router() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEAE0] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#0C0C0C] border-t-[#C9A800] animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/new" component={NewEpisode} />
      <Route path="/building" component={Building} />
      <Route path="/preview-queue" component={PreviewQueue} />
      <Route path="/scheduled" component={Scheduled} />
      <Route path="/published" component={Published} />
      <Route path="/episodes/:id" component={EpisodeDetail} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/social-status" component={SocialStatus} />
      <Route path="/social-setup" component={SocialSetup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
