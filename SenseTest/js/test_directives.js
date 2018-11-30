
app.directive("soundfile", function($timeout,$rootScope) {
    return {
        restrict: "A",
        template: "<div id='play' ng-class='klas'></div>",
        scope: {},
        link: function(s, el, a) {

            s.sound = false;

            s.setklas = function() {
                var classes = {
                    4: "loading",
                    0: "stopped",
                    1: "playing",
                    2: "paused"
                };
                s.klas = classes[s.state];
                $timeout(function() {
                    s.$apply()
                }, 0);
            }

            s.setstate = function(state) {
                s.state = state;
                // send audiostate for update!
                $rootScope.$broadcast("audiostate",state);
                $timeout(function() {
                    s.$apply()
                }, 0);
            }

            s.create_sound = function(){
                if(a.soundfile){
                    if(!a.soundfile.match('undefined')){
                        s.sound = soundManager.createSound({
                            url: a.soundfile,
                            stream: true,
                            autoload: true,
                            autoPlay: false,
                            onpause: function() {
                                s.setstate(2);
                            },
                            onresume: function() {
                                s.setstate(1);
                            },
                            onstart: function() {
                                s.setstate(1);
                            },
                            onstop: function() {
                                s.setstate(0);
                            },
                            onload: function() {
                                s.setstate(0);
                                $rootScope.$broadcast("audio_loaded");
                            },
                            whileloading: function() {},
                            onfinish: function() {
                                s.setstate(0);
                                $rootScope.$broadcast("audio_finished");
                            },
                            whileplaying: function() {
                                s.setstate(1);
                            }
                        }).load();
                    }
                }
            }

            s.setstate(4);
            s.setklas();

            s.$on('$destroy', function(ev,soundfile){
                if(soundfile!=a.soundfile && s.sound) s.sound.stop();
            })

            s.$watch("state", function() {
                s.setklas();
            })

            a.$observe('soundfile',function(val){
                // create on load + change
                s.soundfile = val;
                if(s.sound) s.sound.destruct();
                s.setstate(4);
                s.create_sound();
            })

            el.click(function(evt){
                if(!s.sound) s.create_sound();
                if (s.sound && s.state > 0) s.sound.togglePause();
                if (s.sound && s.state === 0) s.sound.play();

                if($("*[soundfile]").length>1){
                    $rootScope.$broadcast("$destroy",a.soundfile);
                }
            })


        }
    }
})

