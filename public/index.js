
var FIELDS = ['name', 'headline', 'description', 'category', 'creator', 'img'];
var apiURL = 'http://localhost:4741';

// Backbone Model
var Item = Backbone.Model.extend({
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

// backbone collection

var Items = Backbone.Collection.extend({
    url: apiURL + '/items'
});

var items = new Items();

var ItemView = Backbone.View.extend({
    model: new Item(),
    tagName: 'tr',
    className: 'item-pill',
    style: 'height: 50px',
    initialize: function() {
        this.template = _.template($('.items-list-template').html());
    },
    events: {
        'click .edit-item': 'edit',
        'click .save-item': 'save',
        'click .cancel': 'cancel',
        'click .delete-item': 'delete'
    },
    edit: function() {
        this.$('.edit-item').hide();
        this.$('.delete-item').hide();
        this.$('.save-item').show();
        this.$('.cancel').show();

        var self = this;
        _.each(FIELDS, function(field) {
            self.$('.' + field).html('<input type=text class="form-control ' + field + '-update" value="' + self.model.get(field) + '">');
        });
        
    },
    save: function() {
        var self = this;
        _.each(FIELDS, function(field) {
            self.model.set(field, self.$('.' + field + '-update').val());
        });
        this.model.save(null, {
            success: function(response) {
                console.log('succesfully updated item ' + response.toJSON().id);
            },
            error: function() {
                console.log('failed to save');
            }
        });
    },
    cancel: function() {
        this.render();
    },
    delete: function() {
        this.model.destroy({
            success: function(response) {
                console.log('successfully deleted item ' + response.toJSON().id);
            },
            error: function() {
                console.log('failed to delete blog');
            }
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var ItemsView = Backbone.View.extend({
    model: items,
    el: $('.items-list'),
    initialize: function() {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function() {
            self.render();
        }, this);
        this.model.on('remove', this.render, this);

        this.model.fetch({
            success: function(response) {
                console.log('got all items');
            },
            error: function() {
                console.log('failed to get items');
            }
        });
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(item) {
            self.$el.append((new ItemView({model: item})).render().$el);
        });
        return this;
    }
});

var itemsView = new ItemsView();

$(document).ready(function() {
    $('.add-item').on('click', function(e) {
        e.preventDefault();
        var itemPlaceholder = {};
        _.each(FIELDS, function(field) {
            itemPlaceholder[field] = $('.item-' + field).val();
            $('.item-' + field).val('');
        });
        var item = new Item(itemPlaceholder);
        items.add(item);
        item.save(null, {
            success: function(response) {
                console.log('succesfully created item ' + response.toJSON().id);
            },
            error: function() {
                console.log('failed to save');
            }
        })
    });
});