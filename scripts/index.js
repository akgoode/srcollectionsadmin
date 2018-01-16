var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var ItemModel = require('./Item/item-models.js');
var ItemView = require('./Item/item-views.js');

var constants = require('./constants.JSON');

var itemsView = new ItemView.ItemsView();

$(document).ready(function() {
    var items = new ItemModel.Items();

    $('.add-item').on('click', function(e) {
        e.preventDefault();
        var itemPlaceholder = {};
        _.each(constants.FIELDS, function(field) {
            itemPlaceholder[field] = $('.item-' + field).val();
            $('.item-' + field).val('');
        });
        var item = new ItemModel.Item(itemPlaceholder);
        items.add(item);
        item.save(null, {
            success: function(response) {
                console.log('succesfully created item ' + response.toJSON().id);
            },
            error: function() {
                console.log('failed to save');
            }
        });
    });
});