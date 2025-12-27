package cipestudio.controller;

import cipestudio.dto.report.ReportRequestDTO;
import cipestudio.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> reportBook(@Valid @RequestBody ReportRequestDTO request) {
        Long userId = Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        reportService.createReport(request, userId);
        return ResponseEntity.ok().build();
    }
}
