import "./ShowReplace.css";
import ErrorNotice from "./ErrorNotice.js";
import LoadingIcon from "./Loading.js";
import { useState, useEffect } from "react";
import { useShow, useEpisodeReplace } from "../services/tvmaze.js";

function ShowReplace() {
  const [error, setError] = useState();
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [searchStr, setSearchStr] = useState("");
  const [searching, setSearching] = useState(false);
  const show = useShow();
  const replaceEpisode = useEpisodeReplace();

  useEffect(() => {
    setError(null);
  }, [show]);

  useEffect(() => {
    if (show && show.seasons && !show.seasons[seasonIndex]) {
      setSeasonIndex(0);
      setEpisodeNumber(1);
    }
  }, [show, seasonIndex]);

  function episodeChange(event) {
    setEpisodeNumber(Number(event.target.value));
  }

  function handleSearchChange(event) {
    setSearchStr(event.target.value);
  }

  function seasonChange(event) {
    setSeasonIndex(Number(event.target.value));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (searchStr === "") {
      setError("Please enter a TV show name.");
      return;
    }
    setSearching(true);
    replaceEpisode(searchStr, seasonIndex, episodeNumber)
      .then(() => {
        setSearching(false);
        setError(null);
      })
      .catch((reason) => {
        setError(reason.message);
        setSearching(false);
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
                aria-label="Select Season"
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
                aria-label="Select Episode"
                onChange={episodeChange}
              >
                {show.seasons[seasonIndex]?.episodes.map((episode, index) => {
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
        {searching && (
          <div className="d-flex">
            <LoadingIcon />
          </div>
        )}
      </>
    );
  }
  return null;
}

export default ShowReplace;
