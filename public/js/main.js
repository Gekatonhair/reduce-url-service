const checkWantedUrl = (wantedUrl) => (/^([a-z0-9-\.])+$/).test(wantedUrl);

const getMinUrl = (wantedUrl, bigUrl) => {
    let $reduceUrlAlertSuccess =  $(`body`).find("#reduceUrlAlertSuccess");
    let $reduceUrlAlertFail = $(`body`).find("#reduceUrlAlertFail");

    fetch(`/api/reduceUrl`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wantedUrl,
            bigUrl
        })
    })
    .then((response) => {
        console.log(response);
        switch (response.status) {
            case 200:
                response.json().then((url) => {
                    $reduceUrlAlertSuccess.show();
                    $reduceUrlAlertSuccess.append(`You short url link: <a href="/:${url}" target="_blanc">${window.location.href}:${url}</a>`);
                })
                break;
            case 404:
                $reduceUrlAlertFail.show();
                $reduceUrlAlertFail.append(`Error: url "<span>${bigUrl}</span>" not found`);
                break;
            case 400:
                $reduceUrlAlertFail.show();
                $reduceUrlAlertFail.append(`Url "${wantedUrl}" is busy, enter another wanted url`);
                break;
            default:
                $reduceUrlAlertFail.show();
                $reduceUrlAlertFail.append(`Error: unknown status code`);
                break;
        }
        //return response.json();
    })
    .catch((err) => {
        $reduceUrlAlertFail.show();
        console.error(err);
        $reduceUrlAlertFail.append(`Error: ${err}`);
    });
}

$(document).ready(() => {
    console.log("ready");
    let $reduceUrlAlertSuccess =  $(`body`).find("#reduceUrlAlertSuccess");
    let $reduceUrlAlertFail = $(`body`).find("#reduceUrlAlertFail");

    $('#getMinUrlButton').click(() => {
        let wantedUrl = $('#wantedUrlInput').val();
        let bigUrl = $('#bigUrlInput').val();//bigUrl = 'https://auto.ru';

        $reduceUrlAlertSuccess.empty();
        $reduceUrlAlertSuccess.hide();
        $reduceUrlAlertFail.empty();
        $reduceUrlAlertFail.hide();

        if (checkWantedUrl(wantedUrl) || wantedUrl == '') {//url
            $('#wantedUrlAlert').hide();
            if (bigUrl.length < 2049) {//check url max length
                getMinUrl(wantedUrl, bigUrl);
            }
        } else {
            $('#wantedUrlAlert').show();
        }
    });//#getMinUrlButton click
});