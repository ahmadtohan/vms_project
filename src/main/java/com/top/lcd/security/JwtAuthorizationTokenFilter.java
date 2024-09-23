package com.top.lcd.security;

import com.top.lcd.annotations.NoPermissionApi;
import com.top.lcd.configuration.Setup;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.top.lcd.entity.User;
import com.top.lcd.helper.LoggedUserInfo;
import io.jsonwebtoken.ExpiredJwtException;

import java.util.Arrays;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import static com.top.lcd.security.SecurityConfig.*;

@Component
public class JwtAuthorizationTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthorizationTokenFilter.class);

    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtil;
    private String api;


    public JwtAuthorizationTokenFilter(UserDetailsService userDetailsService, JwtTokenUtils jwtTokenUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String path = request.getServletPath();
        System.out.println("session: " + request.getSession().getId() + " path:" + path);
        boolean isFront = path.startsWith("/app");
        if (isFront) {
            request.getRequestDispatcher("/").forward(request, response);
            return;
        }

        logger.info("processing authentication for '{}'", request.getRequestURL());
        final String requestHeader = request.getHeader(Setup.TOKEN_HEADER);
        String username = null;
        String authToken = null;
        if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
            authToken = requestHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(authToken);
            } catch (IllegalArgumentException e) {
                logger.error("an error occured during getting username from token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("the token is expired and not valid anymore", e);
            }
        } else {
            logger.info("no token was included with: " + request.getRequestURL());
        }

        logger.info("checking authentication for user '{}'", username);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Get fresh user info from db, You could also store the information only in the token and read it from it.
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // For simple validation it is completely sufficient to just check the token integrity. You don't have to call the database compellingly. 
            if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                logger.info("authorizated user '{}', setting security context", username);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        request.setAttribute("SHOULD_NOT_FILTER", true);


        int accessCode = 0;
        try {
            accessCode = checkCurrentApiHasPermission(request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if (accessCode != 200) {
            response.sendError(accessCode, "Access Denied");
            return;
        }
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return Boolean.TRUE.equals(request.getAttribute("SHOULD_NOT_FILTER"));
    }

    private int checkCurrentApiHasPermission(HttpServletRequest request) throws Exception {
        int okCode = 200;
        String path = request.getServletPath();

        if (Arrays.stream(permitMatchers).anyMatch(s -> path.startsWith(s))) {
            logger.info("-------------permitMatchers: ok");
            return okCode;
        }

        LoggedUserInfo loggedUserInfo = Setup.getCurrentUserInfo();
        if (loggedUserInfo == null || loggedUserInfo.getUser() == null) {
            logger.info("-------------user is null");
            return 401;
        }
        if (loggedUserInfo.getUser().getType().equals(User.Type.ADMIN)) {
            logger.info("-------------admin: ok");
            return okCode;
        }

        HandlerExecutionChain handlerExecutionChain = Setup.getApplicationContext().getBean(HandlerMapping.class).getHandler(request);
        logger.info("-------------handlerExecutionChain {}", handlerExecutionChain);
        HandlerMethod handlerMethod = (HandlerMethod) handlerExecutionChain.getHandler();
        if (handlerMethod.getMethod().isAnnotationPresent(NoPermissionApi.class)) {
            return okCode;
        }
        Map<RequestMappingInfo, HandlerMethod> map = Setup.getApplicationContext().getBean(RequestMappingHandlerMapping.class).getHandlerMethods();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : map.entrySet()) {
            PatternsRequestCondition patternsRequestCondition = entry.getKey().getPatternsCondition().getMatchingCondition(request);
            if (entry.getValue().getMethod().equals(handlerMethod.getMethod()) && patternsRequestCondition != null) {
                logger.info("-------------patternsRequestCondition {}", patternsRequestCondition);
                Set<String> patterns = patternsRequestCondition.getPatterns();

                logger.info("-------------Patterns {}", patterns);
                for (String p : patterns) {
                    if (Setup.getNoPermissionEndpointList().contains(p) || loggedUserInfo.getEndpointApis().contains(p)) {
                        logger.info("-------------permission true: " + p);
                        return okCode;
                    }
                }

            }
        }

        return 403;
    }
}
