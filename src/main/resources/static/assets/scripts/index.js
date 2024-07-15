const cover = document.getElementById('cover');
const loading = document.getElementById('loading');
const loginForm = document.getElementById('loginForm');
const map = document.getElementById('map');
const recoverDialog = document.getElementById('recoverDialog');
const registerForm = document.getElementById('registerForm');

const loadMap = (lat, lng, lv) => {
    lat ??= 35.8715411;
    lng ??= 128.601505;
    lv ??= 3;
    map.instance = new kakao.maps.Map(map, {
        center: new kakao.maps.LatLng(lat, lng),
        level: lv
    });

    // 마지막에 봤던 지도 시점 저장
    kakao.maps.event.addListener(map.instance, 'bounds_changed', () => {
        const mapCenter = map.instance.getCenter();
        localStorage.setItem('mapLastLat', mapCenter.getLat());
        localStorage.setItem('mapLastLng', mapCenter.getLng());
        localStorage.setItem('mapLastLv', map.instance.getLevel());
    });

    // 지도 클릭 이벤트
    kakao.maps.event.addListener(map.instance, 'click', (mouseEvent) => {
        // 클릭한 위도, 경도 정보를 가져옵니다
        var latlng = mouseEvent.latLng;
        var lng = latlng.getLng();
        var lat = latlng.getLat();

        // 토지 정보 호출
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            loading.hide();
            listAside.hide();
            if (xhr.status < 200 || xhr.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                return;
            }
            const allInfo = JSON.parse(xhr.responseText);
            showDetailAside(allInfo, null, 1,() => showMyPageAside());
        }
        xhr.open(`GET`, `./api/info?lat=${lat}&lng=${lng}`);
        xhr.send();
        loading.show();
    });
};

if (!isNaN(parseFloat(localStorage.getItem('mapLastLat'))) &&
    !isNaN(parseFloat(localStorage.getItem('mapLastLng'))) &&
    !isNaN(parseInt(localStorage.getItem('mapLastLv')))) {
    loadMap(
        parseFloat(localStorage.getItem('mapLastLat')),
        parseFloat(localStorage.getItem('mapLastLng')),
        parseInt(localStorage.getItem('mapLastLv'))
    );
} else {
    navigator.geolocation.getCurrentPosition((data) => {
        // 사용자가 현재위치 사용에 동의했을때
        loadMap(data.coords.latitude, data.coords.longitude);
    }, () => {
        // 사용자가 현재위치 사용을 거부했을때
        loadMap();
    });
}

// 지도 타입 관련 파트
const topographicalMap = document.getElementById('btnTopographicalMap');
const cadastralMap = document.getElementById('btnCadastralMap');
const skyViewMap = document.getElementById('btnSkyView');

topographicalMap.onclick = () => {
    if (skyViewMap.classList.contains('_selected')) {
        skyViewMap.classList.remove('_selected');
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
    }
    if (topographicalMap.classList.contains('_selected')) {
        topographicalMap.classList.remove('_selected');
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
        return;
    }
    topographicalMap.classList.add('_selected');
    map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
}

cadastralMap.onclick = () => {
    if (cadastralMap.classList.contains('_selected')) {
        cadastralMap.classList.remove('_selected');
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
        return;
    }
    if (topographicalMap.classList.contains('_selected')) {
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
        map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
        cadastralMap.classList.add('_selected');
        map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
        return;
    }
    cadastralMap.classList.add('_selected');
    map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
}

skyViewMap.onclick = () => {
    if (topographicalMap.classList.contains('_selected')) {
        topographicalMap.classList.remove('_selected');
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
    }
    if (skyViewMap.classList.contains('_selected')) {
        skyViewMap.classList.remove('_selected');
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
        return;
    }
    if (cadastralMap.classList.contains('_selected')) {
        map.instance.removeOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
        map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
        skyViewMap.classList.add('_selected');
        map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
        return;
    }
    skyViewMap.classList.add('_selected');
    map.instance.addOverlayMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
}

