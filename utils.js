const {User} = require('./user_db.js')

async function matchCredentials(requestBody) { 
    let user = await User.findOne({
    where: {
        username: requestBody.username
    }    
});
try{
var username = user.username;
}
catch(err){
    return false
}

const _user = await User.findOne({
    where: {
        password: requestBody.password
    }
    
});
try{
var password = _user.password;
}
catch(err){
    return false
}

if (requestBody.username === username             
    && requestBody.password === password) {
        return  true;
    } else { 
        return  false;
    }
}
    
module.exports = matchCredentials
