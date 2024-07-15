package org.com.ljh.budong.services.api;

import lombok.RequiredArgsConstructor;
import org.com.ljh.budong.dtos.api.AddressInfoDto;
import org.com.ljh.budong.dtos.api.AllInfoDto;
import org.com.ljh.budong.entities.api.AddressInfoEntity;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressInfoService {
    @Value("${kakao-rest-api-key}")
    private String kakao_rest_api_key;

    public List<JSONObject> getAddresses(String latitude, String longitude) throws Exception {
        List<JSONObject> result = new ArrayList<>();
        String REST_KEY = kakao_rest_api_key;
        String restUrl1 = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=" + longitude + "&y=" + latitude;
        String restUrl2 = "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=" + longitude + "&y=" + latitude;

        // 행정구역번호 추출 할 api 호출
        URL url1 = new URL(restUrl1);
        HttpURLConnection conn1 = (HttpURLConnection) url1.openConnection();
        conn1.setRequestMethod("GET");
        conn1.setRequestProperty("Authorization", "KakaoAK " + REST_KEY);
        BufferedReader rd1;
        if(conn1.getResponseCode() >= 200 && conn1.getResponseCode() <= 300) {
            rd1 = new BufferedReader(new InputStreamReader(conn1.getInputStream()));
        } else {
            rd1 = new BufferedReader(new InputStreamReader(conn1.getErrorStream()));
        }
        StringBuilder sb1 = new StringBuilder();
        String line1;
        while ((line1 = rd1.readLine()) != null) {
            sb1.append(line1);
        }
        rd1.close();
        conn1.disconnect();

        // 산 유무 및 주소 추출 할 api 호출
        URL url2 = new URL(restUrl2);
        HttpURLConnection conn2 = (HttpURLConnection) url2.openConnection();
        conn2.setRequestMethod("GET");
        conn2.setRequestProperty("Authorization", "KakaoAK " + REST_KEY);
        BufferedReader rd2;
        if(conn2.getResponseCode() >= 200 && conn2.getResponseCode() <= 300) {
            rd2 = new BufferedReader(new InputStreamReader(conn2.getInputStream()));
        } else {
            rd2 = new BufferedReader(new InputStreamReader(conn2.getErrorStream()));
        }
        StringBuilder sb2 = new StringBuilder();
        String line2;
        while ((line2 = rd2.readLine()) != null) {
            sb2.append(line2);
        }
        rd2.close();
        conn2.disconnect();

        JSONObject sb1JSON = new JSONObject(sb1.toString());
        JSONObject sb2JSON = new JSONObject(sb2.toString());

        result.add(sb1JSON);
        result.add(sb2JSON);

        return result;
    }
}
