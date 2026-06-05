
$(function() {
    //temp
    setTimeout(function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)){
            $('.additional-checkout-button--apple-pay').attr('style', 'display\:inline-block\!important\;width\:50%\;');
        }
        else {
            $('.additional-checkout-button--apple-pay').attr('style', 'display\:none\!important\;height\:0\;');
        }
	}, 1000);
	
	{% if settings.countdown %}
		{% assign countMonth = settings.countMonth %}
		{% assign countDate = settings.countDate %}
		{% assign countHour = settings.countHr %}
		{% if countMonth < 10 %}
			{% assign countMonth = countMonth | prepend: 0 %}
		{% endif%}
		{% if countDate < 10 %}
			{% assign countDate = countDate | prepend: 0 %}
		{% endif%}
		{%if settings.countAPM == 'pm' %}
			{% assign countHour = countHour | plus: 12 %}
		{% endif %}
	$("#cdTimer").countdown("2020/{{ countMonth }}/{{ countDate }} {{ countHour }}:{{ settings.countMin }}:00", function(event) {
		$(this).text( event.strftime('%D:%H:%M:%S'));
	  });
	{% endif %}
	{% if settings.popAnnounce and settings.popAnnounce_content != '' %}
	var announceCookie = $.cookie('popAnnounce');
    if (!announceCookie) {
		$.fancybox([{ 
			href : '#announceModal'
		}]);
		{% if settings.popAnnounce_freq != '' %}
		$.cookie('popAnnounce', true, { expires: {% if settings.popAnnounce_freq == '0' %}14{% else %}{{ settings.popAnnounce_freq | plus: 0}}{% endif %} , path: '/'});
		{% endif %}
    } 
	$("#bbPromo").fancybox({
		autoSize: true
	});
	{% endif %}

	{% comment %}
	var highContrastSet = Cookies.get('highContrast');
    if (highContrastSet == 'true') {
		$('body').addClass('hCtrst');
		$('#hCtrstTrig').attr('aria-checked','true');
	}
	{% endcomment %}
	
});

$('#adtlCartButtons .trigger').click(function(){
	$('#adtlCartButtons').toggleClass('active');
});
