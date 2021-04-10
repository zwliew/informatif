import { Switch, Route } from "react-router-dom";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <Switch>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

export default App;
