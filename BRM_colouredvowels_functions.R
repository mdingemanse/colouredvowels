# Coloured vowels: some custom functions
# --------------------------------------
# Mark Dingemanse


# tidy data ---------------------------------------------------------------

library(ggrepel)
library(cowplot)

stims <- read_delim(file="BRM_colouredvowels_stimuli_properties.tsv",delim="\t") %>%
  plyr::rename(c("File" = "item","VowelCat" = "phoneme","Graphcat" = "grapheme"))

# wide version of vowel data for easier plotting
d.wide <- d.voweldata %>%
  mutate(item = as.numeric(item)) %>% # drop leading zero
  gather("trial","colour", starts_with("color")) %>%
  mutate(trial = sapply(trial,gsub,pattern="color",replacement="")) %>% # keep only trial number
  dplyr::select(anonid,item,trial,colour) %>%
  arrange(item) %>%
  left_join(stims) # add stim metadata for easy plotting

# full version combining vowels, stims & participants for visualisation functions
d.full <- d.wide %>%
  left_join(d.participants)

# generic ----------------------------------------------------------------


fullpid <- function(string) {
  # finds full anonid for shortened pid
  # usage: fullpid("4e6aad")
  regexpattern <- paste0("^",string)
  unique(d.full[grep(regexpattern,d.full$anonid),"anonid"])[[1]]
}


# visualization -----------------------------------------------------------

# vowelplot()
# Plots the colour associations for a given anonid in F1/F2 colour space.

# Usage: 
# vowelplot(pid="4e6aad",saveplot=F)

# Arguments:
#   pid: (subset of) anonid
#   saveplot: if TRUE, saves the plot with the name "vowelplot-{anonid}.png".

vowelplot <- function(pid=NULL,saveplot=FALSE) {
  dp <- d.wide %>% filter(grepl(pid,anonid))
  p <- ggplot(dp,aes(x=F2,y=F1,label=phoneme)) +
    theme_bw() + theme(legend.position="none") +
    theme(text=element_text(size=16,  family="serif")) +
    scale_fill_identity() +
    scale_y_continuous(trans = "reverse",limits=c(800,200)) +
    scale_x_continuous(trans = "reverse",limits=c(2500,350)) +
    geom_point(pch=21,colour="black",position=position_dodge(width=80),
               aes(fill=colour),size=8) +
    geom_text_repel(data=dp %>% filter(trial == 1),
                    aes(label=phoneme),
                    point.padding=.8,segment.colour=NA,size=6)
  
  if (saveplot) { 
    filename <- paste0("vowelplot-",pid,".png")
    print(paste("Saving as",filename))
    ggsave(file=filename,width=6, height=4)
  }
  
  return(p)
}

# vowelspaces() 

# Vowel plots for arbitrary numbers of participants, selectable by
# consistency or structure scores

# Usage: vowelspaces() 

# Optional arguments:
# pid= vector of profileid(s) to plot, e.g. pid=c("2267","abf7") (random selection if none given)
# n= number of pids to randomly select for plotting when none specified
# max.consistency, min.consistency: for selecting participants by consistency score
# max.structure, min.structure: for selecting participants by structure score
# printpid= logical, whether to print profileids when selecting pids randomly
# savefile= logical, whether to output to png
# keyword= keyword to use in the filename

# If more than one pid is selected, plots will be faceted by pid.

  
vowelspaces <- function(pid=NULL,n=9,max.consistency=500,min.consistency=0,max.structure=10,min.structure=-2,sort=F,showvowels=T,saveplot=FALSE,keyword=NULL,printpid=T) {

  # TO DO
  # add syn_status filter?
  # add options for IPA, phoneme, grapheme labels
    
  # prepare data
  if(is.null(pid)) {
    
    # if no pids are given, first filter data, then randomly select n pids
    dp <- d.full %>%
      filter(structure < max.structure,
             structure > min.structure) %>%
      filter(consistency < max.consistency,
             consistency > min.consistency)

    # filter by profiles
    profiles <- unique(dp$anonid)
    totaln <- length(profiles)
    pid <- as.vector(unlist(sample_n(data.frame(profiles),n)))
    print(paste0('No pids given, randomly sampling ',n,' from ',totaln,' left after applying thresholds'))
    dp <- d.full %>%
      filter(anonid %in% pid)
    
  } else {
    # when pids are given, filter data on pids alone
    n <- length(pid)
    if (nchar(pid[1]) < 36) { # in case we're dealing with abbreviated profileids, find the full ones
      pid <- unlist(lapply(pid,fullpid))
    }
    dp <- d.full %>%
      filter(anonid %in% pid)
  }
  
  # sort
  if(sort) {
    dp <- dp %>%
      group_by(anonid) %>%
      arrange(consistency)
  }

  # prepare plot
  
  pid_labels <- function(labelthis) {
    print(paste0('labeler: ', labelthis))
    nlabels <- length(unique(labelthis))
    labeldata <- dp %>% filter(anonid %in% labelthis) %>% select(anonid,consistency,structure) %>% slice(1:nlabels)
    paste0(strtrim(labeldata$anonid,4)," (C = ",round(labeldata$consistency,digits=0),", S = ",round(labeldata$structure,digits=1),")")
  }
  
  p <- ggplot(dp,aes(x=F2,y=F1)) +
    theme_bw() + theme(legend.position="none", 
                       axis.ticks=element_blank(),
                       axis.title.x=element_blank(),
                       axis.title.y=element_blank(),
                       panel.grid.major = element_blank(), 
                       panel.grid.minor = element_blank(),
                       panel.border = element_blank()) + 
    scale_fill_identity() +
    scale_x_continuous(trans = "reverse",limits=c(2500,400),
                       breaks=NULL) +
    scale_y_continuous(trans = "reverse",limits=c(800,200),
                       breaks=NULL) +
    geom_point(pch=21,colour="#cccccc",position=position_dodge(width=200),
               aes(fill=colour),size=6) +
    facet_wrap(~anonid, labeller = as_labeller(pid_labels)) +
    theme(strip.background = element_rect(fill=NA,colour=NA),axis.line=element_blank(), axis.ticks=element_blank())
  
  
  if(showvowels) {
    p <- p +
      annotate("text",x=2000,y=300,label="i") +
      annotate("text",x=1525,y=600,label="a") +
      annotate("text",x=1050,y=300,label="u") +
      annotate("text",x=1840,y=450,label="e") +
      annotate("text",x=1211,y=450,label="o")
  }

  # save plot
  if (saveplot) { 
    pidstring <- paste0(strtrim(dp$anonid[1],6),"_",length(pid))
    if (!is.null(keyword)) { pidstring <- paste0(keyword,"-",pidstring) }
    filename <- paste0("out/colplot-",pidstring,".png")
    print(paste("Saving as",filename))
    ggsave(file=filename)
  }
  
  # plot plot
  suppressWarnings(print(p))

  # printing pids can be useful if not included in plot
  if(printpid) { print(pid) } 
  
}