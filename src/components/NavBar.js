import { useShowSearch } from "../services/tvmaze.js";
import { useEffect, useState } from "react";
import ErrorNotice from "./ErrorNotice.js";
function NavBar() {
  const searchShow = useShowSearch();
  const [searchStr, setSearchStr] = useState("");
  const [error, setError] = useState();
  useEffect(() => {
    setError(null);
  }, [searchShow]);
  function handleChange(event) {
    setSearchStr(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (searchStr === "") {
      setError("Please enter a TV show name.");
      setSearchStr("");
      return;
    }
    searchShow(searchStr)
      .then(() => {
        setError(null);
      })
      .catch((reason) => {
        setError(`There is no show matching "${searchStr}"`);
      });
    setSearchStr("");
  }
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container container-fluid">
          <h2 className="text-light">Episode Switcher</h2>
          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a TV show"
              aria-label="Enter a TV show"
              aria-describedby="search-button"
              value={searchStr}
              onChange={handleChange}
            />
            <button
              className="btn bg-secondary text-light"
              type="button"
              id="search-button"
              onClick={handleSubmit}
            >
              Search
            </button>
          </form>
        </div>
      </nav>
      {error && <ErrorNotice msg={error} />}
    </>
  );
}

export default NavBar;
