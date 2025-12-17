# Media Troubleshooting Guide

## Images and Videos Not Loading

If images or videos from Craft aren't displaying in your blog posts, here are some troubleshooting steps:

### 1. Check Browser Console

Open the browser developer console (F12) and look for errors when a post loads. The code now logs:
- `Failed to load image: [URL]` - when images fail to load
- `Failed to load video: [URL]` - when videos fail to load

### 2. Verify Craft URLs

Craft uses URLs like `https://r.craft.do/[ID]`. These should be publicly accessible if:
- The document is shared publicly in Craft
- The images are included in the shared document

### 3. Check Craft Sharing Settings

In Craft:
1. Open your "Personal Blog" document
2. Click the Share button
3. Make sure "Anyone with the link" is enabled
4. Ensure "Include images and attachments" is checked

### 4. CORS Issues

If you see CORS errors in the console, Craft URLs might be blocked. Solutions:
- Verify the document sharing settings
- Contact Craft support about API image access
- Consider hosting images elsewhere (e.g., Cloudinary, Imgur)

### 5. Test URLs Directly

Copy an image URL from the console error and paste it into a new browser tab:
- If it loads → Frontend issue (check React code)
- If it doesn't load → Craft configuration issue
- If it redirects to a login → Sharing settings need adjustment

### 6. Supported Formats

**Images**: JPG, JPEG, PNG, GIF, WebP, SVG
**Videos**: MP4, WebM, OGG, MOV

### 7. Alternative: Upload to External Service

If Craft URLs continue to cause issues, you can:
1. Download media from Craft
2. Upload to a CDN or image hosting service
3. Update the URLs in Craft

## Video-Specific Issues

### Playback Problems
- Ensure the video format is web-compatible (MP4 with H.264 works best)
- Large videos may take time to buffer
- Check if the browser supports the video codec

### Controls Not Showing
The video player includes standard HTML5 controls. If they're not visible:
- Try a different browser
- Check browser video settings
- Ensure JavaScript is enabled

## Testing

To test if media rendering works:

1. **Test with a known working image**:
   - Add a test post in Craft with an image from Unsplash or similar
   - Use a direct URL like `https://images.unsplash.com/photo-xxx`

2. **Check network tab**:
   - Open DevTools → Network tab
   - Filter by "Img" or "Media"
   - Reload the page and watch for failed requests

3. **Verify API response**:
   - The API at `https://connect.craft.do/links/8a3DPwLXbQU/api/v1/blocks?id=[ID]`
   - Should return blocks with `type: "image"` and `url: "https://r.craft.do/..."`

## Common Solutions

### Problem: Images show broken icon
**Solution**: The URL is invalid or inaccessible. Check Craft sharing settings.

### Problem: Videos don't play
**Solution**: Format issue. Convert to MP4 with H.264 codec.

### Problem: Nothing loads
**Solution**: Check if API is returning the blocks correctly. Console log the data.

### Problem: Images load slowly
**Solution**: Normal for large images. Consider optimizing images before upload.

## Debug Mode

### Using the Media Debugger Component

A `MediaDebugger` component has been created to help troubleshoot media issues:

1. Open `src/pages/BlogPost.tsx`
2. Import the component at the top:
   ```typescript
   import MediaDebugger from '../components/MediaDebugger';
   ```
3. Add it inside the article, before the closing tags:
   ```typescript
   <MediaDebugger blocks={post.content} />
   ```
4. A blue button will appear in the bottom-right corner showing how many media blocks were found
5. Click it to see details about each media block including URLs
6. Test URLs directly by clicking "Test URL in new tab"

**Remember to remove the MediaDebugger before deploying to production!**

### Manual Console Logging

You can also add console logs manually:

```typescript
// In BlogPost.tsx, at the start of renderContent
console.log('Rendering blocks:', blocks);

// For each image block
console.log('Image block:', { 
  id: block.id, 
  type: block.type, 
  url: block.url,
  markdown: block.markdown 
});
```

## Contact Support

If issues persist:
1. Check the Craft API documentation: https://docs.craft.do
2. Verify your API connection is working
3. Test with the Craft web app to confirm media displays there

