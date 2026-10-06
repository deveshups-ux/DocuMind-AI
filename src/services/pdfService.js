import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  const pages = [];
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    pages.push({
      pageNumber: pageNum,
      text: pageText,
    });
    
    fullText += `\n--- [Page ${pageNum}] ---\n` + pageText;
  }
  
  return {
    numPages: pdf.numPages,
    pages,
    fullText: fullText.trim(),
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
  };
}

export async function extractTextFromTxt(file) {
  const text = await file.text();
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  const pages = paragraphs.map((para, idx) => ({
    pageNumber: idx + 1,
    text: para.trim(),
  }));

  return {
    numPages: pages.length || 1,
    pages: pages.length ? pages : [{ pageNumber: 1, text }],
    fullText: text,
    name: file.name,
    size: (file.size / 1024).toFixed(1) + ' KB',
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}
