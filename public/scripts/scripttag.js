	var currentprice;
	var cartprice;

	var bannerJSON;
	var bannerText;
	var userprice;
	var banner;

	function setUpBanner(){

		if($(".sumobanner").length > 0) {
			banner = $(".sumobanner")[0]
			bannerText=$(".sumobanner > p")[0]
		} else {
			banner = document.createElement("div");
			banner.style.height="40px";
	    	banner.className = "sumobanner";
	    	bannerText=document.createElement("p");
			bannerText.style.position="relative";
			bannerText.style.textAlign="center";
			bannerText.style.top="25%";
			bannerText.style.transform="transformY(-50%)";
		
			bannerText.innerHTML="TJIEOJIOEF";

			banner.appendChild(bannerText);
			$("body").prepend($(banner));
	    }



	    checkCart();
	

		$(document).ajaxSuccess(function(event,xhr,settings) {
		if(settings.type !== "GET" && settings.url.indexOf('/cart') !== -1 ) {
			checkCart()
		}})
	}

	
/*
  position: relative;
  text-align: center;
  top: 50%;
  transform: translateY(-50%); 


*/




    function drawBanner() {

    	var leftoverprice=userprice-cartprice;


    	if (cartprice ==0){
    		bannerText.innerHTML=bannerJSON.initialMessage;
    	}
		else if( leftoverprice<=0){
			bannerText.innerHTML= bannerJSON.goalMessageField;
		}
		else{
			bannerText.innerHTML = bannerJSON.beforeProgressMessageField + "$" + (leftoverprice == NaN ? "" : leftoverprice) + bannerJSON.afterProgressMessageField;
			//banner.innerHTML = bannerJSON.beforeProgressMessageField + (leftoverprice == NaN ? "" : leftoverprice) + bannerJSON.afterProgressMessageField;
		}
    }


    function setBannerJson(val){
    	bannerJSON=val;

    	
    }

    function setUserPrice(val){
    	console.log(val);
    	var parsedVal = parseInt(val); 
    	userprice=parsedVal;
    	drawBanner();
	}

	function setCartPrice(val) {
		console.log(val)
		cartprice = val/100;
		drawBanner();
	}

	function activateFreeShipping(){
		bannerText.innerHTML = "You now have free Shipping!"
	}


	function checkCart() {

		jQuery.getJSON("/cart.js", function(a) { setCartPrice(a.total_price) })
	}


	function makeBlue(){
		 banner.style.background= "#13b4ff";
	}

	function makeWhite(){
		 banner.style.background= "#fcfbe3";
	}
	function makeBlack(){
		 banner.style.background= "#000000";
	}
	function makeYellow(){
		 banner.style.background= "#ffff00";
	}

	function setBannerColor(colorstring){

		switch(colorstring) {
    	case "yellow":
        makeYellow();
        break;
    	case "blue":
        makeBlue();
        break;
        case "black":
        makeBlack();
        break;
        case "white":
        makeWhite();
        break;
    	default:
        makeBlue();
}}



	function checkUser() {

      var url = 'https://108.167.175.187\/scriptTagCode';

      $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: url,
        timeout: 15000,
        success: function(a, status, XMLHttpReq) {

        	if(jQuery.isEmptyObject(a)) return;

        	setUpBanner()
        	setBannerJson(a);
          	setUserPrice(a.goal);
          	setBannerColor(a.color);
        },
        error: function(xhr, status, error) {
          alert( xhr.status + error);
        },
      });
    }



    checkUser();








