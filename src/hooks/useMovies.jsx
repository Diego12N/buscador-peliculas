import {useMemo, useRef, useState, useCallback} from "react";
import {searchMovies} from "../service/movies";

export function useMovies({search, sort}) {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const previousSearch = useRef(search);

	const getMovies = useCallback(async ({search}) => {
		if (search === previousSearch.current) return;
		try {
			setLoading(true);
			setError(null);
			previousSearch.current = search; // Con esta linea le asignamos el valor de la busqueda lo que permite que dicho dato percista evitando un nuevo renderizado.
			const newMovies = await searchMovies({search});
			setMovies(newMovies);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	//const sortedMovies = sort ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
	//localeCompare:  comparar dos cadenas de texto y retorna 0 si coinciden o -1 si no

	//Con esta funcion evitamos que se realice el calculo para ordenar cada vez que nuestro search cambie.
	// const sortedMovies = useMemo(() => {
	// 	console.log("memoSortedMovies");
	// 	if (!movies) return;
	// 	return sort ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
	// }, [sort, movies]);

	const sortedMovies = useMemo(() => {
		return sort ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
	}, [sort, movies]);

	return {movies: sortedMovies, getMovies, loading};
}
