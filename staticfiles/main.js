const todoApp = angular.module("TODO", ["ngRoute"]);
// Services
todoApp.filter("statusFilter", function () {
  return function (list, status) {
    if (status === "incomplete") {
      return list.filter((item) => !item.completed);
    } else if (status === "complete") {
      return list.filter((item) => item.completed);
    } else {
      return list;
    }
  };
});
todoApp.factory("alertService", [
  "$q",
  function ($q) {
    function todoAlert(_class, _msg) {
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

todoApp.controller("navigation", function ($rootScope, $scope) {
  $rootScope.isActive = false;
  $rootScope.onNavToggle = () => {
    $rootScope.isActive = !$rootScope.isActive;
    console.log($rootScope.isActive);
  };
});

// Controllers
todoApp.controller("login", function ($rootScope, $scope, $http, $location, alertService) {
  $scope.onSubmit = (evt) => {
    const data = serializeObject($(evt.target).serializeArray());
    $http.post("/api/insecure/auth/login", data).then((resp) => {
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
});

todoApp.controller("register", function($rootScope, $scope, $http, $location, alertService){
  $scope.registerUser = (evt)=>{
    const data = serializeObject($(evt.target).serializeArray());
    $http.post("/api/insecure/auth/register", data).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  
})
todoApp.controller("todos", function ($rootScope, $scope, $http, $location, alertService) {
  $scope.todos = [];
  $scope.compTodos = [];
  $scope.titleStr = "";
  $scope.status = "all";
  $scope.description = "";

  this.$onInit = function () {
    $http
      .get("/api/todos")
      .then((res) => {
        const { message, statusCode, data } = res.data;
        if (statusCode === 200) {
          $scope.todos = [...data.todos];
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          $location.path("/");
        }
      });
  };

  $scope.addTodo = (evt) => {
    const data = serializeObject($(evt.target).serializeArray());
    data.doc = new Date().toISOString();
    $http
      .post("/api/todos/add", data)
      .then((res) => {
        const { message, statusCode, data } = res.data;
        if (statusCode === 201) {
          $scope.todos.push(data.todo);
          $(evt.target)[0].reset();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  $scope.getFilteredData = (evt) => {
    $http
      .get(`/api/todos/filter?title=${$scope.titleStr}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  $scope.toggleStatus = (todo) => {
    todo.completed = !todo.completed;
    $http
      .patch("/api/todos/update", {
        ...todo,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
});


