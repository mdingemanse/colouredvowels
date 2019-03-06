# Coloured vowels: workspace
# --------------------------
# Mark Dingemanse

# This is a work space — expect buggy code

# the most beautiful corner: lower quartile of consistency, upper quartile of structure
vowelspaces(max.consistency=120,min.structure=6.1,n=12,printpid=F)

# the most messy corner: exactly the inverse
vowelspaces(min.consistency=237,max.structure=1.2,n=12,printpid=F)

# participants with structure >6 demonstrate the correlations most clearly
vowelspaces(min.consistency=30,max.consistency=135,min.structure=6,n=16,printpid=F,sort=T)
vowelspaces(min.consistency=135,max.consistency=500,min.structure=6,n=16,printpid=F,sort=T)

# >70% of participants have significantly more structure than randomly generated mappings
vowelspaces(max.consistency=135,min.structure=2,n=16,printpid=F,sort=T)
vowelspaces(min.consistency=135,min.structure=2,n=16,printpid=F,sort=T)

# high structure is beautiful regardless of consistency
vowelspaces(min.structure=6.1,n=16,printpid=F,sort=T)


# high structure is beautiful regardless of consistency
vowelspaces(min.structure=2,n=16,printpid=F,sort=T)

vowelspaces(min.consistency=30,max.consistency=135,min.structure=6,n=12,printpid=F)

vowelspaces(min.consistency=135,max.consistency=400,min.structure=6,n=12,printpid=F)

vowelspaces(min.structure=3.7,n=25,printpid=F,sort=T)

vowelspaces(max.consistency=100,n=25,printpid=F)


 # vowelspaces plot dev

# set default vars
pid <- unlist(lapply(c("f999ef","4e6aad","deb5c2ac","fb345da0","0045","02ff","8995","ef80"),fullpid))
max.consistency <- NULL
min.consistency <- NULL
dp <- d.full %>%
  filter(anonid %in% pid)


# include small vowel triangle in center of plot

pid_labels <- function(string) {
  consistency <- unique(dp[which(dp$anonid %in% string),]$consistency)
  structure <- unique(dp[which(dp$anonid %in% string),]$structure)
  paste0(strtrim(string,4)," (C = ",round(consistency,digits=0),", S = ",round(structure,digits=1),")")
}

ggplot(dp,aes(x=F2,y=F1)) +
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
  geom_point(pch=21,colour="grey",position=position_dodge(width=200),
             aes(fill=colour),size=6) +
  annotate("text",x=2000,y=300,label="i") +
  annotate("text",x=1500,y=600,label="a") +
  annotate("text",x=1100,y=300,label="u") +
  facet_wrap(~anonid, labeller = as_labeller(pid_labels)) +
  theme(strip.background = element_rect(fill=NA,colour=NA),axis.line=element_blank(), axis.ticks=element_blank())


# annotate, v0: just on the axes (using a secondary axis for U)

ggplot(dp,aes(x=F2,y=F1)) +
  theme_bw() + theme(legend.position="none", 
                     axis.ticks=element_blank(),
                     axis.title.x=element_blank(),
                     axis.title.y=element_blank(),
                     axis.text = element_text(size=12),
                     panel.grid.major = element_blank(), 
                     panel.grid.minor = element_blank(),
                     panel.border = element_blank()) + 
  scale_fill_identity() +
  # show I, A, U on axes instead of F1, F2 using a secondary axis
  scale_x_continuous(trans = "reverse",limits=c(2500,400),
                     breaks=1500,labels="A") +
  scale_y_continuous(trans = "reverse",limits=c(800,200),
                     breaks=200,labels="I",
                     sec.axis = sec_axis(~. * 1, breaks=200,labels="U")) +
  geom_point(pch=21,colour="grey",position=position_dodge(width=200),
             aes(fill=colour),size=6) +
  facet_wrap(~anonid, labeller = as_labeller(pid_labels)) +
  theme(strip.background = element_rect(fill=NA,colour=NA),axis.line=element_blank(), axis.ticks=element_blank())


# annotate, v1: using annotate()
ggplot(dp,aes(x=F2,y=F1)) +
  theme_bw() + theme(legend.position="none", 
                     axis.ticks=element_blank(),
                     axis.title.x=element_blank(),
                     axis.title.y=element_blank(),
                     panel.grid.major = element_blank(), 
                     panel.grid.minor = element_blank(),
                     panel.border = element_blank()) + 
  theme(text=element_text(size=16,  family="serif")) +
  scale_fill_identity() +
  scale_y_continuous(trans = "reverse",limits=c(900,100),
                     breaks=NULL) +
  scale_x_continuous(trans = "reverse",limits=c(2600,450),
                     breaks=NULL) +
  geom_point(pch=21,colour="black",position=position_dodge(width=100),
             aes(fill=colour),size=6) +
  facet_wrap(~anonid) + theme(strip.text = element_blank()) +
  annotate("text",x=2550,y=150,label="I",size=8) +
  annotate("text",x=1500,y=850,label="A",size=8) +
  annotate("text",x=500,y=150,label="U",size=8)
