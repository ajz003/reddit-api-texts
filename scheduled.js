const axios = require("axios");

axios.get("https://cs-reddit-messenger.herokuapp.com/api/scrape").then(function(response) {
}).catch(function(error) {
    // handle error
    console.log(error);
})