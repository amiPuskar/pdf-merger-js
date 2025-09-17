$(document).ready(function() {
    // Global variables
    let selectedPDFs = [];
    
    // Initialize accordion behavior (only one open at a time)
    $('.accordion-header').click(function() {
        const $this = $(this);
        const $accordionGroup = $this.closest('.accordion-group');
        const $accordionContent = $accordionGroup.find('.accordion-content');
        const $arrowIcon = $this.find('.arrow-icon');
        
        // Close all other accordions
        $('.accordion-group').not($accordionGroup).removeClass('active');
        $('.accordion-content').not($accordionContent).removeClass('active');
        $('.arrow-icon').not($arrowIcon).text('→');
        
        // Toggle current accordion
        $accordionGroup.toggleClass('active');
        $accordionContent.toggleClass('active');
        
        // Update arrow icon
        if ($accordionGroup.hasClass('active')) {
            $arrowIcon.text('↓');
        } else {
            $arrowIcon.text('→');
        }
    });
    
    // PDF name click - download single PDF
    $('.pdf-name').click(function(e) {
        e.stopPropagation();
        const pdfName = $(this).closest('.pdf-item').data('pdf');
        downloadSinglePDF(pdfName);
    });
    
    // PDF icon click - add/remove from selection
    $('.pdf-icon').click(function(e) {
        e.stopPropagation();
        const $pdfItem = $(this).closest('.pdf-item');
        const pdfName = $pdfItem.data('pdf');
        const $icon = $(this);
        
        if ($icon.hasClass('selected')) {
            // Remove from selection
            removePDFFromSelection(pdfName, $icon);
        } else {
            // Add to selection
            addPDFToSelection(pdfName, $icon);
        }
    });
    
    // Remove PDF from right panel
    $(document).on('click', '.remove-icon', function(e) {
        e.stopPropagation();
        const pdfName = $(this).closest('.selected-pdf-item').data('pdf');
        const $leftIcon = $(`.pdf-item[data-pdf="${pdfName}"] .pdf-icon`);
        removePDFFromSelection(pdfName, $leftIcon);
    });
    
    // Download merged PDF
    $('#download-btn').click(function() {
        if (selectedPDFs.length === 0) {
            alert('Please select at least one PDF to merge.');
            return;
        }
        
        downloadMergedPDF();
    });
    
    // Clear all PDFs
    $('#clear-all').click(function(e) {
        e.preventDefault();
        clearAllPDFs();
    });
    
    // Helper Functions
    
    function addPDFToSelection(pdfName, $icon) {
        if (selectedPDFs.includes(pdfName)) {
            return; // Already selected
        }
        
        selectedPDFs.push(pdfName);
        $icon.addClass('selected').text('×');
        
        // Add to right panel
        const pdfDisplayName = $icon.siblings('.pdf-name').text();
        const selectedItem = $(`
            <div class="selected-pdf-item" data-pdf="${pdfName}">
                <span class="selected-pdf-name">${pdfDisplayName}</span>
                <span class="remove-icon">×</span>
            </div>
        `);
        
        $('.empty-state').remove();
        $('#selected-pdfs').append(selectedItem);
        
        updateDownloadButton();
    }
    
    function removePDFFromSelection(pdfName, $icon) {
        selectedPDFs = selectedPDFs.filter(pdf => pdf !== pdfName);
        $icon.removeClass('selected').text('+');
        
        // Remove from right panel
        $(`.selected-pdf-item[data-pdf="${pdfName}"]`).remove();
        
        // Show empty state if no PDFs selected
        if (selectedPDFs.length === 0) {
            $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
        }
        
        updateDownloadButton();
    }
    
    function clearAllPDFs() {
        selectedPDFs = [];
        
        // Reset all icons
        $('.pdf-icon').removeClass('selected').text('+');
        
        // Clear right panel
        $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
        
        updateDownloadButton();
    }
    
    function updateDownloadButton() {
        const $downloadBtn = $('#download-btn');
        if (selectedPDFs.length > 0) {
            $downloadBtn.prop('disabled', false);
        } else {
            $downloadBtn.prop('disabled', true);
        }
    }
    
    function downloadSinglePDF(pdfName) {
        // Create a simple download link for the PDF
        const link = document.createElement('a');
        link.href = `pdfs/${pdfName}`;
        link.download = pdfName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function downloadMergedPDF() {
        const $downloadBtn = $('#download-btn');
        const originalText = $downloadBtn.text();
        
        // Show loading state
        $downloadBtn.prop('disabled', true).text('Merging PDFs...');
        
        // Create PDF merger instance
        const merger = new PDFMerger();
        
        // Add all selected PDFs
        const addPDFPromises = selectedPDFs.map(pdfName => {
            return merger.add(`pdfs/${pdfName}`);
        });
        
        // Merge and download
        Promise.all(addPDFPromises)
            .then(() => merger.saveAsBlob())
            .then(blob => {
                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'my-pdf-book.pdf';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
                
                // Reset button
                $downloadBtn.text('Download Complete!');
                setTimeout(() => {
                    $downloadBtn.text(originalText).prop('disabled', false);
                }, 2000);
            })
            .catch(error => {
                console.error('Error merging PDFs:', error);
                alert('Error merging PDFs. Please try again.');
                $downloadBtn.text(originalText).prop('disabled', false);
            });
    }
    
    // Initialize
    updateDownloadButton();
});
