import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Portfolio from "./components/Portfolio";
import LoadingScreen from "./components/LoadingScreen";
import { usePortfolio } from "./lib/stores/usePortfolio";
import "@fontsource/inter";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

function App() {
  const { initializePortfolio } = usePortfolio();

  useEffect(() => {
    initializePortfolio();
  }, [initializePortfolio]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full bg-black overflow-hidden">
        <Suspense fallback={<LoadingScreen />}>
          <Portfolio />
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
