//const loginCheck = (login) => (/^([a-z0-9-\._])+$/).test(login);

$(document).ready(function () {
    $('#submit').click(() => {
        var login = this.forms['login-form'].login.value;
        var password = this.forms['login-form'].password.value;
        var passwordConfirm = this.forms['login-form']['password-2'].value;

        if (login.length > 0 && password.length > 0 && passwordConfirm.length > 0) {
            if (password == passwordConfirm) {
                fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        login,
                        password
                    })
                })
                .then((response) => {
                    if(response.status == 200){
                        window.location.href = '/';
                    }else if(response.status == 401){
                        showError(`Login ${login} is already occupied`);
                    }else {
                        showError('Unknown error!');
                    }
                })
                .catch((err) =>{
                    console.error(err);
                    showError('Server error');
                })
            } else {
                showError('Passwords don\'t match');
            }
        } else{
            showError('All fields must be filled');
        }
    });
});

function showError(text) {
    const distance = '5px';
    const speed = 250;

    $('#result').html(text).show();
    for(i=0; i < 2; i++) {
        $('#result').animate({
            marginRight: '+=' + distance,
            marginLeft: '-=' + distance
        }, speed).animate({
            marginRight: '-=' + distance,
            marginLeft: '+=' + distance
        }, speed);
    }
}