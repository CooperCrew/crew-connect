***API Call Documentation***

*User Login (already done)*
```
/user/login
method: post
jsonData: username, password
```

*Get User By UserID*
<p>Theoretically this should be user/id/{id} for consistency, might change later</p>
```
/user/{id}
method: get
```

*Get User By User Name*

```
/user/username/{username}
method: get
```

*Get User By Email*

```
/user/email/{email}
method: get
```

*Register User*

```
/user/register
method: post
json data: username, password, email, status
```

*Update Email (LOW PRIORITY)*
```
/user/{id}/updateEmail/{email}
method: put
```

*Update Status*

```
/user/{id}/updateStatus/{status}
method: put
```

*Update Password (password is spelled wrong in controller)*

```
user/{id}/updatePassword/{password}
method: post
```

*Delete User*

```
user/{id}/delete
method: delete
```

*Get All Users From GroupChat*

```
/message/id/{id}
method: get
Will return an array of users!
```

*Get Message By Message ID*

```
/message/{id}
method: get
```

*Find By Message Content (LOW PRIORITY, seems incomplete in controller, line 42)*

```
/message/{message} (it's just /message in controller??)
method: get
```

*Send Message*

```
/message
method: post
json data: groupchat id, user id, time sent, message content
```

*Delete by Message ID*

```
/message/{id}
method: delete
```

*Get All Messages In GroupChat*
<p>(in hindsight, seems better to only get a certain amount of messages at a time)</p>
```
/message/groupID/{id}
method: get
```

*Get All Messages From User (uh why is it /grouname/{id} ? it should be /user/{id})*

```
/message/groupname/{id}
method: get
```

*Find GroupChat by GroupChat ID*

```
/groupchat/id/{id}
method: post
```

*Insert Groupchat*
<p>this one is kinda inconsistent with the rest, so maybe subject to change ( dont implement yet? )</p>
```
/groupchat/newGroupName/{groupname}/size/{size}/date/{date}
method: post
```

*Get GroupChat By Group Name*

```
/groupchat/{groupname}
method: get
```

*Delete Groupchat*

```
/groupchat/{id}
method: delete
```

*Get GroupChat By Groupsize (this is probably useless, don't implement yet)*

```
/groupchat/size/{size}
method: get
```

*Update groupchat size by groupchat ID*

```
/groupchat/id/{id}/size/{size}
method: put
```

*Update group name by group ID*

```
/groupchat/id/{id}/name/{name}
method: put
```

*Get All Users From A GroupChat*

```
/groupchats/id/{id}
method: get
```

*Add a User To A GroupChat*

```
/groupchat/gcId1/{gcId}/userId1/{userId}
method: put
```

*Remove User From GroupChat*

```
/groupchat/gcId2/{gcId}/userId2/{userId}
method: delete
```

***FUNCTIONALITY TO IMPLEMENT***
<ul>
    <li>TO DO....</li>
    <li> </li>
    <li> </li>
    <li> </li>
    <li> </li>
</ul>