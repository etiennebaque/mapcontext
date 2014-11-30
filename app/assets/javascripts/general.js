$(document).ready(function(){

    $('#texteditor').mouseup(function() {
        selection = getSelected();
        if (selection) {
            $('#default_description').hide();

            // Show 'selected text' section
            $('#selectedtext_value').html('<strong>'+selection+'</strong>');
            $('#selectedtext').show();

            $('#selection').val(selection);
        }
    });

    $('#selected_text_confirm').click(function() {

        selection = $('#selection').val();

        if ($("input[id='choice_location']:checked").val()){
            // We're adding a 'location' to map
            $("#location_list").append('<button class="btn btn-danger btn-xs">'+selection+'</button>');;

            $('#processNotification').html("<i>Retrieving related stories, and their location...</i>");

            $.ajax({
                url: "/getLocationInfo",
                global: false,
                type: "GET",
                data: {location: selection},
                cache: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function(data) {
                    putLocationMarker(data);
                }

            });

            $('#processNotification').html("");
        }else if ($("input[id='choice_tag']:checked").val()){
            // We're adding a 'tag'
            $("#tag_list").append('<button class="btn btn-primary btn-xs">'+selection+'</button>');

            $('#processNotification').html("<i>Retrieving related stories, and their location...</i>");

            $.ajax({
                url: "/getArticlesByTag",
                global: false,
                type: "GET",
                data: {tag: selection},
                cache: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function(data) {
                    putLocationStoriesMarkers(data);
                }

            });

            $('#processNotification').html("");
        }
    });

});

