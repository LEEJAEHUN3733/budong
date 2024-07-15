const listAside = document.getElementById('listAside');
listAside.empty = listAside.querySelector('.empty');
listAside.item = listAside.querySelector('.item');
listAside.lands = listAside.querySelector('.lands');
const pageContainer = listAside.querySelector('.page-container');

// home화면에서 검색했을때 리다이렉트 후 검색결과 표시
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const by = urlParams.get('by');
    const keyword = urlParams.get('keyword');
    if (!keyword) {
        return;
    }
    if (keyword && by) {
        loadSearchResults(by, keyword, 1);
    }
});

listAside.lands.addEventListener('click', function (e) {
    e.preventDefault();
    const searchEl = e.target.closest('li.item')
    if (searchEl) {
        const searchContainer = e.target.closest('.info-container');
        const pnu = searchContainer.querySelector('.pnu').innerText.trim();
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

const showSearchListAside = (landArray) => {
    detailAside.hide();
    myPageAside.hide();
    listAside.show();
    listAside.scrollTop = 0;

    const landContainer = listAside.querySelector('.lands');
    landContainer.innerHTML = '';
    if (!landArray || landArray.length === 0) {
        landContainer.innerHTML = '<li class="empty">검색결과가 없습니다.<br><br>정확한 검색어를 입력해 주세요.</li>'
        pageContainer.hide();
        return;
    }
    for (const landObject of landArray) {
        let newRoadAddressName = '';
        if (landObject['roadAddressName'] === '') {
            newRoadAddressName = '-';
        } else {
            newRoadAddressName = landObject['roadAddressName'];
        }
        let newBuildingName = '';
        if (!landObject['buildingName']) {
            newBuildingName = '-';
        } else {
            newBuildingName = landObject['buildingName'];
        }
        const landEl = new DOMParser().parseFromString(`
            <li class="item">
            <div class="info-container">
                <span class="pnu">${landObject['pnu']}</span>
                <span class="title">${landObject['addressName']}</span>
                <span class="subtitle">${newRoadAddressName}</span>
                <span class="building">${newBuildingName}</span>
                <ul class="menu">
                    <li class="item view">
                        <i class="icon fa-solid fa-star"></i>
                        <span class="text">${landObject['saveCount']}</span>
                    </li>
                    <li class="item review">
                        <i class="icon fa-solid fa-comments"></i>
                        <span class="text">${landObject['reviewCount']}</span>
                    </li>
                </ul>
            </div>
        </li>`, 'text/html').querySelector('li.item');
        landContainer.append(landEl);
    }
}

// 검색결과 많을 시 알림설정
let exceedAlertShown = false;

const listAsidePagination = (searchObject) => {
    pageContainer.show();
    pageContainer.innerHTML = '';

    if (searchObject['totalCount'] === 0) {
        pageContainer.hide();
        return;
    }

    const currentPage = searchObject['requestPage'];
    const maxPage = searchObject['maxPage'];
    const by = searchObject['by'];
    const keyword = searchObject['keyword'];

    // 검색결과가 많을 시 알림설정
    if (searchObject['isExceed'] === true && !exceedAlertShown) {
        MessageObj.createSimpleOk('알림', '검색결과가 너무 많습니다. 좀 더 정확한 검색어를 입력해 주세요.').show();
        exceedAlertShown = true;
    }

    // 앞으로가기 버튼
    const pageForward = document.createElement('button');
    pageForward.classList.add('_obj-button');
    pageForward.classList.add('forward');
    pageForward.innerHTML = '<i class="icon fa-solid fa-chevron-left"></i>';
    pageForward.addEventListener('click', () => {
        if (currentPage > 1) {
            loadSearchResults(by, keyword, currentPage - 1);
        }
    });
    pageContainer.append(pageForward);

    // 페이지 번호
    for (let i = 1; i <= maxPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.classList.add('page');
        pageLink.textContent = i;
        pageLink.href = `./search/lands?by=${by}&keyword=${keyword}&page=${i}`;
        if (i === currentPage) {
            pageLink.classList.add('selected');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            const currentPageLink = pageContainer.querySelector('.page.selected');
            if (currentPageLink) {
                currentPageLink.classList.remove('selected');
            }
            pageLink.classList.add('selected');
            loadSearchResults(by, keyword, i);
        });
        pageContainer.append(pageLink);
    }

    // 뒤로가기 버튼
    const pageBackward = document.createElement('button');
    pageBackward.classList.add('_obj-button');
    pageBackward.classList.add('backward');
    pageBackward.innerHTML = '<i class="icon fa-solid fa-chevron-right"></i>';
    pageBackward.addEventListener('click', () => {
        if (currentPage < maxPage) {
            loadSearchResults(by, keyword, currentPage + 1);
        }
    });
    pageContainer.append(pageBackward);
}

const loadSearchResults = (by, keyword, page) => {
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
        const landArray = responseObject['address'];
        const searchObject = JSON.parse(responseObject['search']);
        showSearchListAside(landArray);
        listAsidePagination(searchObject);
    }
    xhr.open(`GET`, `/search/lands?by=${by}&keyword=${keyword}&page=${page}`);
    xhr.send();
    loading.show();
}