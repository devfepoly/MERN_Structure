import { Suspense, memo, type FC } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import routes from "@routes";
import Loading from "@components/Loading";

const App: FC = memo(() => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading size="lg" fullScreen />}>
        <Routes>{routes}</Routes>
      </Suspense>
    </BrowserRouter>
  );
});

App.displayName = 'App';

export default App;
