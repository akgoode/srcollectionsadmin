
var FIELDS = ['name', 'headline', 'description', 'category', 'creator', 'img'];
var apiURL = 'http://localhost:4741';

var api = {
    getItems: function() {
        console.log('in get items');
        return $.ajax({
            method: 'GET',
            url: apiURL + '/items'
        });
    },
    createItem: function(item) {
        return $.ajax({
            method: 'POST',
            url: apiURL + '/items'
        });
    },
    updateItem: function(id, data) {
        return $.ajax({
            method: 'PATCH',
            url: apiURL + '/items/' + id,
            data: data
        });
    },
    deleteItem: function(id) {
        return $.ajax({
            method: 'DELETE',
            url: apiURL + '/items/' + id
        });
    }
};

// Backbone Model
var Item = Backbone.Model.extend({
    defaults: {
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

});

// var item1 = new Item({
//     name: "Chair",
//     headline: "Comfy Chair",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     category: "furniture",
//     creator: "Kenzie",
//     img: "http://images.pier1.com/dis/dw/image/v2/AAID_PRD/on/demandware.static/-/Sites-pier1_master/default/dw1bc5c67e/images/2281861/2281861_1.jpg?sw=1600&sh=1600"
// });

// var item2 = new Item({
//     name: "Necklace",
//     headline: "Beautiful Silver Necklace",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     category: "jewelry",
//     creator: "Betsy Rosen",
//     img: "http://www.brighton.com/photos/product/giant/369560S158060/-/size-os.jpg"
//   });

var items = new Items();

var ItemView = Backbone.View.extend({
    model: new Item(),
    tagName: 'tr',
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
        $('.edit-item').hide();
        $('.delete-item').hide();
        $('.save-item').show();
        $('.cancel').show();

        var tempItem = {};
        var self = this;
        _.each(FIELDS, function(field) {
            tempItem[field] = self.$('.item-' + field).html();
            self.$('.' + field).html('<input type=text class="form-control ' + field + '-update" value="' + self.model.get(field) + '">');
        });
        
    },
    save: function() {
        var self = this;
        _.each(FIELDS, function(field) {
            self.model.set(field, self.$('.' + field + '-update').val());
        });
    },
    cancel: function() {
        this.render();
    },
    delete: function() {
        this.model.destroy();
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
            setTimeout(function() {
                self.render();
            }, 30);
        }, this);
        this.model.on('remove', this.render, this);
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
    });
    console.log(api.getItems);
    api.getItems().then(
        function(data) {
            console.log(data);
        },
        function(error) {
            console.error(error);
        }
    );
});