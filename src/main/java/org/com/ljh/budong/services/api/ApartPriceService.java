package org.com.ljh.budong.services.api;

import lombok.RequiredArgsConstructor;
import org.com.ljh.budong.dtos.api.ApartPriceDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartPriceService {
    @Value("${vworld-api-key-1}")
    private String vworld_api_key_1;
    @Value("${vworld-domain-protocol}")
    private String vworldDomainProtocol;
    @Value("${vworld-domain-name}")
    private String vworldDomainName;

    public List<ApartPriceDto> getApartPrice(String pnu) throws Exception {
        StringBuilder urlBuilder = new StringBuilder("http://api.vworld.kr/ned/wfs/getApartHousingPriceWFS"); /* URL */
        StringBuilder parameter  = new StringBuilder();
        parameter.append("?" + URLEncoder.encode("key","UTF-8") + "=" + vworld_api_key_1); /*key*/
        parameter.append("&" + URLEncoder.encode("domain","UTF-8") + "=" + URLEncoder.encode(String.format("%s://%s/main", vworldDomainProtocol, vworldDomainName), StandardCharsets.UTF_8)); /*domain*/
        parameter.append("&" + URLEncoder.encode("typename","UTF-8") + "=" + URLEncoder.encode("dt_d166", "UTF-8")); /* 질의 대상인 하나 이상의 피처 유형 이름의 리스트, 값은 쉼표로 구분화면 하단의 [레이어 목록] 참고 */
        parameter.append("&" + URLEncoder.encode("pnu","UTF-8") + "=" + URLEncoder.encode(pnu, "UTF-8")); /* 필지고유번호 19자리중 최소 8자리(시도[2]+시군구[3]+읍면동[3])(입력시 bbox값은 무시) */
        parameter.append("&" + URLEncoder.encode("maxFeatures","UTF-8") + "=" + URLEncoder.encode("100", "UTF-8")); /* 요청에 대한 응답으로 WFS가 반환해야하는 피처의 최대 값(최대 허용값 : 1000) */

        URL url = new URL(urlBuilder.toString() + parameter.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        List<ApartPriceDto> ApartPriceList = apartPriceApiParseXml(sb.toString());

        return ApartPriceList;
    }

    private List<ApartPriceDto> apartPriceApiParseXml(String xmlData) throws Exception {
        List<ApartPriceDto> ApartPriceList = new ArrayList<>();

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new InputSource(new StringReader(xmlData)));

        NodeList itemListNodes = document.getElementsByTagName("gml:featureMember");

        for (int i = 0; i < itemListNodes.getLength(); i++) {
            Node itemListNode = itemListNodes.item(i);

            if (itemListNode.getNodeType() == Node.ELEMENT_NODE) {
                Element itemListElement = (Element) itemListNode;

                ApartPriceDto apartPrice;

                String pnu = getElementValue(itemListElement, "sop:pnu");
                String apartPriceStandardYear = getElementValue(itemListElement, "sop:stdr_year");
                String apartPriceStandardMonth = getElementValue(itemListElement, "sop:stdr_mt");
                String averagePrice = getElementValue(itemListElement, "sop:avrg_pblntf_pc");
                String allPrice = getElementValue(itemListElement, "sop:all_pblntf_pc");

                apartPrice = new ApartPriceDto(pnu, apartPriceStandardYear, apartPriceStandardMonth, averagePrice, allPrice);

                ApartPriceList.add(apartPrice);
            }
        }
        return ApartPriceList;
    }

    private String getElementValue(Element element, String tagName) {
        NodeList nodeList = element.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            Node node = nodeList.item(0);
            return node.getTextContent();
        }
        return null;
    }
}
