***API Call Documentation***

**User Login (already done)**
```
/user/login
method: post
jsonData: username, password
```

**Get User By UserID**
Theoretically this should be user/id/{id} for consistency, might change later
```
/user/{id}
method: get
```

**Get User By User Name**

```
/user/username/{username}
method: get
```

**Get User By Email**

```
/user/email/{email}
method: get
```

**Register User**

```
/user/register
method: post
json data: username, password, email, status
```

**Update Email (LOW PRIORITY)**
```
/user/{id}/updateEmail/{email}
method: put
```

**Update Status**

```
/user/{id}/updateStatus/{status}
method: put
```

**Update Password (password is spelled wrong in controller)**

```
user/{id}/updatePassword/{password}
method: post
```

**Delete User**

```
user/{id}/delete
method: delete
```

**Get All Users From GroupChat**

```
/message/id/{id}
method: get
Will return an array of users!
```