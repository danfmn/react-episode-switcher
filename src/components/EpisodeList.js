import "./Show.css";
import Episode from "./Episode.js";
import { useShow } from "../services/tvmaze.js";
function SeasonHeader(props) {
  return (
    <>
      <h3 className="text-left">Season {props.seasonData.number}</h3>
      <p className="text-left text-secondary">
        {`${props.episodes.length} episodes | Aired ${props.seasonData.airdate}`}
      </p>
      <hr></hr>
      {props.episodes.map((episode, index) => {
        return <Episode key={index} episode={episode} />;
      })}
    </>
  );
}

function EpisodeList() {
  const show = useShow();
  if (show && show.seasons) {
    return (
      <div className="pt-4">
        {show.seasons.map((seasonData, season) => {
          return (
            <SeasonHeader
              key={season}
              seasonData={seasonData.info}
              episodes={seasonData.episodes}
            />
          );
        })}
      </div>
    );
  } else if (show && !show.seasons) {
    return (
      <div className="d-flex flex-column text-dark align-items-start bg-warning mt-4">
        <p className="p-2 m-0">This show does not have any seasons/episodes.</p>
        <p className="p-2 m-0">Please try another show.</p>
      </div>
    );
  }
  return <> </>;
}

export default EpisodeList;
