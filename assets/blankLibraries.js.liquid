/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
/*
(function(r,G,f,v){var J=f("html"),n=f(r),p=f(G),b=f.fancybox=function(){b.open.apply(this,arguments)},I=navigator.userAgent.match(/msie/i),B=null,s=G.createTouch!==v,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},q=function(a){return a&&"string"===f.type(a)},E=function(a){return q(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&E(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},w=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.5",defaults:{padding:15,margin:20,
	width:800,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},
	keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
	(I?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item modalClose" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next ion" href="javascript:;"></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev ion" href="javascript:;"></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
	openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
	isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
	c.metadata())):k=c);g=d.href||k.href||(q(c)?c:null);h=d.title!==v?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));q(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":q(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(q(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
	k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==v&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
	b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
	setTimeout(b.next,b.current.playSpeed))},c=function(){d();p.unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,p.bind({"onCancel.player beforeClose.player":c,"onUpdate.player":e,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(q(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},prev:function(a){var d=b.current;
	d&&(q(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==v&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},e.dim,k)))},update:function(a){var d=
	a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(B),B=null);b.isOpen&&!B&&(B=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),B=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),b.trigger("onUpdate")),
	b.update())},hideLoading:function(){p.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");p.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||!1,d={x:n.scrollLeft(),
	y:n.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&r.innerWidth?r.innerWidth:n.width(),d.h=s&&r.innerHeight?r.innerHeight:n.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");p.unbind(".fb");n.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(n.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&p.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=e.target||e.srcElement;
	if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==v)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&"hidden"===h[0].style.overflow)&&
	(h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,e){if(e&&b.helpers[d]&&f.isFunction(b.helpers[d][a]))b.helpers[d][a](f.extend(!0,
	{},b.helpers[d].defaults,e),c)});p.trigger(a)}},isImage:function(a){return q(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSWF:function(a){return q(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,
	mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=
	!0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,w(d.padding[a]))});b.trigger("onReady");if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");
	"image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=this.width/b.opts.pixelRatio;b.coming.height=this.height/b.opts.pixelRatio;b._afterLoad()};a.onerror=function(){this.onload=
	this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);
	f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,
	e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,
	outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",!1)}));break;case "image":e=a.tpl.image.replace("{href}",
	g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");a.inner.css("overflow","yes"===k?"scroll":
	"no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,p=h.maxHeight,s=h.scrolling,q=h.scrollOutside?
	h.scrollbarWidth:0,x=h.margin,y=l(x[1]+x[3]),r=l(x[0]+x[2]),v,z,t,C,A,F,B,D,H;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");x=l(k.outerWidth(!0)-k.width());v=l(k.outerHeight(!0)-k.height());z=y+x;t=r+v;C=E(c)?(a.w-z)*l(c)/100:c;A=E(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(H=h.content,h.autoHeight&&1===H.data("ready"))try{H[0].contentWindow.document.location&&(g.width(C).height(9999),F=H.contents().find("body"),q&&F.css("overflow-x","hidden"),A=F.outerHeight(!0))}catch(G){}}else if(h.autoWidth||
	h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(C),h.autoHeight||g.height(A),h.autoWidth&&(C=g.width()),h.autoHeight&&(A=g.height()),g.removeClass("fancybox-tmp");c=l(C);j=l(A);D=C/A;m=l(E(m)?l(m,"w")-z:m);n=l(E(n)?l(n,"w")-z:n);u=l(E(u)?l(u,"h")-t:u);p=l(E(p)?l(p,"h")-t:p);F=n;B=p;h.fitToView&&(n=Math.min(a.w-z,n),p=Math.min(a.h-t,p));z=a.w-y;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/D)),j>p&&(j=p,c=l(j*D)),c<m&&(c=m,j=l(c/D)),j<u&&(j=u,c=l(j*D))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&
	"iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,p)));if(h.fitToView)if(g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height(),h.aspectRatio)for(;(a>z||y>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(p,j-10)),c=l(j*D),c<m&&(c=m,j=l(c/D)),c>n&&(c=n,j=l(c/D)),g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height();else c=Math.max(m,Math.min(c,c-(a-z))),j=Math.max(u,Math.min(j,j-(y-r)));q&&("auto"===s&&j<A&&c+x+q<z)&&(c+=q);g.width(c).height(j);e.width(c+x);a=e.width();
	y=e.height();e=(a>z||y>r)&&c>m&&j>u;c=h.aspectRatio?c<F&&j<B&&c<C&&j<A:(c<F||j<B)&&(c<C||j<A);f.extend(h,{dim:{width:w(a),height:w(y)},origWidth:C,origHeight:A,canShrink:e,canExpand:c,wPadding:x,hPadding:v,wrapSpace:y-k.outerHeight(!0),skinSpace:k.height()-j});!H&&(h.autoHeight&&j>u&&j<p&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",top:c[0],left:c[3]};d.autoCenter&&d.fixed&&
	!a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=w(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=w(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&(d.preventDefault(),
	b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
	a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
	(c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:w(c.top-h*a.topRatio),left:w(c.left-j*a.leftRatio),width:w(f+j),height:w(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===
	f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
	{duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=w(l(e[g])-200),c[g]="+=200px"):(e[g]=w(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
	b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,el:f("html"),create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=
	f('<div class="fancybox-overlay"></div>').appendTo(b.coming?b.coming.parent:a.parent);this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(n.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){if(f(a.target).hasClass("fancybox-overlay"))return b.isActive?
	b.close():d.close(),!1});this.overlay.css(a.css).show()},close:function(){var a,b;n.unbind("resize.overlay");this.el.hasClass("fancybox-lock")&&(f(".fancybox-margin").removeClass("fancybox-margin"),a=n.scrollTop(),b=n.scrollLeft(),this.el.removeClass("fancybox-lock"),n.scrollTop(a).scrollLeft(b));f(".fancybox-overlay").remove().hide();f.extend(this,{overlay:null,fixed:!1})},update:function(){var a="100%",b;this.overlay.width(a).height("100%");I?(b=Math.max(G.documentElement.offsetWidth,G.body.offsetWidth),
	p.width()>b&&(a=p.width())):p.width()>n.width()&&(a=p.width());this.overlay.width(a).height(p.height())},onReady:function(a,b){var e=this.overlay;f(".fancybox-overlay").stop(!0,!0);e||this.create(a);a.locked&&(this.fixed&&b.fixed)&&(e||(this.margin=p.height()>n.height()?f("html").css("margin-right").replace("px",""):!1),b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){var e,c;b.locked&&(!1!==this.margin&&(f("*").filter(function(){return"fixed"===
	f(this).css("position")&&!f(this).hasClass("fancybox-overlay")&&!f(this).hasClass("fancybox-wrap")}).addClass("fancybox-margin"),this.el.addClass("fancybox-margin")),e=n.scrollTop(),c=n.scrollLeft(),this.el.addClass("fancybox-lock"),n.scrollTop(e).scrollLeft(c));this.open(a)},onUpdate:function(){this.fixed||this.update()},afterClose:function(a){this.overlay&&!b.coming&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=
	b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(q(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),I&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,
	e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):p.undelegate(c,"click.fb-start").delegate(c+
	":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};p.ready(function(){var a,d;f.scrollbarWidth===v&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===v){a=f.support;d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body");var e=20===
	d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")});a=f(r).width();J.addClass("fancybox-lock-test");d=f(r).width();J.removeClass("fancybox-lock-test");f("<style type='text/css'>.fancybox-margin{margin-right:"+(d-a)+"px;}</style>").appendTo("head")})})(window,document,jQuery);
*/	
//(function(a){a.isScrollToFixed=function(b){return !!a(b).data("ScrollToFixed")};a.ScrollToFixed=function(d,i){var m=this;m.$el=a(d);m.el=d;m.$el.data("ScrollToFixed",m);var c=false;var H=m.$el;var I;var F;var k;var e;var z;var E=0;var r=0;var j=-1;var f=-1;var u=null;var A;var g;function v(){H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");f=-1;E=H.offset().top;r=H.offset().left;if(m.options.offsets){r+=(H.offset().left-H.position().left)}if(j==-1){j=r}I=H.css("position");c=true;if(m.options.bottom!=-1){H.trigger("preFixed.ScrollToFixed");x();H.trigger("fixed.ScrollToFixed")}}function o(){var J=m.options.limit;if(!J){return 0}if(typeof(J)==="function"){return J.apply(H)}return J}function q(){return I==="fixed"}function y(){return I==="absolute"}function h(){return !(q()||y())}function x(){if(!q()){var J=H[0].getBoundingClientRect();u.css({display:H.css("display"),width:J.width,height:J.height,"float":H.css("float")});cssOptions={/*"z-index":m.options.zIndex,*/position:"fixed",top:m.options.bottom==-1?t():"",bottom:m.options.bottom==-1?"":m.options.bottom,"margin-left":"0px"};if(!m.options.dontSetWidth){cssOptions.width=H.css("width")}H.css(cssOptions);H.addClass(m.options.baseClassName);if(m.options.className){H.addClass(m.options.className)}I="fixed"}}function b(){var K=o();var J=r;if(m.options.removeOffsets){J="";K=K-E}cssOptions={position:"absolute",top:K,left:J,"margin-left":"0px",bottom:""};if(!m.options.dontSetWidth){cssOptions.width=H.css("width")}H.css(cssOptions);I="absolute"}function l(){if(!h()){f=-1;u.css("display","none");H.css({/*"z-index":z,*/width:"",position:F,left:"",top:e,"margin-left":""});H.removeClass("scroll-to-fixed-fixed");if(m.options.className){H.removeClass(m.options.className)}I=null}}function w(J){if(J!=f){H.css("left",r-J);f=J}}function t(){var J=m.options.marginTop;if(!J){return 0}if(typeof(J)==="function"){return J.apply(H)}return J}function B(){if(!a.isScrollToFixed(H)||H.is(":hidden")){return}var M=c;var L=h();if(!c){v()}else{if(h()){E=H.offset().top;r=H.offset().left}}var J=a(window).scrollLeft();var N=a(window).scrollTop();var K=o();if(m.options.minWidth&&a(window).width()<m.options.minWidth){if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}else{if(m.options.maxWidth&&a(window).width()>m.options.maxWidth){if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}else{if(m.options.bottom==-1){if(K>0&&N>=K-t()){if(!L&&(!y()||!M)){p();H.trigger("preAbsolute.ScrollToFixed");b();H.trigger("unfixed.ScrollToFixed")}}else{if(N>=E-t()){if(!q()||!M){p();H.trigger("preFixed.ScrollToFixed");x();f=-1;H.trigger("fixed.ScrollToFixed")}w(J)}else{if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}}}else{if(K>0){if(N+a(window).height()-H.outerHeight(true)>=K-(t()||-n())){if(q()){p();H.trigger("preUnfixed.ScrollToFixed");if(F==="absolute"){b()}else{l()}H.trigger("unfixed.ScrollToFixed")}}else{if(!q()){p();H.trigger("preFixed.ScrollToFixed");x()}w(J);H.trigger("fixed.ScrollToFixed")}}else{w(J)}}}}}function n(){if(!m.options.bottom){return 0}return m.options.bottom}function p(){var J=H.css("position");if(J=="absolute"){H.trigger("postAbsolute.ScrollToFixed")}else{if(J=="fixed"){H.trigger("postFixed.ScrollToFixed")}else{H.trigger("postUnfixed.ScrollToFixed")}}}var D=function(J){if(H.is(":visible")){c=false;B()}else{l()}};var G=function(J){(!!window.requestAnimationFrame)?requestAnimationFrame(B):B()};var C=function(){var K=document.body;if(document.createElement&&K&&K.appendChild&&K.removeChild){var M=document.createElement("div");if(!M.getBoundingClientRect){return null}M.innerHTML="x";M.style.cssText="position:fixed;top:100px;";K.appendChild(M);var N=K.style.height,O=K.scrollTop;K.style.height="3000px";K.scrollTop=500;var J=M.getBoundingClientRect().top;K.style.height=N;var L=(J===100);K.removeChild(M);K.scrollTop=O;return L}return null};var s=function(J){J=J||window.event;if(J.preventDefault){J.preventDefault()}J.returnValue=false};m.init=function(){m.options=a.extend({},a.ScrollToFixed.defaultOptions,i);/*z=H.css("z-index");m.$el.css("z-index",m.options.zIndex);*/u=a("<div />");I=H.css("position");F=H.css("position");k=H.css("float");e=H.css("top");if(h()){m.$el.after(u)}a(window).bind("resize.ScrollToFixed",D);a(window).bind("scroll.ScrollToFixed",G);if("ontouchmove" in window){a(window).bind("touchmove.ScrollToFixed",B)}if(m.options.preFixed){H.bind("preFixed.ScrollToFixed",m.options.preFixed)}if(m.options.postFixed){H.bind("postFixed.ScrollToFixed",m.options.postFixed)}if(m.options.preUnfixed){H.bind("preUnfixed.ScrollToFixed",m.options.preUnfixed)}if(m.options.postUnfixed){H.bind("postUnfixed.ScrollToFixed",m.options.postUnfixed)}if(m.options.preAbsolute){H.bind("preAbsolute.ScrollToFixed",m.options.preAbsolute)}if(m.options.postAbsolute){H.bind("postAbsolute.ScrollToFixed",m.options.postAbsolute)}if(m.options.fixed){H.bind("fixed.ScrollToFixed",m.options.fixed)}if(m.options.unfixed){H.bind("unfixed.ScrollToFixed",m.options.unfixed)}if(m.options.spacerClass){u.addClass(m.options.spacerClass)}H.bind("resize.ScrollToFixed",function(){u.height(H.height())});H.bind("scroll.ScrollToFixed",function(){H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");B()});H.bind("detach.ScrollToFixed",function(J){s(J);H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");a(window).unbind("resize.ScrollToFixed",D);a(window).unbind("scroll.ScrollToFixed",G);H.unbind(".ScrollToFixed");u.remove();m.$el.removeData("ScrollToFixed")});D()};m.init()};a.ScrollToFixed.defaultOptions={marginTop:0,limit:0,bottom:-1,zIndex:1000,baseClassName:"scroll-to-fixed-fixed"};a.fn.scrollToFixed=function(b){return this.each(function(){(new a.ScrollToFixed(this,b))})}})(jQuery);
/*
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};


/*
function ajaxCartPriceCompare(){
	setTimeout(function() {
		$('.cartItem').each(function () {
			var ogAjaxPrice = parseInt($(this).find('.ogCartPrice').html().replace('$', '')),
				nuAjaxPrice = parseInt($(this).find('.cartItemTotal').html().replace('$', ''));
			if (ogAjaxPrice <= nuAjaxPrice){
				$(this).find('.ogCartStrike').remove();
			}
		});
	}, 150);
}
!function(a){function b(b,c,d){b.on("mousedown.ba-events touchstart.ba-events",function(e){$('.baTut').fadeTo("slow", 0);b.addClass("ba-draggable"),c.addClass("ba-resizable");var f=e.pageX?e.pageX:e.originalEvent.touches[0].pageX,g=b.outerWidth(),h=b.offset().left+g-f,i=d.offset().left,j=d.outerWidth();minLeft=i+10,maxLeft=i+j-g-10,b.parents().on("mousemove.ba-events touchmove.ba-events",function(b){var c=b.pageX?b.pageX:b.originalEvent.touches[0].pageX;leftValue=c+h-g,leftValue<minLeft?leftValue=minLeft:leftValue>maxLeft&&(leftValue=maxLeft),widthValue=100*(leftValue+g/2-i)/j+"%",a(".ba-draggable").css("left",widthValue),a(".ba-resizable").css("width",widthValue)}).on("mouseup.ba-events touchend.ba-events touchcancel.ba-events",function(){b.removeClass("ba-draggable"),c.removeClass("ba-resizable"),a(this).off(".ba-events")}),e.preventDefault()})}a.fn.beforeAfter=function(){var c=this,d=c.width()+"px";c.find(".resize img").css("width",d),b(c.find(".handle"),c.find(".resize"),c),a(window).resize(function(){var a=c.width()+"px";c.find(".resize img").css("width",a)})}}(jQuery);
*/
!function(coreUI,$){
	coreUI.init = function() {
		$( ".accordion" ).accordion({
			collapsible: true,
			heightStyle: "content",
			icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
			active: false
		});
		$('.bbTabs').each(function(){
			$(this).tabs();
		});
		var tileBtn = $('.tile'),
			allContent = $('.tileWrapper'),
			contentWrap = $('.tileContent');
			
		tileBtn.on('click', function() {
			var self = $(this),
				match = self.attr('data-tile'),
				allContent = $('.tileWrapper'),
				content = $('div#' + match);
			self.toggleClass('active');
			content.toggleClass('active');
			contentWrap.css({'transition-delay': '.35s'});
			return false;
		});
		$('.tileContent').on('click', function(e) {
			e.stopPropagation();
		});
		$('.tileWrapper, .tileClose').on('click', function() {
			if (allContent.hasClass('active') && tileBtn.hasClass('active')) {
				allContent.removeClass('active');
				setTimeout(function() {
					tileBtn.removeClass('active');
				}, 400);
				contentWrap.css({'transition-delay': '.0s'});
			}
		});
		$('.tile').each(function(){
			var ctrlVal = $(this).data('tile');
			$(this).attr('role','tab').attr('aria-selected','false').attr('aria-controls', ctrlVal).attr('id',ctrlVal + 'Tab');
		});

		$('.ba-slider').beforeAfter();
		var windowWidth = $(window).width();
			if(windowWidth <= 767) {
			$('#collModifier').accordion({
				collapsible: true,
				active: false,
				heightStyle: "content"
			});
		}
		$('#hCtrstTrig').click(function(){
			var highContrastSet = Cookies.get('highContrast');
			if(highContrastSet == 'false'){
				Cookies.set("highContrast", true, { path: '/'});
				$('#hCtrstTrig').attr('aria-checked','true');
				
			}
			else{
				Cookies.set("highContrast", false, { path: '/'});
				$('#hCtrstTrig').attr('aria-checked','false');
			}
			$('body').toggleClass('hCtrst');
		});
		/*
		$('.bbTabs li').each(function(){
			var ctrlVal = $(this).find('a').attr('href').replace('\#','');
			$(this).attr('role','tab').attr('aria-controls', ctrlVal).attr('id',ctrlVal + 'Tab');
		});
		*/
		$('.bbTabs > div').each(function(){
			var labelBy = $(this).attr('id');
			$(this).attr('role','tabpanel').attr('aria-labelledby', labelBy + 'Tab').attr('aria-hidden','true');
		});
		$("li[role='tab']").click(function(){  
			var tabpanid= $(this).attr("aria-controls"),
				tabpan = $("#"+tabpanid);  
			$("li[role='tab']").attr("aria-selected","false"); 
			$(this).attr("aria-selected","true");  
			$("div[role='tabpanel']").attr("aria-hidden","true"); 
			tabpan.attr("aria-hidden","false");
		});
		if($(window).width() <= 767){
			$('.footer_menu:not("#footerContact")').accordion({
				collapsible: true,
				active: false,
				heightStyle: "content"
			});
		}
	}
}(window.coreUI = window.coreUI || {}, jQuery),
	/*
	function(Overlay, $) {
	var overlay = $(".overlay")
	Overlay.show = function() {
		overlay.addClass('is-active');
		Scroll.lock();
	}, Overlay.hide = function() {
		overlay.removeClass('is-active');
		Scroll.unlock();
	}, Overlay.toggle = function() {
		overlay.toggleClass('is-active');
	}, Overlay.init = function() {
		overlay.on("click", function() {
			Overlay.hide(), bbModal.hide()
		})
	}
}(window.Overlay = window.Overlay || {}, jQuery),
function(bbModal, $) {
	bbModal.show = function(modalName) {
		Overlay.show();
		var	modal = $('[data-modal="' + modalName + '"]');
		modal.length && (Overlay.show(), modal.fadeIn(300, function() {
			($("body").attr("data-active-modal", modalName),
			"shade" == modalName)
		}).addClass("is-active").attr('aria-hidden','false'))
	}, 
	bbModal.hide = function() {
		 $(".modal.is-active").fadeOut(300).removeClass("is-active").attr('aria-hidden','true'), $("body").removeAttr("data-active-modal"), Overlay.hide();
	}, 
	bbModal.init = function() {
		$("[data-modal-show]").on("click", function(event) { 
			event.preventDefault(), 
			bbModal.show( $(this).attr("data-modal-show") );
		}), 
		$("[data-modal-hide]").on("click", function(event) {
			event.preventDefault(), bbModal.hide()
		});
		$("[data-modal-show]").keyup(function(event) {
			if (event.keyCode === 13) {
				$(this).click();
			}
		});
		$("[data-modal-hide]").keyup(function(event) {
			if (event.keyCode === 13) {
				$(this).click();
			}
		});
	}
}(window.bbModal = window.bbModal || {}, jQuery),
function(AddToCart, $) {
	var addItem = function(variantId, qty) {	
			if (!qty){
				qty = 1;
			}
			CartJS.addItem(variantId, qty, {}, {	
				success: function(data, textStatus, jqXHR) {	
					bbModal.hide()	
				},	
				error: function(jqXHR, textStatus, errorThrown) {	
					alert("Error: " + errorThrown + "!")	
				}	
			})
		};
	AddToCart.init = function() {
		$('#main, .bb-stickyBar').on('click', '.add_to_cart', function(t) {
			t.preventDefault();

			var addProductID = $(this).closest('.productForm').find('[name="id"]').val(),
				qty = $("[data-mob-qty-amount]").val(),
                addedProdInfo={};
            let addedProductName = $(this).closest('.productForm').data('product-name'),
                addedPrice = $(this).closest('.productForm').data('product-price')
          	addedProdInfo.product_name = addedProductName;
          	addedProdInfo.product_price = addedPrice;
			if($(this).closest('.productForm').data('product-id') == 7486043422910){
				var rawVarStr = $(this).closest('.productForm').data('rand-var'),
					rawVarStr = rawVarStr.replace(/\s/g,''),
					rawArr = rawVarStr.split(","),
			
					randVarArr =  rawArr.map(Number),
					fallBackArr = rawArr.map(Number);

				$('.cartItem').each(function(){
					var cartIDCheck = $(this).find('h5 a').attr('href'),
						cartIDCheck = parseInt(cartIDCheck.match(/[^=]*$/).toString());

					if(randVarArr.includes(cartIDCheck)){
						randVarArr = randVarArr.filter(e => e !== cartIDCheck);
					}
				});
			
				if(randVarArr.length > 0){
					var randVar = randVarArr[Math.floor(Math.random() * randVarArr.length)];
					addItem(randVar, 1);
				} else{
					var fallBack = fallBackArr[Math.floor(Math.random() * fallBackArr.length)];
					addItem(fallBack, 1);
				}
			}
			else{
				addItem(addProductID, qty);
			}
			//eventTracking.add(addProductID, addedProdInfo);
			setTimeout(function()
			{
				jQuery.getJSON('/cart.js', function(cart) {
					let items = cart.items.map (item => {
						return {
							"productID" : `${item.product_id}`,
							"sku" : `${item.sku}`,
							"name" : `${item.product_title}`,
							"category" : `${item.product_type}`,
							"quantity" : `${item.quantity}`,
							"itemPrice" : `${item.price}` * 0.01,
							"images" : [encodeURIComponent(`${item.image}`),],
							"url" : encodeURIComponent(`${item.url}`)
						}
					})
				});
			}, 300);
		})
	}
}(window.AddToCart = window.AddToCart || {}, jQuery),
function(CartQTY, $) {
	var qtyAdjusters = $(".cart-qty-adjuster");
	CartQTY.init = function() {
		qtyAdjusters.click(function() {
			var qtyInput = $(this).siblings(".cartQTY"),
				qty = parseInt(qtyInput.val());
			if ($(this).hasClass("cart-qty-plus")) {
				var newQty = qty + 1;
				qtyInput.val(newQty)
			} else 1 <= (newQty = qty - 1) && qtyInput.val(newQty);
		});
	}
}(window.CartQTY = window.CartQTY || {}, jQuery),
function(bbCart, $){
	var inlineCart = $('#bbCart'),
		cartTrig = $('.cartTrig, #closeCart'),
		clearCart = $('#clearCart'),
		cartProg = $('#shipProgress'),
		updateSideCart = function (op, button, event) {
			event.stopPropagation();
			let input = $(button).closest(".cartItem").find("input.cartQTY");
			let quantity = (op == "add") ? parseInt(input.val()) + 1 : parseInt(input.val()) - 1;
			if (quantity == 0) return;
			let id = input.attr("data-item_id");
			input.val(quantity);
			let data = {
				quantity: quantity,
				id: id
			}
			fetch("/cart/change.js", {
				method: 'POST',
				credentials: "same-origin",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					//"Content-Type": "application/x-www-form-urlencoded",
				}
			}).then(res => {
				if (res.ok) {
					return res.json();
				}
				throw new Error('Oops! Problem in request.');
			}).then(cart => {
				var priceFormat = parseInt(`${cart.total_price*0.01}`).toFixed(2);
				$("#cartSubtotal span.money").text('$'+ priceFormat);
			}).catch(err => {
				console.error("update failed. Error:", err);
				let input = $(button).closest(".cartItem").find(".cartQTY");
				let quantity = (op == "add") ? parseInt(input.val()) - 1 : parseInt(input.val()) + 1;
				input.val(quantity);
			})
		};
	bbCart.init = function(ctLocale){
		if (ctLocale == "local"){
			var freeShipThresh = 5000
		} else {
			var freeShipThresh = 15000
		}
		cartTrig.click(function(e) {
			e.preventDefault();
			Overlay.toggle();
			inlineCart.toggleClass('open');
			var cartActive = $('#bbCart').hasClass('open');
				//bndlTrackCheck = $('#bundleTracker').hasClass('is-active');
			if (cartActive){
				//var positionLock = $(window).scrollTop();
				inlineCart.attr('aria-hidden','false');
				//$('body').css('top', positionLock * -1);
				//$('.attrStore').attr('styleStore', positionLock);

			}
			else{
				if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)){
					var scrollRaw = $('.attrStore').attr('styleStore'),
						scrollResume = parseInt(scrollRaw, 10);
				}
				else {
					var scrollRaw = $('body').css("top"),
						scrollResume = parseInt(scrollRaw, 10);
						scrollResume = scrollResume *-1;
				}
				$('body').removeClass('modalEnabled');
				//$('body').css('top', "");
				//$(window).scrollTop(scrollResume);
				inlineCart.attr('aria-hidden','true');
			}
		});
		cartTrig.keyup(function(event) {
			if (event.keyCode === 13) {
				$(this).click();
			}
		});
		inlineCart.on('blur', function(){
			if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)){
				var scrollRaw = $('.attrStore').attr('styleStore'),
					scrollResume = parseInt(scrollRaw, 10);
			}
			else {
				var scrollRaw = $('body').css("top"),
					scrollResume = parseInt(scrollRaw, 10);
					scrollResume = scrollResume *-1;
			}
			//$('body').removeClass('modalEnabled').css('top', "");
			//$(window).scrollTop(scrollResume);
			inlineCart.attr('aria-hidden','true');
		});
		$(document).on('cart.ready', function(event, cart) {

		let cartTotal = parseInt(cart.total_price * 0.01).toFixed(2);
			progVal = cart.total_price >= freeShipThresh ? 100 : Math.round((cart.total_price / freeShipThresh ) * 100);
			remainderAmt = ( freeShipThresh - cart.total_price)* 0.01;
			remainderAmt = remainderAmt.toFixed(2);
			remainderString = remainderAmt > 0 ? "$"+remainderAmt + " more" : "Free Shipping!" ;
			cartProg.progressbar({
				value: progVal
			}).children('p').attr('role','alert').attr('aria-label',remainderString).empty().append(remainderString);
			
			$('#cartTotal').html('$' + cartTotal);
			$('.cartCount').html(cart.item_count);
			$('.cartItemDetails h5 a').each(function(){
				let string = $(this).text();
					string = string.replace(/-.*$/ , '' );
					$(this).empty().append(string);
			});
			
    		ajaxCartPriceCompare();
		});
		$(document).on('cart.requestComplete', function(event, cart) {
			let cartTotal = parseInt(cart.total_price * 0.01).toFixed(2);
				progVal = cart.total_price >= freeShipThresh ? 100 : Math.round((cart.total_price / freeShipThresh ) * 100);
				remainderAmt = (freeShipThresh - cart.total_price)* 0.01;
				remainderString = remainderAmt > 0 ? "$"+remainderAmt + " more" : "Free Shipping!" ;
			$('#cartTotal').html('$' + cartTotal);
			$('.cartCount').html(cart.item_count);
			if (cart.total_price >= freeShipThresh){
				$('#cartConfirm').addClass('open').attr('aria-hidden','false');
				setTimeout(function() {
					$('#cartConfirm').removeClass('open').attr('aria-hidden','true');
				}, 2000);
			}		
			cartProg.progressbar({
				value: progVal
			}).children('p').attr('role','alert').attr('aria-label',remainderString).empty().append(remainderString);
			$('#bbCart').addClass('open').attr('aria-hidden','false');
			Overlay.show();

			$('.cartItemDetails h5 a').each(function(){
				let string = $(this).text();
					string = string.replace(/-.*$/ , '' );
					$(this).empty().append(string);
			});
      		var ttqCOArr= [];
            $.each(cart.items, function( index, item ) {
				let currentObj = {"content_id":item.id, "content_type":"product", "quantity":item.quantity,"price":item.price}
                ttqCOArr.push(currentObj)
            });
            var kCart = {
              total_price: cart.total_price/100,
              $value: cart.total_price/100,
              total_discount: cart.total_discount,
              original_total_price: cart.original_total_price/100,
              items: cart.items
            }
            _learnq.push(['track', 'Added to Cart', kCart])
          
            $("#checkout").click(function() {
                document.cookie = "apCookie=no;expires= Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
                localStorage.setItem("optAP", "false");
                
            });
			cart.items.forEach(function(cartItem) {
				$.ajax({ 
					url: '/products/' + cartItem.handle + '.js', 
					dataType: 'json',
					async: false, 
					success: function(product){ 
					if (product.tags.includes('discounted') && product.compare_at_price != null){
						cartItem["original_line_price"] = product.compare_at_price * cartItem["quantity"] ;
					}
					} 
				});
            });
    		ajaxCartPriceCompare();
		});
		$('.cart-qty-adjuster.plus').click(function (e) {
			updateSideCart("add", this, e);
		});
		$('.cart-qty-adjuster.minus').click(function (e) {
			updateSideCart("remove", this, e);
		});
		$("a.remove_item").click( function(e) {
			let data = {
				quantity: 0,
				id: $(this).attr("data-item_id")
			}
			$(this).closest(".cartItem").fadeOut(300);
	
			fetch("/cart/change.js", {
				method: 'POST',
				credentials: "same-origin",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				}
			}).then(res => {
				if(res.ok) {
					return res.json();
				}
				throw new Error('Oops! Problem in request.');
			}).then(cart => {
				var priceFormat = parseInt(`${cart.total_price*0.01}`).toFixed(2);
				$("#cartSubtotal span.money").text('$'+ priceFormat);
			}).catch(err => {
				error(err);
				$(this).closest(".cartItem").fadeIn(300);
				console.error("Remove item Failed With error:", err);
			});
		});
		$(document).click(function(event) {
			if (!$(event.target).closest("#bbCart, a#cart, #mobileCartTriggerFixed").length && $('#bbCart').hasClass("open")){
					$("#bbCart").removeClass("open").attr('aria-hidden','false');
					Overlay.hide();
					$('body').removeClass('modalEnabled');
					if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)){
						var scrollRaw = $('.attrStore').attr('styleStore'),
							scrollResume = parseInt(scrollRaw, 10);
					}
					else {
						var scrollRaw = $('body').css("top"),
							scrollResume = parseInt(scrollRaw, 10);
							scrollResume = scrollResume *-1;
					}
					//$('body').css('top', "");
					//$(window).scrollTop(scrollResume);
			}
		});
		clearCart.click(function() {
			CartJS.clear();
		});
	};
}(window.bbCart = window.bbCart || {} ,jQuery),
function(bbCheckout, $) {
	var checkGift = function(){
		var giftItem = false;
		$.getJSON('/cart.js', function(cart) {	
			let giftCheck = cart.items;

			$.each(giftCheck, function(i,lineItem) {
				if (lineItem.final_price === 0)
				{
					giftItem = true;
                  	return false;
				}
			}); 
			
			if(!giftItem){
				CartJS.addItem(defaultID, 1);
			}
			if (!checkMethod){
				setTimeout(function(){ 
				location.href = '/checkout';
				}, 400);
			}
		});
	},
  	giftCookie = function (cooKey){
		var gwpCookie = $.cookie('gwpCookie');
		if (!gwpCookie) {
			$.cookie('gwpCookie', cooKey, { expires: 7 , path: '/'});
		} 
	};
	bbCheckout.init = function (defaultID, checkMethod){
		$("#checkout").click(function(e) {
          	e.stopPropagation();
			document.cookie = "apCookie=no;expires= Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
			localStorage.setItem("optAP", "false");
            if(defaultID) {
                if (checkMethod) {
                	checkGift(defaultID, checkMethod);
                } else{
					giftCookie(defaultID);
                }	
            }
		});
	}
}(window.bbCheckout = window.bbCheckout || {} ,jQuery),
function(FadeIn, $) {
	var animation = $(".fly-in"),
		fadeBox = $(window),
		checkView = function() {
			var viewHeight = fadeBox.height(),
				windBord = fadeBox.scrollTop() + viewHeight;
			$.each(animation, function() {
				var elmnt = $(this),
				elmntHeight = elmnt.outerHeight();
				elmnt.offset().top + elmntHeight <= windBord && elmnt.parent().addClass("in-view")
			})
		};
		FadeIn.init = function() {
			fadeBox.on("scroll", checkView), fadeBox.on("resize", checkView)
		}
}(window.FadeIn = window.FadeIn || {}, jQuery),
function(GeoLocation, e) {
GeoLocation.get = function(pageType, passdID) {
		var uLocale = localStorage.getItem("uLocale");
		function handleResponse(response) {
			if(!uLocale){
				("North America" == response.continent_name) ? uLocale = "local" : uLocale = "international";
				localStorage.setItem("uLocale", uLocale);
			}
			//GlobalHeader.ticker(uLocale);
			bbCart.init(uLocale);
			
			if(pageType == "index"){
				Sliders.homeBanner(uLocale);
			}else if(pageType.includes('product') && uLocale == "international"){
                let restrictedPDP = [7486043422910,7179920408766,1503118327917,1546847879277];
                if (restrictedPDP.includes(passdID)){
                    $('#pdpTransaction input[name="id"], #pdpTransaction .qtyEdit, #pdpTransaction .add_to_cart').remove();
                    $('.stickyBar-form input[name="id"], .stickyBar-form .qtyEdit, .stickyBar-form .add_to_cart').remove();
                    $('.stickyBar-form .productForm > .flex, #pdpTransaction .productForm > .flex').append('<div class="restrictedPDP"><p>This product is not available in your country.<br/>We apologize for the inconvenience</p></div>');
                }
            }
            else if (pageType.includes('collection')){
        		collectionPage.init(passdID, uLocale);
            }
		}	
		getGeolocation(handleResponse);
	}
}(window.GeoLocation = window.GeoLocation || {}, jQuery),
	*/
