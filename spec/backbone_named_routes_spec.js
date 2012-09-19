describe("Backbone named routes extension", function() {

  describe("#addRoute", function() {
    it("adds a named route helper", function() {
      var view = new Backbone.View();
      expect(view.helper.fooPath).toBeUndefined();

      Backbone.NamedRoutes.addRoute('foo', '/foo/:id/bar/:id_2');
      expect(view.helper.fooPath).toBeDefined();
      expect(view.helper.fooPath('hello', 'world')).toEqual('/foo/hello/bar/world');
    });
  });

  describe("when a router is defined", function() {
    var Workspace, router;

    beforeEach(function() {

      Workspace = Backbone.Router.extend({
        routes: {
          "help":                 "help",    // #help
          "search/:query":        "search",  // #search/kiwis
          "search/:query/p:page": "search"   // #search/kiwis/p7
        }
      });

      var router = new Workspace();


      Backbone.history.options = null;

      spyOn(Backbone.history, 'start').andCallFake(function(options) {
        Backbone.history.options = options;
      });
    });

    describe("Views", function() {
      it("provides a helper with named routes", function() {
        var view = new Backbone.View();

        expect(view.helper.helpPath()).toEqual("/help");
        expect(view.helper.searchPath('kiwis')).toEqual("/search/kiwis");
        expect(view.helper.searchPath('kiwis', 7)).toEqual("/search/kiwis/p7");
      });

      it("allows arbitrary query params", function() {
        var router = new Workspace();
        var view = new Backbone.View();

        expect(view.helper.helpPath({ foo: "bar", baz: "boo" })).toEqual("/help?foo=bar&baz=boo");
        expect(view.helper.searchPath('kiwis', { foo: "bar", baz: "boo" })).toEqual("/search/kiwis?foo=bar&baz=boo");
        expect(view.helper.searchPath('kiwis', 7, { foo: "bar", baz: "boo" })).toEqual("/search/kiwis/p7?foo=bar&baz=boo");
        expect(view.helper.searchPath('kiwis', 7, {})).toEqual("/search/kiwis/p7");
      });

      it("filters out null and undefined values for query params", function(){
        var router = new Workspace();
        var view = new Backbone.View();

        expect(view.helper.helpPath({ foo: "bar", baz: undefined, boo: null })).toEqual("/help?foo=bar");
        expect(view.helper.searchPath('kiwis', { foo: "bar", baz: undefined, boo: null })).toEqual("/search/kiwis?foo=bar");
        expect(view.helper.searchPath('kiwis', 7, { foo: "bar", baz: undefined, boo: null })).toEqual("/search/kiwis/p7?foo=bar");
        expect(view.helper.searchPath('kiwis', 7, { foo: undefined })).toEqual("/search/kiwis/p7");
      });

      it("includes the root if history has been started", function() {
        var router = new Workspace();
        var view = new Backbone.View();

        Backbone.history.start({ pushState: true, root: "/articles" });

        expect(view.helper.helpPath({ foo: "bar", baz: "boo" })).toEqual("/articles/help?foo=bar&baz=boo");
        expect(view.helper.searchPath('kiwis', { foo: "bar", baz: "boo" })).toEqual("/articles/search/kiwis?foo=bar&baz=boo");
        expect(view.helper.searchPath('kiwis', 7, { foo: "bar", baz: "boo" })).toEqual("/articles/search/kiwis/p7?foo=bar&baz=boo");
      });
    });

    describe("Routers", function() {
      it("provides a helper with named routes", function() {
        var router = new Workspace();

        expect(router.helper.helpPath()).toEqual("/help");
        expect(router.helper.searchPath('kiwis')).toEqual("/search/kiwis");
        expect(router.helper.searchPath('kiwis', 7)).toEqual("/search/kiwis/p7");
      });

      it("allows arbitrary query params", function() {
        var router = new Workspace();

        expect(router.helper.helpPath({ foo: "bar", baz: "boo" })).toEqual("/help?foo=bar&baz=boo");
        expect(router.helper.searchPath('kiwis', { foo: "bar", baz: "boo" })).toEqual("/search/kiwis?foo=bar&baz=boo");
        expect(router.helper.searchPath('kiwis', 7, { foo: "bar", baz: "boo" })).toEqual("/search/kiwis/p7?foo=bar&baz=boo");
        expect(router.helper.searchPath('kiwis', 7, {})).toEqual("/search/kiwis/p7");
      });

      it("filters out null and undefined values for query params", function(){
        var router = new Workspace();

        expect(router.helper.helpPath({ foo: "bar", baz: undefined, boo: null })).toEqual("/help?foo=bar");
        expect(router.helper.searchPath('kiwis', { foo: "bar", baz: undefined, boo: null })).toEqual("/search/kiwis?foo=bar");
        expect(router.helper.searchPath('kiwis', 7, { foo: "bar", baz: undefined, boo: null })).toEqual("/search/kiwis/p7?foo=bar");
        expect(router.helper.searchPath('kiwis', 7, { foo: undefined })).toEqual("/search/kiwis/p7");
      });

      it("includes the root if history has been started", function() {
        var router = new Workspace();

        Backbone.history.start({ pushState: true, root: "/articles" });

        expect(router.helper.helpPath({ foo: "bar", baz: "boo" })).toEqual("/articles/help?foo=bar&baz=boo");
        expect(router.helper.searchPath('kiwis', { foo: "bar", baz: "boo" })).toEqual("/articles/search/kiwis?foo=bar&baz=boo");
        expect(router.helper.searchPath('kiwis', 7, { foo: "bar", baz: "boo" })).toEqual("/articles/search/kiwis/p7?foo=bar&baz=boo");
      });
    });

    it("allows implementors to mix in the url helper into other places", function() {
      _(Backbone.Model.prototype).extend({
        helper: Backbone.NamedRoutes
      });

      var router = new Workspace();
      var model = new Backbone.Model();

      expect(model.helper.helpPath()).toEqual("/help");
      expect(model.helper.searchPath('kiwis')).toEqual("/search/kiwis");
      expect(model.helper.searchPath('kiwis', 7)).toEqual("/search/kiwis/p7");
    });
  });
});
