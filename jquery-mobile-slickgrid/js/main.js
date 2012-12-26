(function ($) {
    "use strict";

    var grid, data, columns, options, columnWidths;

    data = positions || []; // get from ../data/positions.js
    // Compute position values
    $.each(positions, function (index, position) {
        position.marketValue = position.lastTrade * position.quantity;
        position.totalCost = position.pricePaid * position.quantity;
        position.gain = position.marketValue - position.totalCost;
        position.gainPercent = (position.gain / position.totalCost) * 100;
    });

    // Preparing the Columns
    columns = [
        {id: "security", name: "Security", field: "security", width: 200, resizable: false, headerCssClass:"cell-left-align", minWidth:300},
        {id: "symbol", name: "Symbol", field: "symbol", cssClass:"cell-center-align", maxWidth:80},
        {id: "quantity", name: "Quantity", field: "quantity", cssClass: "right-align", headerCssClass:"cell-right-align"},
        {id: "last-trade", name: "Last Trade", field: "lastTrade", cssClass: "right-align", headerCssClass:"cell-right-align",  formatter: formatCurrency},
        {id: "market-value", name: "Market Value", field: "marketValue", cssClass: "right-align", headerCssClass:"cell-right-align", formatter: formatCurrency},
        {id: "price-paid", name: "Price Paid", field: "pricePaid", cssClass: "right-align", headerCssClass:"cell-right-align", formatter: formatCurrency},
        {id: "total-cost", name: "Total Cost", field: "totalCost", cssClass: "right-align", headerCssClass:"cell-right-align", formatter: formatCurrency},
        {id: "gain", name: "Gain", field: "gain", cssClass: "positive right-align", headerCssClass:"cell-right-align", formatter: formatGainMoney},
        {id: "gain-percent", name: "Gain %", field: "gainPercent", cssClass: "positive right-align", headerCssClass:"cell-right-align", formatter: formatGainPercent}
    ];

    // Essential Options
    options = {

        enableCellNavigation: true,
        enableColumnReorder: false,
        autosizeColumns: true,
        forceFitColumns: true,
        rowHeight: 32
    };
	
	// Number Formatting
	function formatNumber(amount) {
        return $.format.number(amount, '#,##0.00');
    }
	function formatCurrency(row, cell, value, columnDef, dataContext){
		return "$" + formatNumber(value);
	}
	function formatGainMoney(row, cell, value, columnDef, dataContext) {
		var formattedValue = formatNumber(value);
		if (value < 0) {
			return "<span class='negative'>$("+ (-1 * formattedValue) + ")</span>";
		} else {
			return "$" + formattedValue;
		}
	}	
	function formatGainPercent(row, cell, value, columnDef, dataContext) {
		var formattedValue = formatNumber(value);
		if (value < 0) {
			return "<span class='negative'>("+ (-1 * formattedValue) +"%)</span>";
		} else {
			return formattedValue + "%";
		}
	}
	
	// Preparing the Rows and Columns based on Window size
    function getRowHeight() {
        var windowWidth, rowHeight;

        windowWidth = $(window).width();
        rowHeight = (windowWidth < 900) ? 44 : 32;
        return rowHeight;
    }

    function getColumns() {
        var windowWidth, newColumns, columnPriorities, maxPriority, i;

        windowWidth = $(window).width();
        newColumns = [];

        /* Column priorities */
        columnPriorities = [3, 1, 1, 1, 1, 2, 3, 3, 2];
        // By default all columns will be shown
        maxPriority = 3;
        if (windowWidth < 500) {
            maxPriority = 1;
        } else if (windowWidth < 900) {
            maxPriority = 2;
        } else {
            maxPriority = 3;
        }

        for (i = 0; i < columns.length; i++) {
            if (columnPriorities[i] <= maxPriority) {
                newColumns.push(columns[i]);
            }
        }
        //console.log(newColumns.length);

        return newColumns;
    }
	
    // Display window size on resize events
    function displayWindowSize() {
        var win = $(window);

        $('.window-size').html("(" + win.width() + ", " + win.height() + ")");
        //console.log(win.height());
    }
	
    function resizeGrid() {
        $("#positions-table").css("height", ($(window).height() - 132) + "px");
    }

    // Render table

    function drawGrid() {
        var newColumns = getColumns();
        options.rowHeight = getRowHeight();
        resizeGrid();
        grid = new Slick.Grid("#positions-table", data, newColumns, options);
        grid.onClick.subscribe(function (e, args) {
            var rowName = data[args.row].security;
            //console.log(data[args.row].security);
            $("#selected-position").text(rowName);
        });
        //grid.resizeCanvas();
    }

    $(window).on("resize", function () {
        drawGrid();
		displayWindowSize();
    });

    $(function () {
        drawGrid();
		displayWindowSize();
    });

}(jQuery));