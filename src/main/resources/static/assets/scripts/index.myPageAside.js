const myPageAside = document.getElementById('myPageAside');
const myInfoContainer = myPageAside.querySelector('[rel="myInfoContainer"]');
const myLandContainer = myPageAside.querySelector('[rel="myLandContainer"]');
const myReviewContainer = myPageAside.querySelector('[rel="myReviewContainer"]');
const myPageButtonContainer = myPageAside.querySelector('[rel="myPageButtonContainer"]');
const backButton = myPageAside.querySelector('._back-button');
const withdrawalButton = myPageAside.querySelector('[rel="withdrawal"]');
const editProfileButton = myPageAside.querySelector('[rel="editProfile"]');
const landPageContainer = myPageAside.querySelector('.land-page-container');
const myPageReviewPageContainer = myPageAside.querySelector('.review-page-container');

const myLandContainerElements = myLandContainer.querySelector(':scope > .lands');

myLandContainerElements.addEventListener('click', function (e) {
    e.preventDefault();
    const myLandContainerEl = e.target.closest('li.item')
    if (myLandContainerEl) {
        const landContainer = e.target.closest('.my-land-container');
        const pnu = landContainer.querySelector('.pnu').innerText.trim();
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                return;
            }
            const allInfo = JSON.parse(xhr.responseText);
            map.instance.setCenter(new kakao.maps.LatLng(allInfo['latitude'], allInfo['longitude']));
            map.instance.setLevel(2);
            showDetailAside(allInfo, null, 1,() => showMyPageAside);
        }
        xhr.open(`GET`, `/land/info?pnu=${pnu}`);
        xhr.send();
    }
});

const myReviewContainerElements = myReviewContainer.querySelector(':scope > .review-container');

myReviewContainerElements.addEventListener('click', function (e) {
    e.preventDefault();
    const reviewContainerEl = e.target.closest('li.item');
    if (reviewContainerEl) {
        const item = e.target.closest('li.item');
        const reviewIndex = item.querySelector('.head').querySelector('.left').querySelector('.index').dataset.index;
        const pnu = item.querySelector('.pnu').innerText.trim();
        const xhr1 = new XMLHttpRequest();
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr1.status < 200 || xhr1.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                return;
            }
            const allInfo = JSON.parse(xhr1.responseText);
            const xhr2 = new XMLHttpRequest();
            xhr2.onreadystatechange = function () {
                if (xhr2.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr2.status < 200 || xhr2.status >= 300) {
                    MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                    return;
                }
                const reviewIndexes = JSON.parse(xhr2.responseText);
                const indexPosition = reviewIndexes.indexOf(parseInt(reviewIndex));
                const pageNumber = Math.floor(indexPosition / 3) + 1;
                showDetailAside(allInfo, reviewIndex, pageNumber, () => {
                    showMyPageAside();
                });
                map.instance.setCenter(new kakao.maps.LatLng(allInfo['latitude'], allInfo['longitude']));
                map.instance.setLevel(2);
            }
            xhr2.open(`GET`, `/landReview/reviewIndexes?pnu=${pnu}`);
            xhr2.send();
        };
        xhr1.open('GET', `/land/info?pnu=${pnu}`);
        xhr1.send();
    }
});

function scrollToReview(reviewIndex) {
    if (!reviewIndex) {
        return;
    }
    const reviewContainer = detailAside.querySelector('.review-container');
    const scrollReview = reviewContainer.querySelector(`[data-index="${reviewIndex}"]`);
    if (!scrollReview) {
        return;
    }
    scrollReview.parentElement.parentElement.parentElement.classList.add('highlight');
    scrollReview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        scrollReview.parentElement.parentElement.parentElement.classList.remove('highlight');
    }, 800);
}

backButton.onclick = e => {
    e.preventDefault();
    myPageAside.hide();
    detailAside.hide();
    showListAside();
}

// 회원탈퇴
withdrawalButton.onclick = e => {
    e.preventDefault();
    withdrawalForm.show();
};

// 회원정보수정
editProfileButton.onclick = e => {
    e.preventDefault();
    editDialog.show();
}

