package com.top.vms.security;

import com.top.vms.annotations.FrontApi;
import com.top.vms.configuration.Setup;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.top.vms.entity.Endpoint;
import com.top.vms.entity.Permission;
import com.top.vms.entity.Role;
import com.top.vms.entity.User;
import com.top.vms.helper.LoggedUserInfo;
import com.top.vms.helper.Utils;
import com.top.vms.repository.EndpointRepository;
import com.top.vms.repository.PermissionRepository;
import io.jsonwebtoken.ExpiredJwtException;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.juli.logging.Log;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.HandlerMapping;

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
        System.out.println("path:" + path);
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


        int accessCode = checkCurrentApiHasPermission(request);
        if (accessCode!=200) {
            response.sendError(accessCode, "Access Denied");
            return;
        }
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return Boolean.TRUE.equals(request.getAttribute("SHOULD_NOT_FILTER"));
    }

    private int checkCurrentApiHasPermission(HttpServletRequest request) {
        int okCode=200;
        String path = request.getServletPath();

        if (Arrays.stream(SecurityConfig.permitMatchers).anyMatch(s -> path.startsWith(s))) {
            logger.info("-------------permitMatchers: ok");
            return okCode;
        }

        LoggedUserInfo loggedUserInfo = Setup.getCurrentUserInfo();
        if (loggedUserInfo == null || loggedUserInfo.getUser() ==null) {
            logger.info("-------------user is null");
            return 401;
        }
        if (loggedUserInfo.getUser().getType().equals(User.Type.ADMIN)) {
            logger.info("-------------admin: ok");
           return okCode;
        }
        String api = null;
        String[] controllerMappings = new String[]{};
        String[] methodMappings = new String[]{};
        for (HandlerMapping handlerMapping : Setup.getApplicationContext().getBeansOfType(HandlerMapping.class).values()) {
            HandlerExecutionChain handlerExecutionChain = null;
            try {
                handlerExecutionChain = handlerMapping.getHandler(request);

                if (handlerExecutionChain != null) {
                    Object handler = handlerExecutionChain.getHandler();
                    if (handler != null && handler instanceof HandlerMethod) {
                        HandlerMethod handlerMethod = (HandlerMethod) handlerExecutionChain.getHandler();
                        if(handlerMethod.getMethod().isAnnotationPresent(FrontApi.class)){
                            return okCode;
                        }
                        methodMappings = handlerMethod.getMethod().getAnnotation(RequestMapping.class).value();
                        logger.info("---------handlerMethod-----{} {}", handlerMethod);
                        if (handlerMethod.getMethod().getDeclaringClass().isAnnotationPresent(RequestMapping.class)) {
                            controllerMappings = handlerMethod.getMethod().getDeclaringClass().getAnnotation(RequestMapping.class).value();
                        } else {

                            for (String methodMap : methodMappings) {
                                String firstSeg = "/" + Arrays.asList(methodMap.split("/")).get(1);
                                logger.info("---------------firstSeg: " + firstSeg);
                                if (path.contains(firstSeg)) {
                                    String controller = path.substring(0, path.indexOf(firstSeg));
                                    controllerMappings = new String[]{controller};
                                    logger.info("-------------controller: " + controller);
                                    break;
                                }
                            }

                        }
                        break;
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }
        logger.info("--------------{} {}", controllerMappings, methodMappings);

        for (String controllerMap : controllerMappings) {
            for (String methodMap : methodMappings) {
                String matchApi = controllerMap + methodMap;
                String match = Utils.replaceBetween(matchApi, "{", "}", true, true, "");
                logger.info("-------------api: " + matchApi + "   ===>   " + match);
                logger.info("-------------endpointApis {}", loggedUserInfo.getEndpointApis());
                if (path.startsWith(match) && loggedUserInfo.getEndpointApis().contains(matchApi)) {
                        return okCode;
                }


            }
        }
        return 403;
    }
}
