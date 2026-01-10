# 📱 Sycamore Church PWA Setup

Your app is now configured as a Progressive Web App (PWA)! Users can install it on their phones and it will appear with an icon on their home screen.

## ✅ What's Been Configured

1. **Manifest File** (`public/manifest.json`)
   - App name, description, and branding
   - Theme color: #2d7a7a (teal)
   - Display mode: standalone (fullscreen app experience)
   - Icons configuration for all device sizes

2. **Service Worker** (`public/service-worker.js`)
   - Enables offline functionality
   - Caches essential files
   - Auto-updates when new version is deployed

3. **HTML Meta Tags** (`index.html`)
   - PWA meta tags for installation
   - Apple-specific tags for iOS devices
   - Theme color for address bar

## 🎨 Generate App Icons

You need to generate PNG icons from your logo. Choose one of these methods:

### Option 1: Using ImageMagick (Automated)

**Windows (PowerShell):**
```powershell
# Install ImageMagick first (if not installed)
choco install imagemagick

# Run the icon generator
./generate-icons.ps1
```

**Mac/Linux (Bash):**
```bash
# Install ImageMagick first (if not installed)
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Run the icon generator
chmod +x generate-icons.sh
./generate-icons.sh
```

### Option 2: Online Tool (No Installation)

1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload `public/images/sycamore-logo-hd.svg`
3. Configure settings:
   - Background color: #2d7a7a
   - Check "I will place favicon files at the root of my website"
4. Download the package
5. Extract icons to `public/icons/` folder
6. Rename files to match:
   - icon-72x72.png
   - icon-96x96.png
   - icon-128x128.png
   - icon-144x144.png
   - icon-152x152.png
   - icon-192x192.png
   - icon-384x384.png
   - icon-512x512.png

### Option 3: Manual Creation

Use any image editor (Photoshop, Figma, etc.) to export these sizes:
- 72×72px
- 96×96px
- 128×128px
- 144×144px
- 152×152px
- 192×192px (minimum for PWA)
- 384×384px
- 512×512px (recommended for PWA)

Save them as PNG files in `public/icons/` with names like `icon-72x72.png`

## 📦 Required Folder Structure

After generating icons, your folder should look like:

```
sycamore/
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── manifest.json
│   └── service-worker.js
├── index.html
└── ...
```

## 🚀 Testing the PWA

### Desktop (Chrome/Edge)

1. Run the app: `npm run dev`
2. Open in browser: http://localhost:5173
3. Look for install icon in address bar (⊕ or install icon)
4. Click to install
5. App will open in standalone window

### Mobile (Android)

1. Deploy the app to your hosting (Vercel, Netlify, etc.)
2. Open the deployed URL in Chrome
3. Tap menu (⋮) → "Add to Home screen" or "Install app"
4. Confirm installation
5. App icon appears on home screen

### Mobile (iOS/iPhone)

1. Deploy the app to your hosting
2. Open the deployed URL in Safari
3. Tap Share button (□↑)
4. Scroll down and tap "Add to Home Screen"
5. Tap "Add"
6. App icon appears on home screen

## 🌐 Deployment Requirements

For PWA to work, your app **MUST** be served over HTTPS. This is automatic when deploying to:

- ✅ Vercel
- ✅ Netlify
- ✅ Cloudflare Pages
- ✅ GitHub Pages
- ✅ Any other modern hosting platform

⚠️ **Important:** PWA features won't work on `http://` (except localhost for testing)

## 🔍 Verify Installation

After deploying, verify PWA setup:

1. **Chrome DevTools:**
   - Open DevTools (F12)
   - Go to "Application" tab
   - Check "Manifest" section
   - Check "Service Workers" section

2. **Lighthouse Audit:**
   - Open DevTools (F12)
   - Go to "Lighthouse" tab
   - Select "Progressive Web App"
   - Click "Generate report"
   - Should score 90+ for full PWA compliance

## 📊 PWA Features Enabled

✅ **Installable** - Users can add to home screen
✅ **Offline-ready** - Basic caching implemented
✅ **Fast loading** - Service worker caches assets
✅ **App-like** - Standalone display mode
✅ **Responsive** - Works on all device sizes
✅ **Secure** - HTTPS required (automatic on hosting)

## 🎨 Customization

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your Full App Name",
  "short_name": "Short Name"
}
```

### Change Theme Color
Edit `public/manifest.json` and `index.html`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### Add Splash Screen
iOS automatically generates splash screens from your icons and theme color.
Android uses `background_color` and icon.

## 🐛 Troubleshooting

### Icons not showing
- Verify icons exist in `public/icons/`
- Check browser console for 404 errors
- Clear browser cache and reinstall

### Service worker not registering
- Check browser console for errors
- Ensure app is served over HTTPS (or localhost)
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Can't install on iOS
- Only Safari supports PWA installation on iOS
- Chrome/Firefox on iOS won't show install option
- URL must be HTTPS

### App not updating
- Uninstall old version
- Clear browser cache
- Service worker caches aggressively - may need to update version in `service-worker.js`

## 📱 Next Steps

1. ✅ Generate icons using one of the methods above
2. ✅ Test locally: `npm run dev` and try installing
3. ✅ Deploy to hosting platform (Vercel recommended)
4. ✅ Test on actual mobile devices
5. ✅ Share installation link with users

## 🔗 Useful Links

- [PWA Builder](https://www.pwabuilder.com/) - Test and enhance your PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit your PWA
- [Can I Use - PWA](https://caniuse.com/web-app-manifest) - Browser compatibility
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - Complete documentation

---

🎉 **Your app is now ready to be installed as a PWA!**

Users will be able to install it directly from their browser and use it like a native app.
