$(document).ready(function(){

    $('#texteditor').mouseup(function() {
        selection = getSelected();
        if (selection && selection != '') {
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
            $("#location_list").append('<button class="btn btn-danger btn-xs"><strong>'+selection+'</strong></button>&nbsp;&nbsp;<i class="glyphicon glyphicon-remove"></i><br><br>');

            //$("#location_list").append('<span style="color:blue"><strong>'+Selection+"</span>&#160;X'");

            //$('#processNotification').css("display", "block");

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

            //$('#processNotification').css("display", "none");

        }else if ($("input[id='choice_tag']:checked").val()){
            // We're adding a 'tag'
            $("#tag_list").append('<button class="btn btn-primary btn-xs"><strong>'+selection+'</strong></button>&nbsp;&nbsp;<i class="glyphicon glyphicon-remove"></i><br><br>');

            $('#processNotification').css("display", "block");

            if($('#checked_slider').is(':checked')) {
                // We load the development version (with slider)
                $.ajax({
                    url: "/getArticlesByTagGeo",
                    global: false,
                    type: "GET",
                    data: {tag: selection},
                    cache: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Accept", "application/json");
                        xhr.setRequestHeader("Content-Type", "application/json");
                    },
                    success: function(data) {
                        //putLocationStoriesMarkers(data);
                        putLocationStoriesGeoMarkers(data);
                        $('#processNotification').css("display", "none");
                    },
                    error: function(data) {
                        $('#processNotification').css("display", "none");
                    }

                });
            }else{
                // We load the fully functional version (without slider)
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
                        //putLocationStoriesMarkers(data);
                        putLocationStoriesMarkers(data);
                        $('#processNotification').css("display", "none");
                    },
                    error: function(data) {
                        $('#processNotification').css("display", "none");
                    }


                });
            }



        }
    });

});

