const router = require("express").Router();
const Post = require("../models/post.js");
const axios = require("axios");
const client = require('twilio')(process.env.accountSid, process.env.authToken);

router.get("/api/scrape", function (req, res) {
    let numDocs;
    Post.find({}).then((docs) => {
        numDocs = docs.length
        axios.get("https://www.reddit.com/r/cscareerquestions/search.json?q=bootcamp&limit=10&sort=new&restrict_sr=1").then(function (response) {
            for (let i = 0; i < response.data.data.children.length; i++) {
                let newPost = {}
                newPost.title = response.data.data.children[i].data.title;
                newPost.link = response.data.data.children[i].data.url;
                console.log(newPost.title)
                console.log(newPost.link)
                Post.create({
                    title: newPost.title,
                    link: newPost.link
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    if (i === response.data.data.children.length - 1) {

                        console.log("MADE IT HERE")
                        console.log(docs.length, "docs")
                        console.log(numDocs, "numDocs")
                        if (numDocs > 0) {
                            Post.find({}).then((documents) => {
                                console.log(documents.length, "documents")
                                if (documents.length !== numDocs) {
                                    let numNew = documents.length - numDocs;
                                    let textMessage = "";
                                    for (let i = 0; i < 3; i++) {
                                        textMessage += "\n\n " + parseInt(i + 1) + ". Title: " + documents[i].title + "\n Link: " + documents[i].link
                                    }
                                    if (numNew > 3) {
                                        textMessage += "\n ...and " + numNew - 3 + " more."
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
    // find all products where quantity is greater than zero
    Post.find({})
        .then((docs) => {
            res.json(docs);
        });
});


// router.post("/api/sendText", function (req, res) {
//     console.log(req.body)
//     var number =  req.body.phone.replace(/\D/g,'');
//     console.log(number);
//       client.messages
//         .create({
//           body: req.body.msg,
//           from: '+16266584299',
//           to: number
//         })
//         .then(function (response) {

//         })
//         .done();
//     });

module.exports = router;