var apiURL = 'http://localhost:4741';

Item = Backbone.Model.extend({
    defaults: {
        id: null,
        name: '',
        headline: '',
        description: '',
        category: '',
        creator: '',
        img: ''
    }
});
Items = Backbone.Collection.extend({
    url: apiURL + '/items'
});

module.exports = {
    Item,
    Items
};
