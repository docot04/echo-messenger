import { MobileView, WebView, RotateScreen, AuthPage } from "./application";
import { Spinner } from "./components/ui";
import { useAuth } from "./context";
import { useLayoutMode } from "./services";

const App = () => {
  const { isMobileUI, isLandscape } = useLayoutMode();
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady)
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          marginTop: "50%",
        }}
      >
        <Spinner size="3rem" />;
      </div>
    );
  if (isMobileUI && isLandscape) return <RotateScreen />;
  if (!isAuthenticated) return <AuthPage />;
  return isMobileUI ? <MobileView /> : <WebView />;
};

export default App;