function(GlobalHeader, $) {   
	/*
	GlobalHeader.ticker = function(uLocale){
		var promoBar = $("#bbPromo"),
			jSrc = JSON.parse(localStorage.getItem("tickerBar"));
		promoBar.append(jSrc[uLocale]["tickerCopy"]);
	};
	*/
	GlobalHeader.init = function() { 
		if($(window).width() < 767){
				console.log("mobile");
			$('#Shop').siblings('.navChildren').addClass('is-active'); 
			$(".navParent-link").click(function(e) {
                if($(this).siblings('.navChildren').length	){
    				e.preventDefault();
    				if ($(this).siblings('.navChildren').hasClass('is-active')){
    					$(this).siblings('.navChildren').removeClass("is-active").attr('aria-hidden','true');
    				} else{
    					$(".navChildren.is-active").removeClass("is-active").attr('aria-hidden','true');
    					$(this).siblings('.navChildren').addClass("is-active").attr('aria-hidden','false');
    				}
                }
			});
			$(".navChild-link").click(function(e) {
                if($(this).siblings('.navGrandchildren').length){
    				e.preventDefault();
    				if ($(this).siblings(".navGrandchildren").hasClass('is-active')){
    					$(this).siblings(".navGrandchildren").removeClass("is-active").attr('aria-hidden','true');
    				} else{
    					$(".navGrandchildren.is-active").removeClass("is-active").attr('aria-hidden','true');
    					$(this).siblings(".navGrandchildren").addClass("is-active").attr('aria-hidden','false');
    				}
                }
			});
			$("[nav-back]").click(function(e) {
				//$(this).closest(".is-active").removeClass("is-active"),
				if($('.navChildren.is-active').length){
					$('.navChildren.is-active').removeClass("is-active");
				} else {
					$('#bbNav').removeClass("is-active");
				}
			});
			$("[nav-toggle]").click(function() {
				//Overlay.toggle(),
				$(this).toggleClass("is-active"),
				$("#bbNav").toggleClass("is-active");
			});
			$('#bbNav').on('click', function(){
				if($('.navChildren').hasClass('is-active')){
					$('[nav-back]').addClass('is-active');
				} else{
					$('[nav-back]').removeClass('is-active');
				}
			})
		} 
		$(window).scroll(function(){
			if($(this).scrollTop() > 50) {
				$('#bbNav').addClass('scrolled');
				//$('#bbCart').css('top','60px');
			} else {
				$('#bbNav').removeClass('scrolled');
				//$('#bbCart').css('top','90px');
			}
		});
		/*
        var navAccord = $(".expand").accordion({
            collapsible: true,
            active: false,
			heightStyle: "content",
			icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }
        }).on('click', function() {
            navAccord.not(this).accordion('option', 'active', false);
        });
		*/
	}
}(window.GlobalHeader = window.GlobalHeader || {}, jQuery)/*,
function(ProductPage, $) {
	var productQTY = function(){
		$(".qtyEdit").change(function() {
			var qty = $(this).val();
			qtySelect.val(qty)
		})
	},
	swatchBucket = function(){
		var swatchShade= $("#prodName"),
			swatchItem = $(".swatchItem");
		swatchItem.hover(function() {
			var newTitle = $(this).attr("data-swatch-title");
			swatchShade.text(newTitle)
		}, function() {
			var ogTitle = swatchShade.attr("data-original-title");
			swatchShade.text(ogTitle)
		});
	},
	footSlider = {
		fade: !0,
		cssEase: 'linear',
		autoplay: !1,
		arrows: !0,
		dots: !1,
		adaptiveHeight: true,
		prevArrow: '<div class="arrow-icon left"></div>',
		nextArrow: '<div class="arrow-icon right"></div>'
	};
	ProductPage.swatch = function(swatchList, indexCt){
        var sanitizer = ["lip-whip", "lip-gloss", "sugar-sticks", "waffle-things-matte-lipstick", "-"];
       	var expStr = sanitizer.join("|");
		$.each(swatchList, function(shadeName, shadeProps) {
            var swatchName = shadeName.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ').replace(/\s{2,}/g, ' '),
				swatchItem = $('<a class="swatchItem" data-swatch-title="' + swatchName + '" aria-label="' + swatchName + '" data-index="' + indexCt + '" tabindex="0"></a>');
			if (swatchName.includes("metallic") ){
				$(swatchItem).addClass("shiny")
			}
			if(window.location.pathname.indexOf(shadeProps['url']) !== -1  ){
				$(swatchItem).addClass("is-selected")
			} else {
				$(swatchItem).attr('href', shadeProps['url'])
		 	}
		  
			$( shadeProps['shades'] ).each(function( index, shadeHex ) {
				swatchItem.append('<div style="background:' + shadeHex + '"></div>');
			});
			if (shadeProps['available'] == 'oos' ){
				$(".oosList").append(swatchItem);
			} else {
				$(".swatchList").append(swatchItem);
			}
			indexCt++;
		});
		
		if($('.swatchList .swatchItem').length <= 0){
      		$('.oosList').addClass('active');
		} else if($('.oosList .swatchItem').length <= 0){
      		$('.oosList').remove();
		}

		$('#pdpInfo').on('click', '.viewOOS', function(){
			$('.oosList').addClass('active')
		})
	},
	ProductPage.init = function() {
		productQTY();
		if($(window).width() > 767){
		  swatchBucket();
		}
		$(window).scroll(function(){
			if($(this).scrollTop() > $('#pdpTransaction').offset().top) {
				$('.bb-stickyBar').addClass('active');
			} else {
				$('.bb-stickyBar').removeClass('active');
			}
		});
        $('.varPrice').change(function() {
            let selectedID = $(this).find("option:selected").val();
            $('.productForm .productID').val(selectedID)
        });
		$(".product-gallery .fancybox:not(:first):not(:last)").fancybox({padding: 0, wrapCSS: 'gallery'});
	}
}(window.ProductPage = window.ProductPage || {}, jQuery),
function(QtyChangerAtc, $) {
	var bindUIActions = function() {
		mobQtyAdd.on("click", function(t) {
			! function(self, e) {
				e.preventDefault();
				var currentQty = parseInt(mobQty.val());
				mobQty.val(currentQty + 1)
			}(0, t)
		}), mobQtyRmv.on("click", function(t) {
			! function(self, e) {
				e.preventDefault();
				var currentQty = parseInt(mobQty.val());
				1 < currentQty && mobQty.val(currentQty - 1)
			}(0, t)
		})
	};
	QtyChangerAtc.init = function() {
		mobQty = $("[data-mob-qty-amount]"),
		mobQtyAdd = $('[data-qty-change="plus"]'),
		mobQtyRmv = $('[data-qty-change="minus"]'),
		bindUIActions();
	}
}(window.QtyChangerAtc = window.QtyChangerAtc || {}, jQuery),
function(t, $) {
t.lock = function(t) {
	$("html, body").addClass("no-scroll")
}, t.unlock = function(t) {
	$("html, body").removeClass("no-scroll")
}, t.toggle = function(t) {
	$("html, body").toggleClass("no-scroll")
}, t.init = function() {}
}(window.Scroll = window.Scroll || {}, jQuery),
function(Search, $) {
	var viewQuery = window.matchMedia("(min-width: 992px)");
		Search.init = function() {
			var searchBar = $("[js-search-bar]"),
				searchToggle = $("[js-search-toggle]"),
				searchClose = $("#searchClose");
			searchBar.hide();
			searchToggle.on("click", function(t) {
				t.preventDefault(), 
				viewQuery.matches ? searchBar.animate({ width: "toggle" }) : (searchBar.slideDown(350));
				$('.search-form__input').focus();
			}), 
			$('.bbSearch').focus(function(){
				viewQuery.matches ? searchBar.animate({ width: "toggle" }) : (searchBar.slideDown(350));
				$('.search-form__input').focus();
			}), 
			searchClose.on("click", function(t) {
				t.preventDefault(),
				viewQuery.matches ? (searchBar.animate({ width: "toggle" })) : searchBar.slideUp(350);
			}), 
			$('#Search').focusout(function(){
				viewQuery.matches ? (searchBar.animate({ width: "toggle" })) : searchBar.slideUp(350);
			});
		}
}(window.Search = window.Search || {}, jQuery),
function(Blog, $) {
	var catTrigger = $("#blogCats h2, #blogTrigScnd"),
		catList = $("#categoryList");
	Blog.init = function() {
		catTrigger.click(function() {
			catList.toggleClass("active");
			$('#blogTrigScnd').toggleClass('active');
		})
	}
}(window.Blog = window.Blog || {}, jQuery),
function(Article, $) {
	var artTrigger = $("#articleComments .title"),
		artList = $("#articleComments");
	Article.init = function() {
		artTrigger.click(function() {
			artList.toggleClass("active");
		})
	}
}(window.Article = window.Article || {}, jQuery),
function(Sliders, $) {
	homeSlider = {   //Home
		slidesToScroll: 1,
		slidesToShow: 1,
		arrows: !1,
		autoplay: !0,
		autoplaySpeed: 4000
	},
	bannerSlider = {   //Banner
		fade: !0,
		cssEase: 'linear',
		autoplay: !1,
		arrows: !0,
		dots: !1,
		adaptiveHeight: true,
		prevArrow: '<div class="arrow-icon left"></div>',
		nextArrow: '<div class="arrow-icon right"></div>'
	},
	pdpMain = { //pdp slider main
		variableWidth: !1,
		slidesToScroll: 1,
		slidesToShow: 1,
		arrows: !0,
		dots: !1,
		prevArrow: '<a class="arrow-icon left" aria-label="previous arrow"></a>',
		nextArrow: '<a class="arrow-icon right" aria-label="next arrow"></a>',
		mobileFirst: !0,
		autoplay: !1
	},
	slide767 = {   // bbSlider Tiles
		mobileFirst: !0,
		slidesToScroll: 1,
		slidesToShow: 1,
		variableWidth: !1,
		centerMode: !1,
		variableHeight: !0,
		arrows: !0,
		prevArrow: '<div class="arrow-icon left"></div>',
		nextArrow: '<div class="arrow-icon right"></div>',
		responsive: [{
			breakpoint: 767,
			settings: {
				centerMode: !1,
				slidesToShow: 3,
				variableWidth: !1
			}
		}]
	},
	slide480 = {   // bbSlider Tiles
		mobileFirst: !0,
		slidesToScroll: 1,
		slidesToShow: 1,
		variableWidth: !1,
		centerMode: !1,
		variableHeight: !0,
		arrows: !0,
		prevArrow: '<div class="arrow-icon left"></div>',
		nextArrow: '<div class="arrow-icon right"></div>',
		responsive: [{
		breakpoint: 480,
		settings: {
			centerMode: !1,
			slidesToShow: 3,
			variableWidth: !1
		}
		}]
	};
	var thumbRules = function() {
			$(".slider-thumbnails li").on("click", function() {
				var selfIndex = $(this).index();
				$(".pdpSlider").splide("splideGoTo", selfIndex);
				$(".slider-thumbnails li").removeClass("is-active");
				$(this).addClass("is-active");
			});
		};
	Sliders.homeBanner = function(uLocale) {
		let sliderDiv = $(".home-banner"),
			jSrc = JSON.parse(localStorage.getItem("heroSlider"));

		var localSrc = jSrc[uLocale];
		Object.keys(localSrc).forEach(key => {
			let currentItem = localSrc[key];
			var slideWrapper = $('<div>', {
					class: 'home-banner-block'
				}),
				slideImageContainer = $('<picture/>'),
				slideImageSrcSet = $('<source media="(max-width: 768px)" srcset="' +  currentItem["mobileImage"] + '"><source srcset="' + currentItem["desktopImage"] + '">');
				slideImage = document.createElement("img");

			slideImage.className = "home-banner-img";
			slideImage.src = currentItem["desktopImage"];

			slideImageContainer.append(slideImageSrcSet).append(slideImage);
			slideWrapper.append(slideImageContainer)

			if(currentItem["linkTarget"] != ""){
				var slideCTA = $('<a class="home-banner-cta" href="' + currentItem["linkTarget"] + '"></a>');
				slideWrapper.append(slideCTA)
			}
			sliderDiv.append(slideWrapper);
		});
		$(".home-banner").splide(homeSlider);
	};
	Sliders.init = function() {
		var thumbNails = $(".pdp-slider__item"), 
			thumbWrap = $("<ul/>", {
				class: "slider-thumbnails"
			});
		thumbNails.each(function() {
			var thumbData = $(this).attr("data-thumb"),
			thumbTitle = $(this).attr("data-title"),
			imgAttr = $("<img/>", {
				src: thumbData,
				alt: thumbTitle
			}),
			thumbCont = $("<li/>", {
				html: imgAttr
			});
			thumbWrap.append(thumbCont);
		}),
		$(".banner-slider").splide(bannerSlider), 
		$(".bbSlider.rTab").splide(slide767),
		$(".bbSlider.rMob").splide(slide480), 
		$(".product-gallery").append(thumbWrap),
		$(".slider-thumbnails li").eq(0).addClass("is-active"), 
		$(".pdpSlider").splide(pdpMain),
		$(".slider-thumbnails").splide({
			vertical: true,
			draggable: true,
			focusOnSelect: true,
			verticalSwiping: true,
			centerMode: true,
			infinite:false

		}),
		$(".paletteSlider").splide(pdpPaletteSwatch), 
		thumbRules();
		//, bundleSwatchThumbs()
	}
}(window.Sliders = window.Sliders || {}, jQuery),
function(BackToTop, $) {
	var bindUIActions = function() {
		$("[sticky-back-to-top]").on("click", function() {
			$("html, body").animate({
				scrollTop: 0
			}, 1e3)
		}), $(window).on("scroll", function() {
			var pageHeight;
			pageHeight = $(document).height(), (pageHeight /= 4) < $(window).scrollTop() ? $("[sticky-back-to-top]").addClass("fade-in") : $("[sticky-back-to-top]").removeClass("fade-in")
		})
	};
	BackToTop.init = function() {
		bindUIActions()
	}
}(window.BackToTop = window.BackToTop || {}, jQuery),
function(eventTracking, $) {
}(window.eventTracking = window.eventTracking || {}, jQuery)
*/;
