/*******************************************************************************
Copyright (c) 1999 Thomas Brattli (www.bratta.com)

eXperience DHTML coolMenus - Get it at www.bratta.com
Version 1.0
This script can be used freely as long as all copyright messages are
intact. Visit www.bratta.com/dhtml for the latest version of the script.

This is the actual script page. You shouldn't really have to edit anything in
here.
*******************************************************************************/
//Default browsercheck, added to all scripts!
function checkBrowser(){
	this.ver=navigator.appVersion
	this.dom=document.getElementById?1:0
	this.ie5=(this.ver.indexOf("MSIE 5")>-1 && this.dom)?1:0;
	this.ie4=(document.all && !this.dom)?1:0;
	this.ns5=(this.dom && parseInt(this.ver) >= 5) ?1:0;
	this.ns4=(document.layers && !this.dom)?1:0;
	this.bw=(this.ie5 || this.ie4 || this.ns4 || this.ns5)
	return this
}
var bw=new checkBrowser()

//Ie var
var explorerev=''
/********************************************************************************
Object constructor and object functions
********************************************************************************/
function makePageCoords(){
	this.x=0;this.x2=(bw.ns4 || bw.ns5)?innerWidth:document.body.offsetWidth-20;
	this.y=0;this.y2=(bw.ns4 || bw.ns5)?innerHeight:document.body.offsetHeight-5;
	this.x50=this.x2/2;	this.y50=this.y2/2;
	return this;
}
function makeMenu(parent,obj,nest,type,num,subnum,subsubnum){
    nest=(!nest) ? '':'document.'+nest+'.'
   	this.css=bw.dom? document.getElementById(obj).style:bw.ie4?document.all[obj].style:bw.ns4?eval(nest+"document.layers." +obj):0;					
	this.evnt=bw.dom? document.getElementById(obj):bw.ie4?document.all[obj]:bw.ns4?eval(nest+"document.layers." +obj):0;		
	this.height=bw.ns4?this.css.document.height:this.evnt.offsetHeight
	this.width=bw.ns4?this.css.document.width:this.evnt.offsetWidth
	this.moveIt=b_moveIt; this.bgChange=b_bgChange;	
	this.clipTo=b_clipTo;
	this.parent=parent;
	this.active=0;
	this.nssubover=0
	if(type==0){
		this.evnt.onmouseover=new Function("mmover("+num+","+this.parent.name+")");
		this.evnt.onmouseout=new Function("mmout("+num+","+this.parent.name+")");
	}else if(type==1){
		this.clipIn=b_clipIn;
		this.clipOut=b_clipOut;
		this.clipy=0
		if(bw.ns4 && this.parent.menueventoff=="mouse"){
			this.evnt.onmouseout=new Function("setTimeout('if(!"+this.parent.name+"["+num+"].nssubover)"+this.parent.name+".hideactive("+num+");',100)")
			this.evnt.onmouseover=new Function(this.parent.name+"["+num+"].nssubover=true")
		}
	}else if(type==2){
		this.evnt.onmouseover=new Function("submmover("+num+","+subnum+","+this.parent.name+")");
		this.evnt.onmouseout=new Function("submmout("+num+","+subnum+","+this.parent.name+")");
	}else if(type==3){
		this.evnt.onmouseover=new Function("subsubmmover("+num+","+subnum+","+subsubnum+","+this.parent.name+")");
		this.evnt.onmouseout=new Function("subsubmmout("+num+","+subnum+","+subsubnum+","+this.parent.name+")");
	}
	this.tim=100
    this.obj = obj + "Object"; 	eval(this.obj + "=this")	
	return this
}
function b_clipTo(t,r,b,l,h){if(bw.ns4){this.css.clip.top=t;this.css.clip.right=r
this.css.clip.bottom=b;this.css.clip.left=l; this.clipx=r;
}else{this.css.clip="rect("+t+","+r+","+b+","+l+")"; this.clipx=r;;
if(h){ if(bw.ie4 || bw.ie5){ this.css.height=b; this.css.width=r}}}}
function b_moveIt(x,y){this.x=x; this.y=y; this.css.left=this.x;this.css.top=this.y}
function b_bgChange(color){if(bw.dom || bw.ie4) this.css.backgroundColor=color;
else if(bw.ns4) this.css.bgColor=color}
function b_clipIn(speed){
	if(this.clipy>0){
		this.clipy-=speed
		if(this.clipy<0) this.clipy=0
		this.clipTo(0,this.clipx,this.clipy,0,1)
		this.tim=setTimeout(this.obj+".clipIn("+speed+")",10)
	}else{this.clipy=0; this.clipTo(0,this.clipx,this.clipy,0,1)}	
}
function b_clipOut(speed){
	if(this.clipy<this.clipheight){
		this.clipy+=speed
		this.clipTo(0,this.clipx,this.clipy,0,1)
		this.tim=setTimeout(this.obj+".clipOut("+speed+")",10)
	}else{this.clipy=this.clipheight; this.clipTo(0,this.clipx,this.clipy,0,1)}
}
//Page variable, holds the width and height of the document. (see documentsize tutorial on bratta.com/dhtml)
var page=new makePageCoords()

