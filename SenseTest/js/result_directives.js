app.directive('japanresult',function(){
    return {
        restrict:"A",
        link:function(s,el,a){
            s.get_result = function(){
                var done = 0;
                var total = s.$storage.tests.japans.questions.length;
                $.each(s.$storage.tests.japans.questions,function(k,v){
                    if(v.choice==0) done = done+1;
                })
                s.result = done > 0 ? parseInt((done/total)*100) : 0;
            }
            s.get_result();
            a.$observe("class",function(){
                if(el.hasClass("open")){
                    s.get_result();
                }
            })
        }
    }
})

app.directive("colorhue",function($localStorage){
    return {
        restrict:"A",
        template:"<div id='hue'><div id='bg' class='sp-hue'></div><div ng-repeat='s in spread track by $index' id='letter' ng-style='{left:s.pos}'><i>{{s.symbol}}</i></div></div>",
        scope:{},
        link:function(s,el,a){
            s.testid = a.colorhue;
            s.$storage = $localStorage;
            s.t = s.$storage.tests[s.testid];
            s.spread = [];
            $.each(s.t.questions,function(k,v){
                var n = {};
                n.pos = v.color ? rgb2hsl(hex2rgb(v.color))[0]*100+"%" : "";
                n.symbol = v.symbol;
                s.spread.push(n);
            })

        }
    }
})

app.directive("colorpos",function($localStorage){
    return {
        restrict:"A",
        template:"<div id='in'><div ng-repeat='s in spread track by $index' id='letter' ng-style='{left:pos(s.hsl[0]),top:pos(s.hsl[1],true)}'><i ng-style=\"{background:s.c}\">{{s.symbol}}</i></div></div>",
        scope:{},
        link:function(s,el,a){
            s.testid = a.colorpos;
            s.$storage = $localStorage;
            s.t = s.$storage.tests[s.testid];
            s.spread = [];
            $.each(s.t.questions,function(k,v){
                var n = {};
                n.c = "#"+v.color;
                n.hsl = v.color ? rgb2hsl(hex2rgb(v.color)) : [0,0,0];
                n.symbol = v.symbol;
                s.spread.push(n);
            })
            s.pos = function(val,check){
                if(check) return (100-(val*100))+"%";
                return (val*100)+"%";
            }
        }
    }
})

app.directive("colorbar",function($localStorage){
    return {
        restrict:"A",
        template:"<div id='in'><div ng-repeat=\"s in spread | orderObjectBy:'color'\" id='letter' ng-style=\"{width:(100/spread.length)+'%'}\"><i ng-style=\"{background:'#'+s.color}\">{{s.symbol}}</i></div></div>",
        scope:{},
        link:function(s,el,a){
            s.testid = a.colorbar;
            s.$storage = $localStorage;
            s.t = s.$storage.tests[s.testid];
            s.spread = [];
            $.each(s.t.questions,function(k,v){
                var n = {};
                var split = 12;
                n.c = "#"+v.color;
                n.rgb = v.color ? hex2rgb(v.color) : [0,0,0];
                n.hsl = rgb2hsl(n.rgb);
                n.symbol = v.symbol;
                n.hh = n.hsl[1]<0.2 ? false : parseInt(n.hsl[0]*split);
                n.hhh = hsl2rgb((n.hh/split),1,.5);
                n.color = rgb2hex("rgb("+n.hhh[0]+","+n.hhh[1]+","+n.hhh[2]+")");
                s.spread.push(n);
            })
            s.pos = function(val,check){
                if(check) return (100-(val*100))+"%";
                return (val*100)+"%";
            }
        }
    }
})

app.directive("symbols",function($localStorage){
    return {
        restrict:"A",
        template:"<div id='in'><div ng-repeat='s in spread track by $index' id='letter' ng-style=\"{background:s.c}\"><i>{{s.symbol}}</i></div></div>",
        scope:{},
        link:function(s,el,a){
            s.testid = a.symbols;
            s.$storage = $localStorage;
            s.t = s.$storage.tests[s.testid];
            s.spread = [];
            $.each(s.t.questions,function(k,v){
                var n = {};
                n.c = "#"+v.color;
                n.hsl = v.color ? rgb2hsl(hex2rgb(v.color)) : [0,0,0];
                n.symbol = v.symbol;
                s.spread.push(n);
            })
            s.pos = function(val,check){
                if(check) return (100-(val*100))+"%";
                return (val*100)+"%";
            }
        }
    }
})

app.directive("consistency",function($localStorage,$timeout){
    return {
        restrict:"A",
        templateUrl:"templates/consistency",
        scope:{},
        link:function(s,el,a){
            // set vars
            s.spread = {};
            // get values
            s.testid = a.consistency;
            s.$storage = $localStorage;
            s.t = s.$storage.tests[s.testid];

            s.open = false;

            s.init = function(){
                // loop questions
                $.each(s.t.questions,function(k,v){

                    // set spread combined by letter

                    var type = a.type ? a.type : "symbol";

                    s.spread[v[type]] = s.spread[v[type]] ? s.spread[v[type]] : {};
                    s.spread[v[type]].colors = s.spread[v[type]].colors ? s.spread[v[type]].colors : [];
                    s.spread[v[type]].colors.push(v.color);

                })

                var calc = [];
                var total = 0;
                $.each(s.spread,function(k,v){
                    var d = s.distance(v.colors);
                    var distance = d ? (5-d[3])*20 : false;
                    if(distance){
                        v.distance = parseInt(distance);
                        calc.push(distance);
                        total = total+distance;
                    }
                })
                s.percentage = parseInt(total/calc.length);
                $timeout(function(){s.$apply()},0);
            };

            s.distance = function(colors){

                if(colors[0] && colors[1] && colors[2]){
                    var c1 = rgb0(hex2rgb(colors[0])); // convert hex to list of [0.0 - 1.0] rgb values
                    var c2 = rgb0(hex2rgb(colors[1])); // convert hex to list of [0.0 - 1.0] rgb values
                    var c3 = rgb0(hex2rgb(colors[2])); // convert hex to list of [0.0 - 1.0] rgb values
                    var r = Math.abs(c1[0]-c2[0]) + Math.abs(c2[0]-c3[0]) + Math.abs(c3[0]-c1[0]);
                    var g = Math.abs(c1[1]-c2[1]) + Math.abs(c2[1]-c3[1]) + Math.abs(c3[1]-c1[1]);
                    var b = Math.abs(c1[2]-c2[2]) + Math.abs(c2[2]-c3[2]) + Math.abs(c3[2]-c1[2]);
                    return [r,g,b,(r+g+b)];
                } else {
                    return false;
                }

            }

            s.init();
        }
    }
})

app.directive("percentage",function($localStorage,$timeout){
    return {
        restrict:"A",
        template:"<div id='perc' ng-show='pshow'><span>{{pp}}</span><div id='bar' ng-style='{width:pp}'></div></div><span ng-hide='pshow'>Het lijkt erop dat je overal <i>geen kleur</i> hebt ingevuld. Helaas kunnen we daardoor geen score berekenen.</span>",
        link:function(s,el,a){
            s.create = function(val){
                if(val==="NaN" || !val) s.pp = "geen score", s.pshow = false;
                else s.pp = val+"%",s.pshow = true;
            }
            a.$observe("percentage",function(val){
                s.create(val);
            })
        }
    }
})
