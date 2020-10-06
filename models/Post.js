const   postsCollection = require("../db").db().collection("posts"),
        ObjectID        = require("mongodb").ObjectID,
        User            = require("../app");

let Post = function(data, userID) {
    this.data = data;
    this.errors = [];
    this.userID = userID;
};

Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") {
        this.data.title = "";
    };
    if (typeof(this.data.body) != "string") {
        this.data.body = "";
    };

    // get rid of bogus properties --> don't let user send additional properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        author: ObjectID(this.userID),
        createdDate: new Date()
    };
};

Post.prototype.validate = function() {
    if (this.data.title == "") {
        this.errors.push("You must provide a title.");
    };
    if (this.data.body == "") {
        this.errors.push("You must provide post content.");
    };
};

Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp;
        this.validate;

        if (!this.errors.length) {
            // save post to DB
            postsCollection.insertOne(this.data).then(() => {
                resolve();
            }).catch(() => {
                this.errors.push("Please try again later.");
                reject(this.errors);
            });
        } else {
            reject(this.errors);
        };
    });
};

Post.reusablePostQuery = function(uniqueOperations, visitorId) {
    return new Promise(async function(resolve, reject) {
        let aggOperations = uniqueOperations.concat([
            { $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDocument"
            } },
            // $project defines which properties of the $lookup object is needed
            { $project: {
                title: 1,
                body: 1,
                createdDate: 1,
                authorId: "$author",
                // $lookup returns array, so [0] is the first looked up variable
                author: { $arrayElemAt: ["$authorDocument", 0] }
            } }
        ]);
        // aggregate returns an array
        // aggregate gives permission to run multiple operations
        let posts = await postsCollection.aggregate(aggOperations).toArray();

        // clean up author property in each post object
        posts = posts.map(function(post) {
            post.isVisitorOwner = post.authorId.equals(visitorId);

            post.author = {
                username:   post.author.username,
                avatar:     new User(post.author, true).avatar
            };
            return post;
        });

        resolve(posts);
    });
};

Post.prototype.findSingleById = function(id, visitorId) {
    return new Promise(async function(resolve, reject) {
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject();
            return;
        };

        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectID(id)}}
        ], visitorId);

        if (posts.length) {
            console.log(posts[0]);
            resolve(posts[0]);
        } else {
            reject();
        }
    });
};

Post.findByAuthorId = function(authorId) {
    return Post.reusablePostQuery([
        {$match: {author: authorId}},
        {$sort: {createdDate: -1}},
    ]);
};

module.exports = Post;