/********************************************************************************
Checking if the values are % or not.
********************************************************************************/
function checkp(num,lefttop){
	if(num){
		if(num.toString().indexOf("%")!=-1){
			if(this.menurows)num=(page.x2*parseFloat(num)/100)
			else num=(page.y2*parseFloat(num)/100)
		}else num=parseFloat(num)
	}else num=0
	return num
}
/********************************************************************************
Menu object, constructing menu ++
********************************************************************************/
function menuObj(name){
	this.makeStyle=makeStyle;
	this.makeMain=makeMain;
	this.makeSub=makeSub;
	this.makeSubSub=makeSubSub
	this.mainmenus=0; 
	this.submenus=new Array()
	this.construct=constructMenu;
	this.checkp=checkp;
	this.name=name;
	this.menumain=menumain;
	this.hidemain=hidemain;
	this.hideactive=hideactive;
	this.menusub=menusub;
	this.hidesubs=hidesubs;
}
function constructMenu(){
	bw=new checkBrowser()
	page=new makePageCoords()
	//Checking numbers for %
	this.mainwidth=checkp(this.mainwidth,0)
	this.mainheight=checkp(this.mainheight,1)
	this.subplacement=checkp(this.subplacement,1)
	this.subwidth=checkp(this.subwidth,0)
	this.subheight=checkp(this.subheight,1)
	this.subsubwidth=checkp(this.subsubwidth,0)
	this.subsubheight=checkp(this.subsubheight,1)
	this.subsubXplacement=checkp(this.subsubXplacement,1)
	this.subsubYplacement=checkp(this.subsubYplacement,1)
	if(this.backgroundbar){ //Backgroundbar part
		this.oBackgroundbar=new makeMenu(this,'div'+this.name+'Backgroundbar','',-1)
		this.oBackgroundbar.moveIt(this.checkp(this.backgroundbarfromleft,0),this.checkp(this.backgroundbarfromtop,1))
		if(this.menurows) this.oBackgroundbar.clipTo(0,this.checkp(this.backgroundbarsize),this.mainheight,0,1)
		else this.oBackgroundbar.clipTo(0,this.mainwidth,this.checkp(this.backgroundbarsize),0,1)
		this.oBackgroundbar.bgChange(this.backgroundbarcolor)
	}
	this.x=this.checkp(this.fromleft,0); this.y=this.checkp(this.fromtop,1);
	for(i=0;i<this.mainmenus;i++){
		this[i]=new makeMenu(this,'div'+this.name+'Main'+i,'',0,i)
		this[i].clipTo(0,this.mainwidth,this.mainheight,0,1)
		if(this.menuplacement!=0){
			if(this.menurows) this.x=this.checkp(this.menuplacement[i])
			else this.y=this.checkp(this.menuplacement[i])
		}
		this[i].moveIt(this.x,this.y)
		this[i].bgChange(this.mainbgcoloroff)
		if(!this.menurows) this.y+=this.mainheight+this.checkp(this.pxbetween)
		else this.x+=this.mainwidth+this.checkp(this.pxbetween)
		if(this.submenus[i]!='nosub'){
			this[i].subs=new makeMenu(this,'div'+this.name+'Sub'+i,'',1,i,-1)
			if(!this.menurows) this[i].subs.moveIt(this.subplacement+this[i].x,this[i].y)
			else this[i].subs.moveIt(this[i].x,this[i].y+this.subplacement)
			this.suby=0;
			this[i].sub=new Array()
			for(j=0;j<this.submenus[i]["main"];j++){
				this[i].sub[j]=new makeMenu(this,'div'+this.name+'Sub'+i+'_'+j,'div'+this.name+'Sub'+i,2,i,j)
				this[i].sub[j].clipTo(0,this.subwidth,this.subheight,0,1)
				this[i].sub[j].moveIt(0,this.suby)
				this[i].sub[j].bgChange(this.subbgcoloroff)
				this.suby+=this.subheight
				if(this.submenus[i]["submenus"][j]>0){
					this.subsuby=0
					this[i].sub[j].subs=new makeMenu(this,'div'+this.name+'Sub'+i+'_'+j+'_sub','',1,i,j)
					this[i].sub[j].subs.moveIt(this[i].subs.x+this.subsubXplacement,this[i].subs.y+this[i].sub[j].y+this.subsubYplacement)
					this[i].sub[j].sub=new Array()
					for(a=0;a<this.submenus[i]["submenus"][j];a++){
						this[i].sub[j].sub[a]=new makeMenu(this,'div'+this.name+'Sub'+i+'_'+j+'_sub'+a,'div'+this.name+'Sub'+i+'_'+j+'_sub',3,i,j,a)
						this[i].sub[j].sub[a].clipTo(0,this.subsubwidth,this.subsubheight,0,1)
						this[i].sub[j].sub[a].moveIt(0,this.subsuby)
						this[i].sub[j].sub[a].bgChange(this.subsubbgcoloroff)
						this.subsuby+=this.subsubheight
					}
					this[i].sub[j].subs.clipTo(0,this.subsubwidth,0,0,1)
					this[i].sub[j].subs.clipheight=this.subsuby
				}else this[i].sub[j].subs=0
			}
			this[i].subs.clipTo(0,this.subwidth,0,0,1)
			this[i].subs.clipheight=this.suby
		}else this[i].subs=0
	}
	setTimeout("window.onresize=resized;",500)
	if(this.menueventoff=="mouse"){
		explorerev+=this.name+".hidemain(-1);"
		document.onmouseover=new Function(explorerev)
	}
}
function resized(){
	page2=new makePageCoords()
	if(page2.x2!=page.x2 || page.y2!=page2.y2) location.reload()
}

