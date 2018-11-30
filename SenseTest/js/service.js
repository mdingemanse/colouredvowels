app.service("gno", function($localStorage,$http,$q,$timeout) {

    var self = this;

    self.$storage = $localStorage.$default(JSON.parse(JSON.stringify(defaultstorage)));

    // console.log(this.$storage);

    this.get_random_set_questions = function(testid){

        var qq = $q.defer();

        var questions = self.$storage.tests[testid].questions;

        // check if a question is done (test already started)
        if(questions && questions.length>0){
            var check = false;
            $.each(questions,function(k,v){ if(v.done) check = true; })
        }

        if(check) { // return same questions if already started
            qq.resolve(questions);
        } else { // get random set of questions
            $http.get("api/questions/"+testid).then(function(data){
                var data = data.data
                self.$storage.tests[testid].setname = data.name;
                self.$storage.tests[testid].questions = data.questions;
                qq.resolve(data);
            })
        }

        return qq.promise;
    }

    this.check_profile = function(){
        var count = 0;
        var total = 0;
        $.each(self.$storage.profile,function(k,v){
            if(k!="PROFILEID"){
                total = total+1;
                if(v!=="" && v!=-1){
                    count = count+1;
                }
            }
        })
        if(count===total) return false;
        return count;
    }

    this.check_storage_empty = function(){
        var check = true;
        if(!self.check_profile()){
            $.each(self.$storage.tests,function(testid,content){
                if(!content.status.done && content.questions){
                    $.each(content.questions,function(k,v){
                        if(v && v.done) check = false;
                    })
                }
            })
        }
        return check;
    }

    this.check = function(testid){
        // console.log("check",testid);
        var check = true;
        $.each(this.$storage.tests[testid]['questions'],function(k,v){
            if(v && !v.done && v.done!=true) check = false;
        })
        if(check) this.$storage.tests[testid].status.done = true;
        else this.$storage.tests[testid].status.done = false;
        return check;
    }

    this.test_class = function(testid){
        if(testid && self.$storage.tests[testid]){
            var test = self.$storage.tests[testid];
            var classes = [];
            if(self.$storage.tests[testid].status.done){
                classes.push("done");
            }
            if(test.relation){
                if(test.relation[0]==">"){
                    var rel = test.relation.replace(">","");
                    rel = rel.replace(" ","");
                    if(!self.$storage.tests[rel].status.done) classes.push("hide");
                } else {
                    if(self.$storage.tests[test.relation] && !self.$storage.tests[test.relation].status.done) classes.push("disabled");
                }
            }
            return classes;
        } else {
            return "";
        }
    }

    this.progress = function(testid){
        var done = 0;
        var total = this.$storage.tests[testid].questions? this.$storage.tests[testid].questions.length : 0;
        if(total){
            $.each(this.$storage.tests[testid].questions,function(k,v){
                if(v && v.done) done = done+1;
            })
            done = done+1;
            if(done>total) done = total;
            return [done,total];
        } else {
            return false
        }
    }

    this.put = function(testid){

        if(testid != "profile"){
            if(!testid || self.$storage.tests[testid].status.stored) return false;
        }

        /* send data to server */

        var data = {};
        if(testid == "profile") data = self.$storage.profile;
        else data = self.$storage.tests[testid];

        // console.log("send to server: ",data);

        $timeout(function(){
            $http.post("api/put/"+testid+"/"+self.$storage.profile.PROFILEID,data).then(function(data){
                var data = data.data
                // send complete profile if profileID is empty
                if(data.PROFILEID && self.$storage.profile==="" && !data.updated_profile){
                    this.put("profile");
                }
                if(data.PROFILEID) self.$storage.profile.PROFILEID = data.PROFILEID;
                if(data.status){
                    $.each(data.status,function(testid,value){
                        self.$storage.tests[testid].status.stored = value;
                    })
                }
                // console.log("data of '"+testid+"' successfully send to server",data);
            }).catch(function(a,b,c){
                // alert("error1 "+JSON.stringify(b));
                // console.warn("error sending '"+testid+"' to database:",a);
            })
        },100);

    }

    this.update_with_defaultstorage = function(clean){

        // first clean current storage
        if(clean && defaultstorage!=undefined){
            // remove unused profile keys
            $.each(self.$storage.profile,function(k,v){
                if(!(k in defaultstorage.profile)){
                    // console.log("delete",k);
                    delete self.$storage.profile[k];
                }
            })
            // remove unused profile keys
            $.each(self.$storage.tests,function(test,content){
                if(defaultstorage.tests[test] && defaultstorage.tests[test].length>0){ // extra check
                    $.each(content,function(k,v){
                        if(!(k in defaultstorage.tests[test])){
                            // console.log("delete",test,k);
                            delete self.$storage.tests[test][k];
                        }
                    })
                }
            })
        }

        // add new profile parameters
        $.each(defaultstorage.profile,function(k,v){
            if(!(k in self.$storage.profile)){
                // console.log("add",k,v);
                self.$storage.profile[k] = v;
            }
        })

        // remove test results
        $.each(self.$storage.tests,function(test,content){
            if(content.status){
                $.each(content.status,function(k,v){
                    if(!defaultstorage.tests[test] || !(k in defaultstorage.tests[test].status)){
                        // console.log("remove",test,k,v);
                        delete self.$storage.tests[test].status[k];
                    }
                })
            }
            if(content.questions){
                $.each(content.questions,function(k,v){
                    if(!defaultstorage.tests[test] || defaultstorage.tests[test].questions && !(k in defaultstorage.tests[test].questions)){
                        // console.log("remove",test,k,v);
                        delete self.$storage.tests[test].questions[k];
                    }
                })
            }
        })

        // add test if not exists
        $.each(defaultstorage.tests,function(test,content){
            if(!(test in self.$storage.tests)){
                self.$storage.tests[test] = defaultstorage.tests[test];
            }
        })

        // remove test if not exists
        $.each(self.$storage.tests,function(test,content){
            if(!(test in defaultstorage.tests)){
                delete self.$storage.tests[test];
            }
        })

        // add test results
        if(defaultstorage.tests.length){
            $.each(defaultstorage.tests,function(test,content){
                if(content.status){
                    $.each(content.status,function(k,v){
                        if(!self.$storage.tests[test].status) self.$storage.tests[test].status = {};
                        if(!(k in self.$storage.tests[test].status)){
                            // console.log("add",k,v);
                            self.$storage.tests[test].status[k] = v;
                        }
                    })
                }
                $.each(content.questions,function(k,v){
                    if(!self.$storage.tests[test].questions) self.$storage.tests[test].questions = {};
                    if(!(k in self.$storage.tests[test].questions)){
                        // console.log("add",k,v);
                        self.$storage.tests[test].questions[k] = v;
                    }
                })
            })
        }

        return this.$storage;
    }

    // get score

    this.score = function(testid){

        if(testinfo[testid].type=="syn" || testinfo[testid].type=="synplus"){
            var spread = {};
            // loop questions
            if(self.$storage.tests[testid].questions){
                $.each(self.$storage.tests[testid].questions,function(k,v){

                    var type = "symbol";

                    if(v.file) type = "file";

                    // if(testid=="muziek" || testid=="klinkers") type = "file";

                    if(v){
                        spread[v[type]] = spread[v[type]] ? spread[v[type]] : {};
                        spread[v[type]].colors = spread[v[type]].colors ? spread[v[type]].colors : [];
                        spread[v[type]].colors.push(v.color);
                        spread[v[type]].symbol = v[type];

                    }

                })
            }

            var calc = [];
            var total = 0;
            // check color repetition
            var percolor = {};
            var percolormax = 0;
            var spreadlength = 0;

            $.each(spread,function(k,v){
                var d = self.distance(v.colors);
                var distance = d ? (6-d[3])*(100/6) : false;
                if(distance){
                    v.distance = parseInt(distance);
                    calc.push(distance);
                    total = total+distance;
                }
                if(testid=="kleurenalfabet"){
                    $.each(v.colors,function(k,v){
                        percolor[v] = percolor[v]+1 || 1;
                        if(percolormax<percolor[v]) percolormax = percolor[v];
                    })
                } else {
                    $.each(v.colors,function(k,v){
                        // darker than lightness 10% 0.1
                        if(v && v!="nocolor" && hex2hsl(v)[2]<0.1) percolormax++;
                    })
                }
                spreadlength++;
            })



            var result = {};

            if(percolormax/(spreadlength*3)>=0.85) result['toomuchthesame'] = true;
            result['percentage'] = parseInt(total/calc.length);
            result['items'] = spread;

            if(testid=="muziek" || testid=="klinkers") result['sound'] = true;

            // console.log(result);

            return result;

        }

        if(testinfo[testid].type=="klankenvorm"){
            var success = 0;
            var result = {};
            if(self.$storage.tests[testid].questions){
                $.each(self.$storage.tests[testid].questions,function(k,v){
                    var img = v.choice ? v["leftimage"] : v["rightimage"];
                    if(img && v.symbol){
                        if(img[0] == "R" && v.symbol[0] == "A") success++;
                        if(img[0] == "P" && v.symbol[0] == "B") success++;
                    }
                    // if(v.choice && v.file[0]=="A" && v.choose[v.choice][0]=="R") success++;
                    // if(v.choice && v.file[0]=="B" && v.choose[v.choice][0]=="P") success++;
                })
                result['percentage'] = parseInt((success/self.$storage.tests[testid].questions.length)*100);
                result['items'] = spread;
            } else {
                result['percentage'] = 0;
                result['items'] = 0;
            }
            return result;
        }

        if(testinfo[testid].type == "klankenbetekenis"){
            var success = 0;
            var result = {};
            if(self.$storage.tests[testid].questions){
                $.each(self.$storage.tests[testid].questions,function(k,v){
                    if(v.choice=="0") success++;
                })
                result['percentage'] = parseInt((success/self.$storage.tests[testid].questions.length)*100);
                result['items'] = spread;
            } else {
                result['percentage'] = 0;
                result['items'] = 0;
            }

            return result;
        }

        return {"percentage":0};

    }

    this.distance = function(colors){
        if(colors[0] && colors[1] && colors[2] && colors[0]!='nocolor' && colors[1]!='nocolor' && colors[2]!='nocolor'){
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



})

app.service("popup", function($timeout,$q,$rootScope){

    var self = this;

    this.confirm = function(message,buttons){

        // console.log(message);

        self.q = $q.defer();

        $scope = $("*[popup] *").scope();

        $scope.message = message;
        $scope.buttons = buttons;
        $scope.open = true;

        return self.q.promise;

    }

})

app.directive('popup',function($timeout,$compile,popup){
    return {
        restrict:"A",
        scope:{},
        template:"<div id='bg' ng-class=\"{'open':open}\" ng-click='close()'><div id='window' ng-click='noprop($event)'><span compile='message'></span><div id='buttons'><button ng-repeat='(k,b) in buttons' ng-bind='b' ng-click='select(b)' ng-class=\"{'active':active==k}\" ng-mouseover=\"activate_this(k)\"></button></div></div></div>",
        link:function(s,el,a){
            s.open = false;
            s.message = 'max planck';
            s.active = 0;
            // s.buttons = {0:'ja',1:'nee'};
            s.close = function(){
                popup.q.resolve(false);
                s.open = false;
            }
            s.noprop = function(e){
                e.stopPropagation();
            }
            s.select = function(k){
                popup.q.resolve(k);
                s.open = false;
            }
            s.activate_this = function(plus){
                s.active = plus;
            }
            s.activate = function(plus){
                s.active = (s.active+plus)%s.buttons.length;
                s.$apply();
            }
            $(window).on("keydown",function(e){
                if(s.open){
                    // console.log(e.keyCode);
                    if(e.keyCode==27) s.close(), e.preventDefault();
                    if(e.keyCode==9) s.activate(1), e.preventDefault();
                    if(e.keyCode==13) el.find(".active").click(), e.preventDefault();
                }
            })
        }
    }
})


function hr(timestamp){
    // human readable milisecond to seconds
    var deci = 10;
    return Math.round((timestamp/1000)*deci)/deci+"s";
}

function hsl2rgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hsl2hex(h,s,l){
    var rgb = hsl2rgb(h,s,l);
    return rgb2hex("rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")");
}

function hex2hsl(string){
    return rgb2hsl(hex2rgb(string));
}

function rgb2hsl(rgb){

    if(rgb[0]=="r"){
        var rgb = rgb.replace("rgb(","").replace(")","").split(",");
    }

    var r = rgb[0], g = rgb[1], b = rgb[2];
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hex2rgb(hex,string){
    if(hex==undefined) return null;
    var split = 1;
    hex = hex.replace("#","");
    if(hex.length==3){
        split = hex.split("");
        hex = split[0]+""+split[0]+""+split[1]+""+split[1]+""+split[2]+""+split[2];

    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!string){
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    } else {
        return result ? "rgb("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+")" : null;
    }
}

function rgb2hex(string,g,b){
    if(string){
        var spl = [0,1,0.5];
        if(g){
            spl = [string,g,b];
        } else {
            var spl = string.replace("rgb(","").replace(")","").split(",");
        }
        return toHex(spl[0])+toHex(spl[1])+toHex(spl[2]);
    } else {
        return "000000";
    }

}

function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

function rgb0(rgb){
    if(rgb){
        rgb.forEach(function(v,k){ rgb[k] = v/256;})
        return rgb;
    }
}

function stripslashes(str){
   if(str && str.charAt(str.length-1) == "/"){ str = str.substr(0, str.length - 1);}
   if(str && str.charAt(str[0]) == "/"){ str = str.substr(1);}
   return str
}
