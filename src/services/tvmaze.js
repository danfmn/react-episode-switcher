import { useEffect, useState, createContext, useContext } from "react";

const showContext = createContext();
const showSearchContext = createContext();
const episodeReplaceContext = createContext();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

function useShow() {
  return useContext(showContext);
}

function useShowSearch() {
  return useContext(showSearchContext);
}

function useEpisodeReplace() {
  return useContext(episodeReplaceContext);
}

function formatEpisode(episode) {
  const formattedEpisode = {};
  formattedEpisode.name = episode.name;
  formattedEpisode.image = (episode.image && episode.image.medium) || null;
  formattedEpisode.number = episode.number;
  formattedEpisode.season = episode.season;
  formattedEpisode.subheader = `Season ${episode.season} | Episode ${
    episode.number
  } | ${formatDate(episode.airdate)}`;
  formattedEpisode.summary =
    episode.summary &&
    truncateString(episode.summary.replace(/(<([^>]+)>)/gi, ""), 270);
  return formattedEpisode;
}

// Some shows do not start with a season 1 such as show ID 47892
// Some shows do not have any episodes but are still listed: 31012
function formatSeasons(show, episodes) {
  if (episodes.length < 1) return;
  const formattedSeasons = episodes.reduce(
    (acc, val) => {
      if (typeof acc.seasonsToIndex[val.season] === "undefined") {
        const seasonIndex =
          acc.seasons.push({
            info: {
              airdate: formatDate(val.airdate),
              number: val.season,
            },
            episodes: [],
          }) - 1;
        acc.seasonsToIndex[val.season] = seasonIndex;
      }
      acc.seasons[acc.seasonsToIndex[val.season]].episodes.push(
        formatEpisode(val)
      );
      return acc;
    },
    { seasonsToIndex: {}, seasons: [] }
  );
  show.seasons = formattedSeasons.seasons;
}

function formatDate(date) {
  const newDate = new Date(date).toString();
  const exp = /^[^ ]+ (\w+) (\d+) (\d+).*/;
  return newDate.replace(exp, "$1. $2, $3");
}

function formatShow(show) {
  const formattedShow = {};
  formatSeasons(formattedShow, show._embedded.episodes);
  formattedShow.name = show.name;
  formattedShow.subheader =
    (show.genres.length > 0 &&
      show.genres.join(", ") + ((show.premiered && " | ") || "")) ||
    "";
  formattedShow.subheader +=
    (show.premiered && `Premiered on ${formatDate(show.premiered)}`) || "";
  formattedShow.summary =
    show.summary &&
    truncateString(show.summary.replace(/(<([^>]+)>)/gi, ""), 700);
  formattedShow.image = (show.image && show.image.medium) || null;
  return formattedShow;
}

function getShow(showID) {
  const req = new Request(
    `https://api.tvmaze.com/shows/${showID}?embed=episodes`,
    {
      method: "GET",
    }
  );
  return new Promise((resolve, reject) => {
    fetch(req)
      .then((data) => {
        if (data.status === 200) {
          resolve(data.json());
        } else {
          reject(data);
        }
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

function getShowCount() {
  const req = new Request(`https://api.tvmaze.com/updates/shows`, {
    method: "GET",
  });
  return new Promise((resolve, reject) => {
    fetch(req)
      .then((data) => {
        if (data.status === 200) {
          resolve(data.json());
        } else {
          reject(data);
        }
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

function findShow(showName) {
  const req = new Request(
    `https://api.tvmaze.com/singlesearch/shows?q=${showName}&embed=episodes`,
    {
      method: "GET",
    }
  );
  return new Promise((resolve, reject) => {
    fetch(req)
      .then((data) => {
        if (data.status === 200) {
          resolve(data.json());
        } else {
          reject(data);
        }
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

// 47892 crash
function ShowProvider({ children }) {
  const [show, setShow] = useState();
  const [showID, setShowID] = useState();
  const [blockList, setBlockList] = useState(new Set());
  const [showCount, setShowCount] = useState();
  useEffect(() => {
    let num;
    // Sometimes a show is no longer available such as ID 121, so ensure a valid page is always displayed.
    while (true) {
      getShowCount().then((count) => {
        setShowCount(Object.keys(count).length);
      });
      num = getRandomInt(1, showCount);
      if (!blockList.has(num)) {
        break;
      }
    }
    setShowID(num);
  }, [blockList, showCount]);
  useEffect(() => {
    if (showID) {
      getShow(showID)
        .then((data) => {
          setShow(formatShow(data));
        })
        .catch((reason) => {
          setBlockList((blockList) => {
            const ret = new Set(blockList);
            // We add invalid IDs to the blocklist so we don't attempt to use them again.
            ret.add(showID);
            return ret;
          });
        });
    }
  }, [showID]);

  function searchShow(showName) {
    return findShow(showName).then((json) => {
      setShow(formatShow(json));
    });
  }

  function replaceEpisode(showName, seasonIndex, episodeNumber) {
    const seasonNumber = show.seasons[seasonIndex].info.number;
    return findShow(showName).then((json) => {
      const tempShow = json;
      const newEpisode = formatEpisode(
        tempShow._embedded.episodes.find(
          (ep) => ep.season === seasonNumber && ep.number === episodeNumber
        )
      );

      setShow((show) => {
        const seasons = show.seasons.map((season, index) => {
          if (season.info.number === seasonNumber) {
            // Replace the episodes
            const episodes = season.episodes.map((ep) => {
              if (ep.number === episodeNumber) {
                return newEpisode;
              }
              return ep;
            });
            return { ...season, episodes: episodes };
          }
          return season;
        });

        return { ...show, seasons: seasons };
      });
    });
  }

  return (
    <showContext.Provider value={show}>
      <showSearchContext.Provider value={searchShow}>
        <episodeReplaceContext.Provider value={replaceEpisode}>
          {children}
        </episodeReplaceContext.Provider>
      </showSearchContext.Provider>
    </showContext.Provider>
  );
}
export { useShowSearch, useEpisodeReplace, useShow, ShowProvider };
