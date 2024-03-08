const todoApp = angular.module("TODO", ["ngRoute"]);
// Services
todoApp.factory("alertService", [
  "$q",
  function ($q) {
    function todoAlert(_class, _msg) {
      // this._class = _class;
      // this._msg = _msg;
      return $q(function (resolve, reject) {
        const alEl = document.createElement("div");
        alEl.classList.add("alert", _class);
        alEl.textContent = _msg;
        document.body.appendChild(alEl);
        setTimeout(() => {
          document.body.removeChild(alEl);
          resolve();
        }, 2500);
      });
    }
    return {
      todoAlert,
    };
  },
]);

// Route configuration
todoApp.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/static/views/login.html",
    })
    .when("/register", {
      templateUrl: "/static/views/register.html",
    })
    .when("/todos", {
      templateUrl: "/static/views/todos.html",
    });
});

// Controllers
todoApp.controller(
  "login",
  function ($rootScope, $scope, $http, $location, alertService) {
    $scope.onSubmit = (evt) => {
      const data = serializeObject($(evt.target).serializeArray());
      $http.post("/api/auth/login", data).then((resp) => {
        const { statusCode, message, data } = resp.data;
        console.log(resp);
        if (statusCode === 302) {
          $location.path(data.url);
        } else if (statusCode === 200) {
          alertService.todoAlert("success", message).then(() => {
            $location.path("/todos");
          });
        }
      });
    };
  }
);
todoApp.controller(
  "todos",
  function ($rootScope, $scope, $http, $location, alertService) {
    $scope.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
);
