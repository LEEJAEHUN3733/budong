const detailAside = document.getElementById('detailAside');
const detailReviewContainer = detailAside.querySelector('.detail-review-container')
const detailReviewPageContainer = detailAside.querySelector('.review-page-container');

const showDetailAside = (allInfo, reviewIndex, reviewPageNumber, onclose) => {
    loadReviews(allInfo['pnu'], reviewPageNumber, () => {
        scrollToReview(reviewIndex);
    });
    // 마커 표시 event
    map.markers ??= [];
    map.markers.forEach(marker => marker.setMap(null));
    map.markers = [];

    detailAside.show();
    detailAside.scrollTop = 0;
    detailAside.reviewForm['pnu'].value = allInfo['pnu'];
    detailAside.querySelectorAll('[rel="closer"]').forEach(closer => closer.onclick = () => {
        detailAside.hide();
        if (typeof onclose === 'function') {
            onclose();
        }
    });
    // 토지정보 입력
    detailAside.querySelector('[rel="addressName"]').innerText = allInfo['addressName'];
    detailAside.querySelector('[rel="roadAddressName"]').innerText = allInfo['roadAddressName'];
    detailAside.querySelector('[rel="save"]').innerText = allInfo['saveCount'];
    detailAside.querySelector('[rel="review"]').innerText = allInfo['reviewCount'];
    let newLandNumber = '';
    if (allInfo['landMainNumber'] === '-' && allInfo['landSubNumber'] === '-') {
        newLandNumber = '-';
    }
    else if (allInfo['landMainNumber'] === '-') {
        newLandNumber = parseInt(allInfo['landSubNumber'], 10).toString();
    }
    else if (allInfo['landSubNumber'] === '-') {
        newLandNumber = parseInt(allInfo['landMainNumber'], 10).toString();
    }
    else if (allInfo['landSubNumber'] === '0000') {
        newLandNumber = parseInt(allInfo['landMainNumber'], 10).toString();
    }
    else {
        newLandNumber = `${parseInt(allInfo['landMainNumber'], 10).toString()}-${parseInt(allInfo['landSubNumber'], 10).toString()}`
    }
    detailAside.querySelector('[rel="landNumber"]').innerText = newLandNumber;
    detailAside.querySelector('[rel="landCategoryName"]').innerText = allInfo['landCategoryName'];
    let newLandArea = '';
    if (allInfo['landArea'] === '-') {
        newLandArea = '-'
    }
    else {
        newLandArea = (parseFloat(allInfo['landArea']) * 0.3025).toFixed(2).toString() + '평';
    }
    detailAside.querySelector('[rel="landArea"]').innerText = newLandArea;
    detailAside.querySelector('[rel="mainPurposeName"]').innerText = allInfo['mainPurposeName'];
    detailAside.querySelector('[rel="landUseSituation"]').innerText = allInfo['landUseSituation'];
    detailAside.querySelector('[rel="terrainHeight"]').innerText = allInfo['terrainHeight'];
    detailAside.querySelector('[rel="terrainShape"]').innerText = allInfo['terrainShape'];
    detailAside.querySelector('[rel="roadSide"]').innerText = allInfo['roadSide'];
    detailAside.querySelector('[rel="subPurposeName"]').innerText = allInfo['subPurposeName'];

    // 건물정보 입력
    detailAside.querySelector('[rel="buildingName"]').innerText = allInfo['buildingName'];
    let newSiteArea = '-';
    if (allInfo['siteArea'] === '-') {
        newSiteArea = '-'
    }
    else {
        newSiteArea = (parseFloat(allInfo['siteArea']) * 0.3025).toFixed(2).toString() + '평';
    }
    detailAside.querySelector('[rel="siteArea"]').innerText = newSiteArea;
    let newBuildingArea = '-';
    if (allInfo['buildingArea'] === '-') {
        newBuildingArea = '-'
    }
    else {
        newBuildingArea = (parseFloat(allInfo['buildingArea']) * 0.3025).toFixed(2).toString() + '평';
    }
    detailAside.querySelector('[rel="buildingArea"]').innerText = newBuildingArea;
    let newTotalFloorArea = '-';
    if (allInfo['totalFloorArea'] === '-') {
        newTotalFloorArea = '-'
    }
    else {
        newTotalFloorArea = (parseFloat(allInfo['totalFloorArea']) * 0.3025).toFixed(2).toString() + '평';
    }
    detailAside.querySelector('[rel="totalFloorArea"]').innerText = newTotalFloorArea;
    let newTotalFloorRatio = '';
    if (allInfo['floorAreaRatio'] === '-') {
        newTotalFloorRatio = '-'
    }
    else {
        newTotalFloorRatio = allInfo['floorAreaRatio'] + '%';
    }
    detailAside.querySelector('[rel="floorAreaRatio"]').innerText = newTotalFloorRatio;
    let newBuildingToLandRatio = '-';
    if (allInfo['buildingToLandRatio'] === '-') {
        newBuildingToLandRatio = '-'
    }
    else {
        newBuildingToLandRatio = allInfo['buildingToLandRatio'] + '%';
    }
    detailAside.querySelector('[rel="buildingToLandRatio"]').innerText = newBuildingToLandRatio;
    detailAside.querySelector('[rel="structureName"]').innerText = allInfo['structureName'];
    detailAside.querySelector('[rel="buildingMainPurposeName"]').innerText = allInfo['buildingMainPurposeName'];
    detailAside.querySelector('[rel="detailPurposeName"]').innerText = allInfo['detailPurposeName'];
    detailAside.querySelector('[rel="buildingPurposeClassification"]').innerText = allInfo['buildingPurposeClassification'];
    let newBuildingHeight = '-';
    if (allInfo['buildingHeight'] === '-') {
        newBuildingHeight = '-';
    }
    else {
        newBuildingHeight = allInfo['buildingHeight'] + 'm';
    }
    detailAside.querySelector('[rel="buildingHeight"]').innerText = newBuildingHeight;
    let newFloor = '-';
    if (allInfo['groundFloor'] === '-' && allInfo['undergroundFloor'] === '-') {
        newFloor = '-';
    } else if (allInfo['groundFloor'] === '-') {
        newFloor = `지하 ${allInfo['undergroundFloor']}층`;
    } else if (allInfo['undergroundFloor'] === '-') {
        newFloor = `지상 ${allInfo['groundFloor']}층`;
    } else {
        newFloor = `지상 ${allInfo['groundFloor']}층 / 지하 ${allInfo['undergroundFloor']}층`;
    }
    detailAside.querySelector('[rel="floor"]').innerText = newFloor;
    detailAside.querySelector('[rel="permitDate"]').innerText = allInfo['permitDate'];
    detailAside.querySelector('[rel="useConfirmDate"]').innerText = allInfo['useConfirmDate'];

    // 소유정보 입력
    detailAside.querySelector('[rel="possession"]').innerText = allInfo['possession'];
    let newOwnershipChangeDate = '';
    if (allInfo['ownershipChangeDate'] === '-') {
        newOwnershipChangeDate = '-';
    }
    else {
        newOwnershipChangeDate = allInfo['ownershipChangeDate'].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }
    detailAside.querySelector('[rel="ownershipChangeDate"]').innerText = newOwnershipChangeDate;
    let newLandShare = '-';
    if (allInfo['landShare'] === '-') {
        newLandShare = '-';
    } else {
        newLandShare = `${allInfo['landShare']}명`
    }
    detailAside.querySelector('[rel="landShare"]').innerText = newLandShare;

    // 개별공시지가 입력
    let newGovAssessedLandPrice = '-';
    if (allInfo['govAssessedLandPrice'] === '-') {
        newGovAssessedLandPrice = '-';
    } else {
        landPrice = parseFloat(allInfo['govAssessedLandPrice']) / 3.305785

        if (landPrice >= 100000000) {
            const first = Math.floor(landPrice / 100000000);
            const second = Math.floor((landPrice % 100000000) / 10000);
            const remain = Math.floor(landPrice % 10000);
            newGovAssessedLandPrice = `${first}억 ${second}만 ${remain}원/평`
        } else {
            newGovAssessedLandPrice = landPrice.toFixed(0) + '원/평'
        }
    }
    detailAside.querySelector('[rel="govAssessedLandPrice"]').innerText = newGovAssessedLandPrice;
    let newLandPriceStandardDate = '-';
    if (allInfo['landPriceStandardYear'] === '-' && allInfo['landPriceStandardMonth'] === '-') {
        newLandPriceStandardDate = '-';
    }
    else {
        newLandPriceStandardDate = `${allInfo['landPriceStandardYear']}년 ${allInfo['landPriceStandardMonth']}월`
    }
    detailAside.querySelector('[rel="landPriceStandardDate"]').innerText = newLandPriceStandardDate;

    // 개별주택가격 입력
    let newHousePrice = '';
    if (allInfo['housePrice'] === '-') {
        newHousePrice = '-';
    } else {
        housePrice = parseInt(allInfo['housePrice'])

        if (housePrice >= 100000000) {
            const first = Math.floor(housePrice / 100000000);
            const second = Math.floor((housePrice % 100000000) / 10000);
            newHousePrice = `${first}억 ${second}만원`
        } else {
            newHousePrice = housePrice.toFixed(0) + '원'
        }
    }
    detailAside.querySelector('[rel="housePrice"]').innerText = newHousePrice;
    let newHousePriceStandardDate = '';
    if (allInfo['housePriceStandardYear'] === '-' && allInfo['housePriceStandardMonth'] === '-') {
        newHousePriceStandardDate = '-';
    }
    else {
        newHousePriceStandardDate = `${allInfo['housePriceStandardYear']}년 ${allInfo['housePriceStandardMonth']}월`
    }
    detailAside.querySelector('[rel="housePriceStandardDate"]').innerText = newHousePriceStandardDate;

    // 공공주택가격 입력
    let apartPriceInfo = JSON.parse(allInfo['apartPriceInfo']);
    insertNewJSON(apartPriceInfo);

    if (allInfo['saved'] === true) {
        detailAside.querySelector('[rel="saveButton"]').classList.add('-saved');
    } else {
        detailAside.querySelector('[rel="saveButton"]').classList.remove('-saved');
    }

    if (allInfo['savedAlarm'] === true) {
        detailAside.querySelector('[rel="alarmButton"]').classList.add('-saved');
    } else {
        detailAside.querySelector('[rel="alarmButton"]').classList.remove('-saved');
    }

    // 저장버튼
    detailAside.querySelector('[rel="saveButton"]').onclick = () => {
        if (allInfo['signed'] !== true) {
            MessageObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
            return;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('pnu', allInfo['pnu']);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                return;
            }
            const responseObject = JSON.parse(xhr.responseText);
            if (responseObject.result === 'success') {
                if (responseObject['saved'] === true) {
                    detailAside.querySelector('[rel="saveButton"]').classList.add('-saved');
                } else {
                    detailAside.querySelector('[rel="saveButton"]').classList.remove('-saved');
                }
                return;
            }
            const [dTitle, dContent, dOnclick] = {
                failure: ['경고', '알 수 없는 이유로 토지를 저장하지 못하였습니다. 잠시 후 다시 시도해 주세요'],
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }
        xhr.open(`POST`, `/landSave/`);
        xhr.send(formData);
    };

    // 알림버튼(수정 필요)
    detailAside.querySelector('[rel="alarmButton"]').onclick = () => {
        if (allInfo['signed'] !== true) {
            MessageObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
            return;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('pnu', allInfo['pnu']);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                return;
            }
            const responseObject = JSON.parse(xhr.responseText);
            if (responseObject.result === 'success') {
                if (responseObject['savedAlarm'] === true) {
                    detailAside.querySelector('[rel="alarmButton"]').classList.add('-saved');
                } else {
                    detailAside.querySelector('[rel="alarmButton"]').classList.remove('-saved');
                }
                return;
            }
            const [dTitle, dContent, dOnclick] = {
                failure: ['경고', '알 수 없는 이유로 알림설정에 실패하였습니다. 잠시 후 다시 시도해 주세요'],
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }
        xhr.open(`POST`, `/landAlarm/`);
        xhr.send(formData);
    };

    // 신고버튼
    detailAside.querySelector('[rel="reportButton"]').onclick = () => {
        if (allInfo['signed'] !== true) {
            MessageObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
            return;
        }
        new MessageObj({
            title : '신고',
            content : '정말로 해당 대지을 신고할까요? 검토 후 필요에 따라 적절한 조치가 이루어지며 별도로 결과가 통보되지 않습니다.',
            buttons : [
                {text : '취소', onclick : (instance) => instance.hide()},
                {
                    text : '신고하기', onclick: instance => {
                        instance.hide();
                        const xhr = new XMLHttpRequest();
                        const formData = new FormData();
                        formData.append('pnu', allInfo['pnu']);
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
                                failure: ['경고', '알 수 없는 이유로 대지를 신고하지 못하였습니다. 잠시 후 다시 시도해 주세요'],
                                failure_duplicate: ['경고', '이미 신고한 이력이 있는 대지입니다.'],
                                success: ['알림', '대지를 성공적으로 신고하였습니다. 검토 후 필요에 따라 적절한 조치가 이루어지며 별도로 결과가 통보되지 않습니다.'],
                            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                        }
                        xhr.open(`POST`, `/landReport/`);
                        xhr.send(formData);
                        loading.show();
                    }
                }
            ]
        }).show();
    };

    // 공유버튼
    detailAside.querySelector('[rel="shareButton"]').onclick = () => {
        const currentUrl = window.location.href;

        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                MessageObj.createSimpleOk('알림', '현재 페이지의 주소가 클립보드에 복사되었습니다.').show();
            })
            .catch(() => {
                MessageObj.createSimpleOk('경고', '클립보드에 접근하는 중 오류가 발생했습니다.').show();
            })
    };
    // 마커 표시
    const marker = new kakao.maps.Marker({
        map: map.instance,
        position: new kakao.maps.LatLng(allInfo['latitude'], allInfo['longitude'])
    });
    map.markers.push(marker);
}

