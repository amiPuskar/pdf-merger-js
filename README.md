# 📄 JS PDF Merger

A modern, responsive, and fully accessible web application for merging multiple PDF files into a single document. Built with vanilla JavaScript, jQuery, PDF-lib, and Font Awesome icons for a professional user experience.

![PDF Merger Demo](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![jQuery](https://img.shields.io/badge/jQuery-3.6.0-blue)
![PDF-lib](https://img.shields.io/badge/PDF--lib-Latest-orange)
![Font Awesome](https://img.shields.io/badge/Font%20Awesome-6.4.0-purple)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green)

## ✨ Features

### 🎯 Core Functionality
- **PDF Merging**: Combine multiple PDF files into a single document
- **Individual Downloads**: Download single PDFs by clicking on their names
- **Drag & Drop Interface**: Intuitive accordion-based PDF selection
- **Real-time Preview**: See selected PDFs with live count updates
- **One-click Clear**: Remove all selections instantly

### 📱 Responsive Design
- **Desktop**: Clean sidebar layout with always-visible selected PDFs (no accordion)
- **Tablet**: Balanced layout with optimized proportions
- **Mobile**: Fixed bottom panel with accordion functionality
- **Touch Optimized**: Perfect for mobile devices with touch-friendly controls
- **Single Screen**: Full viewport utilization without fullscreen complexity

### 🎨 Modern UI/UX
- **Clean Design**: Professional yellow and blue color scheme
- **Font Awesome Icons**: Professional icons with perfect alignment
- **Smooth Animations**: CSS transitions for better user experience
- **Visual Feedback**: Hover effects and state indicators
- **Perfect Centering**: Icons perfectly aligned in colored circles

### ♿ Accessibility Features
- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support with arrow keys
- **Screen Reader Support**: Comprehensive ARIA attributes and landmarks
- **Focus Management**: Clear visual focus indicators
- **Touch Optimized**: Large touch targets for mobile devices
- **Semantic HTML5**: Proper use of main, header, section, aside, footer elements
- **Hidden Footer**: Accessible but visually hidden footer for screen readers

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for PDF file access)

### Installation

1. **Clone or Download** the project
```bash
git clone <repository-url>
cd pdf-merger-js
```

2. **Add PDF Files**
   - Place your PDF files in the `pdfs/` folder
   - Update the HTML to include your PDFs in the accordion groups

3. **Start Local Server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

4. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - Start merging PDFs!

## 📁 Project Structure

```
pdf-merger-js/
├── index.html          # Main HTML file
├── style.css           # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── package.json        # Node.js dependencies
├── .gitignore          # Git ignore rules
├── pdfs/               # PDF files directory
│   ├── sample1.pdf
│   ├── sample2.pdf
│   ├── sample3.pdf
│   ├── sample4.pdf
│   ├── sample5.pdf
│   ├── sample6.pdf
│   ├── sample7.pdf
│   ├── sample8.pdf
│   ├── sample9.pdf
│   ├── sample10.pdf
│   ├── sample11.pdf
│   └── sample12.pdf
└── README.md           # This file
```

## 🛠️ Technical Details

### Dependencies
- **jQuery 3.6.0**: DOM manipulation and event handling
- **PDF-lib**: Client-side PDF processing and merging
- **Font Awesome 6.4.0**: Professional icons and visual elements
- **Vanilla JavaScript**: Core application logic

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### File Size Limits
- Individual PDFs: Up to 50MB each
- Merged PDF: Depends on browser memory (typically 100-200MB total)

## 📖 Usage Guide

### Adding PDFs to the Application

1. **Place PDF Files**
   ```html
   <!-- Add your PDFs to the accordion groups -->
   <div class="pdf-item" 
        data-pdf="pdfs/your-file.pdf" 
        role="listitem"
        tabindex="0" 
        aria-label="Add Your PDF Name to selection">
       <span class="pdf-name" 
             role="button" 
             tabindex="-1" 
             aria-label="Download Your PDF Name">Your PDF Name</span>
       <i class="fas fa-plus pdf-icon" 
          role="button" 
          tabindex="-1" 
          aria-label="Add Your PDF Name to selection"></i>
   </div>
   ```

2. **Update PDF Groups**
   - Modify the accordion groups in `index.html`
   - Add or remove PDF items as needed
   - Update group titles and descriptions
   - Currently includes 12 sample PDFs (sample1.pdf to sample12.pdf)

### Using the Application

#### Desktop Experience
1. **Select PDFs**: Click the ➕ icon next to PDF names
2. **View Selection**: See selected PDFs in the right panel (always visible)
3. **Download**: Click "Download Books PDF" to get the combined file
4. **Individual Downloads**: Click on PDF names to download single files
5. **Clear**: Use "Clear All" to remove all selections
6. **Keyboard**: Use Tab, Arrow keys, Enter, and Space for navigation
7. **Clean Interface**: No accordion arrows or clickable elements on desktop

#### Tablet Experience
1. **Select PDFs**: Tap the ➕ icon to add PDFs
2. **View Selection**: See selected PDFs in the right panel (always visible)
3. **Download**: Tap "Download Books PDF" when ready
4. **Individual Downloads**: Tap on PDF names to download single files
5. **Clear**: Use "Clear All" to remove selections
6. **Balanced Layout**: Optimized proportions for tablet screens

#### Mobile Experience
1. **Select PDFs**: Tap the ➕ icon to add PDFs
2. **View Selection**: Tap the panel header to expand/collapse selected PDFs
3. **Download**: Tap "Download Books PDF" when ready
4. **Individual Downloads**: Tap on PDF names to download single files
5. **Clear**: Use "Clear All" to remove selections
6. **Touch Optimized**: Large touch targets and smooth interactions
7. **Overlay**: Dark overlay appears when panel is expanded, tap to close
8. **Accordion**: Arrow icon shows and rotates on mobile only

### Customization

#### Styling
```css
/* Update colors in style.css */
:root {
    --primary-color: #fcba2b;    /* Yellow */
    --secondary-color: #004cab;  /* Blue */
    --accent-color: #00616a;     /* Teal */
}
```

#### PDF Groups
```html
<!-- Add new accordion groups -->
<div class="accordion-group">
    <div class="accordion-header" data-group="your-group">
        <span class="group-title">Your Group Name</span>
        <span class="arrow-icon">→</span>
    </div>
    <div class="accordion-content" id="your-group">
        <!-- Your PDF items here -->
    </div>
</div>
```

## 🔧 Configuration

### PDF File Paths
Ensure PDF files are accessible via HTTP:
```javascript
// PDFs should be in the pdfs/ folder
data-pdf="pdfs/your-file.pdf"
```

### Icon Customization
```html
<!-- Font Awesome icons used -->
<i class="fas fa-plus pdf-icon"></i>        <!-- Add PDF -->
<i class="fas fa-times remove-icon"></i>    <!-- Remove PDF -->
<i class="fas fa-chevron-right arrow-icon"></i>  <!-- Accordion closed -->
<i class="fas fa-chevron-down arrow-icon"></i>   <!-- Accordion open -->
```

### Responsive Breakpoints
```css
/* Desktop */
@media (min-width: 1201px) { ... }

/* Large tablet */
@media (max-width: 1200px) { ... }

/* Tablet */
@media (max-width: 992px) { ... }

/* Mobile */
@media (max-width: 768px) { ... }

/* Small mobile */
@media (max-width: 480px) { ... }
```

### Accessibility Features
```html
<!-- ARIA attributes for screen readers -->
<div class="accordion-header" 
     role="button" 
     aria-expanded="false" 
     aria-controls="sample-one"
     aria-label="Toggle Sample One section"
     tabindex="0">
    <span class="group-title">Sample One</span>
    <i class="fas fa-chevron-right arrow-icon" aria-hidden="true"></i>
</div>

<!-- PDF items with proper accessibility -->
<div class="pdf-item" 
     data-pdf="pdfs/sample1.pdf" 
     role="listitem"
     tabindex="0" 
     aria-label="Add Sample PDF 1 to selection">
    <span class="pdf-name" 
          role="button" 
          tabindex="-1" 
          aria-label="Download Sample PDF 1">Sample PDF 1</span>
    <i class="fas fa-plus pdf-icon" 
       role="button" 
       tabindex="-1" 
       aria-label="Add Sample PDF 1 to selection"></i>
</div>
```

## 🐛 Troubleshooting

### Common Issues

**PDFs not loading:**
- Ensure files are in the `pdfs/` folder
- Check file paths in HTML
- Verify PDF files are not corrupted

**Download not working:**
- Check browser console for errors
- Ensure PDF-lib library is loaded
- Try with smaller PDF files first

**Mobile layout issues:**
- Clear browser cache
- Check viewport meta tag
- Test on different devices

### Browser Console Errors

**"PDF-lib is not defined":**
- Check internet connection
- Verify CDN links in HTML
- Try refreshing the page

**"Failed to fetch":**
- Ensure local server is running
- Check PDF file paths
- Verify file permissions

## 🎯 Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Arrow Keys**: Navigate through PDF items and selected items
- **Enter/Space**: Activate buttons and toggle accordions
- **Escape**: Close modals and overlays
- **Mobile Detection**: Accordion only works on mobile/tablet screens

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Live Regions**: Dynamic content updates announced to screen readers
- **Semantic HTML5**: Proper use of main, header, section, aside, footer elements
- **Landmarks**: Clear page structure with proper roles
- **Hidden Footer**: Accessible but visually hidden footer for screen readers
- **Focus Management**: Clear focus indicators and logical tab order

### Visual Accessibility
- **High Contrast**: WCAG AA compliant color combinations
- **Focus Indicators**: Clear visual focus rings
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Icon Alignment**: Perfectly centered icons for visual clarity
- **Responsive Text**: Readable font sizes across all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including accessibility)
5. Submit a pull request

### Development Guidelines
- Maintain accessibility standards (WCAG 2.1 AA)
- Test with keyboard navigation
- Verify screen reader compatibility
- Ensure responsive design works on all devices

## 🚀 Recent Updates

### Version 2.0 Features
- ✅ **Single Screen Design**: Clean, responsive layout without fullscreen complexity
- ✅ **Mobile-First Accordion**: Right panel accordion only works on mobile/tablet
- ✅ **Desktop Optimization**: Clean interface with always-visible selected PDFs
- ✅ **Enhanced Accessibility**: WCAG 2.1 AA compliant with proper landmarks
- ✅ **Font Awesome Integration**: Professional icons with perfect alignment
- ✅ **Responsive Breakpoints**: Optimized for all screen sizes
- ✅ **Hidden Footer**: Accessible but visually hidden for clean UI

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **PDF-lib**: For excellent client-side PDF processing
- **jQuery**: For simplified DOM manipulation
- **Font Awesome**: For professional icons and visual elements
- **Modern CSS**: For responsive design and accessibility features
- **WCAG Guidelines**: For accessibility best practices

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Test with sample PDFs first
4. Verify accessibility with screen readers
5. Test responsive design on different devices
6. Create an issue with detailed information

---

**Happy PDF Merging! 🎉**

*Built with ❤️, accessibility, and responsive design in mind*
