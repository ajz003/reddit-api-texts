const router = require("express").Router();
const Post = require("../models/post.js");
const axios = require("axios");
const client = require('twilio')(process.env.accountSid, process.env.authToken);

router.get("/api/scrape", function (req, res) {
    let numDocs = 0;
    Post.find({}).then((docs) => {
        numDocs = docs.length
        axios.get("https://www.reddit.com/r/cscareerquestions/search.json?q=bootcamp&limit=10&sort=new&restrict_sr=1").then(function (response) {
            for (let i = 0; i < response.data.data.children.length; i++) {
                let newPost = {}
                newPost.title = response.data.data.children[i].data.title;
                newPost.link = response.data.data.children[i].data.url;
                Post.create({
                    title: newPost.title,
                    link: newPost.link
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    if (i === response.data.data.children.length - 1) {
                        if (numDocs > 0) {
                            Post.find({}).then((documents) => {
                                if (documents.length !== numDocs) {
                                    let numNew = parseInt(documents.length - numDocs)
                                    console.log(numNew)
                                    let textMessage = "Good afternoon!";
                                    for (let i = documents.length - numNew + 1, j = 1; i < documents.length + 1 && j < 4; i++, j++) {
                                        textMessage += "\n\n" + parseInt(j) + ". Title: " + documents[i].title + "\nLink: " + documents[i].link
                                    }
                                    if (numNew > 3) {
                                        textMessage += "\n\n" + "...and " + (numNew-3) + " more."
                                    }
                                    client.messages.create({
                                        body: textMessage,
                                        from: '+16266584299',
                                        to: '+18183891298'
                                    }).then(function(response) {}).done();
                                    console.log(textMessage)
                                } else {
                                    client.messages.create({
                                        body: "No new posts.",
                                        from: '+16266584299',
                                        to: '+18183891298'
                                    }).then(function(response) {}).done();
                                }
                            });
                        }

                    }
                })
            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        }).then(function () { });
    }).then(function () { });
})

router.get("/api/posts", function (req, res) {

    Post.find({})
        .then((docs) => {
            res.json(docs);
        });

});

module.exports = router;