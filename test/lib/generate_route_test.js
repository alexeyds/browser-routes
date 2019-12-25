import test from "enhanced-tape";
import generateRoute from "generate_route";

test("generateRoute", function(t) {
  t.test("basic usage", function(t) {
    t.test("creates new Route", function(t) {
      let route = generateRoute({name: "users", path: "/users"});

      t.equal(route.pathName, "usersPath");
      t.equal(route.urlName, "usersUrl");
      t.equal(route.rawPath, "/users");
      t.equal(typeof route.toPath, "function");
  
      t.end();
    });
  });

  t.test("Route#toPath", function(t) {
    t.test("generates simple paths", function(t) {
      let route = generateRoute({name: "users", path: "/users"});

      t.equal(route.toPath(), "/users");
  
      t.end();
    });

    t.test("generates paths with params", function(t) {
      let route = generateRoute({name: "user", path: "/users/:id"});

      t.equal(route.toPath({id: 1}), "/users/1");
    
      t.end();
    });

    t.test("appends {query} to path", function(t) {
      let route = generateRoute({name: "users", path: "/users"});
      let query = {id: 1, name: "John"};

      t.equal(route.toPath({}, {query}), "/users?id=1&name=John");
    
      t.end();
    });
  });

  t.test("Route#toFullUrl", function(t) {
    t.test("behaves like toPath if {hostname} option is not provided", function(t) {
      let route = generateRoute({name: "user", path: "/users/:id"});

      t.equal(route.toFullUrl({id: 1}, {query: {name: "John"}}), "/users/1?name=John");
  
      t.end();
    });

    t.test("prepends {hostname} to path", function(t) {
      let route = generateRoute({name: "users", path: "/users", hostname: "localhost:3000"});

      t.equal(route.toFullUrl(), "localhost:3000/users");
    
      t.end();
    });
  });

  t.test("{scopes} options", function(t) {
    t.test("appends each scope to rawPath", function(t) {
      let route = generateRoute({name: "users", path: "/users", scopes: ["/api", "v2"]});

      t.equal(route.rawPath, "/api/v2/users");
    
      t.end();
    });

    t.test("appends each scope to route path", function(t) {
      let route = generateRoute({name: "users", path: "/users", scopes: ["/:locale", "api"]});

      t.equal(route.toPath({locale: "en"}), "/en/api/users");
  
      t.end();
    });

    t.test("doesn't modify original scopes array", function(t) {
      let scopes = ["/api"];
      generateRoute({name: "users", path: "/users", scopes});

      t.same(scopes, ["/api"]);
    
      t.end();
    });
  });
});