<div id='frame' animate before>
    <div id='intro'>
        <h1>Can you hear colours?</h1>
        <p>In this test you associate colours to speech sounds. You hear a sound, then choose a colour that you feel fits best. Try to choose as intuitively as possible; there are no wrong answers.</p>
        <button help start>start</button>
    </div>
</div>

<div id="frame" before destroy='profile()'>
    <div ng-include src="'templates/profiel'"></div>
</div>

<div id="frame" before>
    <div testsound></div>
</div>

<div id='frame' animate ng-show='q'>
    <div ng-model="q" color='sound'></div>
</div>


<div id="frame" after destroy='profile()'>
    <div ng-include src="'templates/profiel'"></div>
</div>
