let Post = function(data) {
    this.data = data;
};

Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") {
        this.data.title = "";
    };
    if (typeof(this.data.body) != "string") {
        this.data.body = "";
    };

    // get rid of bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date()
    };
};

Post.prototype.validate = function() {
    
};

Post.prototype.create = function() {

};

module.exports = Post;