/**
 * MainController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var request = require("request");
var asnyc = require("async");


function getPhotos (url, cb) {

  request({
    url: url
  }, function (err, body, result) {
    // console.log(result);
    var data = JSON.parse(result);
    data = data.data;
    if (data.length < 1) {
      return;
    }
    savePhoto(data, function () {
      console.log("save all photos done");
      cb(data);
    });
  });
}

function savePhoto (data, cb) {
  console.log("save photos");
  async.each(data, function (val, callback) {
    Photos.create({
      id: val.id,
      title: val.name,
      url: val.images[0].source,
      width: val.images[0].width,
      height: val.images[0].height
    })
    .done(function (){
      callback();
    });
  }, function (err) {
    cb();
  });
}

module.exports = {
    
  index: function (req, res) {

    getPhotos("http://graph.facebook.com/480994675249305/photos?type=uploaded", function (data) {
      res.view("home/index");    
    });

  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MainController)
   */
  _config: {}

  
};
