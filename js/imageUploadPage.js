var ImageUploadPage = function() {
    
    var page = this;
    page.photos = ko.observableArray([]);
    window.Media.getSocialSharePhotos(function(data) {                
        page.photos(data.data.map(function(fbImage) {            
            var image = new Image(fbImage.id, fbImage.images[0].source);
            return image;
        }));        
    }); 

    page.addNewPhoto = function() 
    {
        page.form.selectImage(new Image());
    };
    
    // Image Upload
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
                    self.comments.push({message: self.commentText()});
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
            if (id == undefined) 
            {
                self.comments([]);
            }
            else
            {
                window.Media.getPhotoComments(id, function(data) {
                    self.comments(data.data);
                });
            }
        });

        self.selectImage(new Image());
    };
};

var Image = function(id, url)
{
    this.imageUrl = ko.observable(url == undefined ? "img/no_photo.png" : url);
    this.imageId = ko.observable(id);
};
