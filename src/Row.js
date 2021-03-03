import axios from './axios';
import React, { useEffect, useState } from 'react';
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row({ title, fetchUrl, isLargeRow = false }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    const base_url = "https://image.tmdb.org/t/p/original/";

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData();
    }, [fetchUrl])

    const opts = {                          //Youtube video play parameters
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = async (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        }
        else {
            movieTrailer(movie?.name || "")
            // .then(url => {
            //     //https://www.youtube.com/watch?v=XtMThy8QKqU&t=10371s
            //     const urlParams = new URLSearchParams(new URL(url).search);
            //     setTrailerUrl(urlParams.get("v"));             //gives the url after v i.e, XtMThy...
            // })
            // .catch(error => console.log(error))
            let trailerurl = await axios.get(
                `/movie/${movie.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
            );
            setTrailerUrl(trailerurl.data.results[0]?.key);
        }
    };

    console.log(movies);
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {movies.map(movie =>
                    ((isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
                        <img className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
                    ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

        </div>
    )
}

export default Row;
