// Backbone Model

var Item = Backbone.Model.extend({
    defaults: {
        name: '',
        headline: '',
        description: '',
        category: '',
        creator: '',
        image: ''
    }
});

// backbone collection

var Items = Backbone.Collection.extend({

});

var items = new Items([new Item(), new Item()]);

var ItemView = Backbone.View.extend({
    model: new Item(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('.items-list-template').html());
    },
    render: function() {
        this.$el.html(this.template({model: this.model.toJSON()}));
    }
});

var ItemsView = Backbone.View.extend({
    model: items,
    el: $('.items-list'),
    initialize: function() {
        this.model.on('add', this.render, this);
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(item) {
            self.$el.append((new BlogView({model: item})).render().$el);
        });
    }
});