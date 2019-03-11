import React, { Component } from 'react';
import MovieListing from './MovieListing';

class MovieList extends Component {
    state = {
        movieListings: '',
        genreList: '',
        genreFilter: [],
        ratingFilter: 3,
        imageUrlPath: '',
        imageSizes: '',
    };

    loadAPI = async(url) => {
        //REACT_APP_API_KEY is declared in .env so the key is not exposed
        const apiKey = process.env.REACT_APP_API_KEY;
        const promise = await fetch(url + apiKey);
        const data = await promise.json();
        return data;
    }

    componentDidMount() {
        const movieApiUrl = "https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=";
        const genreApiUrl = "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=";
        const imageApiUrl = "https://api.themoviedb.org/3/configuration?api_key=";

        //async calls to the TMDb API, ideally we should wait until all the calls have been completed so that we can do a single setState function call, preventing additional render calls
        this.loadAPI(movieApiUrl)
        .then((movieResult) => 
        {   
            //An inline sort of the movie results so that they are ordered by the movie popularity value
            movieResult.results.sort((a,b) => (a.popularity < b.popularity) ? 1 : ((b.popularity < a.popularity) ? -1 : 0));
            this.setState({ movieListings: movieResult.results});
        })
        .catch(movieError => console.log(movieError));

        this.loadAPI(genreApiUrl)
        .then((genreResult) => {
            this.setState({ genreList: genreResult.genres});
        })
        .catch(genreError => console.log(genreError));

        this.loadAPI(imageApiUrl)
        .then((imageResult) => {this.setState({ imageUrlPath: imageResult.images.secure_base_url, imageSizes: imageResult.images.backdrop_sizes});})
        .catch(imageError => console.log(imageError));
    };

    updateRatingFilter(event) {
        this.setState({ratingFilter: event.target.value});
    }

    updateGenreFilter(event) {
        //We're rebuilding our genreFilter here but could just update the state value with the new checkbox value or remove the value if it already exists in the genreFilter
        var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
        var newFilters = [];

        for (var i = 0; i < checkedBoxes.length; i++) {
            newFilters.push(parseInt(checkedBoxes[i].value, 10));
        }

        this.setState({genreFilter: newFilters});
    }

    render() {
        //I considered moving the filters into seperate components but in this case I've left it here as it's simpler to capture and react to the filters changing
        return (
            <div>
                <div className="genre-filters">
                    {this.state.genreList !== '' && this.state.genreList.map((genre) => {
                        let inputid = 'input-' + genre.id;
                        let labelid = 'label-' + genre.id;
                        return (
                            <label key={labelid}>
                                <input type="checkbox" key={inputid} name={genre.name} value={genre.id} onChange={this.updateGenreFilter.bind(this)}/>
                                {genre.name}
                            </label>)
                    })}
                </div>
                <div>
                    <label>Minimum Rating</label>
                    <input type="number" name="ratingFilter"
                    min="0" max="10" step="0.5" defaultValue="3" onChange={this.updateRatingFilter.bind(this)}></input>
                </div>
                <div className="movie-listings-container">
                    {
                        //Making sure that the state values we need for movie-listings rendering and filters are loaded. This logic is a bit complex for the render function, so if possible it should be slimmed down
                        //a better solution would be to move this into the filter logic and keep a seprate property that contains the movies that should render.
                        this.state.movieListings !== '' && this.state.genreList !== '' && this.state.imageUrlPath !== '' && this.state.imageSizes !== '' && this.state.movieListings.map((movie)=> {
                            if (movie.vote_average >= this.state.ratingFilter && (this.state.genreFilter.length === 0 || this.state.genreFilter.every(val => movie.genre_ids.includes(val)))) {
                                var genresDisplay = [];
                                
                                //imgPath consists of 3 component parts, the base_url, file_size (in this case I've used the first image size returned from the configuration API but this could be made configurable) and a file_path
                                var imgPath = this.state.imageUrlPath + this.state.imageSizes[0] + movie.poster_path;

                                for (var i = 0; i < movie.genre_ids.length; i++) {
                                    let genreID = movie.genre_ids[i];
                                    let genre = this.state.genreList.find(a => a.id === genreID);
                                    genresDisplay.push(genre.name);
                                }

                                var props = {
                                    id: movie.id,
                                    title: movie.title,
                                    rating: movie.vote_average,
                                    imgPath,
                                    genresDisplay
                                };

                                return <MovieListing key={movie.id} {...props}/>
                            } else {
                                return (null);
                            }
                        }, this)
                    }
                </div>
            </div>
        );
    };
}

export default MovieList;