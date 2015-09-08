var router = require('./App');
var Rating = require('react-rating');


var Restaurant = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {dishes: 'Loading...'};
  },
  componentDidMount: function() {
    var self = this;
    $.ajax({
      method: 'GET',
      url: '/resInfo',
      data: {resId: this.props.query.resId},
      success: function(data) {
        var dishes = self.handleDishes(data);
        self.setState({dishes: dishes});
      },
      error: function(err) {
        console.log(err);
      }
    });
    
    localStorage.setItem('currentRoute', '/parameters');
    FB.getLoginStatus(function(response){
      if (response.status !== 'connected') {
        self.context.router.transitionTo('/login');
      }
    });

  },
  handleRestaurant: function(data) {
    var restaurant = data[0].Restaurant;
    var phoneLink = restaurant.phone.match(/\d+/g).join('');
    return(
      <div>
        <h1>{restaurant.name}</h1>
        <p><a target='_blank' href={'http://maps.google.com/?q=' + restaurant.location}>{restaurant.location}</a></p>
        <p><a href={'tel://'+ phoneLink}>{restaurant.phone}</a></p>
        <Rating initialRate={restaurant.rating} readonly="true" full="glyphicon glyphicon-star star orange" empty="glyphicon glyphicon-star-empty star"/>
      </div>
    );
  },
  handleDishes: function(data) {
    var dishes = [];
    dishes.push(this.handleRestaurant(data))
    data.forEach(function(dish) {
      dishes.push(
       <div className="card">
         <div><strong>{dish.name}</strong></div>
         <p><small><em>{dish.category}</em></small></p>
         <img className="img-thumbnail" src={dish.img_url}/>
         <div className="stars">
         <p>{dish.num_ratings} Reviews</p>
          <Rating initialRate={dish.rating} readonly="true" full="glyphicon glyphicon-star star orange" empty="glyphicon glyphicon-star-empty star"/>
         </div>
       </div>
       );
    });
    return dishes;
  },
  render: function() {
    return (
      <div className="container">
        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
          {this.state.dishes}
        </div>
      </div>);
  }
});

module.exports = Restaurant;