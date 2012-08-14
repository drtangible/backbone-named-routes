/*!
 * Backbone Named Routes 0.1.2
 * http://github.com/drtangible/backbone-named-routes
 */

(function(){
  Backbone.NamedRoutes = {

    VERSION: '0.1.2',

    PATTERNS: {},

    pathFor: function(pathPattern, urlParams, queryParams) {
      var path = pathPattern;
      if (path.charAt(0) !== "/") path = "/" + path;
      if (Backbone.history.options && Backbone.history.options.root !== "/") path = Backbone.history.options.root + path;

      for(var i = 0; i < urlParams.length; i++) {
        var param = urlParams[i];
        path = path.replace(/\:\w+/, param);
      }

      var filteredQueryParams = filterObject(queryParams);

      if (filteredQueryParams && !_.isEmpty(filteredQueryParams)) {
        path += "?" + $.param(filteredQueryParams);
      }
      return path;
    }
  };

  _(Backbone.View.prototype).extend({
    helper: Backbone.NamedRoutes
  });

  _(Backbone.Router.prototype).extend({
    helper: Backbone.NamedRoutes
  });

  _(Backbone.Router.prototype).extend({
    route: (function(original) {
      return function(route, name, callback) {
        // Create key to store path patterns for this route name.
        Backbone.NamedRoutes.PATTERNS[name] = Backbone.NamedRoutes.PATTERNS[name] || {};

        // Store the route pattern for the combination of this route name and the
        // number of path params defined in the pattern.
        var numberOfParams = route.match(/\:\w+/g) ? route.match(/\:\w+/g).length : 0;
        Backbone.NamedRoutes.PATTERNS[name][numberOfParams] = route;

        // Create the named route helper method for this route name.
        Backbone.NamedRoutes[name + 'Path'] = function() {
          var args = Array.prototype.slice.call(arguments);
          var hasQueryParams = _(args[args.length-1]).isObject();
          var numberOfParams = hasQueryParams ? arguments.length - 1 : arguments.length;
          var routePattern = Backbone.NamedRoutes.PATTERNS[name][numberOfParams];
          var queryParams = hasQueryParams ? args.pop() : null;

          return Backbone.NamedRoutes.pathFor(routePattern, args, queryParams);
        };

        // Invoke the orginal #route method.
        original.apply(this, arguments);
      };
    }(Backbone.Router.prototype.route))
  });


  // Private Helper methods

  // Filters out `undefined` and `null` values
  var filterObject = function(object) {
    var filteredObject = {};

    for(var key in object) {
      if (has(object, key)) {
        if (object[key] != null) {
          filteredObject[key] = object[key];
        }
      }
    }

    return filteredObject;
  };

  // cache reference to `Object.prototype.hasOwnProperty`
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var has = function(object, key) {
    return hasOwnProperty.call(object, key);
  };

}).call(this);
