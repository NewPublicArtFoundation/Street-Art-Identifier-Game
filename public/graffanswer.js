
"use strict";


(function($){
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

  GraffAnswer.prototype.getCurrentImage = function(){
    // Do query for image
    // $('#artPhoto').html('<img src="">')''
  }

  GraffAnswer.prototype.getCurrentImage = function(){
    var imageUrl = $('#artPhoto img').attr('src');
    return imageUrl;
  }

  GraffAnswer.prototype.saveKeyValue = function(input, url){
    var keyValue = {
      image: url,
      answer: input
    };
    this.stored.push(keyValue);
    this.clearInput();
  }

  GraffAnswer.prototype.clearInput = function(){
    $('#new-answer').val('');
  }

  // GraffAnswer.prototype.initialize = function(){}

  window.graffApp = new GraffAnswer();
})(jQuery);
