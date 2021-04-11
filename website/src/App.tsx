import { Switch, Route } from "react-router-dom";
import BrowsePage from "./pages/browse";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <Switch>
      <Route exact path="/browse">
        <BrowsePage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

export default App;
