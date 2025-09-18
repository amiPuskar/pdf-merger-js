$(document).ready(function () {
    let selectedPDFs = [];

    // Accordion toggle
    $('.accordion-header, .panel-header').click(function () {
        const $this = $(this);
        const $accordionGroup = $this.closest('.accordion-group, .mobile-selected-accordion, .right-panel');
        const $accordionContent = $accordionGroup.find('.accordion-content, .mobile-selected-content');
        const $arrowIcon = $this.find('.arrow-icon');

        // Only close other accordions if it's not the mobile selected accordion
        if (!$accordionGroup.hasClass('mobile-selected-accordion') && !$accordionGroup.hasClass('right-panel')) {
            $('.accordion-group').not($accordionGroup).removeClass('active');
            $('.accordion-content').not($accordionContent).removeClass('active');
            $('.arrow-icon').not($arrowIcon).text('→');
        }

        $accordionGroup.toggleClass('active');
        $accordionContent.toggleClass('active');

        if ($accordionGroup.hasClass('active')) {
            $arrowIcon.text('↓');
        } else {
            $arrowIcon.text('→');
        }
    });

    // PDF name click - download single PDF
    $('.pdf-name').click(function (e) {
        e.stopPropagation();
        const pdfName = $(this).closest('.pdf-item').data('pdf');
        downloadSinglePDF(pdfName);
    });

    // PDF selection
    $('.pdf-icon').click(function (e) {
        e.stopPropagation();
        const $pdfItem = $(this).closest('.pdf-item');
        const pdfName = $pdfItem.data('pdf');
        const $icon = $(this);

        if ($icon.hasClass('selected')) {
            removePDFFromSelection(pdfName, $icon);
        } else {
            addPDFToSelection(pdfName, $icon);
        }
    });

    // Remove PDF from selection
    $(document).on('click', '.remove-icon', function (e) {
        e.stopPropagation();
        const pdfName = $(this).closest('.selected-pdf-item').data('pdf');
        const $leftIcon = $(`.pdf-item[data-pdf="${pdfName}"] .pdf-icon`);
        removePDFFromSelection(pdfName, $leftIcon);
    });

    // Clear all
    $('#clear-all, #clear-all-mobile').click(function (e) {
        e.preventDefault();
        clearAllPDFs();
    });
    
    // Download merged PDF (both desktop and mobile)
    $('#download-btn, #download-btn-mobile').click(function () {
        if (selectedPDFs.length === 0) {
            alert('Please select at least one PDF to merge.');
            return;
        }
        downloadMergedPDF();
    });

    // add pdf to selection
    function addPDFToSelection(pdfName, $icon) {
        if (selectedPDFs.includes(pdfName)) return;

        selectedPDFs.push(pdfName);
        $icon.addClass('selected').text('×');

        const pdfDisplayName = $icon.siblings('.pdf-name').text();
        const selectedItem = $(`
            <div class="selected-pdf-item" data-pdf="${pdfName}">
                <span class="selected-pdf-name">${pdfDisplayName}</span>
                <span class="remove-icon">×</span>
            </div>
        `);

        // Update both desktop and mobile versions
        $('.empty-state').remove();
        $('#selected-pdfs').append(selectedItem);
        $('#selected-pdfs-mobile').append(selectedItem.clone());
        updateDownloadButton();
    }

    // remove pdf from selection
    function removePDFFromSelection(pdfName, $icon) {
        selectedPDFs = selectedPDFs.filter(pdf => pdf !== pdfName);
        $icon.removeClass('selected').text('+');

        // Remove from both desktop and mobile versions
        $(`.selected-pdf-item[data-pdf="${pdfName}"]`).remove();

        if (selectedPDFs.length === 0) {
            $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
            $('#selected-pdfs-mobile').html('<div class="empty-state">No PDFs selected</div>');
        }

        updateDownloadButton();
    }

    // clear all pdfs
    function clearAllPDFs() {
        selectedPDFs = [];
        $('.pdf-icon').removeClass('selected').text('+');
        $('#selected-pdfs').html('<div class="empty-state">No PDFs selected</div>');
        $('#selected-pdfs-mobile').html('<div class="empty-state">No PDFs selected</div>');
        updateDownloadButton();
    }

    // update download button and PDF count
    function updateDownloadButton() {
        const $downloadBtn = $('#download-btn');
        const $downloadBtnMobile = $('#download-btn-mobile');
        
        $downloadBtn.prop('disabled', selectedPDFs.length === 0);
        $downloadBtnMobile.prop('disabled', selectedPDFs.length === 0);
        
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