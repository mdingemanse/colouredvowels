
# coding: utf-8
#Code for calculating the degree of structure in the mapping between vowels and colours
#For use with data from Cuskley, Dingemanse, Kirby & van Leeuwen (2019) 'Cross-modal associations and synaesthesia: Categorical perception and structure in vowel-colour mappings in a large online sample'

import pandas as pd
import random
import numpy as np
import math
import scipy.stats
import datetime

from colormath.color_conversions import convert_color
from colormath.color_objects import LabColor,sRGBColor
from colormath.color_diff import delta_e_cie2000 as deltaE2000

#create a dictionary which stores the F1/F2 values of Dutch cannonical vowel phonemes, from Adank, van Hout & Smits (2004)
dutchV = {}
with open("dutchAcoustic.csv","r") as infile:
    for line in infile:
        x=line.rstrip().split("\t")
        if x[1] =="Phone":
            pass
        else:
            dutchV[x[1]] = {"F1":float(x[3]),"F2":float(x[2])}

#create a dictionary of pairwise distances between all vowel phonemes so that these don't need to be recalculated on the fly
vowel_distance_dict={}

#likewise for colours (though there is much more variation in these, and this may not save much)
colour_distance_dict={}

#read in raw response data
data=pd.read_csv("mantelinputdat.csv")

nonsyn_profiles=list(set(data[data.SynVowel=="NonVowelSyn"]['profileid']))
syn_profiles=list(set(data[data.SynVowel=="VowelSyn"]['profileid']))

#function to calculate distance between two vowels
def vowel_distance((f1a, f2a, ia), (f1b, f2b, ib)):
    if (f1a, f2a, f1b, f2b) not in vowel_distance_dict:
        vowel_distance_dict[(f1a, f2a, f1b, f2b)] = math.sqrt((f1a-f1b)**2 + (f2a-f2b)**2)
    return vowel_distance_dict[(f1a, f2a, f1b, f2b)]

#function to calculate distance between two colours
def colour_distance(c1,c2):
    stringkeyA=c1+","+c2
    stringkeyB=c2+","+c1
    if stringkeyA in colour_distance_dict:
        return colour_distance_dict[stringkeyA]
    elif stringkeyB in colour_distance_dict:
        return colour_distance_dict[stringkeyB]

    else:
        color1=sRGBColor.new_from_rgb_hex(c1)
        color2=sRGBColor.new_from_rgb_hex(c2)         
        lab_c1=convert_color(color1,LabColor)
        lab_c2=convert_color(color2,LabColor)
        delta_e = deltaE2000(lab_c1, lab_c2)
        colour_distance_dict[stringkeyA]= delta_e
        return colour_distance_dict[stringkeyA]

#calculate pairwise distance correlations between ordered list of vowels and colour choices
def pairwise_distance_correlation(vowels, colours):
    vowel_distances=[]
    for i in range(len(vowels)):
        for j in range(i):
            vowel_distances.append(vowel_distance(vowels[i], vowels[j]))
    
    colour_distances=[]
    for i in range(len(colours)):
        for j in range(i):
            colour_distances.append(colour_distance(colours[i][0], colours[j][0]))
    
    return scipy.stats.pearsonr(vowel_distances, colour_distances)[0]  

#perform mantel test
def mantel_test(vowels, colours, trials):
    vowel_dict={}
    for v in vowels:
        vowel_dict[v[2]]=v
    veridical_correlation=pairwise_distance_correlation(vowels, colours)
    monte_carlo_samples=[]
    count=0
    for _ in range(trials):
        vowel_items=vowel_dict.keys()
        random.shuffle(vowel_items)
        random_map={}
        for i, j in zip(vowel_dict.keys(), vowel_items):
            random_map[i]=j
        random_vowels=[]
        for v in vowels:
            mapped_vowel=vowel_dict[random_map[v[2]]]
            random_vowels.append(mapped_vowel)
        monte_carlo_samples.append(pairwise_distance_correlation(random_vowels, colours))
        if monte_carlo_samples[-1]>veridical_correlation:
            count+=1
    return veridical_correlation, (veridical_correlation-np.mean(monte_carlo_samples))/np.std(monte_carlo_samples), count/float(trials), monte_carlo_samples


#pull out a list of vowels and colours for a particular profile id, run mantel simulation to obtain r value (correlation between vowel and colour distances), z-score, and p-value
def participant_score_vowelcategory(profileid, trials):
    vowels=[list(x[1]) for x in data[data.profileid==profileid][['phonF1','phonF2','item']].iterrows()]
    colours=[list(x[1]) for x in data[data.profileid==profileid][['HexChoice']].iterrows()]
    results=mantel_test(vowels, colours, trials)
    return results[0], results[1], results[2]



#calculate mantel score for each participant
#create a list of the values
allparticipants=[]
#append column headers first
allparticipants.append(["r","z-score","p-value","profileid","SynStatus"])

#get a score for each non-synaesthetes
for item in nonsyn_profiles:
    scr=list(participant_score_vowelcategory(item,10000))
    scr.append(item)
    scr.append("NonSyn")
    allparticipants.append(scr)

#get a score for each synaesthete
for item in syn_profiles:
    scr=list(participant_score_vowelcategory(item,10000))
    scr.append(item)
    scr.append("Syn")
    allparticipants.append(scr)
    
fout=open("AllParticipantsMantel_VowelsFull.csv","w")
for item in allparticipants:
    for i in range(0,len(item)):
        if i==4:
            fout.write(str(item[i])+"\n")
        else:
            fout.write(str(item[i])+"\t")
fout.close()