// 지도 확대 축소 관련

const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');

zoomIn.onclick = () => {
    map.instance.setLevel(map.instance.getLevel() - 1);
}

zoomOut.onclick = () => {
    map.instance.setLevel(map.instance.getLevel() + 1);
}

const showLogin = () => {
    centerDialogForm.hide();
    registerForm.hide();
    recoverDialog.hide();
    loginForm['email'].value = '';
    loginForm['email'].focus();
    loginForm['password'].value = '';
    loginForm.show();
    cover.show(() => {
        loginForm.hide();
        cover.hide();
    })
}

const showRegister = () => {
    loginForm.hide();
    registerForm['emailSalt'].value = '';
    registerForm['email'].enable();
    registerForm['email'].focus();
    registerForm['email'].value = '';
    registerForm['emailSend'].enable();
    registerForm['emailCode'].disable();
    registerForm['emailCode'].value = '';
    registerForm['emailVerify'].disable();
    registerForm['password'].value = '';
    registerForm['passwordCheck'].value = '';
    registerForm['nickname'].value = '';
    registerForm['agree'].checked = false;
    registerForm.show();
    cover.show(() => {
        registerForm.hide();
        showLogin();
    })
}

const showRecover = () => {
    recoverDialog.querySelector('[name="type"][value="email"]').checked = true;
    recoverDialog.emailForm['nickname'].value = '';
    recoverDialog.passwordForm['emailSalt'].value = '';
    recoverDialog.passwordForm['email'].enable().value = '';
    recoverDialog.passwordForm['emailSend'].enable();
    recoverDialog.passwordForm['emailCode'].disable().value = '';
    recoverDialog.passwordForm['emailVerify'].disable();
    recoverDialog.show();
    cover.show(() => {
        recoverDialog.hide();
        showLogin();
    });
};


const showListAside = () => {
    centerDialogForm.hide();
    detailAside.hide();
    myPageAside.hide();
    showSearchListAside();
};

const showMyPageAside = () => {
    centerDialogForm.hide();
    detailAside.hide();
    listAside.hide();
    myPageAside.show();
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        if (responseObject['email'] === 'noEmail') {
            myInfoContainer.hide();
            myLandContainer.hide();
            myReviewContainer.hide();
        } else {
            showMyInfoContainer();
            loadMyLand(1);
            loadMyReview(1);
        }
    }
    xhr.open(`GET`, `/user/getEmail`);
    xhr.send();
}

cover.show = (onclick) => {
    cover.onclick = onclick;
    cover.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
}

const showCenterDialog = () => {
    loginForm.hide();
    centerDialogForm['category'].value = 'question';
    centerDialogForm['content'].value = '';
    centerDialogForm.show();
    cover.show(() => {
        centerDialogForm.hide();
        cover.hide();
    })
}

document.body.querySelectorAll('[rel="showLoginCaller"]').forEach(el => el.addEventListener('click', showLogin));
document.body.querySelectorAll('[rel="showRegisterCaller"]').forEach(el => el.addEventListener('click', showRegister));
document.body.querySelectorAll('[rel="showRecoverCaller"]').forEach(el => el.addEventListener('click', showRecover));
document.body.querySelectorAll('[rel="showListAsideCaller"]').forEach(el => el.addEventListener('click', showListAside));
document.body.querySelectorAll('[rel="showMyPageAsideCaller"]').forEach(el => el.addEventListener('click', showMyPageAside));
document.body.querySelectorAll('[rel="centerCaller"]').forEach(el => el.addEventListener('click', showCenterDialog));
document.body.querySelector('[rel="showHomeCaller"]').onclick = e => {
    e.preventDefault();
    window.location.href = './main';
}


loginForm.emailLabel = new LabelObj(loginForm.querySelector('[rel="emailLabel"]'));
loginForm.passwordLabel = new LabelObj(loginForm.querySelector('[rel="passwordLabel"]'));

