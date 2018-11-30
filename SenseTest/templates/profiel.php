<form novalidate id='profile'>

    <div id='intro' ng-hide='!profile_empty()'>

        <?php echo $texts['profile-pre-text'];?>

        <button ok>ok</button>
        <button id='skip' help start>Skip</button>

        <br>
        <div id='questions'>
            <?php echo $texts['get-in-touch'];?>
        </div>
    </div>

    <button id='fold'>My profile</button>

    <div id='after'>Thanks for your participation. You can continue to your results, but we would appreciate it if you could fill in the following form.</div>


    <div id='content'>
        <div>
            <label class='right'>naam/Sona-ID</label>
            <label class='left'>Naam / Sona-ID</label>
            <div><input value="" type='text' ng-model="$storage.profile.NAME" label/></div>
        </div>

        <div>
            <label class='right'>email</label>
            <label class='left'>Email</label>
            <div><input value="" type='email' ng-model="$storage.profile.EMAIL" label email/></div>
        </div>

        <div>
            <div checkbox='$storage.profile.MAILINGLIST' ng-class="{'active':$storage.profile.MAILINGLIST}" ng-click="$storage.profile.MAILINGLIST=!$storage.profile.MAILINGLIST">
                <i></i>
                <span id='label'>Yes, keep me informed about the test and its results</span>
                <span id='privacy'><?= $texts['mailing-disclaimer']?></span>
                <div id='border'></div>
            </div>
        </div>

        <!-- <div>
            <label class='right'>contact opnemen mag</label>
            <label class='left'>Wil je meer horen over de resultaten of een mogelijk vervolgonderzoek? (Geen spam.)</label>
            <div><input value="" type='text' model="$storage.profile.MAILINGLIST" data="{{['ja','nee']}}" autocomplete="drop"/></div>
        </div> -->

        <div>
            <label class='right'>Age</label>
            <label class='left'>Age</label>
            <div><input value="" type='number' ng-model="$storage.profile.AGE" buffer="true" min="0" max="135" label/></div>
        </div>

        <div>
            <label class='right'>Gender</label>
            <label class='left'>Gender</label>
            <div><input value="" type='text' model="$storage.profile.GENDER" data="{{['man','woman','other']}}" autocomplete="drop"/></div>
        </div>

        <div>
            <label class='right'>Synesthesia</label>
            <label class='left'>Do you have synesthesia?</label>
            <div><input value="" type='text' model="$storage.profile.SYNESTHESIA" data="{{['no','yes','I don\'t know']}}" autocomplete="drop" /></div>
        </div>

        <div>
            <label class='right'>Dyslexia</label>
            <label class='left'>Do you have dyslexia?</label>
            <div><input value="" type='text' model="$storage.profile.DYSLEXIA" data="{{['no','yes','I don\'t know']}}"  autocomplete="drop" /></div>
        </div>

        <!-- <div>
            <label class='right'>creativiteit</label>
            <label class='left'>Hoe creatief vind je jezelf op een schaal van 1-10?</label>
            <div><input value="" type='text' model="$storage.profile.CREATIVITY" data="{{['1','2','3','4','5','6','7','8','9','10']}}" min='1' max='10' autocomplete="drop"></div>
        </div>

        <div>
            <label class='right'>kunst/muziek</label>
            <label class='left'>Maak je zelf kunst of muziek?</label>
            <div><input value="" type="text" model="$storage.profile.ARTMUSIC" data="{{['nee','ja','niet echt']}}" autocomplete="drop" /></div>
        </div>

        <div>
            <label class='right'>moedertaal</label>
            <label class='left'>Moedertaal</label>
            <div><input value="" type='text' model="$storage.profile.MOTHERTONGUE" autocomplete/></div>
        </div>

        <div>
            <label class='right'>schoolniveau</label>
            <label class='left'>Welk schoolniveau heb je afgerond?</label>
            <div><input value="" type='text' model="$storage.profile.SCHOOL" data="{{['middelbaar onderwijs','voortgezet onderwijs (MBO, secundair onderwijs)','hoger onderwijs (HBO, universiteit)','geen van deze']}}" autocomplete="drop"/></div>
        </div> -->


        <button ng-click='profile_done()' ng-hide='testid' help start>OK</button>
        <button ng-click='profile_done()' ng-show='testid' id='continue' help start>Continue to the test</button>
        <button ng-click='profile_done()' ng-show='testid' id='toresults' help start>Continue to your results</button>

    </div>

    <div id='forminfo'>
        disclaimer...
    </div>

</form>
