/**
 * PDF Merger Application
 * A responsive, accessible PDF merging tool with Font Awesome icons
 * Features: Keyboard navigation, ARIA support, mobile optimization
 */
$(document).ready(function () {
    let selectedPDFs = [];

    // ============================================================================
    // ACCORDION FUNCTIONALITY
    // ============================================================================

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

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    // Accordion toggle - click and keyboard
    $('.accordion-header').on('click keydown', function (e) {
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
            e.preventDefault();
            toggleAccordion($(this));
        }
    });

    // Panel header accordion - only on mobile/tablet
    $('.panel-header').on('click keydown', function (e) {
        if (window.innerWidth <= 768 && (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' ')))) {
            e.preventDefault();
            toggleAccordion($(this));
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

    // Remove PDF from selection
    $(document).on('click keydown', '.remove-icon', function (e) {
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
            e.stopPropagation();
            e.preventDefault();
            const pdfName = $(this).closest('.selected-pdf-item').data('pdf');
            const $leftIcon = $(`.pdf-item[data-pdf="${pdfName}"] .pdf-icon`);
            removePDFFromSelection(pdfName, $leftIcon);
        }
    });

    // Clear all
    $('#clear-all').click(function (e) {
        e.preventDefault();
        clearAllPDFs();
    });

    // Download merged PDF
    $('#download-btn').click(function () {
        if (selectedPDFs.length === 0) {
            alert('Please select at least one PDF to merge.');
            return;
        }
        downloadMergedPDF();
    });

    // Close accordion when clicking on overlay
    $('.panel-accordion-overlay').click(function () {
        const $rightPanel = $('.right-panel');
        const $panelHeader = $rightPanel.find('.panel-header');
        const $selectedContent = $rightPanel.find('.selected-content');
        const $arrowIcon = $panelHeader.find('.arrow-icon');

        $rightPanel.removeClass('active');
        $selectedContent.removeClass('active');
        $arrowIcon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        $panelHeader.attr('aria-expanded', 'false');
        $selectedContent.attr('aria-hidden', 'true');
        $('.panel-accordion-overlay').removeClass('active');
    });

    // ============================================================================
    // KEYBOARD NAVIGATION
    // ============================================================================

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

    // ============================================================================
    // PDF MANAGEMENT FUNCTIONS
    // ============================================================================

    function addPDFToSelection(pdfName, $icon) {
        if (selectedPDFs.includes(pdfName)) return;

        selectedPDFs.push(pdfName);
        updateIconState($icon, 'selected');
        $icon.closest('.pdf-item').addClass('selected');

        const pdfDisplayName = $icon.closest('.pdf-item').find('.pdf-name').text();
        const selectedItem = createSelectedItem(pdfName, pdfDisplayName);

        $('.empty-state').remove();
        $('#selected-pdfs').append(selectedItem);
        updateDownloadButton();
    }

    function removePDFFromSelection(pdfName, $icon) {
        selectedPDFs = selectedPDFs.filter(pdf => pdf !== pdfName);
        updateIconState($icon, 'unselected');
        $icon.closest('.pdf-item').removeClass('selected');

        $(`.selected-pdf-item[data-pdf="${pdfName}"]`).remove();

        if (selectedPDFs.length === 0) {
            $('#selected-pdfs').html('<div class="empty-state" role="status" aria-live="polite">No PDFs selected</div>');
        }

        updateDownloadButton();
    }

    function updateIconState($icon, state) {
        if (state === 'selected') {
            $icon.removeClass('fa-plus').addClass('fa-times selected');
            $icon.attr('aria-label', $icon.attr('aria-label').replace('Add', 'Remove'));
        } else {
            $icon.removeClass('fa-times selected').addClass('fa-plus');
            $icon.attr('aria-label', $icon.attr('aria-label').replace('Remove', 'Add'));
        }
    }

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

    function clearAllPDFs() {
        selectedPDFs = [];
        $('.pdf-icon').each(function () {
            updateIconState($(this), 'unselected');
        });
        $('#selected-pdfs').html('<div class="empty-state" role="status" aria-live="polite">No PDFs selected</div>');
        updateDownloadButton();
    }

    function updateDownloadButton() {
        const $downloadBtn = $('#download-btn');
        $downloadBtn.prop('disabled', selectedPDFs.length === 0);
        $('#pdf-count').text(selectedPDFs.length);
    }

    function downloadSinglePDF(pdfName) {
        const link = document.createElement('a');
        link.href = pdfName;
        link.download = pdfName.split('/').pop();
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ============================================================================
    // COVER PAGE FUNCTIONS
    // ============================================================================

    function truncateText(text, maxWidth, fontSize) {
        const avgCharWidth = fontSize * 0.6;
        const maxChars = Math.floor(maxWidth / avgCharWidth);

        if (text.length <= maxChars) {
            return text;
        }

        return text.substring(0, maxChars - 3) + '...';
    }

    function calculateTextWidth(text, fontSize) {
        const avgCharWidth = fontSize * 0.6;
        return text.length * avgCharWidth;
    }

    function createClickablePDFLink(page, x, y, width, height, targetPageNumber) {
        try {
            // Create a simple link annotation using PDF-lib's annotation system
            const linkAnnotation = {
                Type: 'Annot',
                Subtype: 'Link',
                Rect: [x, y, x + width, y + height],
                Border: [0, 0, 0], // No border
                A: {
                    Type: 'Action',
                    S: 'GoTo',
                    D: [targetPageNumber, 'XYZ', null, null, null]
                }
            };

            // Add the annotation to the page's annotation array
            if (!page.node.Annots) {
                page.node.Annots = page.doc.context.register(page.doc.context.obj([]));
            }

            // Register the annotation object
            const registeredAnnotation = page.doc.context.register(page.doc.context.obj(linkAnnotation));
            page.node.Annots.push(registeredAnnotation);

            console.log(`Created clickable link for page ${targetPageNumber} at (${x}, ${y})`);
            return true;
        } catch (error) {
            console.error('Failed to create clickable link:', error);
            return false;
        }
    }

    async function createCoverPage(mergedPdf, pdfPageNumbers = []) {
        try {
            const coverUrl = 'pdfs/pdf-cover.pdf';
            const headerText = 'Selected PDFs:';
            const headingSize = 14;
            const bodyTextSize = 12;
            const bodyTextLineHeight = 18;
            const headerTextColor = PDFLib.rgb(0, 0, 0);
            const bodyTextColor = PDFLib.rgb(0, 0, 0.8);

            // Layout constants
            const startY = 280;
            const leftMargin = 45;
            const listIndent = 55;
            const rightMargin = 100;
            const bottomMargin = 50;
            const headerSpacing = 30;

            // Load the cover PDF
            const coverResponse = await fetch(coverUrl);
            if (!coverResponse.ok) {
                throw new Error(`Cover fetch failed: ${coverResponse.status}`);
            }

            const coverBytes = await coverResponse.arrayBuffer();
            const coverDoc = await PDFLib.PDFDocument.load(coverBytes, { ignoreEncryption: true });

            // Copy the cover page to merged PDF
            const coverPages = await mergedPdf.copyPages(coverDoc, coverDoc.getPageIndices());
            const firstCoverPage = coverPages[0];

            if (firstCoverPage && selectedPDFs.length > 0) {
                const { width, height } = firstCoverPage.getSize();
                const contentStartY = height - startY;

                // Add "Selected PDFs:" heading
                firstCoverPage.drawText(headerText, {
                    x: leftMargin,
                    y: contentStartY,
                    size: headingSize,
                    color: headerTextColor,
                });

                // Add PDF names as numbered list with clickable links
                let cursorY = contentStartY - headerSpacing;
                const maxWidth = width - rightMargin;

                for (let i = 0; i < selectedPDFs.length; i++) {
                    if (cursorY <= bottomMargin) break;

                    const pdfName = selectedPDFs[i].replace('pdfs/', '').replace('.pdf', '');
                    const indexedName = `${i + 1}. ${pdfName}`;
                    const truncatedName = truncateText(indexedName, maxWidth, bodyTextSize);

                    // Calculate text width for link area
                    const textWidth = calculateTextWidth(truncatedName, bodyTextSize);
                    const linkHeight = bodyTextLineHeight;

                    // Draw text on the cover page
                    firstCoverPage.drawText(truncatedName, {
                        x: listIndent,
                        y: cursorY,
                        size: bodyTextSize,
                        color: bodyTextColor,
                    });

                    // Create clickable link to the first page of this PDF (if page numbers are available)
                    if (pdfPageNumbers.length > 0 && pdfPageNumbers[i]) {
                        const targetPageNumber = pdfPageNumbers[i];
                        console.log(`Creating link for "${pdfName}" to page ${targetPageNumber}`);

                        try {
                            const linkCreated = createClickablePDFLink(
                                firstCoverPage,
                                listIndent,
                                cursorY - linkHeight, // Adjust Y coordinate for link area
                                textWidth,
                                linkHeight,
                                targetPageNumber
                            );

                            if (linkCreated) {
                                console.log(`✅ Successfully created clickable link for "${pdfName}"`);
                            } else {
                                console.warn(`❌ Failed to create clickable link for "${pdfName}"`);
                            }
                        } catch (linkError) {
                            console.error(`❌ Error creating clickable link for "${pdfName}":`, linkError);
                        }
                    } else {
                        console.log(`⚠️ No page number available for "${pdfName}" (pdfPageNumbers: ${JSON.stringify(pdfPageNumbers)})`);
                    }

                    cursorY -= bodyTextLineHeight;
                }
            }

            coverPages.forEach((page) => mergedPdf.addPage(page));
            return true;

        } catch (coverError) {
            console.error('Could not create cover page:', coverError.message);
            return false;
        }
    }

    // ============================================================================
    // PDF MERGING FUNCTIONS
    // ============================================================================

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
            const pdfPageNumbers = []; // Track page numbers for each PDF

            // Add cover page first
            await createCoverPage(mergedPdf, pdfPageNumbers);

            // Add selected PDFs and track their starting page numbers
            for (let i = 0; i < selectedPDFs.length; i++) {
                const pdfPath = selectedPDFs[i];
                console.log(`Processing PDF ${i + 1}: ${pdfPath}`);

                const response = await fetch(pdfPath);
                if (!response.ok) {
                    throw new Error(`Failed to load PDF: ${pdfPath}`);
                }

                const pdfBytes = await response.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

                // Record the starting page number for this PDF (after cover page)
                pdfPageNumbers[i] = mergedPdf.getPageCount() + 1;
                console.log(`📄 PDF "${pdfPath}" will start at page ${pdfPageNumbers[i]}`);

                pages.forEach(page => mergedPdf.addPage(page));
            }

            console.log(`📊 Final page numbers array: ${JSON.stringify(pdfPageNumbers)}`);

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

    // Initialize the application
    updateDownloadButton();
});