loginForm.onsubmit = e => {
    e.preventDefault();
    loginForm.emailLabel.setValid(loginForm['email'].tests());
    loginForm.passwordLabel.setValid(loginForm['password'].tests());
    if (!loginForm.emailLabel.isValid() || !loginForm.passwordLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginForm['email'].value);
    formData.append('password', loginForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        if (responseObject.result === 'success') {
            location.reload();
            return;
        }
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.', () => loginForm['email'].focus()],
            failure_suspended: ['경고', '이용이 일시적으로 정지된 계정입니다. 고객센터를 통해 문의해 주세요.', () => showCenterDialog()],
            failure_deleted: ['경고', '탈퇴한 계정입니다. 고객센터를 통해 문의해 주세요.', () => showCenterDialog()]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        showMyPageAside();
    }
    xhr.open(`POST`, `./user/login`);
    xhr.send(formData);
    loading.show();
}

registerForm.emailLabel = new LabelObj(registerForm.querySelector('[rel="emailLabel"]'));
registerForm.passwordLabel = new LabelObj(registerForm.querySelector('[rel="passwordLabel"]'));
registerForm.nicknameLabel = new LabelObj(registerForm.querySelector('[rel="nicknameLabel"]'));

registerForm['emailSend'].onclick = () => {
    registerForm.emailLabel.setValid(registerForm['email'].tests());
    if (!registerForm.emailLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', registerForm['email'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            failure_duplicate_email: ['경고', '해당 이메일은 이미 사용중입니다. 다른 이메일을 입력해 주세요.', () => {
                registerForm['email'].focus();
            }],
            success: ['알림', '입력하신 이메일로 인증번호를 전송하였습니다. 인증번호는 3분간만 유효하니 유의해 주세요', () => {
                registerForm['emailSalt'].value = responseObject['salt'];
                registerForm['email'].disable();
                registerForm['emailSend'].disable();
                registerForm['emailCode'].enable();
                registerForm['emailCode'].focus();
                registerForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`POST`, `./user/registerEmail`);
    xhr.send(formData);
    loading.show();
};

