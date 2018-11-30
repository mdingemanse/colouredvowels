<div percentage="{{percentage}}"></div>

<button ng-click="open=!open">bekijk je score per item</button>

<div id='in' ng-show='open'>
    <div id='mid'>
        <div ng-repeat="(k,s) in spread track by $index" id='letter'>
            <div id='symbol' style='text-shadow:0 {{$index-1}} 0  rgba(0,0,0,0.5);'>{{k}}</div>
            <div id='color' ng-repeat='ss in s.colors track by $index' style='background:#{{ss}};'></div>
            <div id='distance'>
                <div id='bar'>
                    <div w="{{s.distance}}"></div>
                </div>
            </div>
        </div>
    </div>
</div>
