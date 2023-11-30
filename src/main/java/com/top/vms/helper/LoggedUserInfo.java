package com.top.vms.helper;

import com.top.vms.entity.Role;
import com.top.vms.entity.User;

import java.util.List;
import java.util.Set;

public class LoggedUserInfo {

    private User user;

    private Set<String> endpointApis;

    public LoggedUserInfo() {
    }

    public LoggedUserInfo(User user, Set<String> endpointApis) {
        this.user = user;
        this.endpointApis = endpointApis;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<String> getEndpointApis() {
        return endpointApis;
    }

    public void setEndpointApis(Set<String> endpointApis) {
        this.endpointApis = endpointApis;
    }
}
