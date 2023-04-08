***API Call Documentation***

*User Login (already done)*
```
/user/login
method: post
jsonData: username, password
```

*Get User By UserID*



```
/user/id/{id}
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
/user/updateEmail
method: put
json data: userId, email
```

*Update Status*

```
/user/{id}/updateStatus/{status}
method: put
```

*Update Password (password is spelled wrong in controller)*

```
user/updatePassword
method: post
json data : userId, password
```

*Delete User*

```
user/{id}/delete
method: delete
```

*Get All Users From GroupChat*

```
/groupchats/{groupchat_id}/users
method: get
Will return an array of users!
```

*Get Message By Message ID*

```
/message/{message_id}
method: get
```

*Find By Message Content (LOW PRIORITY, seems incomplete in controller, line 42)*

```
/message/{content} 
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
/message/{message_id}
method: delete
```

*Get All Messages In GroupChat*

<p>(in hindsight, seems better to only get a certain amount of messages at a time)
</p>

```
/message/groupID/{id}
method: get
```
*Get Latest N Messages In GroupChat*
```
/message/groupID/{id}/limit/{limit}
method: get
```
*Get Latest N Messages In GroupChat with Offset*
```
/message/groupID/{id}/limit/{limit}/offset/{offset}
method: get
```
*Get All Messages From User (uh why is it /grouname/{id} ? it should be /user/{id})*

```
/users/{user_id}/messages
method: get
```

*Find GroupChat by GroupChat ID*

```
/groupchat/id/{id}
method: post
```

*Insert Groupchat*

<p>this one is kinda inconsistent with the rest, so maybe subject to change ( dont implement yet? )
</p>

```
/groupchat
method: post
IT HAS TO BE IN THIS EXACT CAMELCASING!
json data : groupName, groupSize, dateCreated
```

*Get GroupChat By Group Name*

```
/groupchat/name/{groupname}
method: get
```
*Get Groupchat by Id*

```
/groupchat/id/{group_id}
method: post
```
*Delete Groupchat*

```
/groupchat/id/{group_id}
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
/groupchat/gcId/{gcId}/userId/{userId}
method: put
```

*Remove User From GroupChat*

```
/groupchat/gcId/{gcId}/userId/{userId}
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