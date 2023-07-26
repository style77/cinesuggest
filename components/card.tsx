import React from 'react';
import { BiCameraMovie } from 'react-icons/bi';
import Input from './input';


type MovieType = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};


const Card: React.FC = () => {
    const [search, setSearch] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [movie, setMovie] = React.useState<MovieType | null>(null)
    const [movies, setMovies] = React.useState<MovieType[]>([])

    React.useEffect(() => {
        const getMovies = async () => {
            setLoading(true)
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${process.env.PLASMO_PUBLIC_TMDB_API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`
            )
            const data = await response.json()
            setMovies(data.results)
            setLoading(false)
        }
        getMovies()
    }, [search])

    React.useEffect(() => {
        if (movie) {
            const getMovie = async () => {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${process.env.PLASMO_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
                )
                const data = await response.json()
                setMovies(data.results)
            }
            getMovie()
        }
    }, [movie])


    return (
        <div className="card">
            <div className="content">
                <div className="back">
                    <div className="back-content">
                        <strong>CineSuggest</strong>
                        <BiCameraMovie size="58" />

                        <div className="mt-4">
                            <strong>Search for a movie and click on it to get a suggestion</strong>
                            <div className="flex flex-col w-full text-xs mt-2">
                                <span className="text-gray-400/50">
                                    This app uses the TMDB API to get the movies
                                </span>
                                <span className="text-gray-400/50">
                                    Made by: Joachim Hodana (codenerds.tech)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="front">
                    <div className="flex justify-center mt-8">
                        <Input search={search} setSearch={setSearch} />
                    </div>
                    <div className="h-96 overflow-y-auto">
                        {movie && (
                            <div className="ml-4 mt-2">
                                <span className="text-gray-400/50">
                                    You have chosen: {movie.title}<br />
                                </span>
                                <span className="text-gray-400/50">Here are some recommendations:</span>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4 mt-4 px-4">
                            {search && movies && movies.length > 0 ? movies.map((movie) => (
                                <div
                                    className="flex flex-col items-center p-2 border border-gray-300 rounded-lg cursor-pointer"
                                    key={movie.id}
                                    onClick={() => setMovie(movie)}
                                >
                                    <img
                                        className="w-16 h-24 rounded-lg mb-2"
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <div className="text-center">
                                        <h3 className="text-xs font-semibold">{movie.title}</h3>
                                        <span className="text-gray-600 text-xs">Vote: {movie.vote_average}</span>
                                    </div>
                                </div>
                            )) : !search ? (
                                <div className="flex justify-center items-center w-full h-full">
                                    <span className="text-gray-400/50"></span>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center w-full h-full">
                                    <span className="text-gray-400/50">No movies found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;