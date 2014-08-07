
"use strict";


(function($){

  // Load image
  // Enter selection
  // - Check answer
  // - Show in bottom
  // Load next

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

  GraffAnswer.prototype.parseImageUrl = function(image){
    // image = http:/www.blahblah.com/132123.jpg
    var urlArr = image.split('/'),
    // urlArr = ["http:", "www.blahblah.com", "132123.jpg"]
        urlLastSection = urlArr[urlArr.length-1],
        urlSegments = urlLastSection.split('.'),
        urlSegment  = urlSegments.join('');
    // urlSegments = 132123.jpg
    return urlSegment;
  }

  // LOADING
  GraffAnswer.prototype.loadImage = function(){
    var self = this,
        urlKey,
        image;
    // Do query for image
    $.get( "get_graffiti", function( data ) {
      image = data.data;
      image = image.replace(/['"]+/g, '');
      console.log(image);
      $('#artPhoto').html('<img style="max-width: 100%">');
      $('#artPhoto img').attr('src', image);

      // Note to self:
      // # These may run before the previous one is defined
      urlKey = self.parseImageUrl(image);
      this.currentAnswer = self.queryAnswer(urlKey);
    });
  }

  // LOADING
  GraffAnswer.prototype.queryAnswer = function(urlKey){
    // stored el
    /*
      childBase = {
        revok: 10,
        rawr: 1,
        blah: 5
      }
    */
    var childBase = submitBase.child(urlKey),
        indexEl = 0,
        correctAnswer,
        currentValue;
    this.currentImage = urlKey;
    console.log('currentImage ', this.currentImage);
    // Basic usage of .once() to read the data located at firebaseRef.
    childBase.once('value', function(dataSnapshot) {
      currentValue = dataSnapshot;
    });
    console.log('currentValue ',currentValue);
    console.log('urlKey ',urlKey);
    if(currentValue != undefined){

      _.map(currentValue, function(el, index){
        console.log("el ",el);
        console.log("index ",index);
        console.log("indexEl ",indexEl);
        console.log("-----");
        if(indexEl < el){
          indexEl = el;
          correctAnswer = index;
        }
      });
      console.log('Answer is: ',index);
    } else {
      correctAnswer = undefined;
    }
    return correctAnswer;
  }

  // LOADING
  GraffAnswer.prototype.getCurrentImage = function(){
    var imageUrl = $('#artPhoto img').attr('src');
    return imageUrl;
  }

  // SAVE
  GraffAnswer.prototype.saveKeyValue = function(input, url){
    var self = this;
    console.log(self.currentImage);
    var childBase = submitBase.child(self.currentImage);
    var currentValue;
    childBase.once('value', function(dataSnapshot) {
      currentValue = dataSnapshot;
    });
    // Return object
    if(currentValue == undefined){
      currentValue = {};
    }

    console.log(currentValue);
    // Increment answer by one
    if(currentValue[input] != undefined){
      currentValue[input] = currentValue[input] + 1;
    } else {
      currentValue[input] = 1;
    }

    this.saveToServer(self.currentImage, childBase);
    this.stored.push(keyValue);
    this.clearInput();
    this.renderStored();
    this.loadImage();
    sb.triggerAction(self.stored.length);
  }

  // SAVE
  GraffAnswer.prototype.saveToServer = function(currentImage, childBase){
    referenceBase.setWithPriority()
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
