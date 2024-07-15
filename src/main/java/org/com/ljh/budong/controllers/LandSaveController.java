package org.com.ljh.budong.controllers;

import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.Result;
import org.com.ljh.budong.services.LandSaveService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/landSave")
public class LandSaveController {
    private final LandSaveService landSaveService;

    @Autowired
    public LandSaveController(LandSaveService landSaveService) {
        this.landSaveService = landSaveService;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postPnu(@SessionAttribute("user") UserEntity user,
                          @RequestParam("pnu") String pnu) {
        Result result = this.landSaveService.toggle(pnu, user.getEmail());
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            responseObject.put("saved", this.landSaveService.get(pnu, user.getEmail()) != null);
        }
        return responseObject.toString();
    }
}