registerForm.onsubmit = e => {
    e.preventDefault();
    registerForm.passwordLabel.setValid(registerForm['password'].tests());
    registerForm.nicknameLabel.setValid(registerForm['nickname'].tests());
    if (registerForm['emailSend'].isEnabled() || registerForm['emailVerify'].isEnabled()) {
        MessageObj.createSimpleOk('경고', '이메일 인증을 완료해 주세요.').show();
        return;
    }
    if (registerForm['password'].value !== registerForm['passwordCheck'].value) {
        MessageObj.createSimpleOk('경고', '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.').show();
        return;
    }
    if (!registerForm['agree'].checked) {
        MessageObj.createSimpleOk('경고', '약관에 동의 후 다시 시도해주세요.').show();
        return;
    }
    if (!registerForm.passwordLabel.isValid() || !registerForm.nicknameLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', registerForm['email'].value);
    formData.append('code', registerForm['emailCode'].value);
    formData.append('salt', registerForm['emailSalt'].value);
    formData.append('password', registerForm['password'].value);
    formData.append('nickname', registerForm['nickname'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 회원가입에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
            failure_duplicate_email: ['경고', `입력하신 이메일 <b>${registerForm['email'].value}</b>은 이미 사용 중입니다. 다른 이메일을 사용해 주세요`, () => {
                registerForm['emailSalt'].value = '';
                registerForm['email'].enable().focus();
                registerForm['emailSend'].enable();
                registerForm['emailCode'].disable().value = '';
                registerForm['emailVerify'].disable();
            }],
            failure_duplicate_nickname: ['경고', `입력하신 닉네임 <b>${registerForm['nickname'].value}</b>은(는) 이미 사용 중입니다. 다른 닉네임을 사용해 주세요.`, () => registerForm['nickname'].focus()],
            success: ['알림', '회원가입해 주셔서 감사드립니다. 확인 버튼을 클릭하시면 로그인 페이지로 이동합니다.', () => showLogin()]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`POST`, `./user/`);
    xhr.send(formData);
    loading.show();
};

registerForm['emailVerify'].onclick = () => {
    registerForm.emailLabel.setValid(registerForm['emailCode'].tests());
    if (!registerForm.emailLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', registerForm['email'].value);
    formData.append('code', registerForm['emailCode'].value);
    formData.append('salt', registerForm['emailSalt'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '인증정보가 올바르지 않습니다. 다시 확인해 주세요', () => loginForm['emailCode'].focus()],
            failure_expired: ['경고', '인증정보가 만료되었습니다. 다시 시도해 주세요', () => {
                registerForm['emailSalt'].value = '';
                registerForm['email'].enable();
                registerForm['emailSend'].enable();
                registerForm['emailCode'].disable();
                registerForm['emailCode'].value = '';
                registerForm['emailVerify'].disable();
            }],
            success: ['알림', '이메일 인증이 완료되었습니다. 회원가입을 계속해 주세요.', () => {
                registerForm['emailCode'].disable();
                registerForm['emailVerify'].disable();
                registerForm['password'].focus();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`PATCH`, `./user/registerEmail`);
    xhr.send(formData);
    loading.show();
};

const termsOfUseDialog = document.getElementById('termsOfUseDialog');
const privacyDialog = document.getElementById('privacyDialog');

registerForm.querySelector('[rel="termsOfUseLink"]').onclick = e => {
    e.preventDefault();
    termsOfUseDialog.show();
}

termsOfUseDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    termsOfUseDialog.hide();
}


registerForm.querySelector('[rel="privacyLink"]').onclick = e => {
    e.preventDefault();
    privacyDialog.show();
}

privacyDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    privacyDialog.hide();
}

recoverDialog.emailForm = recoverDialog.querySelector('[rel="emailForm"]');
recoverDialog.emailForm.nicknameLabel = new LabelObj(recoverDialog.emailForm.querySelector('[rel="nicknameLabel"]'));
recoverDialog.passwordForm = recoverDialog.querySelector('[rel="passwordForm"]');
recoverDialog.passwordForm.emailLabel = new LabelObj(recoverDialog.passwordForm.querySelector('[rel="emailLabel"]'));
recoverDialog.passwordForm.passwordLabel = new LabelObj(recoverDialog.passwordForm.querySelector('[rel="passwordLabel"]'));

recoverDialog.querySelector('[name="cancelButton"]').onclick = () => {
    showLogin();
};

recoverDialog.emailForm.onsubmit = e => {
    e.preventDefault();
    recoverDialog.emailForm.nicknameLabel.setValid(recoverDialog.emailForm['nickname'].tests());
    if (!recoverDialog.emailForm.nicknameLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '입력하신 닉네임으로 회원 정보를 찾을 수 없습니다. 다시 확인해 주세요'],
            success: ['알림', `입력하신 닉네임으로 찾은 회원님의 이메일은 <b>${responseObject['email']}</b>입니다. 확인 버튼을 클릭하면 로그인 페이지로 돌아갑니다.`, () =>
                showLogin()]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`GET`, `./user/email?nickname=${recoverDialog.emailForm['nickname'].value}`);
    xhr.send();
    loading.show();
};

recoverDialog.passwordForm['emailSend'].onclick = () => {
    recoverDialog.passwordForm.emailLabel.setValid(recoverDialog.passwordForm['email'].value);
    if (!recoverDialog.passwordForm.emailLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', recoverDialog.passwordForm['email'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '입력하신 이메일을 사용하는 회원이 없습니다. 다시 확인해 주세요.', () => recoverDialog.passwordForm['email'].focus()],
            success: ['알림', '입력하신 이메일로 인증번호를 전송하였습니다. 인증번호는 3분간만 유효하니 유의해 주세요', () => {
                recoverDialog.passwordForm['emailSalt'].value = responseObject['salt'];
                recoverDialog.passwordForm['email'].disable();
                recoverDialog.passwordForm['emailSend'].disable();
                recoverDialog.passwordForm['emailCode'].enable();
                recoverDialog.passwordForm['emailCode'].focus();
                recoverDialog.passwordForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open(`POST`, `./user/resetPasswordEmail`);
    xhr.send(formData);
    loading.show();
}

recoverDialog.passwordForm['emailVerify'].onclick = () => {
    recoverDialog.passwordForm.emailLabel.setValid(recoverDialog.passwordForm['emailCode'].tests());
    if (!recoverDialog.passwordForm.emailLabel.isValid()) {
        return
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', recoverDialog.passwordForm['email'].value);
    formData.append('code', recoverDialog.passwordForm['emailCode'].value);
    formData.append('salt', recoverDialog.passwordForm['emailSalt'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '인증정보가 올바르지 않습니다. 다시 확인해 주세요', () => recoverDialog.passwordForm['emailCode'].focus()],
            failure_expired: ['경고', '인증정보가 만료되었습니다. 다시 시도해 주세요', () => {
                recoverDialog.passwordForm['emailSalt'].value = '';
                recoverDialog.passwordForm['email'].enable();
                recoverDialog.passwordForm['emailSend'].enable();
                recoverDialog.passwordForm['emailCode'].disable();
                recoverDialog.passwordForm['emailCode'].value = '';
                recoverDialog.passwordForm['emailVerify'].disable();
            }],
            success: ['알림', '이메일 인증이 완료되었습니다. 변경할 비밀번호를 입력해 주세요.', () => {
                recoverDialog.passwordForm['emailCode'].disable();
                recoverDialog.passwordForm['emailVerify'].disable();
                recoverDialog.passwordForm['password'].enable().focus();
                recoverDialog.passwordForm['passwordCheck'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open(`PATCH`, `./user/resetPasswordEmail`);
    xhr.send(formData);
    loading.show();
}

recoverDialog.passwordForm.onsubmit = e => {
    e.preventDefault();
    if (recoverDialog.passwordForm['emailSend'].isEnabled() || recoverDialog.passwordForm['emailVerify'].isEnabled()) {
        MessageObj.createSimpleOk('경고', '이메일 인증을 완료해 주세요.').show();
        return;
    }
    recoverDialog.passwordForm.passwordLabel.setValid(recoverDialog.passwordForm['password'].value);
    if (!recoverDialog.passwordForm.passwordLabel.isValid()) {
        return;
    }
    if (recoverDialog.passwordForm['password'].value !== recoverDialog.passwordForm['passwordCheck'].value) {
        MessageObj.createSimpleOk('경고', '재입력한 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', () => recoverDialog.passwordForm['password'].focus()).show();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', recoverDialog.passwordForm['email'].value);
    formData.append('code', recoverDialog.passwordForm['emailCode'].value);
    formData.append('salt', recoverDialog.passwordForm['emailSalt'].value);
    formData.append('password', recoverDialog.passwordForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 비밀번호를 재설정하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            success: ['알림', '비밀번호를 성공적으로 재설정하였습니다. 확인 버튼을 클릭하시면 로그인 페이지로 이동합니다.', () => showLogin()]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`PATCH`, `./user/resetPassword`);
    xhr.send(formData);
    loading.show();
};


// 회원정보변경
const editDialog = document.getElementById('editDialog');
const editCancelButton = editDialog.querySelector('[rel="cancelButton"]');
editDialog.passwordForm = editDialog.querySelector('[rel="passwordForm"]');
editDialog.nicknameForm = editDialog.querySelector('[rel="nicknameForm"]');
editDialog.passwordLabel = new LabelObj(editDialog.querySelector('[rel="passwordLabel"]'));
editDialog.nicknameLabel = new LabelObj(editDialog.querySelector('[rel="nicknameLabel"]'));

editCancelButton.onclick = () => {
    editDialog.passwordForm['password'].value = '';
    editDialog.passwordForm['passwordCheck'].value = '';
    editDialog.nicknameForm['nickname'].value = '';
    document.querySelector('input[name="type"][value="password"]').cheked = false;
    document.querySelector('input[name="type"][value="nickname"]').checked = false;
    editDialog.hide();
}

editDialog.nicknameForm.onsubmit = e => {
    e.preventDefault();
    new MessageObj({
        title: '계정정보변경',
        content: '정말로 닉네임을 변경할까요?',
        buttons: [
            {text: '취소', onclick: instance => instance.hide()},
            {
                text: '변경하기', onclick: instance => {
                    instance.hide();
                    editDialog.nicknameLabel.setValid(editDialog.nicknameForm['nickname'].value);
                    if (!editDialog.nicknameLabel.isValid()) {
                        return;
                    }
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('nickname', editDialog.nicknameForm['nickname'].value);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== XMLHttpRequest.DONE) {
                            return;
                        }
                        loading.hide();
                        if (xhr.status < 200 || xhr.status >= 300) {
                            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
                            return;
                        }
                        const responseObject = JSON.parse(xhr.responseText);
                        const [dTitle, dContent, dOnclick] = {
                            failure: ['경고', '알 수 없는 이유로 닉네임을 변경하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
                            failure_duplicate_nickname: ['경고', `입력하신 닉네임 <b>${editDialog.nicknameForm['nickname'].value}</b>은(는) 이미 사용 중입니다. 다른 닉네임을 사용해 주세요.`, () => editDialog.nicknameForm['nickname'].focus()],
                            success: ['알림', '닉네임을 성공적으로 변경하였습니다.', () => location.reload()]
                        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                    }
                    xhr.open(`PATCH`, `./user/info`);
                    xhr.send(formData);
                    loading.show();
                }
            }
        ]
    }).show();
}

editDialog.passwordForm.onsubmit = e => {
    e.preventDefault();
    new MessageObj({
        title: '계정정보변경',
        content: '정말로 비밀번호를 변경할까요?',
        buttons: [
            {text: '취소', onclick: instance => instance.hide()},
            {
                text: '변경하기', onclick: instance => {
                    instance.hide();
                    editDialog.passwordLabel.setValid(editDialog.passwordForm['password'].value);
                    if (!editDialog.passwordLabel.isValid()) {
                        return;
                    }
                    if (editDialog.passwordForm['password'].value !== editDialog.passwordForm['passwordCheck'].value) {
                        MessageObj.createSimpleOk('경고', '재입력한 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', () => editDialog.passwordForm['password'].focus()).show();
                        return;
                    }
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('password', editDialog.passwordForm['password'].value);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== XMLHttpRequest.DONE) {
                            return;
                        }
                        loading.hide()
                        if (xhr.status < 200 || xhr.status >= 300) {
                            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
                            return;
                        }
                        const responseObject = JSON.parse(xhr.responseText);
                        const [dTitle, dContent, dOnclick] = {
                            failure: ['경고', '알 수 없는 이유로 비밀번호를 재설정하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
                            success: ['알림', '비밀번호를 성공적으로 재설정하였습니다. 로그인을 다시 진행해주세요', () => {
                                const xhr = new XMLHttpRequest();
                                const formData = new FormData();
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState !== XMLHttpRequest.DONE) {
                                        return;
                                    }
                                    if (xhr.status < 200 || xhr.status >= 300) {
                                        MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
                                        return;
                                    }
                                    location.reload();
                                    // location.href = location.href + '';
                                }
                                xhr.open(`GET`, `./user/logout`);
                                xhr.send(formData);
                            }]
                        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                    }
                    xhr.open(`PATCH`, `./user/info`);
                    xhr.send(formData);
                }
            }
        ]
    }).show();
}

// 회원탈퇴
const withdrawalForm = document.getElementById('withdrawalForm');
const withdrawalCancelButton = withdrawalForm.querySelector('[rel="withdrawalCancel"]');
withdrawalForm.passwordLabel = new LabelObj(withdrawalForm.querySelector('[rel="passwordLabel"]'));
withdrawalForm.checkLabel = new LabelObj(withdrawalForm.querySelector('[rel="checkLabel"]'));

withdrawalCancelButton.onclick = e => {
    e.preventDefault();
    withdrawalForm['password'].value = '';
    withdrawalForm['passwordCheck'].value = '';
    withdrawalForm['agree'].checked = false;
    withdrawalForm.hide();
}

withdrawalForm.onsubmit = e => {
    e.preventDefault();
    new MessageObj({
        title: '회원탈퇴',
        content: '정말로 탈퇴할까요? 탈퇴한 회원 정보는 30일간 저장되며 이후 삭제됩니다.',
        buttons: [
            {text: '취소', onclick: instance => instance.hide()},
            {
                text: '탈퇴하기', onclick: instance => {
                    instance.hide();
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    withdrawalForm.passwordLabel.setValid(withdrawalForm['password'].tests());
                    if (!withdrawalForm.passwordLabel.isValid()) {
                        return;
                    }
                    if (withdrawalForm['password'].value !== withdrawalForm['passwordCheck'].value) {
                        MessageObj.createSimpleOk('경고', '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.').show();
                        withdrawalForm['password'].value = '';
                        withdrawalForm['passwordCheck'].value = '';
                        return;
                    }
                    if (!withdrawalForm['agree'].checked) {
                        MessageObj.createSimpleOk('경고', '서비스이용약관 및 개인정보 처리방침에 동의해주세요').show();
                        return;
                    }
                    formData.append('password', withdrawalForm['password'].value);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== XMLHttpRequest.DONE) {
                            return;
                        }
                        loading.hide();
                        if (xhr.status < 200 || xhr.status >= 300) {
                            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                            return;
                        }
                        const responseObject = JSON.parse(xhr.responseText);
                        const [dTitle, dContent, dOnclick] = {
                            failure: ['경고', '알 수 없는 이유로 회원탈퇴에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
                            success: ['알림', '회원탈퇴에 성공했습니다. 탈퇴한 회원 정보는 30일동안 저장되며 이후 삭제됩니다.', () => {
                                const xhr = new XMLHttpRequest();
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState !== XMLHttpRequest.DONE) {
                                        return;
                                    }
                                    if (xhr.status < 200 || xhr.status >= 300) {
                                        MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                                        return;
                                    }
                                    location.reload();
                                }
                                xhr.open(`GET`, `/user/logout`);
                                xhr.send();
                            }],
                            failure_different_password: ['경고', '비밀번호가 틀렸습니다. 비밀번호를 확인해주세요', () => {
                                withdrawalForm['password'].value = '';
                                withdrawalForm['passwordCheck'].value = '';
                            }],
                        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

                    }
                    xhr.open(`PATCH`, `/user/`);
                    xhr.send(formData);
                    loading.show();
                }
            }
        ]
    }).show();
}

// 고객센터
const centerDialogForm = document.getElementById('centerDialog');
const centerDialogCancelButton = centerDialogForm.querySelector('[rel="centerCancelButton"]');

centerDialogCancelButton.onclick = e => {
    e.preventDefault();
    centerDialogForm['category'].value = 'question';
    centerDialogForm['content'].value = '';
    centerDialogForm.hide();
    cover.hide();
}

centerDialogForm.onsubmit = e => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('category', centerDialogForm['category'].value);
    formData.append('content', centerDialogForm['content'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 문의를 접수하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            success: ['알림', '문의를 성공적으로 접수하였습니다. 요청하신 사항을 최대한 반영하겠습니다. 감사합니다.']
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`POST`, `./center/`);
    xhr.send(formData);
    loading.show();
}

const applyFlickity = () => {
    document.body.querySelectorAll('[data-flickity]').forEach(el => {
        new Flickity(el, {
            cellAlign: 'left',
            contain: true,
            pageDots: false,
            wrapAround: true
        })
    });
};

showMyPageAside();
applyFlickity();

