$(window).load(function() {
    var input = "";
    var isKeyBoardHidden = false;
    var isParenthenseOpenned = false;
    var isDecimalAdded = false;
    var histories = new Array();
    var archiveHistories = new Array ();
    var tempInput;
    var historiesCount = 0;
    var isCalculated = false;
    document.addEventListener("tizenhwkey", function(e) {
        if (e.keyName == "back") {
            tizen.application.getCurrentApplication().exit();
        }
    });
    $("#history-wrapper").hide();
    $(".btn-clear-history").hide();    
    
    function showKeyBoard() {    	
        $(".keyboard").removeClass("cal-keyboard-collapsed");
        isKeyBoardHidden = false;
        $(".cal-keyboard-toggle").css("background-image", 'url("./images/ic_btn_show_history.png")');
        $(".cal-screen").removeClass("cal-screen-expanded");
        $("#history-wrapper").hide();
        $("#history-wrapper").removeClass("history-expand");
        $("#result").css("display", "table-cell");
        $(".keyboard").removeClass("cal-keyboard-hidden");
        $(".btn-clear-history").hide();        
    }

    function hideKeyBoard() {
        $(".keyboard").addClass("cal-keyboard-collapsed");
        isKeyBoardHidden = true;
        $(".cal-keyboard-toggle").css("background-image", 'url("./images/ic_btn_hide_history.png")');
        $(".cal-screen").addClass("cal-screen-expanded");
        $("#result").css("display", "none");
        setTimeout(function() {
            $("#history-wrapper").show();
            $("#history-wrapper").addClass("history-expand");
        }, 300);
        setTimeout(function() {
            $(".btn-clear-history").fadeIn();
        }, 500);
        setTimeout(function() {
            $(".keyboard").addClass("cal-keyboard-hidden");
        }, 500);        
    }
    $(".cal-keyboard-toggle").on("swipeup", function() {    	
        if (isKeyBoardHidden == true) {
            showKeyBoard();
        }
    });
    $(".keyboard").on("swipedown", function() {
        if (isKeyBoardHidden == false) {
            hideKeyBoard();
        }
    });
    $(".cal-keyboard-toggle").click(function() {
        if (isKeyBoardHidden == true) {
            showKeyBoard();
        } else {
            hideKeyBoard();
        }
    });
    
    $("#calculator-wrapper").on("swiperight", function () {
    	ClearHistory ();
    });
    
    $("#calculator-wrapper").on("swipeleft", function () {
    	RestoreHistory ();
    });
    
    function ClearHistory () {
    	if (isKeyBoardHidden == true && histories.length > 0) {    		
    		$("#history").addClass("deleteHistory");    		
    		setTimeout(function () {
    			$("#history").removeClass("deleteHistory");
    			archiveHistories = histories;
    			histories = [];
    	        $("#history").html("");
    	        $("#result").html(input);
    		}, 1000);    		
    	}        
    }
    
    function RestoreHistory () {
    	if (isKeyBoardHidden == true && histories.length == 0) {
    		histories = archiveHistories;
    		for (var i = 0; i < histories.length; i++) {
    			var temp = histories[i].split('=');
    			$("#history").append("<span>" + temp[0] + "</span><br/>");
				$("#history").append('<span class="history-result">= ' + temp[1] + "</span><br/>");
			}
    		$("#history").addClass("restoreHistory");    		
    		setTimeout(function () {
    			$("#history").removeClass("restoreHistory");
    		}, 1000); 
    	}
    }
    
    $(".cal-button").click(function() {
        var text = $(this).find("span").text();
        var lastChar = input[input.length - 1];
        if ($("#result").text().length >= 12) {
        	$("#result").css ("font-size","20pt");
        } else {
        	$("#result").css ("font-size","30pt");
        }
        switch (text) {
            case "C":
            	if (isCalculated == true) {
            		$("#result").html("");
            		isCalculated = false;
            	}
                input = "";
                isParenthenseOpenned = false;
                isDecimalAdded = false;
                break;
            case "back":
                if (lastChar == ".") {
                    isDecimalAdded = false;
                }
                if (lastChar == "(") {
                    isParenthenseOpenned = false;
                }
                if (lastChar == ")") {
                    isParenthenseOpenned = true;
                }
                if (isCalculated == true) {  
                	if (("" + input + "").indexOf(".") === -1) {
                        isDecimalAdded = false;
                    } else {
                        isDecimalAdded = true;
                    }
            		$("#result").html("");
            		isCalculated = false;
            	}
                input = input + "";
                input = input.substring(0, input.length - 1);
                break;
            case "=":
                if (input.length == 0) {
                    input = 0;
                } else {
                    if (isParenthenseOpenned == true) {
                        input = input + ")";
                        isParenthenseOpenned = false;
                    }
                    tempInput = input;
                    input = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/√/g, "Math.sqrt");
                    input = Math.round(eval(input) * 1000) / 1000;
                    histories[historiesCount] = "" + tempInput + " = " + input;
                    $("#history").append("<span>" + tempInput + "</span><br/>");
                    $("#history").append('<span class="history-result">= ' + input + "</span><br/>");                    
                    historiesCount++;
                    isCalculated = true;
                    if (("" + input + "").indexOf(".") === -1) {
                        isDecimalAdded = false;
                    } else {
                        isDecimalAdded = true;
                    }
                }
                break;
            case "(  )":
            	if (isCalculated == false) {
	                if (lastChar >= 0 && lastChar <= 9 && isParenthenseOpenned == false) {
	                    input = input + "×(";
	                    isParenthenseOpenned = true;
	                } else {
	                    if (isParenthenseOpenned == true) {
	                        input = input + ")";
	                        isParenthenseOpenned = false;
	                    } else {
	                        input = input + "(";
	                        isParenthenseOpenned = true;
	                    }
	                }
            	}
                break;
            case "√":
                if (isCalculated == true && text == "√") {
                    input = "√(" + input;
                    isCalculated = false;
                    isParenthenseOpenned = true;
                } else {
                    input = input + "√(";
                    isParenthenseOpenned = true;
                }
                break;
            case ".":
                if (isCalculated == true) {
                    if (isDecimalAdded == false) {
                        isDecimalAdded = true;
                        isCalculated = false;
                        input = input + ".";
                    }
                } else {
                    if (isDecimalAdded == false) {
                        isDecimalAdded = true;
                        input = input + ".";
                    }
                }
                break;
            default:
                if (isCalculated == true && text >= 0 && text <= 9) {
                    isCalculated = false;
                    input = text;
                } else {
                    if (isCalculated == true && (text == "+" || text == "-" || text == "×" || text == "÷")) {
                        input = input + text;
                        isCalculated = false;
                        isDecimalAdded = false;
                    } else {
                        if (text == "+" || text == "-" || text == "×" || text == "÷") {
                        	if ($("#result").text().length == 0 && (text == "+" || text == "×" || text == "÷")) {
                        		input = input + "";                        		
                        	} else {
                        		isDecimalAdded = false;
                        	}
                        }
                        if (lastChar == "-" && (text == "-" || text == "×" || text == "÷")) {
                            input = input + "";
                        } else {
                            if ((lastChar == "+" || lastChar == "×" || lastChar == "÷") && (text == "+" || text == "×" || text == "÷")) {
                                input = input + "";
                            } else {
                            	if ($("#result").text().length == 0 && (text == "+" || text == "×" || text == "÷")) {
                            		input = input + "";                        		
                            	} else {
                            		input = input + text;
                            	}
                            }
                        }
                    }
                }
                break;
        }
        if (isCalculated == true) {
        	$("#result").html("");
	        $("#result").append("<span>" + tempInput + "</span><br/>");
	        $("#result").append('<span class="history-result">= ' + input + "</span><br/>");
	        isCalculated == false;
        } else {
        	$("#result").html(input);
        }
    });
    
    $(".btn-clear-history").click(function() {
        histories = [];
        $("#history").html("");
        input = "";
        $("#result").html(input);
    });
});

$(document).on("pageshow", "[data-role='page']", function() {
	$("div.ui-loader").remove();
});