import "./Episode.css";
function Episode(props) {
  if (props.episode) {
    return (
      <div className="episode d-flex pb-5">
        {(props.episode.image && (
          <img
            className="episode-image"
            src={props.episode.image}
            alt="Episode"
          />
        )) || (
          <div className="episode-image d-flex align-items-center justify-content-center bg-secondary text-light">
            <p>NA</p>
          </div>
        )}
        <div className="episode-content container">
          <h4 className="text-left">{props.episode.name}</h4>
          <p className="text-left text-secondary">{props.episode.subheader}</p>
          <p className="text-left">{props.episode.summary}</p>
        </div>
      </div>
    );
  }
  return <></>;
}

export default Episode;
