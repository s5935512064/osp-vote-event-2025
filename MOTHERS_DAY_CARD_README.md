# 💝 Mother's Day Card Creator

A beautiful, interactive web application that allows users to create personalized Mother's Day cards with custom photos, heartfelt messages, and professional styling. The application includes social sharing capabilities with special support for LINE flex messages.

## 🌟 Features

### 📸 Image Upload
- **Drag & Drop Interface**: Users can easily drag and drop images or click to browse
- **Image Preview**: Real-time preview of uploaded photos
- **File Validation**: Supports JPG, PNG, GIF formats
- **Responsive Design**: Works on both desktop and mobile devices

### 🎨 Card Styles
Four beautiful, professionally designed card themes:

1. **Floral Pink** - Soft pink gradients with floral elements
2. **Elegant Purple** - Sophisticated purple tones for elegant cards
3. **Cute Rose** - Warm rose colors with playful design
4. **Modern Coral** - Contemporary coral gradients with modern styling

Each style includes:
- Custom color schemes
- Matching fonts and typography
- Decorative elements and emojis
- Responsive layouts

### ✍️ Message Customization
- **Rich Text Editor**: Multi-line text input for heartfelt messages
- **Character Counter**: 300 character limit with live count
- **Message Suggestions**: Pre-written inspiring messages for users
- **Author Name**: Optional signature field
- **Live Preview**: Real-time preview of message formatting

### 👀 Live Preview
- **Real-time Updates**: Card preview updates instantly as users make changes
- **Responsive Preview**: Shows how the card will look on different devices
- **Style Indicators**: Displays current style and theme information
- **Visual Feedback**: Clear indication of missing elements (e.g., photo upload reminder)

### 📱 Social Sharing

#### LINE Integration (Special Feature)
- **LINE Flex Message**: Generate rich, interactive LINE messages
- **JSON Export**: Copy flex message JSON for LINE Bot integration
- **Developer Tools**: Special tools for developers working with LINE Bot APIs
- **Interactive Elements**: Buttons and rich formatting in LINE messages

#### Other Social Platforms
- **WhatsApp**: Direct sharing with formatted text and link
- **Facebook**: Share with custom quote and page link
- **Twitter**: Tweet with message excerpt and link
- **Image Download**: High-quality PNG download for any platform

### 🖼️ Image Generation
- **Canvas-based Rendering**: High-quality image generation using HTML5 Canvas
- **Custom Resolution**: 800x600 pixel output for optimal sharing
- **Professional Layout**: Automatic text wrapping and image positioning
- **Decorative Elements**: Emojis and visual elements positioned automatically

## 🚀 Technical Implementation

### Tech Stack
- **Framework**: Astro with React integration
- **Styling**: Tailwind CSS with custom gradients
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icon library
- **UI Components**: Custom components with Radix UI primitives

### Key Components

#### Main Component (`MothersDayCardCreator.tsx`)
- State management for card data
- Step-by-step wizard interface
- Progress tracking
- Canvas-based image generation

#### Sub-components
1. **ImageUploader**: Handles file upload with drag & drop
2. **CardStyleSelector**: Style selection with live previews
3. **WishTextEditor**: Message editing with suggestions
4. **CardPreview**: Real-time card preview
5. **SocialSharing**: Comprehensive sharing options

### LINE Flex Message Structure
```json
{
  "type": "flex",
  "altText": "Happy Mother's Day Card 💝",
  "contents": {
    "type": "bubble",
    "size": "kilo",
    "hero": {
      "type": "image",
      "url": "[generated-image-url]",
      "size": "full",
      "aspectRatio": "4:3",
      "aspectMode": "cover"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        // Message content with styling
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        // Call-to-action button
      ]
    }
  }
}
```

## 📱 Usage Instructions

### Step 1: Upload Photo
1. Navigate to `/mothers-day-card`
2. Drag and drop an image or click "Choose Photo"
3. Supported formats: JPG, PNG, GIF (Max 10MB)
4. Preview your uploaded image

### Step 2: Choose Style
1. Browse 4 different card styles
2. Click on your preferred style
3. See live preview of how your card will look
4. Style applies to colors, fonts, and decorations

### Step 3: Add Your Message
1. Write a personal message (up to 300 characters)
2. Optionally add your name as signature
3. Use suggested messages for inspiration
4. See character count and live preview

### Step 4: Preview & Share
1. Review your complete card
2. Download as high-quality image
3. Share directly to social media
4. Copy LINE flex message for bot integration

## 🎯 Target Users

- **Families**: Creating personal cards for mothers
- **Social Media Users**: Sharing on Facebook, WhatsApp, Twitter
- **LINE Users**: Especially popular in Asia-Pacific regions
- **Developers**: Using LINE flex message JSON for bot development
- **General Public**: Anyone wanting to create beautiful digital cards

## 🌍 Accessibility & Responsiveness

- **Mobile-First Design**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets for mobile users
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Progressive Enhancement**: Works even with JavaScript disabled (basic functionality)

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser

### Installation
```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Build for Production
```bash
npm run build
# or
bun build
```

## 📊 Performance Features

- **Lazy Loading**: Components load only when needed
- **Image Optimization**: Automatic image compression and sizing
- **Fast Loading**: Astro's static site generation for quick initial loads
- **Smooth Animations**: Optimized Framer Motion animations
- **Responsive Images**: Adaptive image sizing for different devices

## 🔮 Future Enhancements

- **More Card Styles**: Additional themes and seasonal options
- **Advanced Text Formatting**: Bold, italic, color options
- **Multiple Image Support**: Photo collages and multi-image cards
- **Video Cards**: Support for short video messages
- **Template Gallery**: Pre-made templates for different occasions
- **AI Message Suggestions**: Personalized message recommendations
- **Print Support**: High-resolution output for physical printing

## 🎨 Design Philosophy

The Mother's Day Card Creator emphasizes:
- **Simplicity**: Easy-to-use interface for all age groups
- **Beauty**: Professional, aesthetically pleasing designs
- **Personalization**: Maximum customization with minimal complexity
- **Sharing**: Seamless social media integration
- **Accessibility**: Inclusive design for all users
- **Performance**: Fast, responsive experience across devices

---

**Created with ❤️ for celebrating the amazing mothers in our lives!**