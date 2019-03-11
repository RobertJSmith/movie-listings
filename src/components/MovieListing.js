import React, { Component } from 'react';

class MovieListing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            imagePath: props.imgPath,
            title: props.title,
            popularityRating: props.rating,
            genresDisplay: props.genresDisplay
        }
    }

    render() {
        //I've left in the poplarityRating property here so that we can see the filtering is working correctly
        return (
            <div className="movie-listing-card">
                <img src={this.state.imagePath} alt={this.state.title}></img>
                <div className="movie-listing-card-info"> 
                    <h1 className="movie-listing-card-title">{this.state.title}</h1>
                    <p className="movie-listing-card-rating">Rating: {this.state.popularityRating}</p>
                    <p className="movie-listing-card-genres">{this.state.genresDisplay.toString()}</p>
                </div>
            </div>
        );
    }
}

export default MovieListing;