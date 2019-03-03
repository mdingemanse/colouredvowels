# Coloured vowels: workspace
# --------------------------
# Mark Dingemanse

# This is a work space — expect buggy code

# vowelspaces plot dev

# set default vars
pid <- unlist(lapply(c("f999ef","4e6aad","deb5c2ac","fb345da0"),fullpid))
max.consistency <- 150
min.consistency <- 50
dp <- d.full %>%
  filter(anonid %in% pid)

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
