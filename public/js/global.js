console.log("Inside global.js");
// Userlist data array for filling in info box
var bergData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $('#bergList table tbody').on('click', 'td a.linkshowberg', showBergInfo);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/bergs/bergdata', function( data ) {
        //Stick our berg data array into a userlist variable in the global object
        bergData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            console.log(this.icebergID);
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowberg" rel="' + this.icebergID + '">' + this.icebergID + '</a></td>';
            tableContent += '<td>' + this.x + '</td>';
            tableContent += '<td>' + this.y + '</td>';
            tableContent += '<td>' + this.z + '</td>';
            tableContent += '</tr>';
        });
        // Inject the whole content string into our existing HTML table
        $('#bergList table tbody').html(tableContent);
    });
};

//Show berg info
function showBergInfo(event) {
console.log('In show berg info function');
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisBergName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = bergData.map(function(arrayItem) { 
        return arrayItem.icebergID; 
    }).indexOf(thisBergName);

    // Get our berg Object
    var thisBergObject = bergData[arrayPosition];

    //Populate Info Box
    $('#bergID').text(thisBergObject.icebergID);
    $('#bergX').text(thisBergObject.x);
    $('#bergY').text(thisBergObject.y);
    $('#bergZ').text(thisBergObject.z);

};
