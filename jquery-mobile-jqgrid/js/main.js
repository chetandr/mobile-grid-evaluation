$(document).ready(function() {

    // Compute position values
    $.each(positions, function(index, position) {
        position.marketValue = position.lastTrade * position.quantity;
        position.totalCost = position.pricePaid * position.quantity;
        position.gain = position.marketValue - position.totalCost;
        position.gainPercent = (position.gain/position.totalCost) * 100;
    });

    // Render table
    var grid = $('#positions-table').jqGrid({
    	"hoverrows":true,
		"viewrecords":true,
		"jsonReader":{"repeatitems":false,"subgrid":{"repeatitems":false}},
		"gridview":true,
		"loadonce":true,
		"url":"datav.json",
		"scroll":1,
		"autowidth":true,
		"autoheight":true,
		"rowNum":20,		
		"height":600,
   	    "colNames":['Security','Symbol', 'Quantity', 'Last Trade','Market Value','Price Paid','Total Cost','Gain','Gain %'],   	    
   	    "colModel":[
   		    {name:'security',index:'security', width:327},
   		    {name:'symbol',index:'symbol', width:82,classes:"notimp w82"},
   		    {name:'quantity',index:'quantity', width:131,formatter:'integer',classes:"notimp w131"},
   		    {name:'lastTrade',index:'lastTrade', width:131, align:"right",formatter:'currency',formatoptions:{prefix: "$ "},classes:"notimp w131"},
   		    {name:'marketValue',index:'marketValue', width:131, align:"right",formatter:'currency',formatoptions:{prefix: "$ "},classes:"w131"},		
   		    {name:'pricePaid',index:'pricePaid', width:131,align:"right",formatter:'currency',formatoptions:{prefix: "$ "},classes:"notimp w131"},		
   		    {name:'totalCost',index:'totalCost', width:131, sortable:false,formatter:'currency',formatoptions:{prefix: "$ "},classes:"notimp w131"},
   		    {name:'gain',index:'gain', width:131, sortable:false,formatter:'currency',formatoptions:{prefix: "$ "},classes:"golden w131"},		
   		    {name:'gainPercent',index:'gainPercent', width:131, sortable:false,formatter:'number',classes:"golden w131"}		
   	    ],   	   
        "datatype": 'local',
        "data": positions,
        "rowNum": 10000, /* this is a hack to workaround jqGrid bug */
        onSelectRow: function(id){ 
        		    		 $('#selected-position').html($('tr#'+id+' td:first-child').html());
   }				      
    });

	
    // Display window size on resize events
    function displayWindowSize() {
        var win = $(this);
        $('.window-size').html("(" + win.width() + ", " + win.height() + ")");
    }
    $(window).resize(displayWindowSize);

    // Show selection on click events
    $('#positions-table tbody tr').click(function() {
        var security = $(this).find('.security').html();
        $('#selected-position').html(security);
    });

    // Fit table on resize events
    var headerHeight = $('#positions-header').outerHeight(true);
    var postionsSectionPadding = 30;
    var selectionInfoHeight = $('#selected-position').outerHeight(true);
    var layoutInfoHeight = $('.layout-info').outerHeight(true);
    var fudgeFactor = 25; // don't know why this is needed!
    var fixedSectionsHeight =
        headerHeight + postionsSectionPadding + selectionInfoHeight + layoutInfoHeight + fudgeFactor;


    function fitTable() {
        var winWidth = $(this).width();
        var winHeight = $(this).height();
        $('#positions-table').setGridWidth(winWidth - 35, true);
        $('#positions-table').setGridHeight(winHeight - fixedSectionsHeight);
    }
    $(window).resize(fitTable);

    // Perform initial setup
    displayWindowSize();
    
});