var osimage
var ostext
var browserimage
var browsertext
var version = parseFloat(navigator.appVersion);
var os = navigator.userAgent
var browser_name = navigator.appName;
	if((os.indexOf("Win 9x") != -1) && (os.indexOf("4.9") != -1)){
		ostext='<a href="http://www.microsoft.com/WindowsME/">Microsoft Windows Millennium Edition (ME)</a>'
		osimage='<a href="http://www.microsoft.com/WindowsME/"><img border="0" src=/images/oslogos/bnrWinMEanim.gif></a>'
	}else if((os.indexOf("Win98") != -1) || (os.indexOf("Windows 98") != -1)){
		ostext='<a href="http://www.microsoft.com/windows98/">Microsoft Windows 98</a>'
		osimage='<a href=http://www.microsoft.com/windows98/><img border=0 src=/images/oslogos/bnrWin98.gif></a>'
	}else if((os.indexOf("Win95") != -1) || (os.indexOf("Windows 95") != -1)){
		ostext='<a href=http://www.microsoft.com/windows95/>Microsoft Windows 95</a>'
		osimage='<a href=http://www.microsoft.com/windows95/><img border=0 src=/images/oslogos/bnrWin95.gif></a>'
	}else if (os.indexOf("Windows NT 5.")!=-1){
		ostext="Microsoft Windows 2000"
		osimage="<img src=/images/oslogos/bnrWin2000.gif>"
	}else if ((os.indexOf("Windows NT")!=-1) || (os.indexOf("WinNT") != -1)){
		ostext="Microsoft Windows NT"
		osimage="<img src=/images/oslogos/bnrntw.gif>"
	}else if ((os.indexOf("Windows 3.1")!=-1) || (os.indexOf("Win16") != -1)){
		ostext="Microsoft Windows 3.x"
	}

	if (navigator.appName.substring(0,9) == "Microsoft") {
	        msiestart = (navigator.appVersion.indexOf('(') + 1);
        	msieend = navigator.appVersion.indexOf(')');
	        msiestring = navigator.appVersion.substring(msiestart, msieend);
	        msiearray = msiestring.split(";");
	        platform = msiearray[2];
	        msieversion = msiearray[1].split(" ");
		if (navigator.userAgent.indexOf("MSN")!=-1){
			Component = "MSN Explorer";
			browserimage="<a href=http://explorer.msn.com/home.htm><img border=0 src=/images/browserimages/msne.jpg></a>";
		} else {
        		Component = ("<a href=http://www.microsoft.com/windows/ie/default.htm>" + navigator.appName);
	        	version = (msieversion[2] + "</a>");
			browserimage="<a href=http://www.microsoft.com/windows/ie/default.htm><img border=0 src=/images/browserimages/bnrIE.gif></a>";
		}
	}
	if ((navigator.appName.substring(0,8) == "Netscape") && (navigator.userAgent.indexOf("Netscape6") <= 0)) {
        	if (navigator.userAgent.indexOf("Nav") > 0) {
	                Component = "<a href=http://www.netscape.com>Netscape Navigator</a>";
	        }
	        else {
	                Component = "<a href=http://www.netscape.com>Netscape Communicator</a>";
	        }
	        msiestart = (navigator.userAgent.indexOf('(') + 1);
	        msieend = navigator.userAgent.indexOf(')');
	        msiestring = navigator.userAgent.substring(msiestart, msieend);
		browserimage="<a href=http://www.netscape.com><img src=/images/browserimages/netscape.gif></a>";
	}
	if (navigator.userAgent.indexOf("Netscape6") > 0) {
	        Component = "<a href=http://home.netscape.com>Netscape";
	        Netscape6_start = (navigator.userAgent.indexOf("Netscape6") + 10);
	        Netscape6_end = navigator.userAgent.length;
	        version = navigator.userAgent.substring(Netscape6_start,Netscape6_end) + "</a>";
	        msiestart = (navigator.userAgent.indexOf('(') + 1);
	        msieend = navigator.userAgent.indexOf(')');
	        msiestring = navigator.userAgent.substring(msiestart, msieend);
	        msiearray = msiestring.split("; ");
	        langarray = msiearray[3].split("-");
	        lang = langarray[0];
	        if (version.indexOf("b") > 0 ) {
	                preview = version.substring((version.indexOf("b")+1),version.length);
	                shortver = version.substring(0,version.indexOf("b"));
	                version = shortver + " Preview Release " + preview;
	        }
		browserimage="<a href=http://www.netscape.com><img border=0 src=/images/browserimages/netscape.gif></a>";
	}
var browsername = Component
var browserversion = version