import responseveMovies from "../mocks/with-resoults.json";

export function ListOfMovies({movies}) {
	//l signo de interrogación se coloca después de movies, lo que significa que si movies es nulo o indefinido, la expresión devolverá undefined en lugar de lanzar un error.
	return (
		<ul className="movies">
			{movies?.map((movie) => {
				return (
					<li className="movie" key={movie.id}>
						<h3>{movie.title}</h3>
						<p>{movie.year}</p>
						<img src={movie.poster} alt={movie.title} />
					</li>
				);
			})}
		</ul>
	);
}

export function NoMoviesResoults() {
	return (
		<>
			<p>No se encontraron resultados</p>
		</>
	);
}

export function Movies({movies}) {
	const hasMovies = movies?.length > 0;

	return hasMovies ? <ListOfMovies movies={movies} /> : <NoMoviesResoults />;
}
