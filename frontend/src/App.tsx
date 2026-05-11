import { MobileView, WebView, RotateScreen, AuthPage } from "./application";
import { Spinner } from "./components/ui";
import { useAuth } from "./context";
import { useLayoutMode } from "./services";

const App = () => {
  const { isMobileUI, isLandscape } = useLayoutMode();
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return <Spinner size="3rem" />;
  if (isMobileUI && isLandscape) return <RotateScreen />;
  if (!isAuthenticated) return <AuthPage />;
  return isMobileUI ? <MobileView /> : <WebView />;
};

export default App;
