# SenseTest
SenseTest v 0.99

## requirements
- Apache2
- php 7+
- MySQL

## Basic Installation
- download this repository and put move it in your Apache root folder
- create config.php with your database details as follow:
``` 
<?php
$db['username'] = "username";
$db['password'] = "password";
$db['dbname'] 	= "database name";
$db['host'] 	= "host";
```
- **important:** protect /admin/ with a password, see instructions in /admin/README.md
- go to [your server location]/admin/ to setup your the tests ready for use. After setting up the database, make sure you RENDER the tests (this will compile all necessary data to index.html)

## Short Reference configuration files:

### data/global_config.json
- **title**: main html document title
- **description**: main html document description (Search Engines)
- **keywords**: main html document keywords (Search Engines, mostly ignored)
- **image**: main html document image reference (social media)

### data/profile.json
- database configuration for profile questions.

### config.json (in each test folder)
- **ID**: Unique ID, used for table name and javascript reference
- **link**: link reference used for url (/tests/**link**, /results/**link**)
- **relation**: main | sub | @link
    - main: always visible in top list
    - sub: always visible in sub list
    - @link: only visible if referenced test is done. Reference to **link** parameter of other test. This is a comma seperated list, i.e.: graphemes, vowel_sounds
- **disabled**: true | false
- **type**: syn (colorgrid) | synplus (colorpicker)| klankenvorm | klankenbetekenis
- **titles**:
    - **menushort**: title of test (html)
    - **description**: description of test (html)
    - **time**: estimate duration of test (html)
- **percentage**: threshold for WOW-factor in results (integer 0-100)
- **resultinfo**: description on results page (html)
- **social**: description for social media link (must be url encoded)
- **wow**: description when greater than WOW threshold (html)
- **DB**: default DB fields (columnname: mysqlfieldtype)
- **everyquestion**: DB fields per question (columnname: mysqlfieldtype)
- **maxsetlength**: maximum questions
- **sets**:
    - "setname": [array]<Br>
    Set definitions

**warning**: do not repeat the same soundfile after one another in a set of test items. The sound might not start playing the second time on some devices.

## file structure

- admin/
- api/
- bower_components/
- css/
- data/
    - images // all images and icons
    - pages // static Markdown pages
    - sound // default sounds
    - tests
        - 1. graphemes
            - **config.json**
            - icon.png
            - icon-h.png
            - **template.php**
        - 2. vowel_sounds
        - etc...
    - texts // customise the content
    - **global_config.json**
    - **profile.json**
- js/
- temp // temporary files
- templates
- .htaccess
- config.php
- index.html (compiled, see admin)
- index.php (compile source)

# Credits

This web application is developed by [BSTN](http://www.bstn.nl) for the "Groot Nationaal Onderzoek" project, a large-scale survey of crossmodal associations and synaesthesia led by Mark Dingemanse and Tessa van Leeuwen (2015-2018), supported by the Dutch public broadcaster NPO/NTR and the Max Planck Institute for Psycholinguistics.

The single page web app is based on open source software like AngularJS, SASS, SoundManager2, Parsedown, see bower_components (and api/parsedown-master) for more info.