<div id='profilepage'>
    <div id="head">
        <a href='tests' id='logo' ng-click='profile_done()'>Overview</a>
        <a ng-click='$root.reset()' id='restart' class='right'>Reset</a>
    </div>
    <div id='left'>

        <button id='fold'>My results</button>

        <div id='results'>
            <a ng-repeat="(testid,item) in results | orderObjectBy:'dirname' | filter:main" ng-href='test/{{item.id}}' ng-class="{'done':item.done}">
                <span id='name' compile='item.name'></span>
                <span id='score' ng-bind='item.score.percentage'></span>
                <span id='progress' ng-show='item.progress[1]'>{{item.progress[0]}}/{{item.progress[1]}}</span>
            </a>

            <hr>

            <div ng-repeat="(testid,item) in results | orderObjectBy:'dirname' | filter:sub" ng-class='gno.test_class(item.id)'>
                <a ng-href='test/{{item.id}}' ng-class="{'done':item.done,'start':item.start}">
                    <span id='name' compile='item.name'></span>
                    <span id='score' ng-bind='item.score.percentage'></span>
                    <span id='progress' ng-show='item.progress[1]'>{{item.progress[0]}}/{{item.progress[1]}}</span>
                </a>
            </div>
        </div>
    </div>

    <div id='right'>
        <button id='fold'>My profile details</button>
        <div ng-include src="'templates/profiel'"></div>

    </div>
</div>