/*********************************************************************************************
Mouseevents (name==this (as in made object, not the event "this"))
*********************************************************************************************/
function cancelEv(){
	if(bw.ie4 || bw.ie5) window.event.cancelBubble=true
}
function mmover(num,name){
	name[num].bgChange(name.mainbgcoloron)
	if(name.menueventon=="mouse") name.menumain(num,1)
	name[num].nssubover=true
	cancelEv()
}
function mmout(num,name){
	if(!isNaN(num)){
		if(name[num].subs==0 || !name.stayoncolor || !name[num].active)
		name[num].bgChange(name.mainbgcoloroff); 
		name[num].nssubover=false
		if(name.menueventoff=="mouse") if(bw.ns4) setTimeout("if(!"+name.name+"["+num+"].nssubover) "+name.name+".hideactive("+num+")",100)
	} 
	cancelEv()
}
function submmover(num,subnum,name){
	name[num].sub[subnum].bgChange(name.subbgcoloron)
	if(name.menueventon=="mouse") {name.menusub(num,subnum,1)}
	name[num].nssubover=true
	cancelEv()
}
function submmout(num,subnum,name){
	if(!isNaN(subnum)){
		name[num].nssubover=false;
		if(!name.stayoncolor || !name[num].sub[subnum].active || name[num].sub[subnum].subs==0)
		name[num].sub[subnum].bgChange(name.subbgcoloroff)
	}
	cancelEv()
}
function subsubmmover(num,subnum,subsubnum,name){
	if(!isNaN(subnum)){
		name[num].sub[subnum].sub[subsubnum].bgChange(name.subsubbgcoloron); 
		name[num].nssubover=true
	}
	cancelEv()
}
function subsubmmout(num,subnum,subsubnum,name){
	if(!isNaN(subnum)){
		name[num].nssubover=false; 
		name[num].sub[subnum].sub[subsubnum].bgChange(name.subsubbgcoloroff)
	}
	cancelEv()
}
/*********************************************************************************************
Showing submenus
*********************************************************************************************/
function menumain(num,mouse){
	if(this[num].subs!=0){
		clearTimeout(this[num].subs.tim)
		if(this[num].subs.clipy==0 || mouse){
			this.hidemain(num); this[num].subs.clipOut(this.menuspeed); this[num].active=1
		}else{
			this.hidemain(-1); this[num].active=0
		}
	}
}
/*********************************************************************************************
Showing subsubmenus
*********************************************************************************************/
function menusub(num,sub,mouse){
	this.hidesubs(num,sub)
	if(this[num].sub[sub].subs!=0){
		if(this[num].sub[sub].subs.clipy==0 || mouse){
			this[num].sub[sub].active=1
			this[num].sub[sub].subs.clipOut(this.menusubspeed)
		}else{
			this[num].sub[sub].active=0
			this[num].sub[sub].subs.clipIn(this.menusubspeed)
		}
	}
}
/*********************************************************************************************
Hides the other sub menuitems if any are shown. Also calls the hidesubs to hide any showing
submenus.
*********************************************************************************************/
function hidemain(num){
	for(i=0;i<this.mainmenus;i++){
		if(this[i].subs!=0){
			if(this[i].subs.clipy<=this[i].subs.clipheight){
				this.hidesubs(i,100)
				if(i!=num){
					clearTimeout(this[i].subs.tim)
					this[i].active=0
					this[i].bgChange(this.mainbgcoloroff)
					if(this.menurows)this[i].subs.clipIn(this.menuspeed)
					else{this[i].subs.clipy=0; this[i].subs.clipTo(0,this[i].subs.clipx,this[i].subs.clipy,0,1)}
				}
			}
		}else this[i].bgChange(this.mainbgcoloroff)
	}
}
/*********************************************************************************************
Hides the active submenuitems
*********************************************************************************************/
function hideactive(num){
	if(this[num].subs!=0){
		this.hidesubs(num,100)
		clearTimeout(this[num].subs.tim)
		this[num].active=0
		this[num].bgChange(this.mainbgcoloroff)
		if(this.menurows)this[num].subs.clipIn(this.menuspeed)
		else{this[num].subs.clipy=0; this[num].subs.clipTo(0,this[num].subs.clipx,this[num].subs.clipy,0,1)}
	}
}
/*********************************************************************************************
Hides the other subsub menuitems if any are shown.
*********************************************************************************************/
function hidesubs(num,sub){
	for(j=0;j<this[num].sub.length;j++){
		if(this[num].sub[j].subs!=0 && j!=sub){
			if(this[num].sub[j].subs.clipy<=this[num].sub[j].subs.clipy
			|| this[num].subs.clipy<this[num].subs.clipheight){
				clearTimeout(this[num].sub[j].subs.tim)
				this[num].sub[j].active=0
				this[num].sub[j].bgChange(this.subbgcoloroff)
				this[num].sub[j].subs.clipy=0
				this[num].sub[j].subs.clipTo(0,this[num].sub[j].subs.clipx,this[num].sub[j].subs.clipy,0,1)
			}
		}
	}
}
/*********************************************************************************************
These are the functions that writes the style and menus to the page. 
*********************************************************************************************/
function makeStyle(){
	str='\n<style type="text/css">\n'
	str+="\n<!-- DHTML CoolMenus from www.bratta.com -->\n\n"
	str+='\tDIV.cl'+this.name+'Main{position:absolute; z-index:51; clip:rect(0,0,0,0); overflow:hidden; width:'+(this.mainwidth-10)+'; '+this.clMain+'}\n'
	str+='\tDIV.cl'+this.name+'Sub{position:absolute; z-index:52; clip:rect(0,0,0,0); overflow:hidden; width:'+(this.subwidth-10)+'; '+this.clSub+'}\n'
	str+='\tDIV.cl'+this.name+'SubSub{position:absolute; z-index:54; clip:rect(0,0,0,0); width:'+(this.subsubwidth-10)+'; '+this.clSubSub+'}\n'
	str+='\tDIV.cl'+this.name+'Subs{position:absolute; z-index:53; clip:rect(0,0,0,0); overflow:hidden}\n'
	str+='\t#div'+this.name+'Backgroundbar{position:absolute; z-index:50; clip:rect(0,0,0,0); overflow:hidden}\n'
	str+='\tA.clA'+this.name+'Main{'+this.clAMain+'}\n'
	str+='\tA.clA'+this.name+'Sub{'+this.clASub+'}\n'
	str+='\tA.clA'+this.name+'SubSub{'+this.clASubSub+'}\n'
	str+='</style>\n\n'
	document.write(str)
}
function makeMain(num,text,link,target){
	str=""
	if(this.backgroundbar && num==0){str+='\n<div id="div'+this.name+'Backgroundbar"></div>\n'}
	str+='<div id="div'+this.name+'Main'+num+'" class="cl'+this.name+'Main">'
	if(link){ str+='<a href="'+link+'"'; this.submenus[num]='nosub'
	}else str+='<a href="#" onclick="'+this.name+'.menumain('+num+'); return false"'
	if(target) str+=' target="'+target+'" '
	str+=' class="clA'+this.name+'Main">'+text+'</a></div>\n'
	this.mainmenus++; 
	document.write(str)
}
function makeSub(num,subnum,text,link,total,target){
	str=""
	if(subnum==0) str='<div id="div'+this.name+'Sub'+num+'" class="cl'+this.name+'Subs">\n'
	str+='\t<div id="div'+this.name+'Sub'+num+'_'+subnum+'" class="cl'+this.name+'Sub">'
	if(link) str+='<a href="'+link+'"'; else str+='<a href="#" onclick="'+this.name+'.menusub('+num+','+subnum+'); return false"'
	if(target) str+=' target="'+target+'" '
	str+=' class="clA'+this.name+'Sub">'+text+'</a></div>\n'
	if(subnum==total-1){
		str+='</div>\n'; this.submenus[num]=new Array()
		this.submenus[num]["main"]=total; this.submenus[num]["submenus"]=new Array()
	}
	document.write(str)
}
function makeSubSub(num,subnum,subsubnum,text,link,total,target){
	str=""
	if(subsubnum==0) str='<div id="div'+this.name+'Sub'+num+'_'+subnum+'_sub" class="cl'+this.name+'Subs">\n'
	str+='\t<div id="div'+this.name+'Sub'+num+'_'+subnum+'_sub'+subsubnum+'" class="cl'+this.name+'SubSub">'
	if(link) str+='<a href="'+link+'"'; else str+='<a href="#"'
	if(target) str+=' target="'+target+'" '
	str+=' class="clA'+this.name+'SubSub">'+text+'</a></div>\n'
	if(subsubnum==total-1){str+='</div>\n'; this.submenus[num]["submenus"][subnum]=total}
	document.write(str)
}
/*********************************************************************************************
END Menu script
*********************************************************************************************/
