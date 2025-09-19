# 📄 JS PDF Merger

A modern, responsive web application for merging multiple PDF files into a single document. Built with vanilla JavaScript, jQuery, and PDF-lib for client-side PDF processing.

![PDF Merger Demo](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![jQuery](https://img.shields.io/badge/jQuery-3.6.0-blue)
![PDF-lib](https://img.shields.io/badge/PDF--lib-Latest-orange)

## ✨ Features

### 🎯 Core Functionality
- **PDF Merging**: Combine multiple PDF files into a single document
- **Individual Downloads**: Download single PDFs by clicking on their names
- **Drag & Drop Interface**: Intuitive accordion-based PDF selection
- **Real-time Preview**: See selected PDFs with live count updates
- **One-click Clear**: Remove all selections instantly

### 📱 Responsive Design
- **Desktop**: Traditional sidebar layout with always-visible selected PDFs
- **Mobile/Tablet**: Fixed bottom panel with accordion functionality
- **Touch Optimized**: Perfect for mobile devices with touch-friendly controls
- **Adaptive UI**: Automatically adjusts to different screen sizes

### 🎨 Modern UI/UX
- **Clean Design**: Professional yellow and blue color scheme
- **Smooth Animations**: CSS transitions for better user experience
- **Visual Feedback**: Hover effects and state indicators
- **Accessibility**: Keyboard navigation and screen reader friendly

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
│   └── ...
└── README.md           # This file
```

## 🛠️ Technical Details

### Dependencies
- **jQuery 3.6.0**: DOM manipulation and event handling
- **PDF-lib**: Client-side PDF processing and merging
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
   <div class="pdf-item" data-pdf="pdfs/your-file.pdf">
       <span class="pdf-name">Your PDF Name</span>
       <span class="pdf-icon">+</span>
   </div>
   ```

2. **Update PDF Groups**
   - Modify the accordion groups in `index.html`
   - Add or remove PDF items as needed
   - Update group titles and descriptions

### Using the Application

#### Desktop Experience
1. **Select PDFs**: Click the `+` icon next to PDF names
2. **View Selection**: See selected PDFs in the right panel
3. **Download**: Click "Download Merged PDF" to get the combined file
4. **Clear**: Use "Clear All" to remove all selections

#### Mobile Experience
1. **Select PDFs**: Tap the `+` icon to add PDFs
2. **View Selection**: Tap the panel header to expand/collapse
3. **Download**: Tap "Download Merged PDF" when ready
4. **Clear**: Use "Clear All" to remove selections

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

### Responsive Breakpoints
```css
/* Mobile and tablet */
@media (max-width: 768px) { ... }

/* Small mobile */
@media (max-width: 480px) { ... }
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **PDF-lib**: For excellent client-side PDF processing
- **jQuery**: For simplified DOM manipulation
- **Modern CSS**: For responsive design capabilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Test with sample PDFs first
4. Create an issue with detailed information

---

**Happy PDF Merging! 🎉**
