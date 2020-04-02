'use strict';

function enableRequestDetailsHideShow() {
    $('table.r-details > caption').each(function () {
        if ($(this).hasClass('hide-show-enabled')) {
            return;
        }
        $(this).addClass('hide-show-enabled');
        $(this).unbind();
        $(this).on('click touch', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).toggleClass('r-details-expanded');
            return false;
        });
    });
}

function createSampleTabs() {
    var sampleTabs = $('.discrete.sample-tabs');
    sampleTabs.each(function () {
        if ($(this).hasClass('tabs-enabled')) return;
        $(this).addClass('tabs-enabled');
        var headlineElement = $(this);
        var xmlTabWrap = $('<div class="xmlTabWrap">');
        var xmlTabElements = $(this).siblings('.tab-xml').nextUntil('h2,h3,h4,h5,h6,h7,h8');
        xmlTabWrap.append(xmlTabElements);
        $(this).after(xmlTabWrap);

        var jsonTabWrap = $('<div class="jsonTabWrap">');
        var jsonTabElements = $(this).siblings('.tab-json').nextUntil('h2,h3,h4,h5,h6,h7,h8');
        jsonTabWrap.append(jsonTabElements);
        $(this).after(jsonTabWrap);

        var nvpTabWrap = $('<div class="nvpTabWrap">');
        var nvpTabElements = $(this).siblings('.tab-nvp').nextUntil('h2,h3,h4,h5,h6,h7,h8');
        nvpTabWrap.append(nvpTabElements);
        $(this).after(nvpTabWrap);

        var Tabs = {
            xml: xmlTabElements.length ? xmlTabWrap : undefined,
            json: jsonTabElements.length ? jsonTabWrap : undefined,
            nvp: nvpTabElements.length ? nvpTabWrap : undefined
        };

        Object.keys(Tabs).forEach(function (key) {
            return Tabs[key] == null && delete Tabs[key];
        });

        var _btnrow = $('<div/>', { 'class': 'btn-samples-row' });

        var _loop = function () {
            var _tab_self = Tabs[contentType];
            _btn = $('<button/>', {
                text: contentType.toUpperCase(),
                'class': 'btn-samples-tab ' + contentType
            });

            _btn.on('click touch', function () {
                //hide all. show yourself
                for (var t in Tabs) {
                    $(Tabs[t]).hide();
                }
                $(this).addClass('active');
                $(this).siblings('.btn-samples-tab').removeClass('active');
                $(_tab_self).show();
            });
            _btn.appendTo(_btnrow);
        };

        for (var contentType in Tabs) {
            var _btn;

            _loop();
        }
        _btnrow.insertAfter(headlineElement);
        $(_btnrow).children('button').first().click();
    });
}

// ########################################################################### //
// Search Overlay
// ########################################################################### //
function openOverlay(event) {
    $('#search-overlay').addClass('open');
    $('#search-overlay > form > input').focus();
    $('div#content').addClass('blur');
}

function closeOverlay(event) {
    $('#search-overlay').removeClass('open');
    $('div#content').removeClass('blur');
}

$(document).ready(function () {
    $('#search').click(openOverlay);

    $('#search-overlay button.close').click(closeOverlay);

    $('#search').keyup(function (event) {
        var keyCode = event.keyCode || event.which;
        switch (keyCode) {
            case 27:
                // escape
                closeOverlay(event);
                return;
            case 13:
                // enter
                event.preventDefault();
                return;
            case 38: // arrow up
            case 40:
                // arrow down
                return;
        }
        render(search($('#search').val()));
    });

    $('#search-overlay > form').submit(function (event) {
        event.preventDefault();
        return false;
    });
});

// ########################################################################### //
// Lunr
// ########################################################################### //
var searchTerm = '';
var searchIndexLoaded = false;
var idx;

function loadLunrIndex() {
    if (searchIndexLoaded) return true;

    $.getJSON('lunrindex.json', function (data) {
        idx = lunr.Index.load(data);
        searchIndexLoaded = true;
    });
    return true;
}

function search(term) {
    if (term === '') return [];
    return idx.search(term);
}

function render(results) {
    $('ul#search-results-list').empty();
    console.log("<b>Render:</b>");
    results.forEach(function (entry) {
        console.log(entry);
        $('ul#search-results-list').append($('<li/>', { 'class': 'search-list-entry' }).append(formatEntry(entry)));
    });
    $('ul#search-results-list').children[0].addClass('selected');
}

function formatEntry(entry) {
    var div = $('<div/>');
    var link = $('<a/>').attr('href', 'TestUrl');
    link.append($('<h3>').text('Test Page'));
    link.append($('<p/>').text('Test Text'));
    link.append($('<span/>', { 'class': 'label' }).text('Test Label'));
    div.append(link);
    return div;
}

$(document).ready(function () {
    loadLunrIndex();
});