detailAside.reviewImages = [];
detailAside.reviewForm = detailAside.querySelector(':scope > .review-form');
detailAside.reviewForm.contentLabel = new LabelObj(detailAside.reviewForm.querySelector('[rel="contentLabel"]'));

detailAside.reviewForm['clearButton'].onclick = () => {
    detailAside.reviewForm['images'].value = '';
    detailAside.reviewImages = [];
    const imageContainerEl = detailAside.reviewForm.querySelector(':scope > .attachment > .image-container');
    imageContainerEl.querySelector(':scope > .empty').style.display = 'flex';
    imageContainerEl.querySelectorAll(':scope > .image-wrapper').forEach(x => x.remove());
};

detailAside.reviewForm['deleteButton'].onclick = () => {
    const imageContainerEl = detailAside.reviewForm.querySelector(':scope > .attachment > .image-container');
    const imageWrapperElArray = Array.from(imageContainerEl.querySelectorAll(':scope > .image-wrapper'));
    if (imageWrapperElArray.length === 0) {
        MessageObj.createSimpleOk('경고', '삭제할 이미지가 없습니다').show();
        return;
    }
    if (imageWrapperElArray.every(x => !x.querySelector(':scope > [type="checkbox"]').checked)) {
        MessageObj.createSimpleOk('경고', '삭제할 이미지를 한 개 이상 선택해 주세요.').show();
        return;
    }
    for (let i = imageWrapperElArray.length-1; i >= 0; i--) {
        if (imageWrapperElArray[i].querySelector(':scope > [type="checkbox"]').checked) {
            imageWrapperElArray[i].remove();
            detailAside.reviewImages.splice(i, 1);
        }
    }
    if (detailAside.reviewImages.length === 0) {
        imageContainerEl.querySelector(':scope > .empty').style.display = 'flex';
    }
    detailAside.reviewForm['images'].value = '';
};

