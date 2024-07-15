const cover = document.getElementById('cover');
const loading = document.getElementById('loading');
const loginForm = document.getElementById('loginForm');
const recoverDialog = document.getElementById('recoverDialog');
const registerForm = document.getElementById('registerForm');

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
        cover.hide()
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
document.body.querySelectorAll('[rel="showCenterCaller"]').forEach(el => el.addEventListener('click', showCenterDialog));


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

registerForm.querySelector('[rel="termsOfUseLink"]').onclick = e => {
    e.preventDefault();
    termsOfUseDialog.show();
}

registerForm.querySelector('[rel="privacyLink"]').onclick = e => {
    e.preventDefault();
    privacyDialog.show();
}

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
        centerDialogForm.hide();
        cover.hide();
    }
    xhr.open(`POST`, `./center/`);
    xhr.send(formData);
    loading.show();
}

const termsOfUseDialog = document.getElementById('termsOfUseDialog');
const privacyDialog = document.getElementById('privacyDialog');
const emailDialog = document.getElementById('emailDialog');
const locationDialog = document.getElementById('locationDialog');
const disclaimerDialog = document.getElementById('disclaimerDialog');

document.querySelector('[rel="termsOfUseDialog"]').onclick = e => {
    e.preventDefault();
    termsOfUseDialog.show();
    cover.show(() => {
        termsOfUseDialog.hide();
        cover.hide()
    })
}

termsOfUseDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    termsOfUseDialog.hide();
    cover.hide();
}

document.querySelector('[rel="privacyDialog"]').onclick = e => {
    e.preventDefault();
    privacyDialog.show();
    cover.show(() => {
        privacyDialog.hide();
        cover.hide()
    })
}

privacyDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    privacyDialog.hide();
    cover.hide();
}

document.querySelector('[rel="emailDialog"]').onclick = e => {
    e.preventDefault();
    emailDialog.show();
    cover.show(() => {
        emailDialog.hide();
        cover.hide();
    })
}

emailDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    emailDialog.hide();
    cover.hide();
}

document.querySelector('[rel="locationDialog"]').onclick = e => {
    e.preventDefault();
    locationDialog.show();
    cover.show(() => {
        locationDialog.hide();
        cover.hide();
    })
}

locationDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    locationDialog.hide();
    cover.hide();
}

document.querySelector('[rel="disclaimerDialog"]').onclick = e => {
    e.preventDefault();
    disclaimerDialog.show();
    cover.show(() => {
        disclaimerDialog.hide();
        cover.hide();
    })
}

disclaimerDialog.querySelector('[name="cancelButton"]').onclick = e => {
    e.preventDefault();
    disclaimerDialog.hide();
    cover.hide();
}

