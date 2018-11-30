Coloured vowels open data
================

This dataset and code accompanies the paper "Cross-modal associations and synaesthesia: Categorical perception and structure in vowel-colour mappings in a large online sample" by Cuskley<sup>1</sup>, Dingemanse<sup>1</sup>, van Leeuwen & Kirby.

<sup>1</sup> Joint first authors.

Data
----

The data was collected in the framework of a large-scale study into synaesthesia and cross-modal associations (*Groot Nationaal Onderzoek*, Van Leeuwen & Dingemanse 2016). Spoken vowel-colour association data was collected for **1164 participants** using recordings of 16 vowel sounds selected to represent points spread through acoustic vowel space (Moos et al. 2014). Grapheme-colour association data was collected for a subset of 398 participants who took a full grapheme-colour association test, among them are around 100 confirmed synaesthetes.

The focus of this paper is on colour associations to spoken vowel sounds. Data comes in the following data frames (shared in .csv and .Rdata formats): `d.voweldata` for the raw data from the association task (with `d.stimuli` recording order of presentation) and `d.participants` for anonymised participant metadata and consistency and structure scores.

-   [BRM\_colouredvowels\_voweldata.csv](/BRM_colouredvowels_voweldata.csv)
-   [BRM\_colouredvowels\_stimuli.csv](/BRM_colouredvowels_stimuli.csv)
-   [BRM\_colouredvowels\_participants.csv](/BRM_colouredvowels_participants.csv)

The raw data from the association task looks like this:

``` r
str(d.voweldata)
```

    ## Classes 'tbl_df', 'tbl' and 'data.frame':    18624 obs. of  9 variables:
    ##  $ anonid : chr  "0045dbc0-8936-4c47-b8a2-333f29f3a505" "0045dbc0-8936-4c47-b8a2-333f29f3a505" "0045dbc0-8936-4c47-b8a2-333f29f3a505" "0045dbc0-8936-4c47-b8a2-333f29f3a505" ...
    ##  $ setname: Factor w/ 3 levels "set1","set2",..: 1 1 1 1 1 1 1 1 1 1 ...
    ##  $ item   : Factor w/ 16 levels "01","02","03",..: 12 9 14 13 8 2 3 11 5 15 ...
    ##  $ color1 : chr  "#A82816" "#3C3899" "#9A4B37" "#963B30" ...
    ##  $ color2 : chr  "#B2282B" "#F44E50" "#973933" "#AE4F3F" ...
    ##  $ color3 : chr  "#BB322B" "#EE5A3D" "#A15042" "#8E2026" ...
    ##  $ timing1: num  18689 12561 10586 9186 10823 ...
    ##  $ timing2: num  6599 4046 4480 8701 5662 ...
    ##  $ timing3: num  5893 7648 9060 8250 10079 ...

Here, `anonid` is an anonymised participant identifier; `setname` records the item randomisation a participant was exposed to (as specified in `d.stimuli`); `item` lists item as presented in the test; and `color` and `timing` record colour choice and RT per trial (each item is presented three times).

Participant metadata is in `d.participants` and looks like this:

``` r
str(d.participants)
```

    ## 'data.frame':    1164 obs. of  9 variables:
    ##  $ anonid          : chr  "0045dbc0-8936-4c47-b8a2-333f29f3a505" "005c48a4-acb7-4e25-8e4a-447e08a2dc85" "0086e9c0-418c-404c-8f3c-219de93cc3dc" "00879596-4a24-4341-8cc3-6a74d8efa87c" ...
    ##  $ age_bin         : Factor w/ 7 levels "[18,28]","(28,38]",..: 1 5 3 3 1 4 6 5 2 4 ...
    ##  $ genderFM        : Factor w/ 2 levels "female","male": 1 1 NA 1 1 2 1 1 1 1 ...
    ##  $ syn_selfreport  : Factor w/ 3 levels "dunno","no","yes": 1 NA NA 1 2 2 2 1 1 2 ...
    ##  $ ConsistencyScore: num  85.1 225.3 204.8 156.5 84.7 ...
    ##  $ SynStatus       : chr  "Syn" "NonSyn" "NonSyn" "NonSyn" ...
    ##  $ r               : num  0.7509 0.0208 -0.0154 0.1411 0.571 ...
    ##  $ StructureScore  : chr  "z-score" "z-score" "z-score" "z-score" ...
    ##  $ p-value         : num  0 0.2705 0.7294 0.0366 0.0001 ...

The `anonid` allows linking across test results and metadata. Age and binarised gender were recorded using an optional pre-test questionnaire, which about 75% of participants filled out. Age (`age_bin`) is binned to ensure participant privacy; reported age range is 18-88 (median = 46, SD = 16). Participants identifying as female are overrepresented, which is common in self-selecting online studies.

`ConsistencyScore` is an overall measure of consistency in colour choices, based on distances in CIELuv space. 34 out of 1164 participants received no consistency score as they chose "No colour" for more than half of the items. `SynStatus` is a synaesthesia classification based on the consistency score, as reported in the paper; we identified 365 synaesthetes. Finally, `r`, `StructureScore` (also called *z score* in the paper), and `p-value` are related to the novel Structure measure we introduce in the paper, which characterizes the degree to which participants' responses are structure isomorphically across modalities.

Code
----

Finally, [BRM\_colouredvowels\_MantelCode.py](/BRM_colouredvowels_MantelCode.py) has the code for computing structure scores using the Mantel test.
