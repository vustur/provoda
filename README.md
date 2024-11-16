# Provoda

Forum for communities
Made using NextJS and TailwindCSS

### How to use

1. Clone repo
2. Create `.env.local` in the root of the project
3. Edit it like this:

   ```
   DB_HOST= *Db host. Example: localhost*
   DB_PORT= 3306
   DB_DATABASE= *database name*
   DB_USER= *database user*
   DB_PASSWORD= *database password*
   IMGHOST= *image host api, only chevereto-based apis (check /pages/api/main.tsx, imgUploader method). Example: imgbb.com*
   IMGHOST_KEY= *image host key*
   ```
4. Import `base.sql` to database
5. Run `npm run build`, then `npm run start`
6. Open `localhost:3000`
7. Have fun!

### Other

If you have any questions or suggestions, please open issue or contact me on [telegram](https://t.me/vustur) (Also check my [tg channel](https://t.me/vusturs) / [site](https://vustur.xyz) with my projects!)

Note: provoda.vercel.app is test instance of Provoda, dont expect it to work
