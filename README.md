# Add named routes to your Backbone application.

## Usage

Include the plugin after all dependencies.

    <script src="/javascripts/underscore.js type="text/javascript"></script>
    <script src="/javascripts/json2.js type="text/javascript"></script>
    <script src="/javascripts/jquery.js type="text/javascript"></script>
    <script src="/javascripts/backbone.js type="text/javascript"></script>
    <script src="/javascripts/backbone_named_routes.js type="text/javascript"></script>

Given a Backbone Router:

    var Workspace = Backbone.Router.extend({
      routes: {
        "help":                 "help",    // #help
        "search/:query":        "search",  // #search/kiwis
        "search/:query/p:page": "search"   // #search/kiwis/p7
      }
    });


This plugin provides a `helper` attribute that provides named routes which can be

... accessed on Backbone Routers

    var router = new Workspace();

    router.helper.helpPath();
    => "/help"

    router.helper.searchPath("kiwis");
    => "/search/kiwis"

    router.helper.searchPath("kiwis", 7);
    => "/search/kiwis/p7"


... accessed on Backbone Views

    var view = new Backbone.View();

    view.helper.helpPath();
    => "/help"

    view.helper.searchPath("kiwis");
    => "/search/kiwis"

    view.helper.searchPath("kiwis", 7);
    => "/search/kiwis/p7"


... mixed into Backbone Models, Collections, and other objects.

    _(Backbone.Model.prototype).extend({
      helper: Backbone.NamedRoutes
    });

    var model = new Backbone.Model();

    model.helper.helpPath();
    => "/help"

    model.helper.searchPath("kiwis");
    => "/search/kiwis"

    model.helper.searchPath("kiwis", 7);
    => "/search/kiwis/p7"


## Query parameters

Named routes accept an optional parameter that will append query parameters to the path.

    var router = new Workspace();

    router.helper.helpPath({ foo: "bar", baz: "boo" });
    => "/help?foo=bar&baz=boo"

    router.helper.searchPath("kiwis", { foo: "bar", baz: "boo" });
    => "/search/kiwis?foo=bar&baz=boo"

    router.helper.searchPath("kiwis", 7, { foo: "bar", baz: "boo" });
    => "/search/kiwis/p7?foo=bar&baz=boo"
