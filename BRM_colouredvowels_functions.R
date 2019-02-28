# Coloured vowels: some custom functions
# --------------------------------------
# Mark Dingemanse


# generic ----------------------------------------------------------------

findprofile <- function(string,data=NULL) {
  # finds an anonid from a subset of characters
  regexpattern <- paste0("^",string)
  if(is.null(data)) { data <- d.participants }
  unique(data[grep(regexpattern,data),"anonid"])
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

# colplot() Code to display vowel plots for arbitrary numbers of participants,
# selectable by consistency or structure scores

# <snip>(code needs refactoring)</snip>