app.directive('color', function($timeout,$localStorage,$rootScope,$timeout) {
    return {
        templateUrl: "templates/color",
        link: function(scope, element, attrs) {

            scope.data = scope.$eval(attrs.ngModel);

            scope.enable = function(){
                // console.log("enabled:",scope.data.enabled,scope.audio_finished);
                if(scope.data && scope.data.enabled && scope.audio_finished) return true;
                if(scope.data && scope.data.enabled && attrs.color!=="sound") return true;
                return false;
            }

            scope.$on("update",function(){
                scope.kleuren = scope.shuffle(scope.kleuren);
                scope.offset = Math.random(0);
                $timeout(function(){
                    var w = element.find("*[hue] #hue").width();
                    element.find("*[hue] #hue #img").css("background-position",(scope.offset*w)+"px 0px");
                },10);

                scope.color = "";
                scope.data = scope.$eval(attrs.ngModel);
            })

            scope.kleuren = ["#fcd731","#d80916","#915311","#a1d255","#e26c22","#92173d","#136825","#4db2fc","#083d8a","#6b3497","#0e6b78","#f373aa","#ffffff","#cbcbcb","#595959","#000000"];

            scope.$watch("data.color",function(val){
                scope.color = hex2rgb(val,true);
            })

            // functions

            scope.shuffle = function(o){
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            scope.kleuren = scope.shuffle(scope.kleuren);

            scope.setcolor = function(color,k,spectrumloop){
                scope.data.position = k;
                scope.data.enabled = "true";
                if(color && color!="nocolor"){
                    var rgb = hex2rgb(color);
                    scope.color = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
                } else {
                    scope.color = "nocolor";
                }
                $timeout(function(){scope.$apply()},0);
            }

            scope.apply = function(){
                if(scope.color && scope.color!='nocolor'){
                    scope.data.color = rgb2hex(scope.color);
                } else {
                    scope.data.color = "nocolor";
                }
            }

            scope.$on("startupdate",function(){
                scope.apply();
            })


            if(attrs.color!="sound"){
                scope.audioklas = "hide";
            } else {
                scope.audioklas = 'show';
                scope.$on("audiostate",function(a,state){
                    if(state==4) scope.audioklas = 'show';
                })

                scope.$on("audio_loaded",function(a,state){
                    $timeout(function(){
                        if(!$("body").hasClass("touch")){
                            element.find("*[soundfile]").click();
                        }
                        // console.log("reset time $on audio_loaded",new Date().getTime());
                        $rootScope.time = new Date().getTime();
                        scope.audioklas = 'hide';
                        $timeout(function(){scope.$apply()},0);
                    },500);
                });
            }
            scope.$watch("q",function(){
                if($("body").hasClass("touch")){
                    $timeout(function(){
                        scope.audioklas = 'hide';
                        scope.$apply()
                    },100);
                };
            })
        }
    }
});

app.directive('hue', function($timeout){
    return {
        restrict: "A",
        link: function(s,el,a){

            var huemouse = false;
            var lightmouse = false;

            var huesat = el.find("#hue");
            var huesathandle = el.find("#hue #handle");
            var lightness = el.find("#lightness");
            var lightnesshandle = el.find("#lightness #handle");

            s.$on("update",function(){
                var l = Math.random()*100+"%";
                var t = Math.random()*100+"%";
                huesathandle.css({"top":t,"left":l});
                lightnesshandle.css("left","50%");
                s.huebackground = "#"+hsl2hex(0,0,0.5);
                s.hueopacity = 1;
            })
            huesat.bind("mousedown touchstart",function(ev){
                if(ev && ev.type.match("touch")) ev = ev.originalEvent.touches[0];
                huemouse = true;
                s.prepsethuesat(ev);
            })
            lightness.bind("mousedown touchstart",function(ev){
                if(ev && ev.type.match("touch")) ev = ev.originalEvent.touches[0];
                lightmouse = true;
                s.prepsetlight(ev);
            })
            $(window).bind("mouseup touchend",function(ev){
                huemouse = false;
                lightmouse = false;
            })
            $(window).bind("mousemove touchmove",function(ev){
                if(ev && ev.type.match("touch")) ev = ev.originalEvent.touches[0];
                if(huemouse || ev && ev.type && ev.type.match("touch")){
                    s.prepsethuesat(ev);
                }
                if(lightmouse || ev && ev.type && ev.type.match("touch")){
                    s.prepsetlight(ev);
                }
            })
            s.prepsethuesat = function(ev){
                var l = huesat.offset().left;
                var t = huesat.offset().top;
                var w = huesat.width();
                var h = huesat.height();
                s.sethuesat(s.clip((ev.pageX-l)/w,0,1),s.clip((ev.pageY-t)/h,0,1));
            }
            s.prepsetlight = function(ev){
                var l = lightness.offset().left;
                var w = lightness.width();
                s.setlight(s.clip((ev.pageX-l)/w,0,1));
            }
            s.sethuesat = function(hue,sat){
                huesathandle.css({"top":sat*100+"%","left":hue*100+"%"});
                sat = 1-sat;
                var l = lightnesshandle.css("left").replace("px","")/lightness.width();
                hue = ((hue-s.offset)+1.0)%1.0;
                s.setcolor(hsl2hex(hue,sat,l));
                s.huebackground = "#"+hsl2hex(0,0,l);
                s.hueopacity = 1.0-Math.abs((-1+(l*2.0))%1.0001)
            }
            s.setlight = function(lightness){
                lightnesshandle.css("left",lightness*100+"%");
                var sat = 1-(huesathandle.css("top").replace("px","")/huesat.height());
                var hue = huesathandle.css("left").replace("px","")/huesat.width();
                hue = ((hue-s.offset)+1.0)%1.0;
                s.setcolor(hsl2hex(hue,sat,lightness));
                s.huebackground = "#"+hsl2hex(0,0,lightness);
                s.hueopacity = 1.0-Math.abs((-1+(lightness*2.0))%1.0001)
            }
            s.clip = function(num,min,max){
                if(num<min) return min;
                if(num>max) return max;
                return num;
            }
        }
    }
})

app.directive('testsound', function($timeout,$rootScope) {
    return {
        templateUrl:"templates/testsound",
        scope:{},
        link: function(s, el, a) {
            if(a.testsound=="false"){
                s.bottom = true;
            }
            s.$watch("sound",function(val){
                if(val==1) {
                    $(el).closest("#frame").addClass("hide");
                    $timeout(function(){
                        $(el).closest("#frame").remove();
                        // console.log("reset time testsound",new Date().getTime());
                        $rootScope.time = new Date().getTime();
                        $rootScope.$broadcast("start");
                    },300);
                }
            })
        }
    };
});

app.directive("soundfile",function($timeout, $rootScope){
    return {
        restrict:"A",
        link:function(s,el,a){
            s.time = $timeout(function(){},0);

            s.$watch("audio_finished",function(val){
                if(val!=s.audio_finished_temp){
                    // console.log("reset time audio_finished",new Date().getTime());
                    $rootScope.time = new Date().getTime();
                }
                s.audio_finished_temp = val;
            })

            s.$on("startupdate",function(){
                $timeout.cancel(s.time);
                s.audio_finished = false;
                $timeout(function(){
                    s.$apply();
                },0)
            })
            s.$watch("k",function(){
                $timeout.cancel(s.time);
                s.audio_finished = false;
                s.time = $timeout(function(){
                    s.audio_finished = true;
                    $timeout(function(){
                        s.$apply();
                    },0)
                },4000);
            })

            s.$on("audio_finished",function(){
                s.audio_finished = true;
                $timeout(function(){
                    s.$apply();
                },0)
            })

        }
    }
})

// klank en vorm

app.directive("klankenvorm",function($rootScope,$localStorage,$timeout){
    return {
        restrict:"A",
        templateUrl:"templates/klankenvorm",
        link:function(s,el,a){

            s.audioklas = 'show';

            s.add_images_to_questions = function(){

                var images = s.testinfo[s.testid].imagefiles;

                s.pointyfiles = [];
                s.roundfiles = [];
                $.each(images,function(k,v){
                    if(v[0]=="P") s.pointyfiles.push(v);
                    if(v[0]=="R") s.roundfiles.push(v);
                })

                $.each(s.questions,function(k,v){
                    var p = s.pointyfiles;
                    var r = s.roundfiles;
                    // avoid repetition
                    if(s.questions[k-1]){
                        var left = s.questions[k-1].leftimage;
                        var right = s.questions[k-1].rightimage;
                        var pi = p.indexOf(left) || p.indexOf(right)
                        p.splice(pi,1);
                        var ri = r.indexOf(left) || r.indexOf(right)
                        r.splice(ri,1);
                    }
                    // set random image
                    var random = [];
                    var pr = p[Math.floor(Math.random()*p.length)];
                    var rr = r[Math.floor(Math.random()*r.length)];
                    var lrr = Math.floor(Math.random()*2);

                    v.leftimage = lrr ? pr : rr;
                    v.rightimage = lrr ? rr : pr;
                })

                s.$storage.tests[s.testid].questions = s.questions;

            }

            if(s.questions && s.questions.length>0){
                console.log("questions already set");
                s.add_images_to_questions();
            } else {
                s.$on("questions_loaded",function(){
                    s.add_images_to_questions();
                    console.log("questions loaded: add images to questions()");
                })
            }

            s.$on("audiostate",function(a,state){
                if(state==4) s.audioklas = 'show';
            })

            s.$on("audio_loaded",function(a,state){
                $timeout(function(){
                    if(!$("body").hasClass("touch")){
                        el.find("#bottom button").click();
                    }
                    $rootScope.time = new Date().getTime();
                    s.audioklas = 'hide';
                    $timeout(function(){s.$apply()},0);
                },500);
            });

            s.$watch("q",function(){
                if($("body").hasClass("touch")){
                    $timeout(function(){
                        s.audioklas = 'hide';
                        s.$apply()
                    },100);
                };
            })
        }
    }
})

// klank en betekenis

app.directive("japans",function($rootScope,$localStorage,$timeout,$compile){
    return {
        restrict:"A",
        link:function(s,el,a){

            s.audioklas = 'show';

            s.templatesound = "<div soundfile=\"{{getfolder('mp3',q.file)}}\"></div>";
            s.templateword = "<div ng-bind='q.word' id='word'></div>";

            s.$on("startupdate",function(){
                s.audioklas = 'show';
                s.$apply();
            })

            s.$on("audiostate",function(a,state){
                if(state==4) s.audioklas = 'show';
            })

            s.$on("audio_loaded",function(a,state){
                $timeout(function(){
                    if(s.params.SOUND && !$("body").hasClass("touch")){
                        el.find("*[soundfile]").click();
                    } else {
                        $rootScope.$broadcast("audio_finished");
                    }
                    $rootScope.time = new Date().getTime();
                    s.audioklas = 'hide';
                    s.$apply();
                    // $timeout(function(){s.$apply()},0);
                },500);
            });
            s.$watch("q",function(){
                if($("body").hasClass("touch")){
                    $timeout(function(){
                        s.audioklas = 'hide';
                        s.$apply()
                    },100);
                };
            })
        }
    }
})

app.directive("klankenbetekenisresults",function($timeout){
    return {
        restrict:"A",
        template:"<div percentage='{{percentage}}'></div>",
        link:function(s,el,a){
            var correct = 0;
            $.each(s.$storage.tests.klankenbetekenis.questions,function(k,v){
                if(v.choice==0) correct++;
            })
            s.percentage = parseInt((correct/s.$storage.tests.klankenbetekenis.questions.length)*100);
            s.percentage = 86;
            $timeout(function(){s.$apply()},0);
        }
    }
})

app.directive("splitcolors",function(){
    return {
        restrict:"A",
        link:function(s,el,a){
            var colors = s.$eval(a.splitcolors);
            el.parent().hover(function(){
                var d = 20;
                var shadows = [];
                if(colors){
                    $.each(colors,function(k,color){
                        var dd = (k-1)*d;
                        var rgb = hex2rgb(color);
                        shadows.push(""+dd+"px 0 0 rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.8)");
                    })
                }
                el.css({"text-shadow":shadows.join(","),"color":"rgba(0,0,0,0)"});
            },function(){
                el.css({"text-shadow":"none","color":"#555"});
            })
        }
    }
})
