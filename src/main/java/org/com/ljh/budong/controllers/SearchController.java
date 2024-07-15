package org.com.ljh.budong.controllers;

import com.google.gson.Gson;
import org.com.ljh.budong.dtos.AddressDto;
import org.com.ljh.budong.dtos.SearchDto;
import org.com.ljh.budong.services.SearchService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/search")
public class SearchController {
    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @RequestMapping(value = "/lands", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getLands(SearchDto search,
                           @RequestParam(value = "page", required = false, defaultValue = "1") int page) {
        Gson gson = new Gson();
        JSONObject responseObject = new JSONObject();
        if (search.getBy() == null) {
            search.setBy("all");
        }
        if (search.getKeyword() == null) {
            AddressDto addresses = new AddressDto();
            responseObject.put("address", addresses);
            return responseObject.toString();
        }
        search.setRequestPage(page);
        AddressDto[] addresses = this.searchService.getLands(search);
        responseObject.put("address", addresses);

        String searchJson = gson.toJson(search);
        responseObject.put("search", searchJson);
        return responseObject.toString();
    }
}
