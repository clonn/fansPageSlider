/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {


  var request = require("request");
  var asnyc = require("async");


  function getPhotos (url) {

    request({
      url: url
    }, function (err, body, result) {
      // console.log(result);
      var source = JSON.parse(result);
      data = source.data;
      if (data.length < 1) {
        return;
      }
      savePhoto(data, function () {
        console.log("save all photos done");

        if (source.paging.next) {
          console.log("Request url again.");
          console.log("URL: " + source.paging.next);
          getPhotos(source.paging.next);
        }
      });
    });
  }

  function savePhoto (data, cb) {
    console.log("save photos");
    async.each(data, function (val, callback) {
      Photos.findOne({
        id: val.id,
      }).done(function (err, result) {
        if (result) {
          return callback();
        }
        Photos.create({
          id: val.id,
          title: val.name,
          url: val.images[0].source,
          width: val.images[0].width,
          height: val.images[0].height
        })
        .done(function (){
          return callback();
        });

      });
    }, function (err) {
      cb();
    });
  }

  getPhotos("http://graph.facebook.com/480994675249305/photos?type=uploaded");

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};