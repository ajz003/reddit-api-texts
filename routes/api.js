const router = require("express").Router();
const Post = require("../models/post.js");
const axios = require("axios");

// router.post("/api/product", function(req, res) {
//   // as long as req.body matches what the model expects, this should insert into the database
//   Product.create(req.body)
//   .then(() => {
//     res.json(true);
//   })
//   .catch((err) => {
//     // if not, we can at least catch the error
//     res.json(err);
//   });
// });

router.get("/api/scrape", function(req, res) {

    axios.get("https://www.reddit.com/r/cscareerquestions/search.json?q=bootcamp&limit=10&sort=new&restrict_sr=1")
        .then(function (response) {


            for (let i = 0; i < response.data.data.children.length; i++) {

                let newPost = {}

                newPost.title = response.data.data.children[i].data.title;
                newPost.link = response.data.data.children[i].data.url;
    
                console.log(newPost.title)
                console.log(newPost.link)

                Post.create(
                    { title: newPost.title, link: newPost.link},
                     function(err) {
                        if (err) {console.log(err)}
                    }
                )

            }

        })
        .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            // always executed
          });
})

router.get("/api/posts", function(req, res) {
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

// router.get("/api/products/:id", function(req, res) {
//   // find and return a single object based on upc
//   Product.findOne({
//     upc: req.params.id
//   })
//   .then((docs) => {
//     res.json(docs);
//   });
// });

// router.put("/api/products/:id", function(req, res) {
//   Product.findOneAndUpdate({
//     upc: req.params.id
//   }, {
//     // let mongo auto-decrement the quantity
//     $inc: {quantity: -1}
//   }, {
//     // return the udpated object, not the original
//     new: true
//   })
//   .then((docs) => {
//     res.json(docs);
//   })
//   .catch((err) => {
//     res.json(err);
//   });
// });

module.exports = router;