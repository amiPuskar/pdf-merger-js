$(document).ready(function() {
    let selectedPDFs = [];
    
    // Generate the Local Fixed Routes PDF items (123-200)
    function generateLocalFixedRoutes() {
        const localFixedContainer = $('#local-fixed');
        for (let i = 123; i <= 200; i++) {
            const pdfItem = $(`
                <div class="pdf-item" 
                     data-pdf="${i}-anaheim-huntington.pdf" 
                     role="listitem"
                     tabindex="0">
                    <span class="pdf-name">${i} Anaheim - Huntington Beach</span>
                    <button class="add-icon" 
                            aria-label="Add ${i} Anaheim - Huntington Beach to PDF book"
                            title="Add to PDF book">+</button>
                </div>
            `);
            localFixedContainer.append(pdfItem);
        }
    }
    
    // Initialize accordion functionality with accessibility
    $('.accordion-header').on('click keydown', function(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        
        e.preventDefault();
        const accordionGroup = $(this).parent();
        const isExpanded = accordionGroup.hasClass('active');
        
        // Toggle accordion
        accordionGroup.toggleClass('active');
        
        // Update ARIA attributes
        const newExpanded = !isExpanded;
        $(this).attr('aria-expanded', newExpanded);
        
        // Update the expand icon
        const expandIcon = $(this).find('.expand-icon');
        expandIcon.text(newExpanded ? '▲' : '▼');
    });
    
    // Add PDF to selected list (handles both + and × icons in left panel)
    $(document).on('click keydown', '.add-icon, .pdf-item .remove-icon', function(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const pdfItem = $(this).closest('.pdf-item');
        const pdfName = pdfItem.data('pdf');
        
        // Check if PDF is already selected
        if (selectedPDFs.includes(pdfName)) {
            console.log('Removing PDF from left panel:', pdfName);
            
            // Remove from array
            selectedPDFs = selectedPDFs.filter(pdf => pdf !== pdfName);
            console.log('Selected PDFs now:', selectedPDFs);
            
            // Change icon back to +
            $(this).text('+')
                   .removeClass('remove-icon')
                   .addClass('add-icon')
                   .attr('aria-label', `Add ${pdfName.replace('.pdf', '').replace(/-/g, ' ')} to PDF book`)
                   .attr('title', 'Add to PDF book');
            
            // Remove from right panel
            $(`.selected-pdf-item[data-pdf="${pdfName}"]`).remove();
            
            // Show empty state if no PDFs selected
            if (selectedPDFs.length === 0) {
                $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
            }
            
            // Update UI
            updateDownloadButton();
            console.log('PDF removed successfully');
            return;
        }
        
        console.log('Adding PDF:', pdfName);
        
        // Add to selected list
        selectedPDFs.push(pdfName);
        console.log('Selected PDFs now:', selectedPDFs);
        
        // Change icon from + to × (X mark)
        $(this).text('×')
               .removeClass('add-icon')
               .addClass('remove-icon')
               .attr('aria-label', `Remove ${pdfName.replace('.pdf', '').replace(/-/g, ' ')} from PDF book`)
               .attr('title', 'Remove from PDF book');
        
        // Create new item for selected list
        const selectedItem = $(`
            <div class="selected-pdf-item" 
                 data-pdf="${pdfName}" 
                 role="listitem"
                 tabindex="0">
                <span class="selected-pdf-name">${pdfName.replace('.pdf', '').replace(/-/g, ' ')}</span>
                <button class="remove-icon" 
                        aria-label="Remove ${pdfName.replace('.pdf', '').replace(/-/g, ' ')} from PDF book"
                        title="Remove from PDF book">×</button>
            </div>
        `);
        
        // Remove empty state if it exists
        $('.empty-state').remove();
        
        $('#selected-pdfs').append(selectedItem);
        
        // Update UI
        updateDownloadButton();
        console.log('PDF added successfully');
    });
    
    // Remove PDF from selected list
    $(document).on('click keydown', '.remove-icon', function(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const pdfName = $(this).closest('.selected-pdf-item').data('pdf');
        
        console.log('Removing PDF:', pdfName);
        
        // Remove from array
        selectedPDFs = selectedPDFs.filter(pdf => pdf !== pdfName);
        console.log('Selected PDFs now:', selectedPDFs);
        
        // Change icon back to + in the left panel
        $(`.pdf-item[data-pdf="${pdfName}"] .remove-icon`)
            .text('+')
            .removeClass('remove-icon')
            .addClass('add-icon')
            .attr('aria-label', `Add ${pdfName.replace('.pdf', '').replace(/-/g, ' ')} to PDF book`)
            .attr('title', 'Add to PDF book');
        
        // Remove from DOM
        $(this).closest('.selected-pdf-item').remove();
        
        // Show empty state if no PDFs selected
        if (selectedPDFs.length === 0) {
            $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
        }
        
        // Update UI
        updateDownloadButton();
        console.log('PDF removed successfully');
    });
    
    // Clear all selected PDFs
    $('#clear-all').on('click keydown', function(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        
        e.preventDefault();
        console.log('Clear All clicked - Before:', selectedPDFs);
        
        selectedPDFs = [];
        
        // Reset all icons back to +
        $('.remove-icon').text('+')
                        .removeClass('remove-icon')
                        .addClass('add-icon')
                        .attr('aria-label', function() {
                            const pdfName = $(this).closest('.pdf-item').data('pdf');
                            return `Add ${pdfName.replace('.pdf', '').replace(/-/g, ' ')} to PDF book`;
                        })
                        .attr('title', 'Add to PDF book');
        
        // Clear the right panel
        $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
        
        // Update download button
        updateDownloadButton();
        
        // Visual confirmation
        const clearButton = $(this);
        const originalText = clearButton.text();
        clearButton.text('Cleared!').addClass('cleared');
        
        setTimeout(() => {
            clearButton.text(originalText).removeClass('cleared');
        }, 1000);
        
        console.log('Clear All completed - After:', selectedPDFs);
        console.log('Right panel cleared, showing empty state');
    });
    
    // Download merged PDF using server-side merging
    $('#download-btn').on('click keydown', async function(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        
        if (selectedPDFs.length === 0) {
            alert('Please select at least one PDF to merge.');
            return;
        }
        
        const button = $(this);
        const originalText = button.text();
        
        try {
            // Disable button and show loading state
            button.prop('disabled', true)
                  .text('Merging PDFs...')
                  .attr('aria-label', 'Merging PDFs, please wait');
            
            $('.container').addClass('loading');
            
            console.log('Starting PDF merge process...');
            console.log('Selected PDFs:', selectedPDFs);
            
            // Send POST request to server
            const response = await fetch('/api/merge-pdfs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedPDFs })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to merge PDFs');
            }
            
            // Get the PDF blob
            const pdfBlob = await response.blob();
            console.log('Merged PDF received, size:', pdfBlob.size, 'bytes');
            
            // Create download
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-pdf-book.pdf';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up after a delay
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
            
            console.log('PDF download initiated successfully');
            
            // Show success message
            button.text('Download Complete!')
                  .attr('aria-label', 'PDF download completed successfully');
            setTimeout(() => {
                button.text(originalText)
                      .attr('aria-label', 'Download merged PDF book');
            }, 2000);
            
        } catch (error) {
            console.error('Error merging PDFs:', error);
            
            // Show error message
            alert(`Error merging PDFs: ${error.message}`);
            
        } finally {
            // Re-enable button
            button.prop('disabled', false)
                  .attr('aria-label', 'Download merged PDF book');
            $('.container').removeClass('loading');
        }
    });
    
    // Update download button state
    function updateDownloadButton() {
        const downloadBtn = $('#download-btn');
        if (selectedPDFs.length === 0) {
            downloadBtn.prop('disabled', true)
                      .attr('aria-label', 'No PDFs selected for download');
        } else {
            downloadBtn.prop('disabled', false)
                      .attr('aria-label', `Download merged PDF book with ${selectedPDFs.length} PDFs`);
        }
    }
    
    // Initialize the app
    generateLocalFixedRoutes();
    updateDownloadButton();
    
    // Initialize all accordion icons to ▼ (closed state)
    $('.expand-icon').text('▼');
    
    // Debug: Log initial state
    console.log('PDF Book Builder initialized');
    console.log('Selected PDFs:', selectedPDFs);
    console.log('Accordion icons initialized');
    
    // Add keyboard navigation for PDF items
    $(document).on('keydown', '.pdf-item', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).find('.add-icon, .remove-icon').trigger('click');
        }
    });
    
    // Add keyboard navigation for selected PDF items
    $(document).on('keydown', '.selected-pdf-item', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).find('.remove-icon').trigger('click');
        }
    });
});