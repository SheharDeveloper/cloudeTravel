var YashAdmin = function(){
"use strict"
	
	/* Search Bar ============ */
	var screenWidth = $( window ).width();
	var screenHeight = $( window ).height();
	
	var handleSelectPicker = function(){
		if(jQuery('.dataTables_length select').length > 0 ){
			jQuery('.dataTables_length select').selectpicker();
		}
	}

    var handleMetisMenu = function() {
		if(jQuery('#menu').length > 0 ){
			$("#menu").metisMenu();
		}
		jQuery('.metismenu > .mm-active ').each(function(){
			if(!jQuery(this).children('ul').length > 0)
			{
				jQuery(this).addClass('active-no-child');
			}
		});
	}
	
	var handleAllChecked = function() {
		if(jQuery('.check-wrapper').length > 0){				
			$(".check-all").on('click',function() {
				jQuery(this).closest('.check-wrapper').find('.check-input').prop('checked', $(this).prop("checked"));
			});
		}
	}
	
	var handleNavigation = function() {
		$(".nav-control").on('click', function() {
			$('#main-wrapper').toggleClass("menu-toggle");
			$(".hamburger").toggleClass("is-active");
		});
	}
  
	var handleCurrentActive = function() {
		for (var nk = window.location,
			o = $("ul#menu a").filter(function() {
				return this.href == nk;
			})
			.addClass("mm-active")
			.parent()
			.addClass("mm-active");;) 
		{
			if (!o.is("li")) break;
			o = o.parent()
				.addClass("mm-show")
				.parent()
				.addClass("mm-active");
		}
	}

	var handleMiniSidebar = function() {
		$("ul#menu>li").on('click', function() {
			const sidebarStyle = $('body').attr('data-sidebar-style');
			if (sidebarStyle === 'mini') {
				console.log($(this).find('ul'))
				$(this).find('ul').stop()
			}
		})
	}
   
	var handleMinHeight = function() {
		var win_h = window.innerHeight;
		var win_h = window.innerHeight;
		if (win_h > 0 ? win_h : screen.height) {
			$(".content-body").css("min-height", (window.innerHeight - 70) + "px");	
			setTimeout(() => {
				if($('body').attr('data-layout') === "vertical"){
					if(
						($('body').attr('data-sidebar-style') === "mini") && ($('.deznav .metismenu').height() > (window.innerHeight - 60))
						||
						($('body').attr('data-sidebar-style') === "modern") && ($('.deznav .metismenu').height() > (window.innerHeight - 60))
						||
						($('body').attr('data-sidebar-style') === "full") && $('#main-wrapper').hasClass('menu-toggle') && ($('.deznav .metismenu').height() > (window.innerHeight - 60))
					){	
						$(".content-body").css("min-height", ($('.deznav .metismenu').height() + 110) + "px");
					}
				}
			},500);
		};
		
		setTimeout(() => {
			if(
				$('body').attr('data-header-position') === "fixed" 
				&& 
				$('body').attr('data-layout') === "horizontal"
				&&
				$('body').attr('data-sidebar-position') === "fixed"
			){
				$('.content-body').css("padding-top" ,  ($('.deznav').height() + $('.header').height()) + 'px');
			}else if(
				$('body').attr('data-header-position') === "fixed" 
				&& 
				$('body').attr('data-layout') === "horizontal"
				&&
				$('body').attr('data-sidebar-position') === "static"
			){
				$('.content-body').css("padding-top" , $('.header').height() + "px" );
			}else if(
				$('body').attr('data-header-position') === "static" 
				&& 
				$('body').attr('data-layout') === "horizontal"
				&&
				$('body').attr('data-sidebar-position') === "fixed"
			){
				$('.content-body').css("padding-top" , "0px" );
			}else {
				$('.content-body').css("padding-top" , "" );
			}
		},400);
		
	}
	
	var handleHeaderHight = function() {
		const headerHight = $('.header').innerHeight();
		$(window).scroll(function() {
			if ($('body').attr('data-layout') === "horizontal" && $('body').attr('data-header-position') === "static" && $('body').attr('data-sidebar-position') === "fixed")
			$(this.window).scrollTop() >= headerHight ? $('.deznav').addClass('fixed') : $('.deznav').removeClass('fixed')
		});
	}
	
	var handleMenuTabs = function() {
		if(screenWidth <= 991 ){
			jQuery('.menu-tabs .nav-link').on('click',function(){
				if(jQuery(this).hasClass('open'))
				{
					jQuery(this).removeClass('open');
					jQuery('.fixed-content-box').removeClass('active');
					jQuery('.hamburger').show();
				}else{
					jQuery('.menu-tabs .nav-link').removeClass('open');
					jQuery(this).addClass('open');
					jQuery('.fixed-content-box').addClass('active');
					jQuery('.hamburger').hide();
				}
			});
			jQuery('.close-fixed-content').on('click',function(){
				jQuery('.fixed-content-box').removeClass('active');
				jQuery('.hamburger').removeClass('is-active');
				jQuery('#main-wrapper').removeClass('menu-toggle');
				jQuery('.hamburger').show();
			});
		}
	}
	
	var headerFix = function(){
		/* Main navigation fixed on top  when scroll down function custom */		
		jQuery(window).on('scroll', function () {
			
			if(jQuery('.header').length > 0){
				var menu = jQuery('.header');
				$(window).scroll(function(){
					var sticky = $('.header'),
					scroll = $(window).scrollTop();

					if (scroll >= 100){
						sticky.addClass('is-fixed');
					}else {
						sticky.removeClass('is-fixed');
					}
				});				
			}
		});
		/* Main navigation fixed on top  when scroll down function custom end*/
	}
	
	var handleChatbox = function() {
		jQuery('.btn-chatbox').on('click',function(){
			jQuery('.chatbox').addClass('active');
		});
		jQuery('.chatbox-close').on('click',function(){
			jQuery('.chatbox').removeClass('active');
		});
	}
	
	var handleBtnNumber = function() {
		$('.btn-number').on('click', function(e) {
			e.preventDefault();

			fieldName = $(this).attr('data-field');
			type = $(this).attr('data-type');
			var input = $("input[name='" + fieldName + "']");
			var currentVal = parseInt(input.val());
			if (!isNaN(currentVal)) {
				if (type == 'minus')
					input.val(currentVal - 1);
				else if (type == 'plus')
					input.val(currentVal + 1);
			} else {
				input.val(0);
			}
		});
	}
	
	var handleDzChatUser = function() {
		jQuery('.dz-chat-user-box .dz-chat-user').on('click',function(){
			jQuery('.dz-chat-user-box').addClass('d-none');
			jQuery('.dz-chat-history-box').removeClass('d-none');
		}); 
		
		jQuery('.dz-chat-history-back').on('click',function(){
			jQuery('.dz-chat-user-box').removeClass('d-none');
			jQuery('.dz-chat-history-box').addClass('d-none');
		}); 
		
		jQuery('.dz-fullscreen').on('click',function(){
			jQuery('.dz-fullscreen').toggleClass('active');
		});
	}
	
	var handleDzFullScreen = function() {
		jQuery('.dz-fullscreen').on('click',function(e){
			if(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement) { 
				/* Enter fullscreen */
				if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.msExitFullscreen) {
					document.msExitFullscreen(); /* IE/Edge */
				} else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen(); /* Firefox */
				} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen(); /* Chrome, Safari & Opera */
				}
			}
			else { /* exit fullscreen */
				if(document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if(document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen();
				} else if(document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if(document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				}
			}		
		});
	}
	
	var handleShowPass = function(){
		jQuery('.show-pass').on('click',function(){
			var inputType = jQuery(this).parent().find('.dz-password');
			if(inputType.attr('type') == 'password')
			{
				inputType.attr('type', 'text');
				jQuery(this).addClass('active');
			}
			else
			{
				inputType.attr('type', 'password');
				jQuery(this).removeClass('active');
			}
		});
	}

	var heartBlast = function (){
		$(".heart").on("click", function() {
			$(this).toggleClass("heart-blast");
		});
	}
	
	var handleLightgallery = function(){
		if(jQuery('#lightgallery').length > 0){
			$('#lightgallery').lightGallery({
				loop:true,
				thumbnail:true,
				exThumbImage: 'data-exthumbimage'
			});
		}
		if(jQuery('#lightgallery2').length > 0){
			$('#lightgallery2').lightGallery({
				loop:true,
				thumbnail:true,
				exThumbImage: 'data-exthumbimage'
			});
		}
	}
	
	var handleCustomFileInput = function() {
		$(".custom-file-input").on("change", function() {
			var fileName = $(this).val().split("\\").pop();
			$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
		});
	}
    
  	var vHeight = function(){
        var ch = $(window).height() - 206;
        $(".chatbox .msg_card_body").css('height',ch);
    }
	
	var handleCkEditor = function(){
		if(jQuery("#ckeditor").length>0) {
			ClassicEditor
			.create( document.querySelector( '#ckeditor' ), {
				simpleUpload: {
                    uploadUrl: 'ckeditor-upload.php', 
                }
			} )
			.then( editor => {
				window.editor = editor;
			} )
			.catch( err => {
				console.error( err.stack );
			} );
		}
	}
	
	var handleMenuPosition = function(){
		if(screenWidth > 1024){
			$(".metismenu  li").unbind().each(function (e) {
				if ($('ul', this).length > 0) {
					var elm = $('ul:first', this).css('display','block');
					var off = elm.offset();
					var l = off.left;
					var w = elm.width();
					var elm = $('ul:first', this).removeAttr('style');
					var docH = $("body").height();
					var docW = $("body").width();
					
					if(jQuery('html').hasClass('rtl')){
						var isEntirelyVisible = (l + w <= docW);	
					}else{
						var isEntirelyVisible = (l > 0)?true:false;	
					}
					
					if (!isEntirelyVisible) {
						$(this).find('ul:first').addClass('left');
					} else {
						$(this).find('ul:first').removeClass('left');
					}
				}
			});
		}
	}
	
	var handleChartSidebar = function(){
		$('.chat-rightarea-btn').on('click',function(){
			$(this).toggleClass('active');
			$('.chat-right-area').toggleClass('active');
		})
		$('.chat-hamburger').on('click',function(){
			$('.chat-left-area').toggleClass('active');
		})
	}
	
	var handleSelectText = function(){
		if($('.btn-select-text').length > 0){
			$('.btn-select-text').click(function(){
				if($(this).parent().hasClass('select-text-wrap')){
					var $temp = $('<textarea>');
					$('body').append($temp);
					$temp.val($(this).siblings('.text-select-copy').text()).select();
					document.execCommand('copy');
					$temp.remove();
				}
			});
		}
	}
	
	var setCurrentYear = function () {
		const currentDate = new Date();
		let currentYear = currentDate.getFullYear();
		let elements = document.getElementsByClassName('current-year');

		for (const element of elements) {
			element.innerHTML = currentYear;
		}
	}
	
	var mobileEmailPanel = function(){
		if($('.mobile-email-panel').length > 0){
			$(".mobile-email-panel").on('click', function(){
				$('.email-left-body, .mobile-email-panel').toggleClass("active");
			});
		}
	}
	
	var handleBsToggle = function(){
		if(jQuery('[data-bs-toggle="popover"]').length > 0){
			var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
			var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
				return new bootstrap.Popover(popoverTriggerEl)
			})
		}
		
		if(jQuery('[data-bs-toggle="tooltip"]').length > 0){
			const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
			const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
		}
	}
	
	var handleValidation = function(){
		// Fetch all the forms we want to apply custom Bootstrap validation styles to
		const forms = document.querySelectorAll('.needs-validation')

		// Loop over them and prevent submission
		Array.from(forms).forEach(form => {
			form.addEventListener('submit', event => {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
	}
	
	var handleTypeNumber = function (){
		if ($('.type-number').length > 0) {
			$('.type-number').on('input', function() {
				var inputVal = $(this).val();
				var numericVal = inputVal.replace(/\D/g, '');

				if (numericVal.length > 10) {
					$(this).val(numericVal.slice(0, 10));
				} else {
					$(this).val(numericVal);
				}
			});
		}
	}
	
	var handleImageUpload = function (){
		if ($('.upload-trigger').length > 0) {
			$('.upload-trigger').on('click', function () {
				$(this).siblings('.imageUpload').click();
			});
			$('.imageUpload').on('change', function () {
				var input = this;
				if (input.files && input.files[0]) {
					var reader = new FileReader();
					reader.onload = function (e) {
						$(input).siblings('.imagePreview').attr('src', e.target.result).hide().fadeIn(650);
					};
					reader.readAsDataURL(input.files[0]);
				}
			});
		}
	}
	
	var handleCopyText = function (){
		if ($('.btn-select-text').length > 0) {
			$('.btn-select-text').click(function(){
				if($(this).parent().hasClass('select-text-wrap')){
					var $temp = $('<textarea>');
					$('body').append($temp);
					$temp.val($(this).siblings('.text-select-copy').text()).select();
					document.execCommand('copy');
					$temp.remove();
				}
			});
		}
	}
	
	var handleDzLoadMore = function() {
		$(".dz-load-more").on('click', function(e)
		{
			e.preventDefault();	//STOP default action
			$(this).append(' <i class="fas fa-sync"></i>');
			
			var dzLoadMoreUrl = $(this).attr('rel');
			var dzLoadMoreId = $(this).attr('id');
			
			$.ajax({
				method: "POST",
				url: dzLoadMoreUrl,
				dataType: 'html',
				success: function(data) {
					$( "#"+dzLoadMoreId+"Content").append(data);
					$('.dz-load-more i').remove();
				}
			})
		});
	}
	
	var handleDatetimepicker = function(){
		if(jQuery("#datetimepicker1").length>0) {
			$('#datetimepicker1').datetimepicker({
				inline: true,
			});
		}
		if(jQuery('.bt-datepicker').length > 0){
			$(".bt-datepicker").datepicker({ 
				autoclose: true, 
				todayHighlight: true
			}).datepicker('update', new Date());
		}
	}
	
	var handleDraggableCard = function() {
		if ($('.dz-draggable').length > 0) {
			var dzDraggable = function () {
				return {
					init: function () {
						var containers = document.querySelectorAll('.dz-draggable');

						if (containers.length === 0) {
							return false;
						}
						
						new Sortable.default(containers, {
							draggable: '.draggable',
							handle: '.draggable-handle',
							mirror: {
								appendTo: '.dz-draggable',
								constrainDimensions: true
							}
						});
					}
				};
			}();

			jQuery(document).ready(function () {
				dzDraggable.init();
			});
		}
	}

	var handleConverterTheme = function(){
		if($('.btc-converts').length > 0){
			setTimeout(()=> {
				if($('body').attr('data-theme-version') === "dark"){
					$('.btc-converts').attr('dark-mode', true);
				} 
			},1000);
			$('#theme_version').on('change',function(){
				if($('body').attr('data-theme-version') === "dark"){
					$('.btc-converts').attr('dark-mode', true);
				} else{
					$('.btc-converts').attr('dark-mode', false);
				}
			});
		}
	}
	
	var handleThemeMode = function() {
		if(jQuery(".dz-theme-mode").length>0) {
	
			jQuery('.dz-theme-mode').on('click',function(){
				jQuery(this).toggleClass('active');
				
				if(jQuery(this).hasClass('active')){
					jQuery('body').attr('data-theme-version','dark');
					setCookie('version', 'dark');
				}else{
					jQuery('body').attr('data-theme-version','light');
					setCookie('version', 'light');
				}
			});
			var version = getCookie('version');
			if(version != null){	
				jQuery('body').attr('data-theme-version', version);
			}
			jQuery('.dz-theme-mode').removeClass('active');
			
			jQuery(window).on('resize',function () {
				var version = getCookie('version');
				if(version != null){
					jQuery('body').attr('data-theme-version', version);
				}
			})
			
			setTimeout(function(){
				if(jQuery('body').attr('data-theme-version') === "dark")
				{
					jQuery('.dz-theme-mode').addClass('active');
				}
			},1600)
		}
	}
	
	var handleTagify = function (){		
		if(jQuery('.basic-tagify').length > 0 ){
			var input = document.querySelector('.basic-tagify');
			new Tagify(input)
		}
	}
	
	var handleDatePicker = function(){
		if(jQuery('.bs-datepicker').length > 0 ){
			$('.bs-datepicker').datepicker({
				format: 'mm/dd/yyyy',
				autoclose: true,
				todayHighlight: true
			});
		}
	}

	var handlePreloader = function(){
		setTimeout(function() {
			jQuery('#preloader').remove();
			$('#main-wrapper').addClass('show');
		},1000);	
		
	}
	
	/* Function ============ */
	return {
		init:function(){
			handleSelectPicker();
			handleMetisMenu();
			handleAllChecked();
			handleNavigation();
			handleCurrentActive();
			handleMiniSidebar();
			handleMinHeight();
			handleHeaderHight();
			handleMenuTabs();
			headerFix();
			handleChatbox();
			handleBtnNumber();
			handleDzChatUser();
			handleDzFullScreen();
			handleShowPass();
			heartBlast();
			handleLightgallery();
			handleCustomFileInput();
			vHeight();
			handleCkEditor();
			handleMenuPosition();
			handleChartSidebar()
			handleSelectText()
			setCurrentYear()
			mobileEmailPanel()
			handleBsToggle();
			handleValidation();
			handleTypeNumber();
			handleImageUpload();
			handleCopyText();
			handleDzLoadMore();
			handleDatetimepicker();
			handleDraggableCard();
			handleConverterTheme();
			handleThemeMode();
			handleTagify();
			handleDatePicker();
			
		},

		
		load:function(){
			handlePreloader();
		},
		
		resize:function(){
			vHeight();
			
			setTimeout(() => {
				handleMinHeight();
			},300);
		},	
		
		handleMenuPosition:function(){
			handleMenuPosition();
		},
	}
	
}();

/* Document.ready Start */	
jQuery(document).ready(function() {	
	YashAdmin.init();
	
	$('.btn-active').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	
	$('.post-like').click(function(){
		$(this).toggleClass('active');
	});
	
	jQuery(".accordion-close").on('click',function(){
		jQuery(this).closest('.accordion-item').remove();
	})
	
	if(jQuery('.dropdown-badge').length > 0){
		$(".dropdown-badge-menu .dropdown-item").click(function(){
			var badgeText = $(this).text();
			var dataBadge = $(this).attr("data-badge");

			var dropdown = $(this).closest(".dropdown-badge");
			var toggleButton = dropdown.find(".dropdown-toggle");
			
			var btnClasses = ["btn-primary", "btn-secondary", "btn-success", "btn-danger", "btn-warning", "btn-info", "btn-light", "btn-dark"];

			// Remove only these color classes
			toggleButton.removeClass(btnClasses.join(" "));

			// Update button text and add new badge class
			toggleButton.text(badgeText).addClass(dataBadge);
		});
	}
	
});
/* Document.ready END */

/* Window Load START */
jQuery(window).on('load',function () {
	YashAdmin.load();
	
	setTimeout(function(){
		YashAdmin.handleMenuPosition();
	}, 1000);
	
});
/*  Window Load END */

/* Window Resize START */
jQuery(window).on('resize',function () {
	YashAdmin.resize();
	
	setTimeout(function(){
			YashAdmin.handleMenuPosition();
	}, 1000);
});
/*  Window Resize END */