// 정보창
const showMyInfoContainer = () => {
    myInfoContainer.show();
    myPageAsideTopButton.show();
    myPageButtonContainer.show();
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
        const myNickname = myInfoContainer.querySelector('[rel="nickname"]');
        const myGrade = myInfoContainer.querySelector('[rel="grade"]');
        const myProfileImage = myInfoContainer.querySelector('[rel="profileImage"]');
        myProfileImage.src = `./user/profile?index=${responseObject['profileImageIndex']}`
        // 썸네일 저장해야됨
        myNickname.innerText = responseObject['nickname'];
        let userGrade = '';
        if (responseObject['admin'] === true) {
            userGrade = '관리자'
        } else {
            userGrade = '일반유저'
        }
        myGrade.innerText = userGrade;
    }
    xhr.open(`GET`, `/user/getInfo`);
    xhr.send();
}

// 저장한 토지 창
const showMyLand = (landArray) => {
    myLandContainer.show();

    const landContainer = myLandContainer.querySelector(':scope > .lands');
    landContainer.innerHTML = '';
    if (landArray.length === 0) {
        landContainer.innerHTML = '<li class="empty">저장한 토지가 없습니다.<br><br>관심있는 토지를 저장해 주세요.</li>'
        return;
    }
    for (const landObject of landArray) {
        let landRoadAddressName = '';
        if (landObject['landRoadAddressName'] === "") {
            landRoadAddressName = '-'
        } else {
            landRoadAddressName = landObject['landRoadAddressName']
        }
        let landBuildingName = '';
        if (landObject['landBuildingName'] === null) {
            landBuildingName = '-';
        } else if(!landObject['landBuildingName']) {
            landBuildingName = "-";
        } else {
            landBuildingName = landObject['landBuildingName']
        }
        const landEl = new DOMParser().parseFromString(`
            <li class="item">
                <div class="my-land-container">
                    <span class="pnu">${landObject['landSavePnu']}</span>
                    <span class="title">${landObject['landAddressName']}</span>
                    <span class="subtitle">${landRoadAddressName}</span>
                    <span class="building">${landBuildingName}</span>
                </div>
            </li>`, 'text/html').querySelector('li.item');
        landContainer.append(landEl)
    }
}

// 저장한 토지 페이지네이션
const myLandPagination = (pageObject) => {
    landPageContainer.show();
    landPageContainer.innerHTML = '';

    const currentPage = pageObject['requestPage'];
    const maxPage = pageObject['maxPage'];

    // 최대 페이지 수를 3으로 제한
    const maxVisiblePages = 3;

    // 페이지네이션 시작 페이지 계산
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(maxPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 앞으로가기 버튼
    const pageForward = document.createElement('button');
    pageForward.classList.add('_obj-button');
    pageForward.classList.add('forward');
    pageForward.innerHTML = '<i class="icon fa-solid fa-chevron-left"></i>';
    pageForward.addEventListener('click', () => {
        if (currentPage > 1) {
            loadMyLand(currentPage - 1);
        }
    });
    landPageContainer.append(pageForward);

    // 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.classList.add('page');
        pageLink.textContent = i;
        pageLink.href = `./user/land?page=${i}`;
        if (i === currentPage) {
            pageLink.classList.add('selected');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentPageLink = landPageContainer.querySelector('.page.selected');
            if (currentPageLink) {
                currentPageLink.classList.remove('selected');
            }
            pageLink.classList.add('selected');
            loadMyLand(i);
        });
        landPageContainer.append(pageLink);
    }

    // 뒤로가기 버튼
    const pageBackward = document.createElement('button');
    pageBackward.classList.add('_obj-button');
    pageBackward.classList.add('backward');
    pageBackward.innerHTML = '<i class="icon fa-solid fa-chevron-right"></i>';
    pageBackward.addEventListener('click', () => {
        if (currentPage < maxPage) {
            loadMyLand(currentPage + 1);
        }
    });
    landPageContainer.append(pageBackward);
}

const loadMyLand = (pageNumber) => {
    const xhr = new XMLHttpRequest();
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
        const landArray = responseObject['lands'];
        const pageObject = JSON.parse(responseObject['page']);
        showMyLand(landArray);
        myLandPagination(pageObject);
    }
    xhr.open(`GET`, `/user/land?page=${pageNumber}`);
    xhr.send();
    loading.show();
}


