import "./App.css";
import NavBar from "./components/NavBar.js";
import Show from "./components/Show.js";
import ShowReplace from "./components/ShowReplace.js";
import EpisodeList from "./components/EpisodeList.js";
import { ShowProvider } from "./services/tvmaze.js";

function App() {
  return (
    <div className="App">
      <ShowProvider>
        <NavBar />
        <div className="container pt-4">
          <Show />
          <ShowReplace />
          <EpisodeList />
        </div>
      </ShowProvider>
    </div>
  );
}

export default App;
