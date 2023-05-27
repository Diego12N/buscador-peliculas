import "./App.css";
import {useMovies} from "./hooks/useMovies";
import {Movies} from "./components/movies";
import {useCallback, useEffect, useRef, useState} from "react";
import debounce from "just-debounce-it";

function useSearch() {
	const [search, updateSearch] = useState("");
	const [error, setError] = useState(null);
	const isFirstInput = useRef(true);

	useEffect(() => {
		//Verificamos que el usario aun no haya utilizado el input
		if (isFirstInput.current) {
			isFirstInput.current = search === ""; // utilizando el useRef en lugar de useState, evitamos que se renderice nuevamente al cambiar el search
			return;
		}

		if (search === "") {
			setError("No se puede buscar una pelicula vacia");
			return;
		}

		if (search.match(/^\d+$/)) {
			setError("No se puede buscar una pelicula con un numero");
			return;
		}

		if (search.length < 3) {
			setError("La busqueda debe tener al menos 3 caracteres");
			return;
		}

		setError(null);
	}, [search]);

	return {search, updateSearch, error};
}

function App() {
	const [sort, setSort] = useState(false);
	const {search, updateSearch, error} = useSearch();
	const {movies, getMovies, loading} = useMovies({search, sort});

	const debouncedGetMovies = useCallback(
		debounce((search) => {
			console.log("search", search);
			getMovies({search});
		}, 300),
		[getMovies]
	);

	// function debounceLocal (callback, timeToWait = 300) {
	// 	let timerId;

	// 	return (...args) => {
	// 		clearTimeout(timerId);
	// 		timerId = setTimeout(() => {
	// 			// Cuando le asignas el setTimeOut a una variable esta obtiene como valor el ID de dicho setTimeOut
	// 			callback(...args);
	// 		}, timeToWait);
	// 	};
	// };

	// Utilizo la instancia FormData en vez de useRef, ya que si tengo mas de 1 input, deberia declarar un useRef por cada uno.
	const handleSubmit = (e) => {
		e.preventDefault();

		// const fields = new window.FormData(e.target); // Crea una nueva instancia de objeto a partir del evento recibido de nuestro formulario.
		//const {query} = Object.fromEntries(new window.FormData(e.target));

		getMovies({search});
	};

	const handleChange = (e) => {
		const newSearch = e.target.value;
		updateSearch(newSearch); // Se utiliza este metodo ya que el estado al ser asincrono, podria tardar en actualizarce por lo que para tener el estado actual se pasa como constante para ser seteado.
		//setQuery(e.target.value);
		//Me permite realizar la buqueda mientras escribo - Con debounced evito que mientras escribo se guarde alguna busqueda anterior a el valor final que escribio el usuario-
		debouncedGetMovies(newSearch);
	};

	const handleSort = () => {
		setSort(!sort);
	};

	return (
		<>
			<div className="page">
				<header>
					<h1>Buscador de peliculas</h1>
					<form className="form" onSubmit={handleSubmit}>
						<input onInput={handleChange} name="query" value={search} placeholder="Avengers, Star Wars, The Matrix..." />
						<input type="checkbox" onChange={handleSort} checked={sort} />
						<button type="submit">Buscar</button>
					</form>
					{error && <p style={{color: "red"}}>{error}</p>}
				</header>
				<main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
			</div>
		</>
	);
}

export default App;
