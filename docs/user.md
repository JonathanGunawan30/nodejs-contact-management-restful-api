# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "jonathan",
    "password" : "rahasia",
    "name" : "Jonathan Gunawan"
}
```

Response Body Success :

```json 
{
    "data" : {
        "username" : "jonathan",
        "name" : "Jonathan Gunawan"
    }
}
```

Response Body Error :

```json 
{
    "errors" : "username already registered"
    
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "jonathan",
    "password" : "rahasia" 
}
```

Response Body Success : 
```json
{
    "data" : {
        "token" : "unique-token"
    }
}
```

Response Body Error : 

```json
{
    "errors" : "username or password is wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers : 
- Authorization : token

Request Body : 

```json
{
   "name" : "Jonathan Gunawan Updated", //optional
    "password" : "new password" //optional
}
```

Response Body Success :

```json
{
   "data" : {
    "username" : "jonathan",
    "name" : "Jonathan Gunawan Updated"
   }
}
```

Response Body Error : 

```json
{
   "errors" : "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers : 
- Authorization : token

Response Body Success : 

```json
{
   "data" : {
    "username" : "jonathan",
    "name" : "Jonathan Gunawan"
   }
}
```

Response Body Errors : 

```json
{
   "errors" : "Unauthorized"
}
```


## Logout User API

Endpoint : DELETE /api/users/logout

Headers : 
- Authorization : token

Response Body Success : 

```json
{
   "data" : "OK"
}
```

Response Body Error : 

```json
{
   "errors" : "Unauthorized"
}
```