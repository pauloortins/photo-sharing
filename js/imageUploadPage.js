var ImageUploadPage = function() {
    
    var page = this;

    // Gallery Section
    page.gallery = new function() {
        var self = this;

        self.photos = ko.observableArray([]);
        window.Media.getSocialSharePhotos(function(data) {                
            self.photos(data.data.map(function(fbImage) {            
                var image = new Image(fbImage.id, fbImage.images[0].source);
                return image;
            }));        
        }); 

        self.addNewPhoto = function() 
        {
            page.form.selectImage(new Image());
        };
    }; 
    
    // Form Section
    page.form = new function() {

        var self = this;
        
        self.isBusy = ko.observable(false);

        self.imageFile = ko.observable();
        self.imageUrl = ko.observable();
        self.imageId = ko.observable();

        self.commentText = ko.observable();
        self.comments = ko.observableArray();

        self.fileChange = function(file) 
        {
            self.isBusy(true);
            window.Media.uploadPreview(file, function(data) {
                self.imageUrl(data.data.img_url);
                self.isBusy(false);
            }); 
        };

        self.sendClick = function() {
            self.isBusy(true);
            window.Media.sendPhotoToFacebook(
                self.imageUrl(), 
                function(response) 
                {
                    self.imageId(response.id);
                    page.photos.push(new Image(self.imageId(), self.imageUrl()));
                    self.isBusy(false);
                }
            );
        };

        self.sendComment = function() {
            self.isBusy(true);
            window.Media.sendCommentToFacebook(
                self.imageId(), 
                self.commentText(),
                function(response)             
                {
                    self.commentsPanel.addComment(self.commentText());
                    self.commentText('');
                    self.isBusy(false);
                }
            ); 
        };

        self.selectImage = function(image) {
            self.imageFile(null);
            self.imageId(image.imageId());
            self.imageUrl(image.imageUrl());
        }; 

        self.imageId.subscribe(function(id) {
            page.commentsPanel.loadComments(id);
        });

        self.selectImage(new Image());
    };

    // Comments Section
    page.commentsPanel = new function() {
        var self = this;

        self.comments = ko.observableArray();

        self.loadComments = function (imageId) {
            if (imageId == undefined) 
            {
                self.comments([]);
            }
            else
            {
                window.Media.getPhotoComments(imageId, function(data) {
                    self.comments(data.data);
                });
            }
        };

        self.addComment = function (comment) 
        {
            self.comments.push({message: comment});
        };
    };
};

var Image = function(id, url)
{
    this.imageUrl = ko.observable(url == undefined ? "img/no_photo.png" : url);
    this.imageId = ko.observable(id);
};
