# Home Page - DeepHealth

## Overview
A dynamic, animated landing page for DeepHealth newsletter signups with live subscriber count and engaging visual effects.

## Features
- 🎨 Modern grayscale design with Inter font
- ✨ Dynamic animations throughout the page
- 🔄 Rotating text showcasing different AI benefits
- 💫 Floating background words with smooth animations
- 📊 Live subscriber count with pulse animation
- 📧 Email signup form with validation and smooth transitions
- ✅ Success/error messages with slide-down animation
- 📱 **Fully responsive and mobile-optimized design**
- 💼 Business-focused content about AI implementation
- 🎯 Three animated benefit cards highlighting value propositions
- 👆 Touch-friendly interactions for mobile devices
- ⚡ Performance optimized for all screen sizes

## Running the Server

### Start the server:
```bash
npm run home
```

### Development mode (with auto-reload):
```bash
npm run dev:home
```

The server will start on **http://localhost:3002**

## API Endpoints

### GET `/api/subscribers/count`
Returns the current active subscriber count.

**Response:**
```json
{
  "success": true,
  "count": 807,
  "total": 850
}
```

### POST `/api/subscribe`
Add a new subscriber to the database.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully subscribed!"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "This email is already subscribed"
}
```

### GET `/health`
Health check endpoint for monitoring.

## Dynamic Features

### Rotating Text
The tagline features rotating text that cycles through 7 different AI benefits every 3 seconds:
- "Automate Operations"
- "Cut Costs by 40%"
- "Scale Your Business"
- "Boost Productivity"
- "Implement AI Tools"
- "Transform Customer Service"
- "Streamline Workflows"

### Animations
- **Floating Words**: Background words (Automation, Efficiency, Scale, etc.) float continuously
- **Fade-in Effects**: Sequential animations as page elements load
- **Pulse Animation**: Subscriber count pulses to draw attention
- **Bounce Effect**: Benefit emoji icons bounce on hover
- **Hover Transitions**: Cards lift and scale on hover
- **Button Ripple**: Submit button has ripple effect on hover

## Mobile Optimization

### Responsive Breakpoints
- **768px and below**: Tablet/mobile layout with adjusted spacing and font sizes
- **480px and below**: Small mobile devices with compact layout
- **Landscape mode**: Optimized for horizontal mobile viewing

### Mobile-Specific Features
1. **Touch-Friendly UI**:
   - Minimum 48px touch targets for buttons and inputs
   - 16px font size on inputs (prevents iOS zoom)
   - Tap feedback effects instead of hover states

2. **Performance Optimizations**:
   - Reduced floating word animations (only 4 visible on mobile)
   - Slower rotation speed (4s instead of 3s for better readability)
   - Optimized animation durations
   - Hardware acceleration for smooth performance

3. **Layout Adjustments**:
   - Single column benefit cards on mobile
   - Reduced padding and margins for better space usage
   - Adjusted font sizes for readability
   - Optimized line heights for mobile screens

4. **iOS-Specific**:
   - Prevented zoom on form input focus
   - Smooth scrolling enabled
   - Overscroll bounce disabled
   - Theme color for browser chrome

5. **Touch Device Detection**:
   - Automatic detection of touch devices
   - Different interaction patterns for touch vs mouse
   - Active states instead of hover effects on touch

## Customization

### Update Newsletter Info
Edit `src/home/public/index.html` to customize:
- Title and tagline
- Rotating text phrases (in JavaScript section)
- Description text
- Benefit cards icons and text
- Floating background words

### Styling
All styles are in the `<style>` section of `index.html`. Key design elements:
- **Color Scheme**: Professional grayscale (blacks, grays, whites)
- **Font**: Inter (Google Fonts)
- **Background**: Dark gradient (`#0f0f0f` → `#2a2a2a`)
- **Cards**: Dark with subtle borders (`#1a1a1a` with `#333` borders)
- **Primary Action**: Light gradient button (`#f5f5f5` → `#e0e0e0`)

### Port Configuration
Default port is 3002. Override with environment variable:
```bash
HOME_PORT=3003 npm run home
```

## Database Integration
Signups are automatically saved to `data/subscribers.db` using the existing subscriber management system. All subscribers have:
- Unique email
- Unsubscribe token
- Subscription status tracking

## Deployment
For production deployment (e.g., Railway):
1. Set `HOME_PORT` environment variable (or use default 3002)
2. Ensure `data/` directory exists and is writable
3. Run `npm run home`

The server includes graceful shutdown handling for SIGTERM/SIGINT signals.

