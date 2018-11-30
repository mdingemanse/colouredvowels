// orderby filter
app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.directive("store",function(gno){
    return {
        restrict:"A",
        link:function(s,el,a){
            el.click(function(){
                gno.put();
            })
        }
    }
})

app.directive("bgi",function(gno){
    return {
        restrict:"A",
        link:function(s,el,a){
            var setimage = function(){
                if(a.bgi) el.css("background-image","url('"+a.bgi+"')");
            }
            a.$observe("bgi",function(){
                setimage();
            })
            setimage();
        }
    }
})


app.directive("w",function(){
    return {
        restrict:"A",
        scope:{},
        link:function(s,el,a){
            s.setwidth = function(val){$(el).width(val+"%");};
            a.$observe("w",function(val){s.setwidth(val);})
            s.setwidth();
        }
    }
})

app.directive("h",function(){
    return {
        restrict:"A",
        scope:{},
        link:function(s,el,a){
            s.setwidth = function(val){ $(el).height(val+"%");};
            a.$observe("h",function(val){ s.setwidth(val);})
            s.setwidth();
        }
    }
})

app.directive("body",function(){
    return {
        restrict:"E",
        link:function(s,el,a){
            var is_touch_device = 'ontouchstart' in document.documentElement;
            if(is_touch_device){
                el.addClass("touch");
            }
        }
    }
})

//
app.directive("label", function($location,$filter,$compile,$timeout) {
    return {
        restrict: "A",
        scope:{ngModel:"="},
        link: function(s, el, a) {
            s.showhidelabel = function(){
                if(el.val()!="" && s.$eval(a.ngModel)!="") {
                    el.parent().parent().find("label").show();
                    el.parent().parent().find("label.left").hide();
                } else {
                    el.parent().parent().find("label").hide();
                    el.parent().parent().find("label.left").show();
                }
            }
            a.$observe("ngModel",function(val){
                s.showhidelabel();
            })
            s.$watch("ngModel",function(){
                s.showhidelabel();
            })
            el.bind('propertychange keyup paste focus blur', function (blurEvent) {
                s.showhidelabel();
            });
            s.showhidelabel();
        }
    }
});

