import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Dashboard from './pages/Dashboard';
import EpisodeDetail from './pages/EpisodeDetail';
import NewEpisode from './pages/NewEpisode';
import Building from './pages/Building';
import PreviewQueue from './pages/PreviewQueue';
import Scheduled from './pages/Scheduled';
import Published from './pages/Published';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/new" component={NewEpisode} />
      <Route path="/building" component={Building} />
      <Route path="/preview-queue" component={PreviewQueue} />
      <Route path="/scheduled" component={Scheduled} />
      <Route path="/published" component={Published} />
      <Route path="/episodes/:id" component={EpisodeDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
