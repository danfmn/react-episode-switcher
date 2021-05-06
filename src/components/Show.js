import "./Show.css";
import { useShow } from "../services/tvmaze.js";
function Show() {
  const show = useShow();
  if (show) {
    return (
      <div className="show-container d-flex">
        {(show.image && (
          <img className="show-image" src={show.image} alt="Show" />
        )) || (
          <div className="show-image d-flex align-items-center justify-content-center bg-secondary">
            <p className="text-light ">NA</p>
          </div>
        )}
        <div className="show-content container">
          <h1 className="text-left">{show.name}</h1>
          <p className="text-left text-secondary">{show.subheader}</p>
          <p className="text-left mt-4">{show.summary}</p>
        </div>
      </div>
    );
  }
  return <> </>;
}

export default Show;
