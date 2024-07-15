package org.com.ljh.budong.controllers;

import org.com.ljh.budong.entities.LandReportEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.results.Result;
import org.com.ljh.budong.services.LandReportService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/landReport")
public class LandReportController {
    private final LandReportService landReportService;

    @Autowired
    public LandReportController(LandReportService landReportService) {
        this.landReportService = landReportService;
    }


    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postPnu(@SessionAttribute("user") UserEntity user,
                          LandReportEntity landReport) {
        landReport.setUserEmail(user.getEmail());
        Result result = this.landReportService.add(landReport);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }
}
