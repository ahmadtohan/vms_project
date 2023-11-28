const config = {

 baseUrl: "http://localhost:8088/vms/",


////////userServices//////////

 userAPIs: {

listPage:'visitor/page',
list:'user/list',
view:'user',
create:'user/create',
update:'user/update',
delete:'user/delete',
login:'user/login'
},

 visitorAPIs: {

listPage:'visitor/page',
list:'visitor/list',
view:'visitor',
create:'visitor/create',
update:'visitor/update',
delete:'visitor/delete',
verify:'visitor/verify'
},


}

export default config;
