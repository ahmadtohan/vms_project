const config = {

 baseUrl: "http://localhost:8088/vms/",


////////userServices//////////

 userAPIs: {

list:'user/list',
create:'user/create',
update:'user/update',
delete:'user/delete',
login:'user/login'
},

 visitorAPIs: {

list:'visitor/list',
create:'visitor/create',
update:'visitor/update',
delete:'visitor/delete',
login:'visitor/login'
},


}

export default config;
