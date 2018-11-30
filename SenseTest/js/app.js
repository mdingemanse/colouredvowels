"use strict";

var app = angular.module('app', ['ui.router', 'ngStorage']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/tests')

    $stateProvider
        .state('profiel', {
            url: '/profiel',
            templateUrl: "templates/profile",
            controller: 'staticCtrl'
        })
        .state('tests', {
            url: '/tests',
            templateUrl: "templates/overview",
            controller: 'overviewCtrl'
        })
        .state('info', {
            url: '/info',
            template: "<div koppen id='head'></div><div class='text info' compile='html' ng-class='name'></div>",
            controller: 'staticCtrl'
        })
        .state('test', {
            url: '/test/{testid:[a-zA-Z0-9\-/]*}',
            template: "<div id='reset' ng-click='setdefault()'>reset</div><div id='test' compile='html' ng-class='testid'></div>",
            controller: 'testCtrl'
        })
        .state('results', {
            url: '/results/{testid:[a-zA-Z0-9\-/]*}',
            template: "<div id='reset' ng-click='setdefault()'>reset</div><div id='results' ng-include=\"'templates/results'\"></div>",
            controller: 'resultsCtrl'
        })
        .state('reset', {
            url: '/reset',
            controller: 'resetCtrl'
        })

    $locationProvider.html5Mode(true)


})

soundManager.debugMode = false;
soundManager.setup({
    url: 'bower_components/soundmanager2/swf/',
    html5PollingInterval: 300,
    flashPollingInterval: 300,
    useHTML5Audio: true,
    debugMode: false,
    preferFlash: false,
    onready: function() {},
    ontimeout: function() {
        console.warn("soundmanager2 error");
    }
});

app.run(function($rootScope, $http, $interval, $location, $state, $localStorage, $timeout, $window, gno, popup) {

    // console.log("localstorage:",$localStorage.version);

    var defaultstorage = Object.assign({}, defaultstorage);

    if(parseFloat($localStorage.version) < parseFloat(defaultstorage.version)){
        console.log("update localstorage to version:",defaultstorage.version);
        $localStorage.tests = "";
        $localStorage.tests = defaultstorage.tests;
        delete $localStorage.profile.COUNTRY;
        $localStorage.version = defaultstorage.version;
        gno.put("profile");
        $rootScope.$apply();
    }

    $rootScope.loaded = true;

    $rootScope.$on('$stateChangeStart', function(e, to, params) {
        // directly to results
        if(to.name=="test"){
            if($state.current.name=="results"){
                e.preventDefault();
                $state.go("tests");
            } else if($localStorage.tests[params.testid].status.done){
                e.preventDefault();
                $state.go("results",{"testid":params.testid});
            }
        }
    });

    $rootScope.state = function(){
        var ctrlr = $state.current.controller;
        if(ctrlr=="staticCtrl" || ctrlr=="overviewCtrl") return true
        return false;
    }

    $rootScope.reset = function() {
        popup.confirm("Are you sure you want to start over? <label>Your profile and test results will be erased from your browser memory.</label>",["yes","no"]).then(function(sure){
            if(sure=="yes"){
                window.localStorage.clear();
                $localStorage.$reset(JSON.parse(JSON.stringify(defaultstorage)));
                $rootScope.$broadcast("update");
                $timeout(function(){$window.location.reload();},500);
                $state.go("tests");
            }
        });
    }

    $rootScope.put = function(){
        gno.put();
    }

    gno.update_with_defaultstorage(true);

    // monitor broadcast

    $rootScope.$onMany = function(events, fn) {
       for(var i = 0; i < events.length; i++) {
          this.$on(events[i], fn);
       }
    }

    $rootScope.$onMany(["start", "next", "startupdate", "audio_finished", "audio_loaded"],function(e){
        // console.log(e.name);
    })

})

