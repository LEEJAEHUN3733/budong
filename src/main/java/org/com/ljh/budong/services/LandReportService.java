package org.com.ljh.budong.services;

import org.com.ljh.budong.entities.LandReportEntity;
import org.com.ljh.budong.mappers.LandReportMapper;
import org.com.ljh.budong.results.CommonResult;
import org.com.ljh.budong.results.ReportResult;
import org.com.ljh.budong.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LandReportService {
    private final LandReportMapper landReportMapper;

    @Autowired
    public LandReportService(LandReportMapper landReportMapper) {
        this.landReportMapper = landReportMapper;
    }

    public Result add(LandReportEntity landReport) {
        LandReportEntity dbLandReport = this.landReportMapper.selectLandReport(landReport.getPnu(), landReport.getUserEmail());
        if (dbLandReport != null) {
            return ReportResult.FAILURE_DUPLICATE;
        }
        landReport.setCreatedAt(LocalDateTime.now());
        return this.landReportMapper.insertLandReport(landReport) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
}
