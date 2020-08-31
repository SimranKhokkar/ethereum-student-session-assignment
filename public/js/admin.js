$(document).ready(() => {
    $.ajax({
        'url': '/admin/allStudents',
        'type': 'GET',
        success: (res) => {
            if (res.result.length === 0) {
                $("#studentsTable").hide();
                $('#errorMessage').show();
            }
            else {
                $('#errorMessage').hide();
                $("#studentsTable").show();
                var studentsArray = res.result;
                var rows = "";
                for (var i = 0; i < studentsArray.length; i++) {
                    rows += "<tr><td>" + i + "</td><td>" + studentsArray[i].args.name + "</td><td>" + studentsArray[i].args.email + "</td></tr>";
                    $(rows).appendTo("#studentsTable tbody");
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
    $.ajax({
        'url': '/admin/allFeedbacks',
        'type': 'GET',
        success: (res) => {
            if (res.result.length === 0) {
                $("#feedbacksTable").hide();
                $('#errorMessageFeedback').show();
            }
            else {
                $('#errorMessageFeedback').hide();
                $("#feedbacksTable").show();
                var feedbacksArray = res.result;
                var rows = "";
                for (var i = 0; i < feedbacksArray.length; i++) {
                    rows += "<tr><td>" + i + "</td><td>" + feedbacksArray[i].args.averageRating + "</td></tr>";
                    $(rows).appendTo("#feedbacksTable tbody");
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    });

    $.ajax({
        'url': '/admin/getFeedbackFlag',
        'type': 'GET',
        success: (res) => {
            if (res.feedbackFlag) {
                $('#openFeedback').prop('disabled', true);
                $('#openFeedback').css('background', '#ccc');
            }
            else {
                $('#openFeedback').prop('disabled', false);
                $('#openFeedback').css('background', '#4CAF50'); 
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
});

$('#openFeedback').on('click', () => {
    $.ajax({
        'url': '/admin/openFeedback',
        'type': 'GET',
    success: () => {
        $('#openFeedback').prop('disabled', true);
        $('#openFeedback').css('background', '#ccc');
    },
    error: (err) => {
        console.log(err);      
    }
});
});

$('#pay').on('click', () => {
    $.ajax({
        'url': '/admin/pay',
        'type': 'GET',
    success: () => {
        $('#pay').prop('disabled', true);
        $('#pay').css('background', '#ccc');
    },
    error: (err) => {
        console.log(err);      
    }
});
});

function loadContainer(tab) {
    $(".content").hide();
    $("#"+tab).show();
    var homeTab = document.getElementById("homeTab");
    var studentsTab = document.getElementById("allStudents");
    var feedbacksTab = document.getElementById("allFeedbacks");
    if(tab == "home"){
        homeTab.classList.add("active");
        feedbacksTab.classList.remove("active");
        studentsTab.classList.remove("active");
    }
    else if(tab == "students") {
        studentsTab.classList.add("active");
        homeTab.classList.remove("active");
        feedbacksTab.classList.remove("active");
        
    }
    else {
        feedbacksTab.classList.add("active");
        homeTab.classList.remove("active");
        studentsTab.classList.remove("active");
    }    
}