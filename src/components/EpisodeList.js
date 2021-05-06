import Episode from "./Episode.js";
import { useShow } from "../services/tvmaze.js";
import LoadingIcon from "./Loading.js";

function Season(props) {
  return (
    <>
      <h3 className="text-left">Season {props.seasonData.number}</h3>
      <p className="text-left text-secondary">
        {`${props.episodes.length} episodes | Aired ${props.seasonData.airdate}`}
      </p>
      <hr></hr>
      <ol>
        {props.episodes.map((episode, index) => {
          return (
            <li key={index}>
              <Episode episode={episode} />
            </li>
          );
        })}
      </ol>
    </>
  );
}

function EpisodeList() {
  const show = useShow();

  if (!show) {
    return <LoadingIcon />;
  } else if (show.seasons) {
    return (
      <ol className="pt-4">
        {show.seasons.map((seasonData, season) => {
          return (
            <li key={season}>
              <Season
                seasonData={seasonData.info}
                episodes={seasonData.episodes}
              />
            </li>
          );
        })}
      </ol>
    );
  } else {
    return (
      <div className="d-flex flex-column text-dark align-items-start bg-warning mt-4">
        <p className="p-2 m-0">This show does not have any seasons/episodes.</p>
        <p className="p-2 m-0">Please try another show.</p>
      </div>
    );
  }
}

export default EpisodeList;
