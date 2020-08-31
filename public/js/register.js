
$('#register').on('click', (e) => {
    e.preventDefault();
    let formdata = $('#registerForm').serialize();
    if($('#password').val() !== $('#cpassword').val()){
        $('#passwordError').show().html('Password and confirm password is not the same');
    }
    else {
    $.ajax({
        'url': '/register',
        'type': 'POST',
        'data': formdata,
        'dataType': 'json',
    success: () => {
        window.onbeforeunload = null;
        window.location.href = '/giveFeedback'
    },
    error: () => {
        $('#formError').show().html('Registration failed, Please try again');        
    }
});
}
});