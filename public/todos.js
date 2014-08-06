// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// Firebase adapter to persist Backbone models.

// Load the application once the DOM is ready, using `jQuery.ready`:
var GraffAnswers;

$(function(){

  // GraffAnswer Model
  // ----------

  // Our basic **GraffAnswer** model has `title`, `order`, and `done` attributes.
  var GraffAnswer = Backbone.Model.extend({

    // Default attributes for the GraffAnswer item.
    defaults: function() {
      return {
        title: "empty GraffAnswer...",
        done: false
      };
    },

    // Ensure that each GraffAnswer created has `title`.
    initialize: function() {
      if (!this.get("title")) {
        this.set({"title": this.defaults().title});
      }
    },

    // Toggle the `done` state of this GraffAnswer item.
    toggle: function() {
      this.set({done: !this.get("done")});
    }

  });

  // GraffAnswer Collection
  // ---------------

  // The collection of GraffAnswers is backed by *Firebase*.
  var GraffAnswerList = Backbone.Firebase.Collection.extend({

    // Reference to this collection's model.
    model: GraffAnswer,

    // Save all of the GraffAnswer items in a Firebase.
    firebase: new Firebase("https://backbone.firebaseio.com"),

    // Filter down the list of all GraffAnswer items that are finished.
    done: function() {
      return this.filter(function(GraffAnswer){ return GraffAnswer.get('done'); });
    },

    // Filter down the list to only GraffAnswer items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    }
  });

  // Create our global collection of **GraffAnswers**.
  GraffAnswers = new GraffAnswerList;

  // GraffAnswer Item View
  // --------------

  // The DOM element for a GraffAnswer item...
  var GraffAnswerView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The GraffAnswerView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **GraffAnswer** and a **GraffAnswerView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'remove', this.remove);
    },

    // Re-render the titles of the GraffAnswer item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the GraffAnswer.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.set({title: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item from the collection.
    clear: function() {
      GraffAnswers.remove(this.model);
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#GraffAnswerapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-answer":  "createOnEnter"
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `GraffAnswers`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting GraffAnswers that might be saved in *Firebase*.
    initialize: function() {
      this.input = this.$("#new-answer");
      this.allCheckbox = this.$("#toggle-all")[0];

      // this.listenTo(GraffAnswers, 'add', this.addOne);
      this.listenTo(GraffAnswers, 'add', this.submitAnswer);
      this.listenTo(GraffAnswers, 'reset', this.addAll)
      this.listenTo(GraffAnswers, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = GraffAnswers.done().length;
      var remaining = GraffAnswers.remaining().length;

      if (GraffAnswers.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single GraffAnswer item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    submitAnswer: function(graffAnswer) {
      var image = $('#artPhoto img').attr('src');

      // var checkedAnswer = new GraffAnswerView({model: graffAnswer});
      // var view = new GraffAnswerView({model: GraffAnswer});
      // this.$("#GraffAnswer-list").append(view.render().el);
    },
    // // Add a single GraffAnswer item to the list by creating a view for it, and
    // // appending its element to the `<ul>`.
    // addOne: function(GraffAnswer) {
    //   var view = new GraffAnswerView({model: GraffAnswer});
    //   this.$("#GraffAnswer-list").append(view.render().el);
    // },

    // Add all items in the **GraffAnswers** collection at once.
    addAll: function() {
      this.$("#GraffAnswer-list").html("");
      GraffAnswers.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **GraffAnswer** model,
    // persisting it to *Firebase*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      GraffAnswers.add({title: this.input.val()});
      this.input.val('');
    },

    // Clear all done GraffAnswer items.
    clearCompleted: function() {
      GraffAnswers.done().forEach(function(model) {
        GraffAnswers.remove(model);
      });
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      GraffAnswers.each(function (GraffAnswer) { GraffAnswer.set({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