app.controller("overviewCtrl", function($scope,$rootScope,$state,$localStorage,gno,popup) {

    $scope.gno = gno;

    if(gno.check_storage_empty()){
        $rootScope.intro = true;
    };

    $scope.$storage = $localStorage
    $scope.testinfo = testinfo;


    $scope.link = function(test){
        if(gno.test_class(test).indexOf("disabled")<0) return 'test/'+test.link;
        return "";
    }
    $scope.main = function(test){
        if(test.relation=="main" && !$scope.testinfo[test.ID].disabled) return true;
        else return false;
    }
    $scope.sub = function(test){
        if($scope.testinfo[test.ID].relation=="main" || $scope.testinfo[test.ID].disabled) return false;
        if($scope.testinfo[test.ID].relation=="sub" && !$scope.testinfo[test.ID].disabled) return true;
        var check = false;
        var dependencies = $scope.testinfo[test.ID].relation.split(",");
        $.each($scope.$storage.tests,function(k,v){
            // check if @link is in dependencies and if not disabled and status is done.
            if(dependencies.indexOf($scope.testinfo[k].link) && !$scope.testinfo[k].disabled && v.status.done) check = true;
        })
        if(check || test.relation=="=") return true;
        else return false;
    }
    $scope.done = function(ID){
        if($scope.$storage.tests[ID] && $scope.$storage.tests[ID].status.done) return true;
        return false;
    }
    $scope.percentage = function(ID){
        var p = gno.progress(ID);
        return parseInt(((p[0]-1)/(p[1]-1))*100);
    }
})

app.controller("testCtrl", function($scope, $rootScope, $state, $localStorage,$templateCache, $timeout, $http, gno, popup) {

    // set general test info
    $scope.testinfo = testinfo;

    // get testid by url (matches config.json->link of test)
    $.each($scope.testinfo,function(k,v){
        if(v.link == $state.params.testid) $scope.testid = k;
    })

    // redirect if test does not exist
    if($scope.testid=="" || !defaultstorage.tests[$scope.testid]) $state.go("tests");

    // set template
    $scope.template = "test/"+$scope.testid;
    $scope.html = $templateCache.get($scope.template);

    // set storage object
    $scope.$storage = $localStorage;

    // groot nationaal onderzoek service
    $scope.gno = gno;

    // set params
    $scope.params = $scope.$storage.tests[$scope.testid];

    // set folder
    $scope.folder = "data/tests/"+$scope.testinfo[$scope.testid].dirname;

    // get questions from random set if not yet exist
    gno.get_random_set_questions($scope.testid).then(function(){
        $scope.questions = $scope.$storage.tests[$scope.testid].questions;
        $rootScope.$broadcast("questions_loaded");
    })

    // set questions
    $scope.questions = $scope.$storage.tests[$scope.testid].questions;

    // go to next if broadcast
    $scope.$on("next",function(){
        $scope.next();
    })

    // start directive: when start is clicked
    $scope.$on("start",function(){
        if($("#frame[before]").length<1){
            $scope.next();
        }
    })

    // go to next slide
    $scope.next = function() {

        // reset timer
        // console.log("reset time start",new Date().getTime());
        $rootScope.time = new Date().getTime();

        // get next question
        $scope.k = $scope.getnextq();

        // upload and reroute when done
        if(!$scope.k){
            gno.check($scope.testid);
            gno.put($scope.testid);
            $scope.q = null;
            $("#frame[after]").show();
            if($("#frame[after]").length<1){
                $state.go("results",{"testid":$scope.testid});
            }
        }

        // set question
        $scope.q = $scope.questions[$scope.k-1];
        // console.log($scope.q);

        // send update (for child scopes $eval)
        $rootScope.$broadcast("update");

        $timeout(function(){
            $scope.$apply();
        },0);

    }

    $scope.getnextq = function(){
        var next = false;
        $.each($scope.questions,function(k,v){
            if(!v.done || v.done==undefined) { next = k+1; return false;}
        });
        return next;
    }


    // profile form
    $scope.hidden = function(content){
        if(!content && content!=0) return false;
        if(typeof content == "number"){
            if(content==-1) return false;
            if(content || content==0) return true;
            if(content<0) return false;
        }
        if(typeof content == "string"){
            if(parseInt(content)) return true;
            if(content=="") return false;
            if(content) return true;
        }
        return false;

    }

    $scope.profile = function(params){

        var profile = gno.check_profile();
        if(profile!== false){
            return false;
        } else {
            return true;
        }

    }

    $scope.profile_empty = function(){
        var check = gno.check_profile();
        if(check===2 || check===1) return true;
        return false;
    }

    $scope.getfolder = function(subdir,file){
        subdir = stripslashes(subdir);
        file = stripslashes(file);
        if($scope.folder) return $scope.folder+"/"+subdir+"/"+file;
        else return false;
    }

    $scope.setdefault = function(){
        $scope.$storage.tests[$scope.testid] = defaultstorage.tests[$scope.testid];
        $state.reload();
    }

    $scope.profile_done = function(){
        gno.put("profile");
        $rootScope.$broadcast("update");
    }

})

