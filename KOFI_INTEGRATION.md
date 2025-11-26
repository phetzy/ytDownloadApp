# Ko-fi Donation Integration

## ✅ What Was Added

### 1. **Ko-fi Button Component** (`components/kofi-button.tsx`)
- Reusable Ko-fi donation button
- Official Ko-fi red color (#FF5E5B)
- Ko-fi cup icon included
- Opens in new tab with proper security attributes

### 2. **Homepage Placement**
- Prominent button below header
- Located above ads for visibility
- "Buy me a coffee" text
- Links to: `https://ko-fi.com/phetzy`

### 3. **Footer Link**
- Additional "☕ Support" link in footer navigation
- Matches footer styling with Ko-fi brand color
- Appears on all pages (home, privacy, terms)

## 🎨 Design

The Ko-fi button features:
- ✅ Official Ko-fi red color (#FF5E5B)
- ✅ Ko-fi cup SVG icon
- ✅ Hover effects with darker shade
- ✅ Shadow for depth
- ✅ Responsive design

## 📍 Locations

### Homepage Button (Primary)
- **Position:** Below header, above top ad
- **Style:** Full button with icon
- **Text:** "Buy me a coffee"

### Footer Link (Secondary)
- **Position:** Footer navigation (all pages)
- **Style:** Text link with coffee emoji
- **Text:** "☕ Support"

## 🔧 Customization

### Change Ko-fi Username
Edit in `app/page.tsx`:
```tsx
<KofiButton username="your-username" label="Buy me a coffee" />
```

Edit in `components/footer.tsx`:
```tsx
href="https://ko-fi.com/your-username"
```

### Change Button Text
```tsx
<KofiButton username="phetzy" label="Support This Project" />
```

### Change Button Styling
Edit `components/kofi-button.tsx` to customize colors, size, etc.

### Move Button Position
Move the Ko-fi button div in `app/page.tsx` to different location.

## 📊 Current Setup

```
Header
   ↓
Ko-fi Button ← Primary donation CTA
   ↓
Top Ad
   ↓
Main Content (Downloader)
   ↓
Bottom Ad
   ↓
Features Section
   ↓
How-To Section
   ↓
FAQ Section
   ↓
Footer (with Ko-fi link) ← Secondary donation link
```

## 💡 Benefits

1. **Prominent Placement:** Visible immediately after header
2. **Multiple Touchpoints:** Button + footer link
3. **Brand Consistent:** Uses official Ko-fi colors and icon
4. **User Friendly:** Clear "Buy me a coffee" messaging
5. **Secure:** Opens in new tab with proper rel attributes

## 🚀 Deploy

Changes are ready to deploy:

```bash
git add .
git commit -m "Add Ko-fi donation support"
git push
```

Your Ko-fi donation button is now live! ☕
