$(function() {
     $(".button-collapse").sideNav();
//     $('select').material_select();
    var c=$("#carrera");
    
    var H=0;
    $(document).on("scroll",function(e){    	
    	h=$("header")
    	n=$("#navbar")
    	wh=window.pageYOffset;
    	if(wh>h.height()){
    		n.addClass('n-fixed')
    		}else{    		
    		n.removeClass('n-fixed')}
    })		 
});