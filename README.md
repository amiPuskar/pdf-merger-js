# PDF Book Builder

A robust web application for building PDF books by selecting and merging PDFs using HTML, CSS, JavaScript (with jQuery), Node.js + Express, and pdf-merger-js library. Features server-side PDF merging, accessibility support, and a clean responsive interface.

## Features

- **Split Screen Layout**: Clean interface with accordion groups on the left and selected PDFs on the right
- **Accordion Groups**: Collapsible sections for different PDF categories (Local Fixed Routes, Community Routes, Express Routes)
- **Interactive PDF Selection**: Click + to add PDFs, ✓ when selected, × to remove them
- **Server-Side PDF Merging**: Robust PDF merging using Node.js + Express + pdf-merger-js
- **Accessibility Support**: Full keyboard navigation, ARIA labels, and screen reader support
- **Sticky Footer**: Download and Clear All buttons always visible at bottom
- **Scrollable Selection**: Right panel scrolls when many PDFs are selected
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling with user feedback

## Getting Started

### Prerequisites

- Node.js (for running the development server)
- A modern web browser

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the server** (recommended):
   ```bash
   npm start
   ```
   This will start the Express server at `http://localhost:3000` with server-side PDF merging.

2. **Alternative - Client-only mode**:
   ```bash
   npm run client
   ```
   This runs a simple HTTP server at `http://localhost:8080` (client-side merging only).

### Usage

1. **Select PDFs**: Click the + button next to any PDF in the available list or accordion sections
2. **Remove PDFs**: Click the × button next to any PDF in the selected list
3. **Merge PDFs**: Click "Download Merged PDF" to merge all selected PDFs in order
4. **Clear All**: Click "Clear All" to remove all selections

## File Structure

```
pdf-merger-js/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Node.js dependencies
├── pdfs/               # Sample PDF files
│   ├── sample1.pdf
│   ├── sample2.pdf
│   ├── sample3.pdf
│   ├── demo1.pdf
│   ├── demo2.pdf
│   └── demo3.pdf
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox layout, responsive design, animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **jQuery**: DOM manipulation and event handling
- **pdf-merger-js**: PDF merging functionality
- **http-server**: Development server

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- The sample PDFs provided are basic PDF files for demonstration purposes
- In a production environment, you would replace these with actual PDF files
- The application handles PDF loading errors gracefully
- All PDFs are merged in the order they appear in the selected list

## License

MIT License - feel free to use this project for your own purposes.