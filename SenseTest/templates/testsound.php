<div id='nosound' ng-show='sound==0'>

    <div>
        Helaas, voor deze test heb je geluid nodig.
        Gelukkig zijn er genoeg andere testen die je wel kunt doen!<br><br>
        <a href='tests'>Doe een andere test</a>
    </div>

</div>


<div id='left'>
    <h3>Kun je dit geluid horen?<Br>
        <span>Deze test werkt het beste met koptelefoon.</span>
    </h3>
</div>
<div id='right'>
    <div soundfile="data/sound/beep.mp3"></div>
</div>
<div id='bottom' ng-hide='bottom'>

    <div ng-model='sound' choose="{{['nee','ja']}}"></div>
</div>
