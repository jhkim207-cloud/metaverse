package com.biz.management.auth.service;

import com.biz.management.auth.dto.LoginRequest;
import com.biz.management.auth.dto.LoginResponse;
import com.biz.management.auth.dto.UserDto;
import com.biz.management.auth.mapper.AuthMapper;
import com.biz.management.common.exception.BizException;
import com.biz.management.menu.dto.MenuDto;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final AuthMapper authMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(AuthMapper authMapper) {
        this.authMapper = authMapper;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public LoginResponse login(LoginRequest request) {
        // 1. 사용자 조회
        UserDto user = authMapper.findByUsername(request.getUsername());
        if (user == null) {
            throw new BizException("AUTH_USER_NOT_FOUND", "사용자를 찾을 수 없습니다.");
        }

        // 2. 계정 활성 상태 확인
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BizException("AUTH_ACCOUNT_DISABLED", "비활성화된 계정입니다.");
        }

        // 3. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            authMapper.incrementFailedLoginCount(user.getId());
            throw new BizException("AUTH_INVALID_PASSWORD", "비밀번호가 올바르지 않습니다.");
        }

        // 4. 로그인 성공 처리
        authMapper.resetFailedLoginCount(user.getId());
        authMapper.updateLastLoginAt(user.getId());

        // 5. 역할 조회
        List<String> roles = authMapper.findRoleCodesByUserId(user.getId());

        // 6. 메뉴 조회 (역할 기반) + 트리 변환
        List<MenuDto> flatMenus = authMapper.findMenusByUserId(user.getId());
        List<MenuDto> menuTree = buildTree(flatMenus);

        // 7. 응답 조립
        LoginResponse response = new LoginResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setDisplayName(user.getDisplayName());
        response.setEmployeeId(user.getEmployeeId());
        response.setEmail(user.getEmail());
        response.setRoles(roles);
        response.setMenus(menuTree);

        return response;
    }

    private List<MenuDto> buildTree(List<MenuDto> flatList) {
        Map<Long, MenuDto> map = new LinkedHashMap<>();
        List<MenuDto> roots = new ArrayList<>();

        for (MenuDto menu : flatList) {
            menu.setChildren(new ArrayList<>());
            map.put(menu.getId(), menu);
        }

        for (MenuDto menu : flatList) {
            if (menu.getParentId() == null) {
                roots.add(menu);
            } else {
                MenuDto parent = map.get(menu.getParentId());
                if (parent != null) {
                    parent.getChildren().add(menu);
                }
            }
        }

        return roots;
    }
}
