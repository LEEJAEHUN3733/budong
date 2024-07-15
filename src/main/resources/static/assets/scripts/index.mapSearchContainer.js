const mapSearchButton = document.getElementById('itemContainer');
const addressSearchForm = document.getElementById('addressSearchForm');

mapSearchButton.onclick = () => {
    if (mapSearchButton.querySelector('[rel="closer"]').classList.contains('-visible')) {
        mapSearchButton.querySelector('[rel="closer"]').hide();
        mapSearchButton.querySelector('[rel="opener"]').show();
        addressSearchForm['keyword'].value = '';
        addressSearchForm.hide();
        return;
    }

    mapSearchButton.querySelector('[rel="opener"]').hide();
    mapSearchButton.querySelector('[rel="closer"]').show();
    addressSearchForm.show();
}

// 검색 코드 구현해야됨
addressSearchForm.onsubmit = e => {
    e.preventDefault();
    const keyword = addressSearchForm['keyword'].value;
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
    xhr.open(`GET`, `/search/lands?keyword=${keyword}`);
    xhr.send();
    loading.show();
}