// autocomplete (+ talen/landen)
app.directive("autocomplete", function($location,$filter,$compile,$timeout) {
    return {
        restrict: "A",
        scope: {model:"="},
        link: function(s, el, a) {

            s.init = function(){
                // set vars
                s.show = false;
                s.active = -1;
                s.template = "<div id='autocomplete'><div id='options' ng-show='show'><div ng-repeat=\"option in options | orderBy : 'key'\" ng-click='set(option.key)' ng-class=\"{'active':$index==active}\">{{option.value}}</div></div></div>";
                s.choices = [];

                // evaluate data attribute
                var choices = s.$eval(a.data);

                // hook for landen + talen
                if(a.model && a.model.match("MOTHERTONGUE")) choices = talen;

                // convert array to object
                s.setchoices(choices);

                // if dropdown
                if(a.autocomplete=="drop"){
                    el.val(s.choices[s.model]);
                } else {
                    el.val(s.model);
                }

                // add autocomplete template
                el.after(s.template);
                $compile(el.next("#autocomplete").contents())(s);
                $timeout(function(){s.showhidelabel()},0);
            }

            s.setchoices = function(choices){
                s.choices = [];
                $.each(choices,function(k,v){ s.choices.push({"key":k+1,"value":v}); });
            }

            a.$observe("data",function(){
                s.refresh();
            })

            s.refresh = function(){
                s.setchoices(s.$eval(a.data));
                s.options = s.choices;
                if(a.autocomplete=="drop"){
                    $.each(s.choices,function(k,v){
                        if(s.model===v.key){
                            el.val(v.value);
                        }
                    })
                } else {
                    el.val(s.choices[s.model]);
                }
            }

            el.bind("focus",function(){
                s.active = -1;
                s.show = true;
                s.$apply();
            })

            el.bind('propertychange keyup paste focus', function (blurEvent) {
                // scroll
                if($("body").hasClass("touch")) $("#gradient").scrollTo($(el),300);
                // show/hide info label
                s.showhidelabel();
                // activate filter
                var filter = el.val();
                if(a.autocomplete=="drop") filter = "";
                s.options = $filter("orderBy")(s.filty(filter),'bylength');
                s.$apply();
            });

            s.$on("update",function(){
                s.apply();
            })

            el.bind("blur",function(){
                $timeout(function(){
                    if(el.val()=="" && el.val()!==0) s.set("");
                    else s.set(el.val());
                    s.active = -1;
                    s.show = false;
                    s.$apply();
                },200);
            })

            // keys (up/down/enter) dropdown menu
            el.on("keydown", function (event) {
                s.show = true;
                if(event.which === 40) {
                    if (s.options && (s.active + 1) < s.options.length) {
                        s.active ++;
                        s.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    s.$apply();
                } else if(event.which == 38) {
                    if (s.active >= 1) {
                        s.active --;
                        s.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if (s.options && s.active >= 0 && s.active < s.options.length) {
                        event.preventDefault();
                        event.stopPropagation();
                        el.parent().find(".active").click();
                        s.show = false;
                        s.$apply();
                    } else {
                        event.preventDefault();
                        event.stopPropagation();
                        s.options = [];
                        s.$apply();
                    }

                } else if (event.which == 27) {
                    s.options = [];
                    s.showDropdown = false;
                    s.$apply();
                } else if (event.which == 8) {
                    s.selectedObject = null;
                    s.$apply();
                }
            });

            s.set = function(key){
                var vv = key;
                $.each(s.options,function(k,v){
                    if(v.key===key){
                        vv = v.value;
                    }
                })
                if(a.ngModel) s.ngModel = vv;
                else el.val(vv);
                s.apply();
                s.showhidelabel();
                $timeout(function(){s.$apply()},0);
            }

            s.apply = function(){
                if(el.is(":visible")){
                    if(a.autocomplete=="drop") {
                        if(el.val()==="") {
                            s.model = "";
                        } else {
                            $.each(s.options,function(k,v){
                                if(v.value===el.val()){
                                    s.model = v.key;
                                }
                            })
                        }
                        // s.model = s.options.indexOf(el.val());
                    } else {
                        s.model = el.val();
                    }
                }
            }

            // simple show hide label
            s.showhidelabel = function(){
                if(el.val()!="" && s.$eval(a.ngModel)!="") {
                    el.parent().parent().find("label").show();
                    el.parent().parent().find("label.left").hide();
                } else {
                    el.parent().parent().find("label").hide();
                    el.parent().parent().find("label.left").show();
                }
            }

            // filters
            s.filty = function(filter){
                var re = new RegExp("^"+filter+".*","i");
                var results = [];
                $.each(s.choices,function(k,v){
                    if(v.value.match(re)){ results.push(v);}
                })
                return results;
            }
            s.bylength = function(a){
                return a.length;
            }

            s.init();
        }
    }
})

// app.directive("buffer", function($timeout) {
//     return {
//         restrict: "A",
//         scope: {model:"="},
//         link: function(s, el, a) {
//             s.$on("update",function(){
//                 s.apply();
//             })
//             s.apply = function(){
//                 s.model = el.val();
//                 $timeout(function(){s.$apply()},0);
//             }
//             s.$watch("model",function(val){
//                 el.val(val);
//             })
//         }
//     }
// });

// reload css
app.directive("link", function($timeout) {
    return {
        restrict: "E",
        link: function(s, el, a) {
            $(window).bind("keydown", function(e) {
                if (e.keyCode == "82" && el.attr("href").match("_main") && !e.metaKey && $("input:focus,textarea:focus").length < 1) {
                    var rand = Math.random(0, 999999999);
                    $("body").addClass("reloadcss");
                    el.attr("href", el.attr("href").split("?")[0] + "?" + rand);
                    $timeout(function() {
                        $("body").removeClass("reloadcss");
                    }, 100);
                }
            })
        }
    }
})

// compile html content
app.directive("compile", function($compile,$rootScope) {
    return {
        restrict: 'A',
        link: function(s, el, a) {
            s.$watch(a.compile, function(html) {
                el.html(html);
                $compile(el.contents())(s);
                $rootScope.$broadcast("compiled");
            });
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
            el.click(function(){
                el.addClass("loading");
            })
        }
    }
})

app.directive("hideintro", function($localStorage) {
    return {
        restrict: "A",
        link: function(s, el, a) {
            // $localStorage.settings.nointro = true;
            el.click(function(e){
                e.preventDefault();
                e.stopPropagation();
                $localStorage.settings = $localStorage.settings ? $localStorage.settings : {"nointro":false};
                $localStorage.settings.nointro = true;
                s.$apply();
            })
        }
    }
})

// load test icon
app.directive("icon", function($timeout) {
    return {
        restrict: "A",
        link: function(s, el, a) {
            s.set = function(){
                var testID = a.icon;
                if(testinfo[testID]){
                    var im1 = new Image();
                    var im2 = new Image();
                    im1.src = testinfo[testID]['icons'][0];
                    im2.src = testinfo[testID]['icons'][1];
                    el.css("background-image","url('"+testinfo[testID]['icons'][0]+"')");
                    el.parent().hover(function(){
                        el.css("background-image","url('"+testinfo[testID]['icons'][1]+"')");
                    },function(){
                        el.css("background-image","url('"+testinfo[testID]['icons'][0]+"')");
                    })
                }
            }
            a.$observe("icon",s.set);
            s.set();
        }
    }
})

app.directive("loading", function($rootScope, $interval, $timeout) {
    return {
        restrict: "A",
        scope: {},
        template: "<i ng-repeat='n in range' ng-style=\"{left:(n/(size-1))*100+'%'}\"></i>",
        link: function(s, el, a) {
            s.size = 7;
            s.time = 100;
            s.now = 0;
            s.range = [];
            for (i = 0; i < s.size; i++) s.range.push(i);
            $interval(function() {
                s.now = (s.now + 1) % s.size;
                s.prev = s.now - 2 % s.size;
                el.find("i:eq(" + s.now + ")").addClass("active");
                el.find("i:eq(" + s.prev + ")").removeClass("active");
            }, s.time)
        }
    }
})


app.directive("next", function($rootScope,$timeout) {
    return {
        restrict: 'A',
        link: function(s, el, a) {
            el.click(function(){
                s.gonext();
            })
            $(window).on("keydown",function(e){
                if(e.keyCode=="13" && s.testid!=="klankenbetekenis") s.gonext();
            })
            s.gonext = function(){
                if(!el.hasClass("disabled")){
                    if(s.q) {
                        s.q.done = true;
                        s.q.timing = new Date().getTime() - $rootScope.time;
                    }
                    // console.log("reset time next directive",new Date().getTime());
                    $rootScope.$broadcast("startupdate");
                    $timeout(function(){
                        $rootScope.time = new Date().getTime();
                        $rootScope.$broadcast("next");
                    },50);
                }
            }
            el.append("<i></i>");
        }
    }
});

app.directive("disable", function($rootScope, $interval, $timeout) {
    return {
        restrict: "A",
        link: function(s, el, a) {
            a.$observe("disable",function(val){
                if(!val || val==="false"){
                    el.addClass("disabled");
                } else {
                    el.removeClass("disabled");
                }
            })
        }
    }
})


app.directive("help", function($rootScope,$timeout) {
    return {
        restrict: 'A',
        link: function(s, el, a) {
            el.click(function(){
                $(el).closest("#frame").addClass("hide");
                $timeout(function(){
                    $(el).closest("#frame").remove();
                    // console.log("reset time help",new Date().getTime());
                    $rootScope.time = new Date().getTime();
                    $rootScope.$broadcast("start");
                },300);
            })
        }
    }
})

app.directive("destroy", function($rootScope,$timeout) {
    return {
        restrict: 'A',
        link: function(s, el, a) {
            s.$on("next",function(){
                destroy();
            })
            a.$observe("destroy",function(){
                destroy();
            })
            s.$on("start",function(){
                destroy();
            })
            var destroy = function(){
                if(s.$eval(a.destroy)){
                    el.remove();
                }
            }
        }
    }
})

app.directive("ok", function($localStorage) {
    return {
        restrict: 'A',
        link: function(s, el, a) {
            el.click(function(){
                s.$storage.settings = s.$storage.settings || {};
                s.$storage.settings.hideprofileintro = "true";
                el.parent().remove();
                // console.log($localStorage);
            })
        }
    }
})


app.directive("after",function($rootScope,$timeout){
    return {
        restrict:"A",
        link:function(s,el,a){
            el.hide();
        }
    }
})

app.directive("progress",function(gno,$localStorage,$timeout){
    return {
        restrict:"A",
        template:"<div id='bar' ng-style=\"{width:(k/questions.length)*100+'%'}\"></div><span>{{k-1}}/{{questions.length}}</span>",
        link:function(s,el,a){
            s.update = function(){

            }
            s.$on("update",function(){
                s.update();
            })
            s.update();
        }
    }
})

app.directive("choose", function($localStorage,$timeout,$parse){
    return {
        restrict: "A",
        template:"<div ng-repeat='(k,option) in options' ng-click='select(option)' ng-class=\"{'selected':option.key==state}\"><span ng-bind='option.value'></span></div>",
        scope:{},
        link: function(s,el,a){

            s.init = function(){
                s.ngModel = s.$parent.$eval(a.ngModel);
                if(s.ngModel!="" && s.ngModel!=undefined){
                    s.state = JSON.parse(JSON.stringify(s.ngModel));
                }
                if(a.choose){
                    s.state = "";
                    var raw = s.$eval(a.choose);
                    var opties = [];
                    if(raw){
                        $.each(raw, function(k,v){
                            opties.push(JSON.parse("{\"key\":\""+k+"\",\"value\":\""+v+"\"}"));
                        })
                    }
                    if(a.type=="random"){
                        s.options = s.shuffle(opties);
                    } else {
                        s.options = opties;
                    }
                }
            }


            s.shuffle = function(o){
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            a.$observe("choose",function(){
                s.init();
            })

            s.$watch("ngModel",function(){
                s.init();
            })

            s.select = function(option){
                s.state = option.key;
                s.$parent.tempstate = s.state;
                s.ngModel = s.state;
                s.$parent.$eval(a.ngModel+"="+s.state);
            }
            s.apply = function(){
                // s.ngModel = s.state;
            }
        }
    }
})

app.directive("drop", function($timeout){
    return {
        restrict: "A",
        template:"<div id='selected' ng-bind='selected()'></div><i></i><div id='dropdown' ng-class=\"{'open':open}\"><div ng-repeat='(k,option) in options' ng-bind='option.value' ng-click='select(option)' ng-class=\"{'selected':option.key==state}\" id='option'></div></div>",
        scope:{"ngModel":"="},
        link: function(s,el,a){

            if(s.ngModel!="" && s.ngModel!=undefined){
                s.state = JSON.parse(JSON.stringify(s.ngModel));
                $timeout(function(){s.$apply()},0);
            }
            s.shuffle = function(o){
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            s.selected = function(){
                return s.options[s.state] ? s.options[s.state].value : "";
            }
            a.$observe("drop",function(val){
                var raw = s.$eval(val);
                var opties = [];
                $.each(raw, function(k,v){
                    opties.push(JSON.parse("{\"key\":\""+k+"\",\"value\":\""+v+"\"}"));
                })
                if(a.type=="random"){
                    s.options = s.shuffle(opties);
                } else {
                    s.options = opties;
                }
                $timeout(function(){s.$apply()},0);
            })

            el.click(function(evt){
                s.open = !s.open;
                evt.stopPropagation();
                s.$apply();
            });

            $(window).on("click",function(){
                s.open = false;
                $timeout(function(){s.$apply()},0);
            })

            s.select = function(option){
                s.state = option.key;
                s.$parent.tempstate = s.state;
            }
            s.apply = function(){
                s.ngModel = s.state;
            }
        }
    }
})

// animate #frame

app.directive("animate",function($timeout){
    return {
        restrict:"A",
        link:function(s,el,a){
            s.$on("startupdate",function(){
                el.addClass("move");
            })
            s.$on("update",function(){
                $timeout(function(){
                    el.removeClass("move");
                },100);
            })
        }
    }
})

app.directive("square",function(){
    return {
        restrict:"A",
        link:function(s,el,a){
            s.update = function(){
                var h = el.parent().height();
                var w = el.parent().width();
                if(h>w){
                    el.height(w);
                    el.width(w);
                } else {
                    el.width(h);
                    el.height(h);
                }
            }
            $(window).resize(function(){
                s.update();
            })
            s.update();
        }
    }
})

// info page menu

app.directive("koppen",function($rootScope,$timeout){
    return {
        restrict:"A",
        template:"<div id='in' ng-class=\"{'open':$root.aboutmenu}\"><a href='tests' id='logo'>Return to tests</a><div id='burger' ng-click=\"$root.aboutmenu=!$root.aboutmenu\"><i></i></div><div id='omkop'><div id='kop' ng-repeat='(k,kop) in koppen' ng-click='skrolto(k)' ng-class=\"{'active':k==n}\">{{kop}}</div></div><div id='line'></div></div>",
        link:function(s,el,a){
            s.n = 0;
            $rootScope.aboutmenu = false;
            s.$watch("html",function(){
                s.koppen = [];
                $timeout(function(){
                    el.next().find("h1").each(function(k,v){
                        s.koppen[k] = $(v).text();
                    })
                    $timeout(function(){
                        s.position();
                    },0);
                },0)
            })
            s.skrolto = function(kop){
                $rootScope.aboutmenu = false;
                var offset = -300;
                if($("section").width()<700){
                    offset = -100;
                }
                $("#gradient").scrollTo($("h1:eq("+kop+")"),100,{offset:offset});
            }
            $("#gradient").bind("scroll",function(evt){
                var top = $(window).scrollTop();
                $("h1").each(function(k,v){
                    if($(this).offset().top<top+250){
                        s.n = k;
                    };
                });
                s.$apply();
            })
            s.position = function(){
                var w = $("#text p").width();
                var ww = $(window).width();
                if(ww>1200){
                    var nw = (((ww-w)/2)-$(el).width())/2;
                    // $(el).css({"marginRight":nw+"px"});
                } else {
                    // $(el).css({"marginRight":""});
                }
            }
            $(window).resize(function(){s.position()});
        }
    }
})

// profile

app.directive("email",function($timeout){
    return {
        restrict:"A",
        link:function(s,el,a){

            var check_email = function(){
                if(el.hasClass("ng-valid") && el.val()!=""){
                    el.parent().parent().next("div").show();
                } else {
                    el.parent().parent().next("div").hide();
                }
            }
            s.$watch(function() {
              return el.attr('class');
            }, function(newValue, oldValue) {
              if (newValue !== oldValue) { // Values will be equal on initialization
                check_email()
              }
            });
            a.$observe("ngModel",function(){
                $timeout(function(){check_email()},0);
            });

            el.bind('propertychange keyup paste focus',function(){
                check_email();
            })

            check_email();
        }
    }
})