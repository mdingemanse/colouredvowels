<div id='loading' ng-class='audioklas'><div class='loader'>loading...</div></div>

<div id='left' class='special' bgi="{{getfolder('images',q.leftimage)}}" ng-click='q.choice=0' next disable='{{audio_finished}}'></div>

<div id='right' class='special' bgi="{{getfolder('images',q.rightimage)}}" ng-click='q.choice=1' next disable='{{audio_finished}}'></div>

<div id='bottom'>

    <button soundfile="{{getfolder('mp3',q.symbol)}}"></button>

</div>
