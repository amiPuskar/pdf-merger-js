const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const PDFMerger = require('pdf-merger-js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to merge PDFs
app.post('/api/merge-pdfs', async (req, res) => {
    try {
        const { selectedPDFs } = req.body;
        
        if (!selectedPDFs || !Array.isArray(selectedPDFs) || selectedPDFs.length === 0) {
            return res.status(400).json({ error: 'No PDFs selected for merging' });
        }

        console.log('Merging PDFs:', selectedPDFs);

        // Create PDF merger instance
        const merger = new PDFMerger();

        // Process each PDF
        for (const pdfName of selectedPDFs) {
            try {
                const pdfPath = path.join(__dirname, 'pdfs', pdfName);
                
                // Check if file exists
                await fs.access(pdfPath);
                
                // Add PDF to merger
                await merger.add(pdfPath);
                console.log(`Successfully added: ${pdfName}`);
                
            } catch (error) {
                console.warn(`Could not load ${pdfName}:`, error.message);
                
                // Create a sample PDF for missing files
                const samplePDF = await createSamplePDF(pdfName);
                await merger.add(samplePDF);
                console.log(`Created sample PDF for: ${pdfName}`);
            }
        }

        // Generate merged PDF
        const mergedPdfBuffer = await merger.saveAsBuffer();
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="my-pdf-book.pdf"');
        res.setHeader('Content-Length', mergedPdfBuffer.length);
        
        // Send the PDF
        res.send(mergedPdfBuffer);
        
        console.log('PDF merge completed successfully');

    } catch (error) {
        console.error('Error merging PDFs:', error);
        res.status(500).json({ 
            error: 'Failed to merge PDFs', 
            details: error.message 
        });
    }
});

// Helper function to create sample PDFs
async function createSamplePDF(pdfName) {
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 150
>>
stream
BT
/F1 12 Tf
100 700 Td
(Sample PDF: ${pdfName.replace('.pdf', '').replace(/-/g, ' ')}) Tj
0 -50 Td
/F1 10 Tf
(This is a demo PDF created for testing purposes.) Tj
0 -30 Td
(In a real application, this would be an actual PDF file.) Tj
0 -30 Td
/Date: ${new Date().toLocaleDateString()}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000368 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
515
%%EOF`;

    return Buffer.from(pdfContent, 'utf8');
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('PDF merger API available at /api/merge-pdfs');
});
