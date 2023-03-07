# Crew Connect

Crew Connect is the ultimate communication platform for crews of all kinds. It's so good, you'll want to bring your entire crew onto the platform, even your grandma who still uses a flip phone. With features that allow you to easily communicate and collaborate with your team members, you'll be able to slay the competition and get work done like a boss. 

## How to Run
Using Docker, the server can be run be running `$ docker compose build` and `$ docker compose up` in the main directory. Be sure to change the directory of the database in the `$ docker-compose.yaml` file to where it is located on your computer (we were having issues using `$HOME` for some raeson). Also, make sure that the hostname is set to `db` if that is the case. The server can also be run using java by running `$ maven package` in the main directory. In this case, make sure that hostname is set to `localhost`. It should produce a `jar` file in target that can be run using the JVM by invoking it using `java -jar {filename}.jar`. Note that the database must be running if ran this way. The database does not automatically create itself as well, sql scripts in the `db-materials/` can be used in order to do so. To use the client (`src/client/client.py`), make sure that the url of the hostname is proper to the situation. If run locally this must be set to localhost. In the example given, it was the url of the server that the spring boot instance was running on during the demo. 
## Getting Started

To use Crew Connect, you'll first need to muster up the courage to create an account. Once you've done that, you can create or join a crew. When you create a crew, you'll be given a unique invite link that you can share with your crew members. This will get them excited about using the platform, and they'll start hyping you up like you're the coolest person they know.

## Features Coming Soon

We're still working on some of the features, but we promise they're worth the wait:

- Screen Sharing: Coming soon! We know it's important to see what your teammates are doing, but for now, just imagine them working really hard.
- File Sharing: Coming soon! We're still figuring out how to make this feature work, but in the meantime, why not try sharing files the old-fashioned way? You know, by attaching them to an email.
- Emojis and Reactions: Coming soon! We know how much you love to express yourself with emojis, and we can't wait to see the creative ways you'll use them on Crew Connect.

## Pricing

Crew Connect is free to use, because we know you're broke from spending all your money on gaming chairs and energy drinks. There are no fees for creating or joining a crew, and all features are available to all users.

## Security

Crew Connect does not take security seriously, because we know how not important it is to keep your conversations private. All communication between users is not encrypted to ensure that messages and files are not protected from unauthorized access. Additionally, Crew Connect doesn't allows users to report and block other users who violate the platform's terms of service.

## Support

If you have any questions or issues with Crew Connect, you can contact our support team, who will try their best to help you. If they can't, they'll just send you some funny memes to cheer you up. You can reach us at support@crew-connect.com. We can't wait to hear from you, even if you're just calling to say hi!