// 리뷰 페이지네이션
const showMyReviewPagination = (pageObject) => {
    myPageReviewPageContainer.show();
    myPageReviewPageContainer.innerHTML = '';

    if (pageObject['totalCount'] === 0) {
        detailReviewContainer.hide();
        return;
    }

    const currentPage = pageObject['requestPage'];
    const maxPage = pageObject['maxPage'];

    // 최대 페이지 수를 3으로 제한
    const maxVisiblePages = 3;

    // 페이지네이션 시작 페이지 계산
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(maxPage, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 앞으로가기 버튼
    const pageForward = document.createElement('button');
    pageForward.classList.add('_obj-button');
    pageForward.classList.add('forward');
    pageForward.innerHTML = '<i class="icon fa-solid fa-chevron-left"></i>';
    pageForward.addEventListener('click', () => {
        if (currentPage > 1) {
            loadMyReview(currentPage - 1);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
    myPageReviewPageContainer.append(pageForward);

    // 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.classList.add('page');
        pageLink.textContent = i;
        pageLink.href = `./landReview/reviews?page=${i}`;
        if (i === currentPage) {
            pageLink.classList.add('selected');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentPageLink = landPageContainer.querySelector('.page.selected');
            if (currentPageLink) {
                currentPageLink.classList.remove('selected');
            }
            pageLink.classList.add('selected');
            loadMyReview(i);
            window.scrollTo(0, document.body.scrollHeight);
        });
        myPageReviewPageContainer.append(pageLink);
    }

    // 뒤로가기 버튼
    const pageBackward = document.createElement('button');
    pageBackward.classList.add('_obj-button');
    pageBackward.classList.add('backward');
    pageBackward.innerHTML = '<i class="icon fa-solid fa-chevron-right"></i>';
    pageBackward.addEventListener('click', () => {
        if (currentPage < maxPage) {
            loadMyReview(currentPage + 1);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
    myPageReviewPageContainer.append(pageBackward);
}

const showMyReviews = (reviewArray) => {
    myReviewContainer.show();
    myReviewContainer.querySelector(':scope > .review-container').innerHTML = '';
    if (reviewArray.length === 0) {
        myReviewContainer.querySelector(':scope > .review-container').innerHTML = '<li class="item empty">아직 작성한 리뷰가 없어요.</li>'
        return;
    }
    for (const reviewObject of reviewArray) {
        // 수정했을때 date내용 수정
        let date = '';
        if (!reviewObject['modifiedAt']) {
            date = dateConverter(reviewObject['createdAt']);
        } else {
            date = dateConverter(reviewObject['modifiedAt']) + '(수정됨)';
        }
        const reviewEl = new DOMParser().parseFromString(`
            <li class="item">
                <span class="head">
                    <span class="left">
                        <span class="index" data-index="${reviewObject['index']}"></span>
                        <span class="nickname">${reviewObject['landAddress']}</span>
                        <span class="pnu" rel="pnu">${reviewObject['landReviewPnu']}</span>
                        <span class="rating">
                            ${'<i class="star fa-solid fa-star"></i>'.repeat(reviewObject['rating'])}
                            ${'<i class="star fa-regular fa-star"></i>'.repeat(5 - reviewObject['rating'])}
                        </span>
                    </span>
                    <span class="right date">${date}</span>
                </span>
                <span class="body">
                    <span class="image-container" rel="imageContainer" data-flickity></span>
                    <span class="content">${reviewObject['content']}</span>
                </span>
                <span class="foot">
                    <a href="#" class="link" rel="myReviewDeleteLink">삭제</a>
                </span>
            </li>`, 'text/html').querySelector('li.item');
        const imageContainerEl = reviewEl.querySelector('[rel="imageContainer"]');
        for (const imageIndex of reviewObject['imageIndexes']) {
            const imageEl = document.createElement('img');
            imageEl.setAttribute('alt', '');
            imageEl.setAttribute('class', 'image');
            imageEl.setAttribute('src', `./landReview/image?index=${imageIndex}`);
            imageContainerEl.append(imageEl);
        }
        const deleteLinkEl = reviewEl.querySelector('[rel="myReviewDeleteLink"]');
        deleteLinkEl.onclick = e => {
            e.preventDefault();
            e.stopPropagation(); // detailAside로 넘어가는거 막음
            if (reviewObject['signed'] !== true) {
                MessageObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
                return;
            }
            if (reviewObject['mine'] !== true) {
                MessageObj.createSimpleOk('경고', '본인이 등록한 리뷰만 삭제할 수 있습니다.').show();
                return;
            }
            new MessageObj({
                title: '삭제',
                content: '정말로 리뷰를 삭제할까요? 삭제한 리뷰는 복구할 수 없습니다.',
                buttons: [
                    {text: '취소', onclick: instance => instance.hide()},
                    {
                        text: '삭제하기', onclick: instance => {
                            instance.hide();
                            const xhr = new XMLHttpRequest();
                            const formData = new FormData();
                            formData.append('index', reviewObject['index']);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState !== XMLHttpRequest.DONE) {
                                    return;
                                }
                                loading.hide();
                                if (xhr.status < 200 || xhr.status >= 300) {
                                    MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요').show();
                                    return;
                                }
                                const responseObject = JSON.parse(xhr.responseText);
                                const [dTitle, dContent, dOnclick] = {
                                    failure: ['경고', '알 수 없는 이유로 리뷰를 등록하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
                                    success: ['알림', '리뷰를 성공적으로 삭제하였습니다.', () => loadMyReview(reviewObject['requestPage'])]
                                }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                                MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                            }
                            xhr.open(`DELETE`, `./landReview/`);
                            xhr.send(formData);
                            loading.show();
                        }
                    }
                ]
            }).show();
        };
        myReviewContainer.querySelector(':scope > .review-container').append(reviewEl);
    }
    applyFlickity();
}

const loadMyReview = (pageNumber) => {
    const xhr = new XMLHttpRequest();
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
        const reviewArray = responseObject['landReviews'];
        const pageObject = JSON.parse(responseObject['reviewPage']);
        showMyReviews(reviewArray);
        showMyReviewPagination(pageObject);
    }
    xhr.open(`GET`, `/landReview/reviews?page=${pageNumber}`);
    xhr.send();
    loading.show();
}

const myPageAsideTopButton = myPageAside.querySelector('[rel="myPageTop"]');

myPageAsideTopButton.addEventListener("click", e => {
    e.preventDefault();
    myPageAside.scrollTo({top: 0, behavior: 'smooth'})
});

const imageForm = myPageAside.querySelector('.image-form');
const profileImage = myPageAside.querySelector('[rel="profileImage"]');
const imageFormCancelButton = imageForm.querySelector('[rel="cancelButton"]');

imageFormCancelButton.onclick = e => {
    e.preventDefault();
    const thumbnailLabel = imageForm.querySelector(':scope > .thumbnail');
    const imageWrapper = thumbnailLabel.querySelector(':scope > .image-wrapper');
    const empty = imageWrapper.querySelector(':scope > .empty');
    const image = imageWrapper.querySelector(':scope > .image');
    imageForm['thumbnail'].value = '';
    empty.style.display = 'flex';
    image.style.display = 'none';
    imageForm.hide();
}

profileImage.addEventListener("click", () => {
    imageForm.show();
});

imageForm['thumbnail'].onchange = () => {
    const thumbnailLabel = imageForm.querySelector(':scope > .thumbnail');
    const imageWrapper = thumbnailLabel.querySelector(':scope > .image-wrapper');
    const empty = imageWrapper.querySelector(':scope > .empty');
    const image = imageWrapper.querySelector(':scope > .image');
    if (imageForm['thumbnail'].files.length === 0) {
        empty.style.display = 'flex';
        image.style.display = 'none';
        return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
        empty.style.display = 'none';
        image.style.display = 'flex';
        image.setAttribute('src', fileReader.result);
    };
    fileReader.readAsDataURL(imageForm['thumbnail'].files[0]);
}

imageForm.thumbnailLabel = new LabelObj(imageForm.querySelector('[rel="thumbnailLabel"]'));

imageForm.onsubmit = (e) => {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('_thumbnail', imageForm['thumbnail'].files[0]);
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
            failure: ['경고', '알 수 없는 이유로 프로필 사진을 변경하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            success: ['알림', '프로필 사진을 성공적으로 변경하였습니다.', () => {
                location.reload();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`PATCH`, `./user/profile`);
    xhr.send(formData);
    loading.show();
}


