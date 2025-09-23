/**
 * PDF Merger Application
 * A responsive, accessible PDF merging tool with Font Awesome icons
 * Features: Keyboard navigation, ARIA support, mobile optimization
 */
$(document).ready(function () {
    let selectedPDFs = [];

    // Accordion toggle function
    function toggleAccordion($this) {
        const $accordionGroup = $this.closest('.accordion-group, .right-panel');
        const $accordionContent = $accordionGroup.find('.accordion-content, .selected-content');
        const $arrowIcon = $this.find('.arrow-icon');
        const isRightPanel = $accordionGroup.hasClass('right-panel');
        const isActive = $accordionGroup.hasClass('active');

        // Close other accordions if it's not the right panel
        if (!isRightPanel) {
            $('.accordion-group').not($accordionGroup).removeClass('active');
            $('.accordion-content').not($accordionContent).removeClass('active');
            $('.arrow-icon').not($arrowIcon).removeClass('fa-chevron-down').addClass('fa-chevron-right');
        }

        // Toggle this accordion/panel
        $accordionGroup.toggleClass('active');
        $accordionContent.toggleClass('active');

        // Update ARIA attributes
        $this.attr('aria-expanded', !isActive);
        $accordionContent.attr('aria-hidden', isActive);

        // Update arrow icon
        if ($accordionGroup.hasClass('active')) {
            $arrowIcon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
            if (isRightPanel && window.innerWidth <= 768) {
                $('.panel-accordion-overlay').addClass('active');
            }
        } else {
            $arrowIcon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
            if (isRightPanel && window.innerWidth <= 768) {
                $('.panel-accordion-overlay').removeClass('active');
            }
        }
    }

    // Accordion toggle - click and keyboard
    $('.accordion-header').on('click keydown', function (e) {
        // Handle both click and Enter/Space key
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault();
            toggleAccordion($(this));
        }
    });

    // Panel header accordion - only on mobile/tablet
    $('.panel-header').on('click keydown', function (e) {
        // Only handle on mobile/tablet screens
        if (window.innerWidth <= 768) {
            if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
                e.preventDefault();
                toggleAccordion($(this));
            }
        }
    });

    // Keyboard navigation for PDF items
    $('.pdf-item').on('keydown', function (e) {
        const $this = $(this);
        const $pdfItems = $('.pdf-item');
        const currentIndex = $pdfItems.index(this);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % $pdfItems.length;
                $pdfItems.eq(nextIndex).focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? $pdfItems.length - 1 : currentIndex - 1;
                $pdfItems.eq(prevIndex).focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                const $icon = $this.find('.pdf-icon');
                const pdfName = $this.data('pdf');
                if ($icon.hasClass('selected')) {
                    removePDFFromSelection(pdfName, $icon);
                } else {
                    addPDFToSelection(pdfName, $icon);
                }
                break;
        }
    });


    // PDF name click - download single PDF
    $('.pdf-name').click(function (e) {
        e.stopPropagation();
        const pdfName = $(this).closest('.pdf-item').data('pdf');
        downloadSinglePDF(pdfName);
    });

    // PDF selection
    $('.pdf-item').click(function (e) {
        // Prevent nested clicks like on PDF name from triggering download
        if ($(e.target).hasClass('pdf-name')) return;

        const $item = $(this);
        const pdfName = $item.data('pdf');
        const $icon = $item.find('.pdf-icon');

        if ($icon.hasClass('selected')) {
            removePDFFromSelection(pdfName, $icon);
        } else {
            addPDFToSelection(pdfName, $icon);
        }
    });

    // Remove PDF from selection - click and keyboard
    $(document).on('click keydown', '.remove-icon', function (e) {
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
            e.stopPropagation();
            e.preventDefault();
            const pdfName = $(this).closest('.selected-pdf-item').data('pdf');
            const $leftIcon = $(`.pdf-item[data-pdf="${pdfName}"] .pdf-icon`);
            removePDFFromSelection(pdfName, $leftIcon);
        }
    });

    // Keyboard navigation for selected PDF items
    $(document).on('keydown', '.selected-pdf-item', function (e) {
        const $this = $(this);
        const $selectedItems = $('.selected-pdf-item');
        const currentIndex = $selectedItems.index(this);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % $selectedItems.length;
                $selectedItems.eq(nextIndex).focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? $selectedItems.length - 1 : currentIndex - 1;
                $selectedItems.eq(prevIndex).focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                const pdfName = $this.data('pdf');
                const $leftIcon = $(`.pdf-item[data-pdf="${pdfName}"] .pdf-icon`);
                removePDFFromSelection(pdfName, $leftIcon);
                break;
        }
    });

    // Clear all
    $('#clear-all').click(function (e) {
        e.preventDefault();
        clearAllPDFs();
    });

    // Close accordion when clicking on overlay
    $('.panel-accordion-overlay').click(function () {
        const $rightPanel = $('.right-panel');
        const $panelHeader = $rightPanel.find('.panel-header');
        const $selectedContent = $rightPanel.find('.selected-content');
        const $arrowIcon = $panelHeader.find('.arrow-icon');

        // Close the accordion with proper mobile handling
        $rightPanel.removeClass('active');
        $selectedContent.removeClass('active');
        $arrowIcon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        $panelHeader.attr('aria-expanded', 'false');
        $selectedContent.attr('aria-hidden', 'true');

        // Remove overlay
        $('.panel-accordion-overlay').removeClass('active');
    });


    // Download merged PDF
    $('#download-btn').click(function () {
        if (selectedPDFs.length === 0) {
            alert('Please select at least one PDF to merge.');
            return;
        }
        downloadMergedPDF();
    });

    // Add PDF to selection
    function addPDFToSelection(pdfName, $icon) {
        if (selectedPDFs.includes(pdfName)) return;

        selectedPDFs.push(pdfName);
        updateIconState($icon, 'selected');

        $icon.closest('.pdf-item').addClass('selected');

        // ✅ Correctly get PDF display name
        const pdfDisplayName = $icon.closest('.pdf-item').find('.pdf-name').text();
        const selectedItem = createSelectedItem(pdfName, pdfDisplayName);

        $('.empty-state').remove();
        $('#selected-pdfs').append(selectedItem);
        updateDownloadButton();
    }

    // Remove PDF from selection
    function removePDFFromSelection(pdfName, $icon) {
        selectedPDFs = selectedPDFs.filter(pdf => pdf !== pdfName);
        updateIconState($icon, 'unselected');

        // ✅ Remove class from the parent .pdf-item
        $icon.closest('.pdf-item').removeClass('selected');

        $(`.selected-pdf-item[data-pdf="${pdfName}"]`).remove();

        if (selectedPDFs.length === 0) {
            $('#selected-pdfs').html('<div class="empty-state" role="status" aria-live="polite">No PDFs selected</div>');
        }

        updateDownloadButton();
    }

    // Helper function to update icon state
    function updateIconState($icon, state) {
        if (state === 'selected') {
            $icon.removeClass('fa-plus').addClass('fa-times selected');
            $icon.attr('aria-label', $icon.attr('aria-label').replace('Add', 'Remove'));
        } else {
            $icon.removeClass('fa-times selected').addClass('fa-plus');
            $icon.attr('aria-label', $icon.attr('aria-label').replace('Remove', 'Add'));
        }
    }

    // Helper function to create selected item HTML
    function createSelectedItem(pdfName, pdfDisplayName) {
        return $(`
            <div class="selected-pdf-item" 
                 data-pdf="${pdfName}" 
                 role="listitem"
                 tabindex="0"
                 aria-label="${pdfDisplayName}, press Enter or Space to remove from selection">
                <span class="selected-pdf-name">${pdfDisplayName}</span>
                <i class="fas fa-times remove-icon" 
                   role="button" 
                   tabindex="-1"
                   aria-label="Remove ${pdfDisplayName} from selection"></i>
            </div>
        `);
    }

    // Clear all PDFs
    function clearAllPDFs() {
        selectedPDFs = [];
        $('.pdf-icon').each(function () {
            updateIconState($(this), 'unselected');
        });
        $('#selected-pdfs').html('<div class="empty-state" role="status" aria-live="polite">No PDFs selected</div>');
        updateDownloadButton();
    }

    // update download button and PDF count
    function updateDownloadButton() {
        const $downloadBtn = $('#download-btn');

        $downloadBtn.prop('disabled', selectedPDFs.length === 0);

        // Update PDF count
        $('#pdf-count').text(selectedPDFs.length);
    }

    // download single pdf
    function downloadSinglePDF(pdfName) {
        const link = document.createElement('a');
        link.href = pdfName;
        link.download = pdfName.split('/').pop();
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // download merged pdf
    async function downloadMergedPDF() {
        const $downloadBtn = $('#download-btn');
        const originalText = $downloadBtn.text();

        if (typeof PDFLib === 'undefined') {
            alert('PDF Lib library is not loaded. Please refresh the page and try again.');
            return;
        }

        $downloadBtn.prop('disabled', true).text('Merging PDFs...');

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const pdfPath of selectedPDFs) {
                const response = await fetch(pdfPath);
                if (!response.ok) {
                    throw new Error(`Failed to load PDF: ${pdfPath}`);
                }

                const pdfBytes = await response.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'my-pdf-book.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            $downloadBtn.text('Download Complete!');
            setTimeout(() => {
                $downloadBtn.text(originalText).prop('disabled', false);
            }, 2000);

        } catch (error) {
            alert('Error merging PDFs: ' + error.message);
            $downloadBtn.text(originalText).prop('disabled', false);
        }
    }

    updateDownloadButton();
});