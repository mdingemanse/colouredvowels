"use strict";

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $locationProvider) {
  $stateProvider
    .state('admin', {
      /*

      catch all, see main controller

      */
      url: '/{path:[a-zA-Z0-9\-/]*}',
      template:"<div compile='template'></div>",
      controller: 'main'
    })
  $locationProvider.html5Mode(true)

})

app.run(function($http, $interval, $location) {

})

var errorcodes = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  429: 'Too Many Requests',
  500: 'Internal Server Error'
};

app.controller("main", function($scope, $rootScope, $http, $timeout, $location,$state) {

  // check if database is setup properly
  $rootScope.db = false;
  $http.get('adminapi/checkconfig').then(function(data){
    console.log('config fine')
    $rootScope.db = true;
  }).catch(function(){
    $rootScope.db = false;
    console.log('config error')
  })

  // load templates
  var template = $state.params.path ? $state.params.path : "overview";
  var templateUrl = "adminapi/template/"+template+".php";
  $scope.load_template = function(){
    $http.get(templateUrl).then(function(data){
      $scope.template = data.data.template;
    }).catch(function(){
      console.warn('could not load template.')
    })
  }

  // api functions
  $scope.api = function(params){
    var spl = params.split(" ");
    // drop
    if(spl[0]=="drop"){
      var sure = confirm("Are you sure? This will delete all data in this table.");
      if(sure){
        $http.get("adminapi/drop/"+spl[1]).then(function(){
          $scope.load_template();
        })
      }
    }
    // update
    if(spl[0]=="update"){
      var sure = confirm("Are you sure to update? This will delete all data in this table.");
      if(sure){
        $http.get("adminapi/update/"+spl[1]).then(function(data){
          $scope.load_template();
        }).catch(function(err){
          console.log('Something went wrong with updating this table.')
        })
      }
    }
    // render
    if(spl[0]=="render"){
      $scope.render_loading = true;
      $http.get("adminapi/render").then(function(){
        $timeout(function(){
          $scope.render_loading = false;
        },500);
      }).catch(function(){
        alert("something went wrong...");
      })
    }
    // setup
    if(spl[0]=="setup"){
      $scope.setup_loading = true;
      console.log('setup')
      $http.get("adminapi/setup/"+spl[1]).then(function(){
        $timeout(function(){
          $scope.setup_loading = false;
          $scope.load_template();
        },500);
      }).catch(function(){
        alert("something went wrong...");
      })
    }
  }

  $scope.getdata = function() {
    var pad = $location.path().split("/");
    if (pad[0] == "") pad.splice(0, 1);
    if (pad[0] == "admin") {
      pad.splice(0, 1);
      var url = pad.join("/");
      $http.get("adminapi/" + url).then(function(a, b, c) {
        $scope.content = a;
      }).catch(function(a, b, c) {
        $scope.content = {
          "error": "<error>" + b + ": " + errorcodes[b] + "</error>"
        };
      })
    }
    if (pad[0] == "api") {
      pad.splice(0, 1);

    }
  }
  $scope.download = function (table) {
    window.open('adminapi/export?table='+table)
  }

  $scope.show_content = function(ev){
    var el = ev.target;
    if($(el).hasClass("open")){
      $(el).removeClass("open")
    } else {
      $(el).addClass("open");
    }
  }

  $scope.load_template();

})

// compile
app.directive("compile", function($compile) {
  return {
    restrict: 'A',
    link: function(s, el, a) {
      s.$watch(a.compile, function(html) {
        el.html(html);
        $compile(el.contents())(s);
      });
    }
  }
})

// css
app.directive("link", function() {
  return {
    restrict: "E",
    link: function(s, el, a) {
      $(window).bind("keydown", function(e) {
        if (e.keyCode == "82" && el.attr("href").match("_main") && !e.metaKey && $("input:focus,textarea:focus").length < 1) {
          var rand = Math.random(0, 999999999);
          // console.log(el.attr("href"));
          el.attr("href", el.attr("href").split("?")[0] + "?" + rand);
        }
      })
    }
  }
})

// active link
app.directive("a", function($location) {
  return {
    restrict: "E",
    scope: {},
    link: function(s, el, a) {
      s.check = function() {
        var sub = $location.path().substring(1)
        if (a.href == sub || (a.href == "index" && sub == "")) el.addClass("NOW");
        else el.removeClass("NOW");
      }
      s.$on("$locationChangeSuccess", s.check);
      s.check();
    }
  }
})
