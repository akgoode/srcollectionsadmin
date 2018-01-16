var ItemModel = require('./item-models.js');
var $ = require('jquery');
var _ = require('underscore');
var constants = require('../constants.JSON');

var ItemView = Backbone.View.extend({
    model: new ItemModel.Item(),
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
        _.each(constants.FIELDS, function(field) {
            self.$('.' + field).html('<input type=text class="form-control ' + field + '-update" value="' + self.model.get(field) + '">');
        });
        
    },
    save: function() {
        var self = this;
        _.each(constants.FIELDS, function(field) {
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
    model: new ItemModel.Items(),
    el: $('.items-list'),
    initialize: function() {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function() {
            self.render();
        }, this);
        this.model.on('remove', this.render, this);
        this.model.on('sync', this.render, this);

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

module.exports = {
    ItemView,
    ItemsView
};

