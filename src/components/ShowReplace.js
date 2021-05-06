import "./ShowReplace.css";
import ErrorNotice from "./ErrorNotice.js";
import { useState, useEffect } from "react";
import { useShow, useEpisodeReplace } from "../services/tvmaze.js";
function ShowReplace() {
  const [error, setError] = useState();
  const [seasonIndex, setseasonIndex] = useState(0);
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [searchStr, setSearchStr] = useState("");
  const show = useShow();
  const replaceEpisode = useEpisodeReplace();

  useEffect(() => {
    setError(null);
  }, [show]);

  function episodeChange(event) {
    setEpisodeNumber(Number(event.target.value));
  }

  function handleSearchChange(event) {
    setSearchStr(event.target.value);
  }

  function seasonChange(event) {
    setseasonIndex(Number(event.target.value));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (searchStr === "") {
      setError("Please enter a TV show name.");
      return;
    }
    replaceEpisode(searchStr, seasonIndex, episodeNumber)
      .then(() => {
        setError(null);
      })
      .catch((reason) => {
        if (typeof reason.message !== "undefined") {
          setError(
            "There is no matching episode for the season, episode, and show provided."
          );
          return;
        }
        if (reason.status === 404) {
          setError(`There is no show matching "${searchStr}"`);
        }
        setError(`There is no show matching "${searchStr}"`);
      });
  }
  // Some shows do not have episodes / seasons however they will still be retrieved from the API.
  if (show && show.seasons) {
    return (
      <>
        <form>
          <div className="replace-container d-flex align-items-center pt-4">
            <div>
              <span className="mr-4">Replace</span>
              <select
                className="show-select custom-select mr-4"
                aria-label="Season 1"
                onChange={seasonChange}
              >
                {show.seasons.map((seasonData, index) => {
                  return (
                    <option key={index} value={index}>
                      Season {seasonData.info.number}
                    </option>
                  );
                })}
              </select>
              <select
                className="show-select custom-select mr-4"
                aria-label="Episode 1"
                onChange={episodeChange}
              >
                {show.seasons[seasonIndex].episodes.map((episode, index) => {
                  return (
                    <option key={index} value={episode.number}>
                      Episode {episode.number}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="replace-content d-flex align-items-center mr-4">
              <span className="text-center mr-4">with</span>
              <input
                className="form-control me-2 mr-4"
                aria-label="Show Replacement"
                value={searchStr}
                onChange={handleSearchChange}
              />
              <button
                className="btn bg-dark text-light"
                type="submit"
                onClick={handleSubmit}
              >
                Replace
              </button>
            </div>
          </div>
        </form>
        {error && <ErrorNotice msg={error} />}
      </>
    );
  }
  return <></>;
}

export default ShowReplace;
