<div id='head'>
    <a href='info' id='info'>info</a>
    <button class='right' ng-click="reset()">Reset</button>
    <a class='right' href='profiel' id='profile' ng-if='!$storage.profile.NAME'>My Profile</a>
    <a class='right' href='profiel' id='profile' ng-if='$storage.profile.NAME' ng-bind='$storage.profile.NAME'></a>

</div>

<div id="overview">

    <div id='introtext'>
        <?= $texts['overview-intro'];?>
    </div>

    <div id="item" ng-repeat="test in testinfo  | orderObjectBy:'dirname' | filter:main" ng-class="gno.test_class(test.ID)">
        <a ng-href="{{link(test)}}">
            <i icon="{{test.ID}}"></i>
            <div id='done'></div>
            <h4 compile="test.titles.menushort"></h4>
            <div id='description' ng-show="!done(test.ID)"><div compile="test.titles.description"></div></div>
            <div id='description' ng-show="done(test.ID)"><div>Show results</div></div>
            <div id='time' compile="'&plusmn; '+test.titles.time"></div>
            <div id='percentage' ng-style="{width:percentage(test.ID)+'%'}"></div>
        </a>
    </div>

    <div id='extra'><span>extra</span></div>

    <div id="item" ng-repeat="test in testinfo  | orderObjectBy:'dirname' | filter:sub" ng-class="gno.test_class(test.ID)">
        <a ng-href="{{link(test)}}">
            <i icon="{{test.ID}}"></i>
            <div id='done'></div>
            <h4 compile="test.titles.menushort"></h4>
            <div id='description' ng-show="!done(test.ID)"><div compile="test.titles.description"></div></div>
            <div id='description' ng-show="done(test.ID)"><div>Show results</div></div>
            <div id='time' compile="'&plusmn; '+test.titles.time"></div>
            <div id='percentage' ng-style="{width:percentage(test.ID)+'%'}"></div>
        </a>
    </div>

    <div id='more' ng-hide='$storage.tests.kleurenalfabet.status.done'><span><?= $texts['overview-more'];?></span></div>

</div>


<div class='intro text' ng-hide="$storage.settings.nointro" ng-include="'pages/start'" ng-class='name'></div>
