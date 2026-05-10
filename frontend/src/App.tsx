import { MobileView, WebView, RotateScreen } from "./application";
import { useLayoutMode } from "./services";

const App = () => {
  const { isMobileUI, isLandscape } = useLayoutMode();
  if (isMobileUI && isLandscape) return <RotateScreen />;
  return isMobileUI ? <MobileView /> : <WebView />;
};

export default App;
