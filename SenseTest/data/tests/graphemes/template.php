<div id='frame' animate before>
    <div id='intro'>
        <h1>Letters and colours</h1>
        <p>In this test you associate colours to letters and numbers. You see a character, then choose a colour that you feel is fitting. Try to respond as intuitively as possible; there are no wrong answers.</p>
        <button help start>start</button>
    </div>
</div>

<div id="frame" before destroy='profile()'>
    <div ng-include src="'templates/profiel'"></div>
</div>

<div id='frame' animate ng-show='q'>
    <div ng-model="q" color='picker'></div>
</div>


<div id="frame" after destroy='profile()'>
    <div ng-include src="'templates/profiel'"></div>
</div>
