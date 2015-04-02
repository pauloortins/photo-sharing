(function(window) {
  'use strict';
 
  function Media() {
  }

  Media.prototype.uploadPreview = function(file, successFn) {
    var form = new FormData();
    form.append("upload", file);

    // send via XHR - look ma, no headers being set!
    $.ajax({
      url: 'http://uploads.im/api',
      data: form,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data) {
        if (successFn != undefined) 
        {    
            successFn(data);
        }
      }
    }); 
  }

  Media.prototype.sendPhotoToFacebook = function(url, successFn) 
  {
      this.getSocialShareAlbum(function(id) {
          FB.api('/' + id + '/photos', 'post', 
          {
              url: url
          }, 
          successFn);
      });       
  };

  Media.prototype.getSocialShareAlbum = function(successFn) 
  {
      FB.api('/me/albums', 'get', {}, function(data) 
      {
        var socialShareAlbum = data.data.filter(function(x) {return x.name == "SocialShare";}); 

        if (socialShareAlbum.length > 0) 
        {
            successFn(socialShareAlbum[0].id);            
        }
        else 
        {
            FB.api('/me/albums', 'post', {name: "SocialShare"}, function(data) {
                successFn(data.id);
            }); 
        }
      });
  };

  Media.prototype.sendCommentToFacebook = function(imageId, comment, successFn)
  {
      FB.api('/' + imageId + '/comments', 'post', 
      {
         message: comment
      }, 
      successFn); 
  };

  Media.prototype.getPhotoComments = function(imageId, successFn) {
      FB.api('/' + imageId + '/comments', 'get', 
      {}, 
      successFn);  
  };

  Media.prototype.getSocialSharePhotos = function (successFn) 
  {
      this.getSocialShareAlbum(function(id) {
          FB.api('/' + id + '/photos', 'get', 
          {}, 
          successFn);
      });    
  };

  window.Media = new Media;

})(window);
