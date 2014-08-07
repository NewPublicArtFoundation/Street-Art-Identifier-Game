
"use strict";


(function($){

  var submitBase = new Firebase('https://publicartfound.firebaseio.com/submissions');
  var _ = window._;
  var Backbone = window.Backbone;

  var GraffAnswer = function(){
    this.initialize();
  }

  GraffAnswer.prototype.initialize = function(){
    console.log('Running');
    this.events();
    this.stored = [];
    this.loadImage();
    this.currentScore();
  }

  GraffAnswer.prototype.events = function(){
    var self = this;
    $('#new-answer').on('keypress', function(e){ self.detectKey(e); });
  }

  GraffAnswer.prototype.detectKey = function(e){
    console.log(e);
    this.input = $('#new-answer').val();
    this.imageUrl = this.getCurrentImage();
    if(e.keyCode == 13){
      this.saveKeyValue(this.input, this.imageUrl);
    }
  }

  GraffAnswer.prototype.currentScore = function(){
    this.submission = this.stored.length;
    sb.triggerAction(this.submission);
  }


  GraffAnswer.prototype.loadImage = function(){
    // Do query for image
    $.get( "get_graffiti", function( data ) {
      var image = data.data;
      image = image.replace(/['"]+/g, '');
      console.log(image);
      $('#artPhoto').html('<img style="max-width: 100%">');
      $('#artPhoto img').attr('src', image);
    });
  }

  GraffAnswer.prototype.getCurrentImage = function(){
    var imageUrl = $('#artPhoto img').attr('src');
    return imageUrl;
  }

  GraffAnswer.prototype.saveKeyValue = function(input, url){
    var self = this;
    var keyValue = {
      image: url,
      answer: input
    };

    submitBase.push(keyValue);

    this.stored.push(keyValue);
    this.clearInput();
    this.renderStored();
    this.loadImage();
    sb.triggerAction(self.stored.length);
  }

  GraffAnswer.prototype.renderStored = function(){
    var self = this;
    $('#todoapp-post').html('<div id="feedback"></div>');

    for(var i = 0; i < self.stored.length; i++ ){
      var content = '<div class="answer-row"><img class="answer-image" src="' + self.stored[i].image + '"><p>' + self.stored[i].answer + '</p></div>';
      $('#todoapp-post #feedback').append(content);
    }
  }

  GraffAnswer.prototype.clearInput = function(){
    $('#new-answer').val('');
  }

  // GraffAnswer.prototype.initialize = function(){}

  window.graffApp = new GraffAnswer();
})(jQuery);
