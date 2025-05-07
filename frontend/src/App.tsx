import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage"; // doğru

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={WelcomePage} />
      </Switch>
    </Router>
  );
}

export default App;
