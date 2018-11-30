
<div id='head'>
    <a href='info'>info</a>

    <a href='profiel' id='profile' ng-hide='$storage.profile.NAME'>My Profile</a>
    <a href='profiel' id='profile' ng-show='$storage.profile.NAME' ng-bind='$storage.profile.NAME'></a>
</div>

<div id='mid'>
    <div id='left'>
        <h1>{{testinfo[testid].titles.menushort}}</h1>
        <span id='info' compile='testinfo[testid].resultinfo'></span>

        <span ng-hide='score.toomuchthesame'>Your score is:</span><br>

        <span ng-show='score.toomuchthesame'>Het lijkt erop dat je voor elke letter of elk cijfer dezelfde kleur hebt gekozen. Je hebt te weinig verschillende kleuren gekozen om je score te kunnen berekenen. Heb je alleen maar zwart gekozen? Dan heb je waarschijnlijk geen synesthesie.</span>

        <div  ng-click="open=!open" ng-hide='score.toomuchthesame'>
            <div percentage="{{score.percentage}}"></div>

            <!-- <button>Zie hieronder voor meer informatie over je score</button> -->
        </div>

        <div id='social'>
            <a href='http://www.facebook.com/sharer/sharer.php?u=<?php echo getBaseUrl(); ?>' target="_blank" id='facebook'></a>
            <a ng-href="http://www.twitter.com/share?url=<?php echo getBaseUrl(); ?>&text={{social(score.percentage)}}" target="_blank" id='twitter'></a>
        </div>

    </div>

    <div id='right' ng-show='score.percentage>=testinfo[testid].percentage && !score.toomuchthesame' >

        <div id='wow'>

            <span ng-show="testinfo[testid].wow" compile="testinfo[testid].wow"></span><br>

            <a href='test/synesthesietest' ng-hide='$storage.tests.synesthesietest.status.done'>Wil je de complete synesthesietest doen?</a><Br><Br>

            We zouden ook graag contact opnemen als we nog eens een onderzoek naar synesthesie hebben.<br>

            <form id="profile" class='profilesmall'>
                <div id='content'>
                    <div>
                        <label class='right'>email</label>
                        <label class='left'>email</label>
                        <div><input type='email' ng-model="$storage.profile.EMAIL" label/></div>
                    </div>
                    <div>
                        <div checkbox='$storage.profile.MAILINGLIST' ng-class="{'active':$storage.profile.MAILINGLIST}" ng-click="$storage.profile.MAILINGLIST=!$storage.profile.MAILINGLIST">
                            <i></i>
                            <span id='label'>Ja, houd me op de hoogte over de resultaten en mogelijk vervolgonderzoek </span>
                            <span id='privacy'>We respecteren je privacy en delen deze informatie niet met derden. We spammen je niet en nemen alleen contact met je op als we iets relevants te melden hebben.</span>
                        </div>
                    </div>
                </div>

                <button ng-click='profile_done()'>OK</button>

                <div id='extra'>Je kunt dit later in je <a href='profiel'>profiel</a> nog aanpassen.</div>
            </form>

        </div>

    </div>

    <div id='nogeen'>
        <a href='tests'>Do another test!</a>
    </div>

    <div id='itemscore' class='open' ng-hide="hideresults(testid)">
        <div id='close' ng-click="open=!open"></div>
        <div id='mid'>
            <div ng-repeat="(k,s) in score.items | orderObjectBy:'symbol'" id='letter' ng-class="resultsclass()">
                <div id='symbol' splitcolors='s.colors'>
                    <span ng-bind='s.symbol' ng-hide='score.sound'></span>
                    <span soundfile="{{getfolder('mp3',s.symbol)}}" ng-show='score.sound'></span>
                </div>
                <div id='color' ng-repeat='ss in s.colors track by $index' ng-style="{background:'#'+ss}"></div>
                <div id='distance' ng-hide='{{nocolor(s)}}'>
                    <div id='bar'>
                        <div w="{{s.distance}}">{{s.distance}}%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id='bottom'>
</div>