detailAside.reviewForm['addButton'].onclick = () => {
    detailAside.reviewForm['images'].click();
};

detailAside.reviewForm['images'].onchange = () => {
    if (detailAside.reviewForm['images'].files.length === 0) {
        return;
    }
    const imageContainerEl = detailAside.reviewForm.querySelector(':scope > .attachment > .image-container');
    imageContainerEl.querySelector(':scope > .empty').style.display = 'none';
    for (const file of detailAside.reviewForm['images'].files) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const imageWrapperEl = new DOMParser().parseFromString(`
            <label class="image-wrapper">
                <input type="checkbox">
                <img alt="" class="image" src="">
            </label>
            `, 'text/html').querySelector('.image-wrapper');
            imageWrapperEl.querySelector('.image').src = fileReader.result;
            imageContainerEl.append(imageWrapperEl);
            detailAside.reviewImages.push(file);
        };
        fileReader.readAsDataURL(file);
    }
};

detailAside.reviewForm.onsubmit = e => {
    e.preventDefault();
    detailAside.reviewForm.contentLabel.setValid(detailAside.reviewForm['content'].tests());
    if (!detailAside.reviewForm.contentLabel.isValid()) {
        detailAside.reviewForm['content'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('landReviewPnu', detailAside.reviewForm['pnu'].value);
    formData.append('rating', detailAside.reviewForm['rating'].value);
    formData.append('content', detailAside.reviewForm['content'].value);
    for (const image of detailAside.reviewImages) {
        formData.append('_images', image);
    }
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
            success: ['알림', '리뷰를 등록해주셔서 감사합니다.', () => {
                detailAside.reviewForm['rating'].value = '5';
                detailAside.reviewForm['content'].value = '';
                detailAside.reviewForm['clearButton'].click();
                loadReviews(detailAside.reviewForm['pnu'].value, 1);
            }],
            failure: ['경고', '알 수 없는 이유로 리뷰를 등록하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`POST`, `./landReview/`);
    xhr.send(formData);
    loading.show();
};

// 리뷰 수정
detailAside.reviewModifyImages = [];

detailAside.reviewModifyForm = detailAside.querySelector(':scope > .review-modify-form');
detailAside.reviewModifyForm.contentLabel = new LabelObj(detailAside.reviewModifyForm.querySelector('[rel="contentLabel"]'));

detailAside.reviewModifyForm['clearButton'].onclick = () => {
    detailAside.reviewModifyForm['images'].value = '';
    detailAside.reviewModifyImages = [];
    const imageContainerEl = detailAside.reviewModifyForm.querySelector(':scope > .attachment > .image-container');
    imageContainerEl.querySelector(':scope > .empty').style.display = 'flex';
    imageContainerEl.querySelectorAll(':scope > .image-wrapper').forEach(x => x.remove());
};

detailAside.reviewModifyForm['deleteButton'].onclick = () => {
    const imageContainerEl = detailAside.reviewModifyForm.querySelector(':scope > .attachment > .image-container');
    const imageWrapperElArray = Array.from(imageContainerEl.querySelectorAll(':scope > .image-wrapper'));
    if (imageWrapperElArray.length === 0) {
        MessageObj.createSimpleOk('경고', '삭제할 이미지가 없습니다').show();
        return;
    }
    if (imageWrapperElArray.every(x => !x.querySelector(':scope > [type="checkbox"]').checked)) {
        MessageObj.createSimpleOk('경고', '삭제할 이미지를 한 개 이상 선택해 주세요.').show();
        return;
    }
    for (let i = imageWrapperElArray.length-1; i >= 0; i--) {
        if (imageWrapperElArray[i].querySelector(':scope > [type="checkbox"]').checked) {
            imageWrapperElArray[i].remove();
            detailAside.reviewModifyImages.splice(i, 1);
        }
    }
    if (detailAside.reviewModifyImages.length === 0) {
        imageContainerEl.querySelector(':scope > .empty').style.display = 'flex';
    }
    detailAside.reviewModifyForm['images'].value = '';
};

detailAside.reviewModifyForm['addButton'].onclick = () => {
    detailAside.reviewModifyForm['images'].click();
};

detailAside.reviewModifyForm['images'].onchange = () => {
    if (detailAside.reviewModifyForm['images'].files.length === 0) {
        return;
    }
    const imageContainerEl = detailAside.reviewModifyForm.querySelector(':scope > .attachment > .image-container');
    imageContainerEl.querySelector(':scope > .empty').style.display = 'none';
    for (const file of detailAside.reviewModifyForm['images'].files) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const imageWrapperEl = new DOMParser().parseFromString(`
            <label class="image-wrapper">
                <input type="checkbox">
                <img alt="" class="image" src="">
            </label>    
            `, 'text/html').querySelector('.image-wrapper');
            imageWrapperEl.querySelector('.image').src = fileReader.result;
            imageContainerEl.append(imageWrapperEl);
            detailAside.reviewModifyImages.push(file);
        };
        fileReader.readAsDataURL(file);
    }
};

// 리뷰 수정
detailAside.reviewModifyForm.onsubmit = e => {
    e.preventDefault();
    detailAside.reviewModifyForm.contentLabel.setValid(detailAside.reviewModifyForm['content'].tests());
    if (!detailAside.reviewModifyForm.contentLabel.isValid()) {
        detailAside.reviewModifyForm['content'].focus();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('index', detailAside.reviewModifyForm['index'].value);
    formData.append('landReviewPnu', detailAside.reviewModifyForm['pnu'].value);
    formData.append('rating', detailAside.reviewModifyForm['rating'].value);
    formData.append('content', detailAside.reviewModifyForm['content'].value);
    // 수정할 때 새로운 사진을 추가하는 경우
    if (detailAside.reviewModifyImages) {
        let remainReviewImageIndexes = detailAside.reviewModifyImages.filter(index => typeof index === 'number');
        remainReviewImageIndexes.forEach(index => {
            formData.append('remainReviewImageIndexes', index);
        })
    } else if (detailAside.reviewModifyImages.length === 0) {
        formData.append('remainReviewImageIndexes', '');
    }
    // 이미지 삽입
    for (const image of detailAside.reviewModifyImages) {
        formData.append('_images', image);
    }
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
            success: ['알림', '리뷰를 수정하는데 성공하였습니다.', () => {
                detailAside.reviewModifyForm['rating'].value = '5';
                detailAside.reviewModifyForm['content'].value = '';
                detailAside.reviewModifyForm['clearButton'].click();
                loadReviews(detailAside.reviewModifyForm['pnu'].value, 1,() => {scrollToReview(detailAside.reviewModifyForm['index'].value);
                                detailAside.reviewModifyForm.hide()});
            }],
            failure: ['경고', '알 수 없는 이유로 리뷰를 수정하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open(`PATCH`, `./landReview/`);
    xhr.send(formData);
    loading.show();
};

// 리뷰 페이지네이션
const showReviewPagination = (pnu, pageObject) => {
    detailReviewPageContainer.show();
    detailReviewPageContainer.innerHTML = '';

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
            loadReviews(pnu ,currentPage - 1);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
    detailReviewPageContainer.append(pageForward);

    // 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.classList.add('page');
        pageLink.textContent = i;
        pageLink.href = `./landReview/reviews?page=${i}&pnu=${pnu}`;
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
            loadReviews(pnu, i);
            window.scrollTo(0, document.body.scrollHeight);
        });
        detailReviewPageContainer.append(pageLink);
    }

    // 뒤로가기 버튼
    const pageBackward = document.createElement('button');
    pageBackward.classList.add('_obj-button');
    pageBackward.classList.add('backward');
    pageBackward.innerHTML = '<i class="icon fa-solid fa-chevron-right"></i>';
    pageBackward.addEventListener('click', () => {
        if (currentPage < maxPage) {
            loadReviews(pnu ,currentPage + 1);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
    detailReviewPageContainer.append(pageBackward);
}

const showDetailReviews = (pnu, reviewArray) => {
    detailReviewContainer.show();
    detailReviewContainer.querySelector(':scope > .review-container').innerHTML = '';
    if (reviewArray.length === 0) {
        detailReviewContainer.querySelector(':scope > .review-container').innerHTML = '<li class="item empty">아직 작성한 리뷰가 없어요.</li>'
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
                            <span class="nickname">${reviewObject['userNickname']}</span>
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
                        <a href="#" class="link" rel="deleteLink">삭제</a>
                        <a href="#" class="link" rel="reportLink">신고</a>
                        <a href="#" class="link" rel="modifyLink">수정</a>
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
        const deleteLinkEl = reviewEl.querySelector('[rel="deleteLink"]');
        const reportLinkEl = reviewEl.querySelector('[rel="reportLink"]');
        const modifyLinkEl = reviewEl.querySelector('[rel="modifyLink"]');
        deleteLinkEl.onclick = e => {
            e.preventDefault();
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
                                    success: ['알림', '리뷰를 성공적으로 삭제하였습니다.', () => loadReviews(pnu, reviewObject['requestPage'])]
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
        reportLinkEl.onclick = e => {
            e.preventDefault();
            if (reviewObject['signed'] !== true) {
                MessageObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
                return;
            }
            if (reviewObject['mine'] !== false) {
                MessageObj.createSimpleOk('경고', '본인이 등록한 리뷰는 신고할 수 없습니다.').show();
                return;
            }
            new MessageObj({
                title: '신고',
                content: '정말로 리뷰를 신고할까요? 검토 후 필요에 따라 적절한 조치가 이루어지며 별도로 결과가 통보되지 않습니다',
                buttons: [
                    {text: '취소', onclick: instance => instance.hide()},
                    {
                        text: '신고하기', onclick: instance => {
                            instance.hide();
                            const xhr = new XMLHttpRequest();
                            const formData = new FormData();
                            formData.append('index', reviewObject['index']);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState !== XMLHttpRequest.DONE) {
                                    return;
                                }
                                if (xhr.status < 200 || xhr.status >= 300) {
                                    MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요').show();
                                    return;
                                }
                                const responseObject = JSON.parse(xhr.responseText);
                                const [dTitle, dContent, dOnclick] = {
                                    failure: ['경고', '알 수 없는 이유로 리뷰를 신고하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
                                    failure_duplicate: ['경고', '이미 신고한 이력이 있는 리뷰입니다.'],
                                    success: ['알림', '리뷰를 성공적으로 신고하였습니다. 검토 후 필요에 따라 적절한 조치가 이루어지며 별도로 결과가 통보되지 않습니다']
                                }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                                MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                            }
                            xhr.open(`POST`, `./landReview/report`);
                            xhr.send(formData);
                        }
                    }
                ]
            }).show();
        };
        modifyLinkEl.onclick = e => {
            e.preventDefault();
            if (reviewObject['signed'] !== true) {
                MessageObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
                return;
            }
            if (reviewObject['mine'] !== true) {
                MessageObj.createSimpleOk('경고', '본인이 등록한 리뷰만 수정할 수 있습니다.').show();
                return;
            }
            detailAside.reviewModifyForm.show();
            detailAside.reviewModifyForm.querySelector('[rel="index"]').value = '';
            detailAside.reviewModifyForm.querySelector('[rel="content"]').value = '';
            detailAside.reviewModifyForm.querySelector('[rel="rating"]').value = '5';
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status < 200 || xhr.status >= 300) {
                    MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요').show();
                    return;
                }
                const responseObject = JSON.parse(xhr.responseText);
                // 한번 더 눌렀다면 이전 정보 초기화
                detailAside.reviewModifyForm.querySelector('[rel="index"]').value = responseObject['index'];
                detailAside.reviewModifyForm.querySelector('[rel="pnu"]').value = responseObject['landReviewPnu'];
                detailAside.reviewModifyForm.querySelector('[rel="content"]').value = responseObject['content'];
                detailAside.reviewModifyForm.querySelector('[rel="rating"]').value = responseObject['rating'];
                detailAside.reviewModifyForm['clearButton'].click();
                const imageContainerEl = detailAside.reviewModifyForm.querySelector('[rel="imageContainer"]');
                imageContainerEl.querySelectorAll(':scope > .image-wrapper').forEach(x => x.remove());
                imageContainerEl.querySelector(':scope > .empty').style.display = 'none';
                for (const imageIndex of reviewObject['imageIndexes']) {
                    const imageWrapperEl = document.createElement('label');
                    imageWrapperEl.setAttribute('class', 'image-wrapper');
                    const checkboxInputEl = document.createElement('input');
                    checkboxInputEl.setAttribute('type', 'checkbox');
                    const imageEl = document.createElement('img');
                    imageEl.setAttribute('alt', '');
                    imageEl.setAttribute('class', 'image');
                    imageEl.setAttribute('src', `./landReview/image?index=${imageIndex}`);
                    imageWrapperEl.appendChild(checkboxInputEl);
                    imageWrapperEl.appendChild(imageEl);
                    imageContainerEl.appendChild(imageWrapperEl);
                    detailAside.reviewModifyImages.push(imageIndex);
                }
                if (detailAside.reviewModifyImages.length === 0) {
                    detailAside.reviewModifyForm.querySelector('.empty').style.display = 'flex';
                }
                detailAside.reviewModifyForm.querySelector('[rel="cancelButton"]').onclick = e => {
                    e.preventDefault();
                    detailAside.reviewModifyForm.querySelector('[rel="index"]').value = '';
                    detailAside.reviewModifyForm.querySelector('[rel="content"]').value = '';
                    detailAside.reviewModifyForm.querySelector('[rel="rating"]').value = '5';
                    detailAside.reviewModifyForm.querySelector('[rel="pnu"]').value = '';
                    const imageContainerEl = detailAside.reviewModifyForm.querySelector('[rel="imageContainer"]');
                    imageContainerEl.querySelectorAll(':scope > .image-wrapper').forEach(x => x.remove());
                    detailAside.reviewModifyImages = [];
                    detailAside.reviewModifyForm.hide();
                }
            }
            xhr.open(`GET`, `/landReview/review?index=${reviewObject['index']}`);
            xhr.send();
        };
        detailReviewContainer.querySelector(':scope > .review-container').append(reviewEl)
    }
    applyFlickity();
}

const loadReviews = (pnu, pageNumber, callback) => {
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
        showDetailReviews(pnu, reviewArray);
        showReviewPagination(pnu, pageObject);
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
    xhr.open(`GET`, `/landReview/reviews?page=${pageNumber}&pnu=${pnu}`);
    xhr.send();
    loading.show();
}

function deleteContainer() {
    let specContainerApart = document.querySelector('.spec-container.apart');
    specContainerApart.innerHTML = '';
}

function insertNewJSON(newData) {
    deleteContainer();

    if (Array.isArray(newData) && newData.length > 0) {
        let specContainerApart = document.querySelector('.spec-container.apart');
        newData.forEach(priceInfo => {
            let detailEstateInfo1 = document.createElement('div');
            detailEstateInfo1.classList.add('detail', 'estate-info');

            let subtitle1 = document.createElement('span');
            subtitle1.classList.add('subtitle');
            subtitle1.innerText = '평균공시가격';
            detailEstateInfo1.appendChild(subtitle1);

            let spring1 = document.createElement('span');
            spring1.classList.add('spring');
            detailEstateInfo1.appendChild(spring1);

            let newAveragePrice = '';
            if (priceInfo['averagePrice'] === '-') {
                newAveragePrice = '-';
            } else {
                averagePrice = parseInt(priceInfo['averagePrice'])

                if (averagePrice >= 100000000) {
                    const first = Math.floor(averagePrice / 100000000);
                    const second = Math.floor((averagePrice % 100000000) / 10000);
                    newAveragePrice = `${first}억 ${second}만원`
                } else {
                    newAveragePrice = averagePrice.toFixed(0) + '원'
                }
            }
            let content1 = document.createElement('span');
            content1.classList.add('content');
            content1.innerText = newAveragePrice;
            detailEstateInfo1.appendChild(content1);

            specContainerApart.appendChild(detailEstateInfo1);

            let detailEstateInfo2 = document.createElement('div');
            detailEstateInfo2.classList.add('detail', 'estate-info');

            let subtitle2 = document.createElement('span');
            subtitle2.classList.add('subtitle');
            subtitle2.innerText = '전체공시가격';
            detailEstateInfo2.appendChild(subtitle2);

            let spring2 = document.createElement('span');
            spring2.classList.add('spring');
            detailEstateInfo2.appendChild(spring2);

            let newAllPrice = '';
            if (priceInfo['allPrice'] === '-') {
                newAllPrice = '-';
            } else {
                allPrice = parseInt(priceInfo['allPrice']);

                if (allPrice >= 100000000) {
                    const first = Math.floor(allPrice / 100000000);
                    const second = Math.floor((allPrice % 100000000) / 10000);
                    newAllPrice = `${first}억 ${second}만원`
                } else {
                    newAllPrice = allPrice + '원'
                }
            }
            let content2 = document.createElement('span');
            content2.classList.add('content');
            content2.innerText = newAllPrice;
            detailEstateInfo2.appendChild(content2);

            specContainerApart.appendChild(detailEstateInfo2);

            let detailEstateInfo3 = document.createElement('div');
            detailEstateInfo3.classList.add('detail', 'estate-info');

            let subtitle3 = document.createElement('span');
            subtitle3.classList.add('subtitle');
            subtitle3.innerText = '기준일자';
            detailEstateInfo3.appendChild(subtitle3);

            let spring3 = document.createElement('span');
            spring3.classList.add('spring');
            detailEstateInfo3.appendChild(spring3);

            let content3 = document.createElement('span');
            content3.classList.add('content');
            content3.innerText = `${priceInfo['apartPriceStandardYear']}-${priceInfo['apartPriceStandardMonth']}`
            detailEstateInfo3.appendChild(content3);

            specContainerApart.appendChild(detailEstateInfo3);
        });
    } else {
        let specContainerApart = document.querySelector('.spec-container.apart');
        let empty = document.createElement('div');
        empty.classList.add('empty');
        empty.innerText = '공공주택 가격 정보가 없습니다.';
        specContainerApart.appendChild(empty);
    }
}

function dateConverter(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// 맨 위로 버튼
const detailAsideTopButton = detailAside.querySelector('[rel="detailAsideTop"]');

detailAsideTopButton.addEventListener("click", e => {
    e.preventDefault();
    detailAside.scrollTo({top: 0, behavior: 'smooth'})
});