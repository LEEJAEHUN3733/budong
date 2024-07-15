package org.com.ljh.budong.controllers;

import org.com.ljh.budong.entities.CenterEntity;
import org.com.ljh.budong.entities.UserEntity;
import org.com.ljh.budong.results.Result;
import org.com.ljh.budong.services.CenterService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/center")
public class CenterController {
    private final CenterService centerService;

    @Autowired
    public CenterController(CenterService centerService) {
        this.centerService = centerService;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(@SessionAttribute(value = "user", required = false) UserEntity user,
                            CenterEntity centerEntity) {
        if (user == null) {
            centerEntity.setUser("guest");
        } else {
            centerEntity.setUser(user.getEmail());
        }
        JSONObject responseObject = new JSONObject();
        Result result = this.centerService.add(centerEntity);
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }
}