app.controller("resultsCtrl", function($scope, $rootScope, $state, $localStorage,$templateCache, $timeout, gno, popup) {

    // get testid by url (matches config.json of test)
    $scope.testid = $state.params.testid;

    // redirect if test does not exist
    if($scope.testid=="" || !defaultstorage.tests[$scope.testid]) $state.go("tests");

    // set template
    $scope.template = "results/"+$scope.testid;
    $scope.html = $templateCache.get($scope.template);

    // set storage object
    $scope.$storage = $localStorage;

    // groot nationaal onderzoek service
    $scope.gno = gno;

    // set general test info
    $scope.testinfo = testinfo;

    // set folder
    $scope.folder = "data/tests/"+$scope.testinfo[$scope.testid].dirname;

    $scope.score = gno.score($scope.testid);

    $scope.setdefault = function(){
        $scope.$storage.tests[$scope.testid] = defaultstorage.tests[$scope.testid];
        $state.reload();
    }

    $scope.profile_done = function(){
        gno.put("profile");
        $rootScope.$broadcast("update");
        $state.go("tests");
    }

    $scope.resultsclass = function(){

        var c = "";
        var names = ['maanden','dagenvdweek'];
        var sounds = ['klinkers','muziek'];

        c = "symbols"; // default
        if(names.indexOf($scope.testid)!=-1) c = "names";
        if(sounds.indexOf($scope.testid)!=-1) c = "sounds";

        return c;
    }

    $scope.getfolder = function(subdir,file){
        subdir = stripslashes(subdir);
        file = stripslashes(file);
        if($scope.folder) return $scope.folder+"/"+subdir+"/"+file;
        else return false;
    }

    $scope.hideresults = function(testid){
        if($scope.testinfo[testid].type == "syn" || $scope.testinfo[testid].type == "synplus") return false;
        else return true;
    }

    $scope.nocolor = function(item){
        if(item){
            var ret = false;
            $.each(item.colors,function(k,v){
                if(!v || v==='nocolor') ret = true;
            });
            return ret;
        }
        return false;
    }

    $scope.social = function(percentage){

        var socialstring = $scope.testinfo[$scope.testid].social;
        socialstring = socialstring.replace("%%",percentage+"%");
        socialstring = encodeURIComponent(socialstring);

        return socialstring;

    }

})

app.controller("staticCtrl", function($rootScope,$scope,$state,$timeout,$compile,$templateCache,$localStorage,popup,gno) {
    $scope.name = $state.current.name;
    $scope.template = "pages/"+$scope.name;
    $scope.html = $templateCache.get($scope.template);
    $scope.$storage = $localStorage;
    $scope.testinfo = testinfo;
    $scope.gno = gno;



    $scope.get_results = function(){
        $scope.results = {};
        $.each($scope.$storage.tests,function(testid,content){
            var values = {};
            values['id'] = testid;
            values['name'] = $scope.testinfo[testid].titles.menushort;
            values['dirname'] = $scope.testinfo[testid].dirname;
            values['done'] = content.status.done;
            values['progress'] = gno.progress(testid);
            values['score'] = gno.score(testid);
                values['score'].percentage = "score: "+values['score'].percentage+"%";
            values['type'] = $scope.testinfo[testid].type;
            values['relation'] = $scope.testinfo[testid].relation;
            values['start'] = values['progress'][0] == 1 ? true : false;
            $scope.results[testid] = values;
        })
    }

    $scope.main = function(test){
        if(test.relation=="main" && !$scope.testinfo[test.id].disabled) return true;
        else return false;
    }
    $scope.sub = function(test){
        if($scope.testinfo[test.id].relation=="main" ||  $scope.testinfo[test.id].disabled) return false;
        if($scope.testinfo[test.id].relation=="sub" && !$scope.testinfo[test.id].disabled) return true;
        var check = false;
        var dependencies = $scope.testinfo[test.id].relation.split(",");
        $.each($scope.$storage.tests,function(k,v){
            // check if @link is in dependencies and if not disabled and status is done.
            if(dependencies.indexOf($scope.testinfo[k].link) && !$scope.testinfo[k].disabled && v.status.done) check = true;
        })
        if(check || test.relation=="=") return true;
        else return false;
    }

    $scope.get_results();

    $scope.profile_done = function(){
        gno.put("profile");
        $rootScope.$broadcast("update");
        $timeout(function(){
            $state.go("tests");
        },100);
    }
})

app.controller("resetCtrl", function($rootScope,$state) {
    $rootScope.reset();
})
