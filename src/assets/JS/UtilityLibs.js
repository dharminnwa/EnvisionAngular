function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function fnNumberFormatting(value) {
    if (value && value > 1000 || value && value < 1000)
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else
        return value;
}

function changeLeftToggle() {
    var left = $("#left");
    var leftWidth = $("#left").width();
    var leftCss = left.css("display");
    if (leftCss == "none") {
        left.addClass("showleft");
        $("#main").css("margin-left", leftWidth);
        //Start - By Nikunj (Edited for US 661 #04-06-2015#)
        $("#content_1").mCustomScrollbar("update");
        if (RequestFrom == "SilverlightApp") {
            CreateTree();
        }
        //End - By Nikunj
        //leftpanel = "true";
    }
    else {
        left.removeClass("showleft");
        left.addClass("hideleft");
        $("#main").css("margin-left", 0);
        //Start - By Nikunj for US 577 (#17-02-2014#)
        //$('#tree').dynatree('destroy');
        //$('#tree').empty();
        //End - By Nikunj
        //leftpanel = "false";
    }
}

function getMonthNameFromDate(date) {
    var month = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
    ];
    var MonthName = month[date.getMonth()];
    return MonthName;
}