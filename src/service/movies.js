const API_KEY = "990290eb";

export const searchMovies = async ({search}) => {
	if (search === "") return null;

	try {
		const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`);
		const json = await response.json();

		const movies = json.Search;

		//Se recomienda obtener los datos de la api desde el comienzo ya que en un futuro si decidimos modificar dicha api, tendriamos que cambiar cada dato en cada lugar donde se utilizo nuestra api original
		return movies?.map((movie) => ({
			id: movie.imdbID,
			title: movie.Title,
			year: movie.Year,
			poster: movie.Poster,
		}));
	} catch (e) {
		throw new Error("Error searching movies");
	}
};
