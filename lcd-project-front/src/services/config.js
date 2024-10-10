const config = {

    baseUrl: "http://localhost:8088/lcd/",


    ////////userServices//////////

    userAPIs: {

        listPage: 'user/page',
        list: 'user/list',
        getusers: 'user/getusers',
        view: 'user/get',
        create: 'user/create',
        update: 'user/update',
        delete: 'user/delete',
        login: 'user/login',
        logout: 'user/logout'
    },

    roleAPIs: {

        listPage: 'role/page',
        list: 'role/list',
        view: 'role/get',
        create: 'role/create',
        update: 'role/update',
        delete: 'role/delete',
        activeRoles: 'role/activeroles'
    },
  treatmentAPIs: {
        listPage: 'treatment/page',
        list: 'treatment/list',
        view: 'treatment/get',
        create: 'treatment/create',
        update: 'treatment/update',
        delete: 'treatment/delete'
    },
    endpointAPIs: {

        listPage: 'endpoint/page',
        list: 'endpoint/list',
        view: 'endpoint/get',
        create: 'endpoint/create',
        update: 'endpoint/update',
        delete: 'endpoint/delete',
        endpoints: 'endpoint/endpoints'
    },

    permissionAPIs: {

        listPage: 'permission/page',
        list: 'permission/list',
        view: 'permission/get',
        create: 'permission/create',
        update: 'permission/update',
        delete: 'permission/delete',
        permissionlist: 'permission/permissionlist'
    },
    parameterAPIs: {
        listPage: 'parameter/page',
        list: 'parameter/list',
        view: 'parameter/get',
        create: 'parameter/create',
        update: 'parameter/update',
        delete: 'parameter/delete'
    },
    picklistAPIs: {
        listPage: 'picklist/page',
        list: 'picklist/list',
        view: 'picklist/get',
        create: 'picklist/create',
        update: 'picklist/update',
        delete: 'picklist/delete'
    }

}

export default config;
