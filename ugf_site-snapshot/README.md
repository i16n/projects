# UGF Site

Built by Isaac Huntsman with help from:
Samuel: manual work to get all portco plaques together
Carson: designed UI on program page and vccc pages
Cole: manual work gathering all portco info and verifying it
Sydney: initially gathering all portco info
Lars: gave me the UGF blue color
Lindsey: manual work relating to team member photos, portco data

## Prerequisites

nodejs, nextjs

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## other info

I provide a .env.example if you want to run this, however, you can just view the live site at ugf-website.vercel.app
as of 08/21/25 we haven't gone live at ugrowthfund.com but this should happen soon.
Obviously the webhooks won't work at all because they reference specific table columns, and because you need to register the webhook with a specific url.

## Skills I learned doing this:

React... kind of. I was resistant to learning it, so didn't really apply myself. I do understand props very well, and somewhat state. Not so much hooks. I do understand custom react components.  
nextjs as a build tool  
vercel for hosting  
webhooks with airtable  
redis database for storing a cursor value for pagination and batch airtable record changes  
project management via clickup kanban board (included much more than "project management" as I helped people who have never coded before build webpages)  
cron job for refreshing my webhook  
ngrok for testing webhook  
APIs in general, also GET and POST requests.  
Video bitrate compression -- i happened upon this by accident visiting some restaurant website and finding that their 1 minute video was surprisingly small in terms of MB. Then I found out my bitrate was at like 8. I reduced it to 2.5 and was able to shrink the video size A LOT by doing so.  
VERSION CONTROl: I understand rebasing vs merging, branching, conflict res, quite well, and have had to explain it to more than a dozen people at this point. I firmly believe that if you have AI do everything, at least understand version control. Version control requires... a human touch.

### CACHING

I struggled with airtable's "temporary image url" served every API request (completely false) for a while,  
then proceeded to struggle with next/image caching. Attempted to force zero caching via nextjs, then attempted to cache bust next/image with unique image urls, ultimately just decided I would mirror airtable state in vercel blob.
On one hand, airtable said "don't use us like a CDN", and on the other hand, I say, "at least have your documentation right" -- for future developers, airtable will NOT give you a fresh url to your image every API request. They will give you the _same_ url up until the moment it expires, and then when you call, they will still give you that same url, which is now 403 forbidden.
I tried contacting developer support about this but they were beyond unhelpful.
browser caching -- i learned that it's requisite as a developer to have the "clear cache" chrome extension,
and that responsive design mode is very helpful.
I also learned that in general, _by default_, vercel/nextjs will cache _everything_ on your pages unless you add
`export const revalidate = <something in ms>` to your page or `export const dynamic = force-dynamic`
THIS INCLUDES API REQUESTS -- it will call on build or on first page hit, and then... _never again_...

## other notes
This is not meant to be run by you. I removed the whole public directory anyway which will break many links.
