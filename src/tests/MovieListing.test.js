import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MovieListing from '../components/MovieListing';

configure({ adapter: new Adapter() });

test('should render MovieListing with test data', () => {
    /*This test is to make sure that we get the expected html output given the input we've defined.
    modifying the MovieListing render function return statement should then fail this test (as the rendered HTML would no longer
    match the snapshot stored (at least until we give the go ahead to override the snapshot)*/

    const props = {
        id: 299537,
        title: "Captain Marvel",
        rating: 7.3,
        imgPath: "https://image.tmdb.org/t/p/w300/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
        genresDisplay: ["Action", "Adventure", "Science Fiction"]
    };
    
    const wrapper = shallow(<MovieListing {...props}/>);
    expect(wrapper).toMatchSnapshot();
});