<div id='loading' ng-class='audioklas'><div class='loader'>loading...</div></div>

<div id='left'>

    <div id='selected' ng-style='{backgroundColor:color}'>
        <div letter ng-show="data.symbol" ng-bind='data.symbol' ng-class="{'noborder':l<200}"></div>
        <div soundfile="{{getfolder('mp3',data.file)}}" style='background-color:{{color}};' ng-hide="data.symbol"></div>
    </div>

</div>

<div id='right'>

    <div id='colorgrid' square>
        <div id='colorblock' ng-repeat='(k,kleur) in kleuren' ng-click='setcolor(kleur,k)'><span><i ng-style='{background:kleur}'></i></span></div>
        <div id='nocolor' ng-click="setcolor('nocolor',0)">
            <div><span><?= $words['nocolor']?></span></div>
        </div>
    </div>

    <div id='hue' ng-class='audioklas' hue>
        <div id='hue' ng-style='{backgroundColor:huebackground}'>
            <div id='img' ng-style='{opacity:hueopacity}'></div>
            <div id='handle'></div>
        </div>
        <div id='lightness'>
            <div id='donker'><?= $words['dark']?></div>
            <div id='licht'><?= $words['light']?></div>
            <div id='handle'></div>
        </div>
        <div id='nocolor' class='nospectrum' ng-click="setcolor('nocolor',0)">
            <div><span><?= $words['nocolor']?></span></div>
        </div>
    </div>

</div>

<div id='bottom'>
    <button next disable="{{enable()}}"><span><?= $words['next']?></span></button>
</div>

<div progress="kleurenalfabet"></div>
