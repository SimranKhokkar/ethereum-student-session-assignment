$(document).ready(() => {
    $.ajax({
        'url': '/admin/getFeedbackFlag',
        'type': 'GET',
        success: (res) => {
            if (!res.feedbackFlag) {
                $("#knowledgeOfInstructor").prop('disabled', true);
                $("#durationOfSession").prop('disabled', true);
                $("#informationSharing").prop('disabled', true);
                $("#sessionContent").prop('disabled', true);
                $("#overallExperience").prop('disabled', true);
                $("#feedback").prop('disabled', true);
                $("#clear").prop('disabled', true);
                $('#feedback').css('background', '#ccc');
                $("#feedbackFlagMessage").show();
            }
            else {
                $("#knowledgeOfInstructor").prop('disabled', false);
                $("#durationOfSession").prop('disabled', false);
                $("#informationSharing").prop('disabled', false);
                $("#sessionContent").prop('disabled', false);
                $("#overallExperience").prop('disabled', false);
                $("#feedback").prop('disabled', false);
                $("#clear").prop('disabled', false);
                $('#feedback').css('background', '#4CAF50');
                $("#feedbackFlagMessage").hide();  
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
});

let formdata;
$('#feedback').on('click', (e) => {
    e.preventDefault();
    if(0 <= (parseInt($('#knowledgeOfInstructor').val()) || parseInt($('#durationOfSession').val()) || parseInt($('#informationSharing').val()) || parseInt($('#sessionContent').val()) || parseInt($('#overallExperience').val())) > 5){
        $('#validationError').show().html('All the fields are to be rated out of 5');
    }
    else {
    formdata = $('#feedbackForm').serialize();
    $('#login').show();
    $('#feedbackForm').hide();
    }
});

$('#studentDetails').on('click', (e) => {
    let formData = $('#feedbackForm, #myForm').serialize();
    e.preventDefault();
    $.ajax({
        'url': '/giveFeedback',
        'type': 'POST',
        'data': formData,
        'dataType': 'json',
    success: () => {
        window.onbeforeunload = null;
        window.location.href = 'end'
    },
    error: () => {
        $('#myForm').hide();
        $('#feedbackForm').show();
        $('#formError').show().html('Failed to record the feedback, Please refresh and try again');        
    }
});
});

$('#clear').on('click', (e) => {
    $('#knowledgeOfInstructor').val() = '';
    $('#durationOfSession').val() = '';
    $('#informationSharing').val() = '';
    $('#sessionContent').val() = '';
    $('#overallExperience').val() = '';
});