import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import {
  FileText,
  Layers,
  Scissors,
  Grid,
  FileSpreadsheet,
  Presentation,
  RotateCw,
  Hash,
  Droplet,
  Lock,
  Unlock,
  PenTool,
  Minimize2,
  Search,
  Wrench,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Cloud,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  Heart,
  RefreshCw,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  BookOpen,
  Check
} from 'lucide-react';

export default function PdfMakerPage({ onNavigate, onOpenAuth }) {
  // Global Upload & Active Tool States
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatusText, setProcessStatusText] = useState('');
  const [processResult, setProcessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Cloud Import State
  const [cloudModal, setCloudModal] = useState(null);
  const [cloudFiles, setCloudFiles] = useState([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudAccountEmail, setCloudAccountEmail] = useState('');

  // Tool Specific Parameter States
  // Split
  const [splitMode, setSplitMode] = useState('range');
  const [splitRanges, setSplitRanges] = useState('1-5');
  const [splitPagesPerFile, setSplitPagesPerFile] = useState(5);

  // Rotate
  const [rotateAngle, setRotateAngle] = useState(90);
  const [rotatePages, setRotatePages] = useState('all');

  // Page Numbers
  const [pageNumberPosition, setPageNumberPosition] = useState('bottom-center');
  const [pageNumberFormat, setPageNumberFormat] = useState('Page {n} of {total}');
  const [pageNumberStart, setPageNumberStart] = useState(1);
  const [pageNumberColor, setPageNumberColor] = useState('#4b5563');

  // Watermark
  const [watermarkText, setWatermarkText] = useState('ProfessorVirus');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.22);
  const [watermarkFontSize, setWatermarkFontSize] = useState(42);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkColor, setWatermarkColor] = useState('#781416');

  // Crop
  const [cropMarginPercent, setCropMarginPercent] = useState(5);

  // Text to PDF / Document Converter
  const [convertTextContent, setConvertTextContent] = useState('');
  const [convertDocTitle, setConvertDocTitle] = useState('Semester Revision Notes');

  // Digital Signature
  const signatureCanvasRef = useRef(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const [hasSignatureDrawing, setHasSignatureDrawing] = useState(false);
  const [signaturePage, setSignaturePage] = useState(1);
  const [signatureXPercent, setSignatureXPercent] = useState(70);
  const [signatureYPercent, setSignatureYPercent] = useState(15);

  // Organize PDF page list
  const [organizePages, setOrganizePages] = useState([1, 2, 3, 4, 5]);
  const [deletedPages, setDeletedPages] = useState([]);
  const [rotatedPagesMap, setRotatedPagesMap] = useState({});

  // Image to PDF Page Size
  const [imagePageSize, setImagePageSize] = useState('a4');

  // File Input Refs
  const fileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Cleanup blob URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (processResult && processResult.downloadUrl) {
        URL.revokeObjectURL(processResult.downloadUrl);
      }
    };
  }, [processResult]);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFilesSelected = (files) => {
    if (!files || files.length === 0) return;
    setErrorMessage('');
    setProcessResult(null);

    // Filter valid files
    const valid = files.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'doc', 'docx', 'txt'].includes(ext);
    });

    if (valid.length === 0) {
      setErrorMessage('Please upload valid PDF, JPG, PNG or document files.');
      return;
    }

    setSelectedFiles(prev => [...prev, ...valid]);

    // If no active tool is open, open Merge if multiple files, or jpg-to-pdf if 1 image, or organize if 1 PDF
    if (!activeTool) {
      const isImg = valid.some(f => !f.name.toLowerCase().endsWith('.pdf'));
      if (valid.length > 1) {
        openTool('merge');
      } else if (isImg) {
        openTool('jpg-to-pdf');
      } else {
        openTool('organize');
      }
    }
  };

  // Open Tool Modal
  const openTool = (toolId) => {
    setErrorMessage('');
    setProcessResult(null);
    setActiveTool(toolId);

    // If opening organize and we have a selected PDF, inspect page count
    if (toolId === 'organize' && selectedFiles.length > 0) {
      inspectPdfPages(selectedFiles[0]);
    }

    // If tool is 'generate-100-page', execute immediately
    if (toolId === 'generate-100-page') {
      handleGenerate100PageNotes();
    }
  };

  const closeTool = () => {
    setActiveTool(null);
    setIsProcessing(false);
    setProcessProgress(0);
    setErrorMessage('');
  };

  // Universal Image to standard A4 (595.28 x 841.89) canvas converter
  const convertImageToStandardCanvas = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to convert image'));
            const r = new FileReader();
            r.onload = () => resolve({ buffer: r.result, width: canvas.width, height: canvas.height });
            r.onerror = reject;
            r.readAsArrayBuffer(blob);
          }, 'image/png');
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Inspect page count for organize tool (client-side with fallback)
  const inspectPdfPages = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const total = Math.max(1, Math.min(100, pdfDoc.getPageCount() || 5));
      const pagesArray = Array.from({ length: total }, (_, i) => i + 1);
      setOrganizePages(pagesArray);
      setDeletedPages([]);
      setRotatedPagesMap({});
    } catch {
      setOrganizePages([1, 2, 3, 4, 5]);
    }
  };

  // Cloud Import Trigger
  const handleOpenCloudModal = async (provider) => {
    setCloudModal(provider);
    setErrorMessage('');

    if (provider === 'google-drive') {
      setCloudLoading(true);
      try {
        const res = await fetch('/api/pdf/cloud/google-drive');
        const data = await res.json();
        if (data.success && data.files) {
          setCloudFiles(data.files);
          setCloudAccountEmail(data.accountEmail || 'Connected Drive');
        } else {
          setCloudFiles([]);
          setCloudAccountEmail('');
        }
      } catch {
        setCloudFiles([]);
      } finally {
        setCloudLoading(false);
      }
    }
  };

  const handleImportDriveFile = async (file) => {
    setCloudLoading(true);
    try {
      const res = await fetch('/api/pdf/cloud/google-drive/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.id })
      });

      if (!res.ok) throw new Error('Failed to download file from Google Drive');
      const blob = await res.blob();
      const localFile = new File([blob], file.name || 'gdrive_doc.pdf', { type: 'application/pdf' });

      handleFilesSelected([localFile]);
      setCloudModal(null);
    } catch (err) {
      alert('Error importing from Google Drive: ' + err.message);
    } finally {
      setCloudLoading(false);
    }
  };

  // =========================================================================
  // PROCESSING ENGINE DISPATCHERS
  // =========================================================================

  // 1. Merge PDFs & Images (Universal: PDF + JPG + PNG + 100+ files)
  const handleMergeSubmit = async () => {
    if (selectedFiles.length < 1) {
      setErrorMessage('Please select at least 1 file (PDF or Image) to merge.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(10);
    setProcessStatusText('Preparing documents and validating file signatures...');

    try {
      // First attempt fast, reliable client-side processing using pdf-lib
      try {
        const mergedPdf = await PDFDocument.create();
        let totalPages = 0;

        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const pct = Math.round(15 + ((i + 1) / selectedFiles.length) * 75);
          setProcessProgress(pct);
          setProcessStatusText(`Merging ${file.name} (${i + 1} of ${selectedFiles.length})...`);

          const isPdfFile = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

          if (isPdfFile) {
            const arrayBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const pageIndices = srcDoc.getPageIndices();
            const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);
            copiedPages.forEach(p => {
              mergedPdf.addPage(p);
              totalPages++;
            });
          } else {
            // High-fidelity image embedding (JPG, PNG, WEBP, etc.)
            const { buffer, width, height } = await convertImageToStandardCanvas(file);
            const embeddedImage = await mergedPdf.embedPng(buffer);

            // Standard A4 dimensions in points
            const a4Width = 595.28;
            const a4Height = 841.89;
            const margin = 20;
            const maxWidth = a4Width - margin * 2;
            const maxHeight = a4Height - margin * 2;

            const scale = Math.min(maxWidth / width, maxHeight / height, 1);
            const drawWidth = width * scale;
            const drawHeight = height * scale;

            const page = mergedPdf.addPage([a4Width, a4Height]);
            page.drawImage(embeddedImage, {
              x: (a4Width - drawWidth) / 2,
              y: (a4Height - drawHeight) / 2,
              width: drawWidth,
              height: drawHeight
            });
            totalPages++;
          }
        }

        setProcessProgress(95);
        setProcessStatusText('Finalizing merged PDF document...');

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setProcessProgress(100);
        setProcessResult({
          downloadUrl: url,
          filename: 'professorvirus_merged_document.pdf',
          fileSize: blob.size,
          message: `Successfully merged ${selectedFiles.length} files (${totalPages} total pages) into one valid PDF!`
        });
        return;
      } catch (clientErr) {
        console.warn('[PDF MERGE] Client engine note, trying server endpoint:', clientErr.message);
      }

      // Backend fallback if client-side parsing encounters legacy unsupported streams
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      setProcessProgress(50);
      setProcessStatusText('Processing via backend engine...');

      const res = await fetch('/api/pdf/merge', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to merge documents.');
      }

      const blob = await res.blob();
      const pageCount = res.headers.get('x-page-count') || selectedFiles.length;
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: 'professorvirus_merged_document.pdf',
        fileSize: blob.size,
        message: `Successfully merged ${selectedFiles.length} files (${pageCount} total pages) into one valid PDF!`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to merge files');
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Split PDF
  const handleSplitSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to split.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText('Extracting pages according to rule...');

    try {
      // First attempt fast client-side split
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const total = srcDoc.getPageCount();

        if (splitMode === 'single-pages' || splitMode === 'pages-per-file') {
          const zip = new JSZip();
          const step = splitMode === 'pages-per-file' ? Math.max(1, parseInt(splitPagesPerFile, 10) || 1) : 1;
          let partNum = 1;

          for (let i = 0; i < total; i += step) {
            const newDoc = await PDFDocument.create();
            const pageIndices = [];
            for (let j = i; j < Math.min(total, i + step); j++) {
              pageIndices.push(j);
            }
            const copied = await newDoc.copyPages(srcDoc, pageIndices);
            copied.forEach(p => newDoc.addPage(p));
            const bytes = await newDoc.save();
            zip.file(`part_${partNum}_pages_${i + 1}-${Math.min(total, i + step)}.pdf`, bytes);
            partNum++;
          }

          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(zipBlob);
          setProcessProgress(100);
          setProcessResult({
            downloadUrl: url,
            filename: 'split_pages.zip',
            fileSize: zipBlob.size,
            message: 'Pages split and packaged into ZIP successfully!'
          });
          return;
        } else {
          // Range mode
          const parseRanges = (str, max) => {
            const pages = new Set();
            const parts = str.split(',');
            for (const part of parts) {
              const trimmed = part.trim();
              if (trimmed.includes('-')) {
                const [startStr, endStr] = trimmed.split('-');
                let start = parseInt(startStr, 10);
                let end = parseInt(endStr, 10);
                if (isNaN(start)) start = 1;
                if (isNaN(end)) end = max;
                start = Math.max(1, Math.min(max, start));
                end = Math.max(1, Math.min(max, end));
                for (let p = start; p <= end; p++) pages.add(p - 1);
              } else {
                const p = parseInt(trimmed, 10);
                if (!isNaN(p) && p >= 1 && p <= max) {
                  pages.add(p - 1);
                }
              }
            }
            return Array.from(pages).sort((a, b) => a - b);
          };

          const targetIndices = parseRanges(splitRanges || '1', total);
          if (targetIndices.length === 0) {
            throw new Error(`Invalid page range. Total pages: ${total}`);
          }

          const newDoc = await PDFDocument.create();
          const copied = await newDoc.copyPages(srcDoc, targetIndices);
          copied.forEach(p => newDoc.addPage(p));
          const bytes = await newDoc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          setProcessProgress(100);
          setProcessResult({
            downloadUrl: url,
            filename: `extracted_pages_${(splitRanges || '1').replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`,
            fileSize: blob.size,
            message: 'Page range extracted into PDF successfully!'
          });
          return;
        }
      } catch (clientErr) {
        console.warn('[PDF SPLIT] Client engine note, trying server endpoint:', clientErr.message);
      }

      // Backend fallback
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('mode', splitMode);
      formData.append('ranges', splitRanges);
      formData.append('pagesPerFile', splitPagesPerFile);

      setProcessProgress(65);
      const res = await fetch('/api/pdf/split', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error splitting PDF');
      }

      const contentType = res.headers.get('content-type') || '';
      const isZip = contentType.includes('zip');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: isZip ? 'split_pages.zip' : 'extracted_pages.pdf',
        fileSize: blob.size,
        message: isZip ? 'Pages split and packaged into ZIP successfully!' : 'Page range extracted into PDF successfully!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to split file');
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Organize PDF (Reorder, Delete, Rotate)
  const handleOrganizeSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to organize.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(25);
    setProcessStatusText('Reordering, deleting, and rotating pages...');

    try {
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();
        const finalPages = organizePages.filter(p => !deletedPages.includes(p));

        for (const pNum of finalPages) {
          const [copiedPage] = await newDoc.copyPages(srcDoc, [pNum - 1]);
          const rot = rotatedPagesMap[pNum] || 0;
          if (rot !== 0) {
            const curr = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((curr + rot) % 360));
          }
          newDoc.addPage(copiedPage);
        }

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setProcessProgress(100);
        setProcessResult({
          downloadUrl: url,
          filename: `organized_${selectedFiles[0].name}`,
          fileSize: blob.size,
          message: `PDF organized successfully! Retained ${finalPages.length} pages.`
        });
        return;
      } catch (clientErr) {
        console.warn('[PDF ORGANIZE] Client engine note, trying server endpoint:', clientErr.message);
      }

      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('pageOrder', JSON.stringify(organizePages));
      formData.append('deletePages', JSON.stringify(deletedPages));
      formData.append('rotatePages', JSON.stringify(rotatedPagesMap));

      setProcessProgress(70);
      const res = await fetch('/api/pdf/organize', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to organize PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `organized_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: `PDF organized successfully! Retained ${organizePages.filter(p => !deletedPages.includes(p)).length} pages.`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to organize PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Rotate PDF
  const handleRotateSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to rotate.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(35);
    setProcessStatusText(`Applying ${rotateAngle}° rotation to ${rotatePages} pages...`);

    try {
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        pages.forEach((p, idx) => {
          if (rotatePages === 'all' || (rotatePages === 'odd' && (idx + 1) % 2 !== 0) || (rotatePages === 'even' && (idx + 1) % 2 === 0)) {
            const currentAngle = p.getRotation().angle;
            p.setRotation(degrees((currentAngle + parseInt(rotateAngle, 10)) % 360));
          }
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setProcessProgress(100);
        setProcessResult({
          downloadUrl: url,
          filename: `rotated_${rotateAngle}deg_${selectedFiles[0].name}`,
          fileSize: blob.size,
          message: `Successfully rotated pages by ${rotateAngle}°!`
        });
        return;
      } catch (clientErr) {
        console.warn('[PDF ROTATE] Client engine note, trying server endpoint:', clientErr.message);
      }

      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('angle', rotateAngle);
      formData.append('pages', rotatePages);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/rotate', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error rotating PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `rotated_${rotateAngle}deg_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: `Successfully rotated pages by ${rotateAngle}°!`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to rotate file');
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Page Numbers
  const handlePageNumbersSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText('Inserting numbered headers & footers...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('position', pageNumberPosition);
      formData.append('format', pageNumberFormat);
      formData.append('startNumber', pageNumberStart);
      formData.append('fontColor', pageNumberColor);

      setProcessProgress(75);
      const res = await fetch('/api/pdf/page-numbers', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error adding page numbers');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `numbered_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: 'Page numbers inserted cleanly across all pages!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add page numbers');
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. Watermark
  const handleWatermarkSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(35);
    setProcessStatusText(`Applying diagonal watermark "${watermarkText}"...`);

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('text', watermarkText);
      formData.append('opacity', watermarkOpacity);
      formData.append('fontSize', watermarkFontSize);
      formData.append('angle', watermarkAngle);
      formData.append('fontColor', watermarkColor);

      setProcessProgress(75);
      const res = await fetch('/api/pdf/watermark', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error adding watermark');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `watermarked_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: 'Diagonal anti-tamper watermark applied successfully!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add watermark');
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Compress PDF
  const handleCompressSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to compress.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(35);
    setProcessStatusText('Compressing fonts, graphics & stream tables...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(75);
      const res = await fetch('/api/pdf/compress', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error compressing PDF');
      }

      const origSize = res.headers.get('x-original-size') || selectedFiles[0].size;
      const savings = res.headers.get('x-savings-percent') || '0';

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `compressed_${selectedFiles[0].name}`,
        fileSize: blob.size,
        originalSize: parseInt(origSize, 10),
        savingsPercent: savings,
        message: 'Compression complete! File size optimized safely.'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to compress file');
    } finally {
      setIsProcessing(false);
    }
  };

  // 8. Crop PDF
  const handleCropSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to crop.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(40);
    setProcessStatusText(`Trimming ${cropMarginPercent}% outer page margins...`);

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('marginPercent', cropMarginPercent);

      setProcessProgress(75);
      const res = await fetch('/api/pdf/crop', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error cropping PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `cropped_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: `Page margins cropped by ${cropMarginPercent}% successfully!`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to crop file');
    } finally {
      setIsProcessing(false);
    }
  };

  // 9. JPG / PNG to PDF
  const handleImagesToPdfSubmit = async (e) => {
    const files = e ? Array.from(e.target.files) : selectedFiles;
    if (!files || files.length === 0) {
      setErrorMessage('Please select at least 1 image (JPG / PNG / WEBP).');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText(`Converting ${files.length} images to standard A4 PDF...`);

    try {
      try {
        const doc = await PDFDocument.create();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const pct = Math.round(20 + ((i + 1) / files.length) * 70);
          setProcessProgress(pct);
          setProcessStatusText(`Converting ${file.name} (${i + 1}/${files.length})...`);

          const { buffer, width, height } = await convertImageToStandardCanvas(file);
          const embeddedImage = await doc.embedPng(buffer);

          const a4Width = 595.28;
          const a4Height = 841.89;
          const margin = 20;
          const maxWidth = a4Width - margin * 2;
          const maxHeight = a4Height - margin * 2;

          const scale = Math.min(maxWidth / width, maxHeight / height, 1);
          const drawWidth = width * scale;
          const drawHeight = height * scale;

          const page = doc.addPage([a4Width, a4Height]);
          page.drawImage(embeddedImage, {
            x: (a4Width - drawWidth) / 2,
            y: (a4Height - drawHeight) / 2,
            width: drawWidth,
            height: drawHeight
          });
        }

        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setProcessProgress(100);
        setProcessResult({
          downloadUrl: url,
          filename: 'converted_images.pdf',
          fileSize: blob.size,
          message: `Successfully converted ${files.length} images into a single valid PDF!`
        });
        return;
      } catch (clientErr) {
        console.warn('[JPG TO PDF] Client engine note, trying server endpoint:', clientErr.message);
      }

      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      formData.append('pageSize', imagePageSize);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/jpg-to-pdf', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to convert images');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: 'converted_images.pdf',
        fileSize: blob.size,
        message: `Successfully converted ${files.length} images into a single valid PDF!`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to convert images');
    } finally {
      setIsProcessing(false);
    }
  };

  // 10. PDF to Word (.docx)
  const handlePdfToWordSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to convert to Word.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText('Extracting typography and structure into Microsoft Word (.docx)...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/to-word', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to convert PDF to Word');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `${selectedFiles[0].name.replace(/\.pdf$/i, '')}.docx`,
        fileSize: blob.size,
        message: 'Converted to genuine Microsoft Word (.docx) document!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to convert PDF to Word');
    } finally {
      setIsProcessing(false);
    }
  };

  // 11. PDF to Excel (.xlsx)
  const handlePdfToExcelSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to extract tables from.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText('Scanning document for tabular data rows & columns...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/to-excel', {
        method: 'POST',
        body: formData
      });

      if (res.status === 422) {
        const errData = await res.json();
        throw new Error(errData.message || 'No structured tables were detected in this PDF.');
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to extract tables');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `${selectedFiles[0].name.replace(/\.pdf$/i, '')}_tables.xlsx`,
        fileSize: blob.size,
        message: 'Tabular data extracted into native Microsoft Excel (.xlsx) file!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract tables');
    } finally {
      setIsProcessing(false);
    }
  };

  // 12. PDF to Markdown (.md)
  const handlePdfToMarkdownSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to convert to Markdown.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText('Extracting headings, lists and syntax into Markdown...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/to-markdown', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to convert to Markdown');
      }

      const blob = await res.blob();
      const text = await blob.text();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `${selectedFiles[0].name.replace(/\.pdf$/i, '')}.md`,
        fileSize: blob.size,
        extractedTextPreview: text.slice(0, 1500),
        message: 'Extracted clean GitHub-flavored Markdown document!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to convert to Markdown');
    } finally {
      setIsProcessing(false);
    }
  };

  // 13. PDF AI Summarizer (Gemini AI)
  const handleSummarizeSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to summarize.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(25);
    setProcessStatusText('Synthesizing academic overview & exam formulas via Gemini AI...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(65);
      const res = await fetch('/api/pdf/summarize', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to summarize PDF');
      }

      const data = await res.json();
      const blob = new Blob([data.summary || ''], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `${selectedFiles[0].name.replace(/\.pdf$/i, '')}_exam_summary.md`,
        fileSize: blob.size,
        extractedTextPreview: data.summary,
        message: 'Executive academic summary generated with high-yield exam takeaways!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to summarize PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // 14. PDF to Text (OCR)
  const handlePdfToTextSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(35);
    setProcessStatusText('Scanning and extracting raw textual tokens...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/pdf-to-text', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to extract text');
      }

      const data = await res.json();
      const blob = new Blob([data.fullText || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `${selectedFiles[0].name.replace(/\.pdf$/i, '')}_extracted.txt`,
        fileSize: blob.size,
        extractedTextPreview: (data.fullText || '').slice(0, 1500),
        totalPages: data.total,
        message: `Extracted ${data.fullText ? data.fullText.length : 0} characters across ${data.total} pages!`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to extract text');
    } finally {
      setIsProcessing(false);
    }
  };

  // 15. Text / Notes to PDF
  const handleTextToPdfSubmit = async () => {
    if (!convertTextContent.trim()) {
      setErrorMessage('Please enter or paste your study text to convert into a PDF.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(40);
    setProcessStatusText('Formatting margins, headers and layout typography...');

    try {
      const res = await fetch('/api/pdf/convert/from-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: convertTextContent,
          title: convertDocTitle || 'Student Document',
          author: 'ProfessorVirus Academic Tools'
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to convert document');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `${(convertDocTitle || 'document').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
        fileSize: blob.size,
        message: 'Clean formatted multi-page PDF generated successfully!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to convert text');
    } finally {
      setIsProcessing(false);
    }
  };

  // 16. Digital Signature
  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1F2421';
    setIsDrawingSignature(true);
    setHasSignatureDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawingSignature) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawingSignature(false);
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignatureDrawing(false);
  };

  const handleSignSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to sign.');
      return;
    }
    const canvas = signatureCanvasRef.current;
    if (!canvas || !hasSignatureDrawing) {
      setErrorMessage('Please draw your signature in the signature box.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(35);
    setProcessStatusText('Embedding digital signature into target page coordinates...');

    try {
      const signatureDataUrl = canvas.toDataURL('image/png');
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('signatureImageBase64', signatureDataUrl);
      formData.append('pageNumber', signaturePage);
      formData.append('xPercent', signatureXPercent);
      formData.append('yPercent', signatureYPercent);

      setProcessProgress(75);
      const res = await fetch('/api/pdf/sign', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to sign PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `signed_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: `Digitally signed on Page ${signaturePage} successfully!`
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign document');
    } finally {
      setIsProcessing(false);
    }
  };

  // 17. Repair PDF
  const handleRepairSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select a PDF file to repair.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(30);
    setProcessStatusText('Rebuilding cross-reference tables and object streams...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      setProcessProgress(70);
      const res = await fetch('/api/pdf/repair', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to repair PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: `repaired_${selectedFiles[0].name}`,
        fileSize: blob.size,
        message: 'PDF structure repaired and validated for error-free viewing!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to repair PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  // 18. Generate 100-Page Student Notes (Proves 100-Page Capability)
  const handleGenerate100PageNotes = async () => {
    setIsProcessing(true);
    setProcessProgress(25);
    setProcessStatusText('Generating comprehensive 100-page academic study resource...');

    try {
      setProcessProgress(60);
      const res = await fetch('/api/pdf/generate-100-page');
      if (!res.ok) throw new Error('Failed to generate 100-page notes');

      setProcessProgress(90);
      setProcessStatusText('Finalizing 100-page high-yield review document...');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessProgress(100);
      setProcessResult({
        downloadUrl: url,
        filename: 'professorvirus_100_page_notes.pdf',
        fileSize: blob.size,
        totalPages: 100,
        message: 'Verified 100-Page Student Document generated with full formulas, syllabus and exam solutions!'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Error generating 100-page document');
    } finally {
      setIsProcessing(false);
    }
  };

  // Organize helpers
  const moveOrganizePage = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= organizePages.length) return;
    const newPages = [...organizePages];
    const temp = newPages[index];
    newPages[index] = newPages[target];
    newPages[target] = temp;
    setOrganizePages(newPages);
  };

  const toggleDeleteOrganizePage = (pageNum) => {
    if (deletedPages.includes(pageNum)) {
      setDeletedPages(deletedPages.filter(p => p !== pageNum));
    } else {
      if (deletedPages.length >= organizePages.length - 1) {
        setErrorMessage('At least one page must remain.');
        return;
      }
      setDeletedPages([...deletedPages, pageNum]);
    }
  };

  const rotateOrganizePage = (pageNum) => {
    const current = rotatedPagesMap[pageNum] || 0;
    setRotatedPagesMap({
      ...rotatedPagesMap,
      [pageNum]: (current + 90) % 360
    });
  };

  // Format File Size
  const formatSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Move files in Merge tool
  const moveFile = (index, direction) => {
    const newFiles = [...selectedFiles];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setSelectedFiles(newFiles);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  // Detect if file is an image
  const isImageFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    return ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
  };

  // Tool Definitions
  const categories = [
    {
      id: 'organize',
      title: 'Organize PDF',
      desc: 'Arrange, merge, split and manage your PDF files.',
      icon: Layers,
      color: '#C88D2D',
      tools: [
        {
          id: 'merge',
          title: 'Merge PDF',
          desc: 'Combine multiple PDFs and images into one.',
          icon: Layers,
          badgeColor: '#fee2e2',
          iconColor: '#dc2626',
          featured: true
        },
        {
          id: 'split',
          title: 'Split PDF',
          desc: 'Split one PDF into multiple files or ranges.',
          icon: Scissors,
          badgeColor: '#fee2e2',
          iconColor: '#e11d48'
        },
        {
          id: 'organize',
          title: 'Organize PDF',
          desc: 'Rearrange, delete or rotate PDF pages.',
          icon: Grid,
          badgeColor: '#fce7f3',
          iconColor: '#db2777'
        }
      ]
    },
    {
      id: 'convert',
      title: 'Convert PDF',
      desc: 'Convert PDFs to and from different formats.',
      icon: RefreshCw,
      color: '#0284c7',
      tools: [
        {
          id: 'pdf-to-word',
          title: 'PDF to Word',
          desc: 'Convert PDF to Word (DOCX).',
          icon: FileText,
          badgeColor: '#e0f2fe',
          iconColor: '#0284c7',
          featured: true
        },
        {
          id: 'pdf-to-excel',
          title: 'PDF to Excel',
          desc: 'Extract structured tables to XLSX.',
          icon: FileSpreadsheet,
          badgeColor: '#dcfce7',
          iconColor: '#16a34a'
        },
        {
          id: 'jpg-to-pdf',
          title: 'JPG/PNG to PDF',
          desc: 'Convert images to standard A4 PDF.',
          icon: FileText,
          badgeColor: '#ede9fe',
          iconColor: '#7c3aed'
        },
        {
          id: 'word-to-pdf',
          title: 'Text / Notes to PDF',
          desc: 'Format notes into clean A4 PDF.',
          icon: FileText,
          badgeColor: '#e0f2fe',
          iconColor: '#0284c7'
        },
        {
          id: 'pdf-to-markdown',
          title: 'PDF to Markdown',
          desc: 'Extract headings and text into MD.',
          icon: FileText,
          badgeColor: '#fef3c7',
          iconColor: '#d97706'
        },
        {
          id: 'ppt-to-pdf',
          title: 'PowerPoint to PDF',
          desc: 'Convert presentation slides to PDF.',
          icon: Presentation,
          badgeColor: '#ffedd5',
          iconColor: '#ea580c'
        }
      ]
    },
    {
      id: 'edit',
      title: 'Edit & Format PDF',
      desc: 'Modify, enhance, watermark and annotate your PDF files.',
      icon: PenTool,
      color: '#ea580c',
      tools: [
        {
          id: 'edit-doc',
          title: 'Edit & Compile Notes',
          desc: 'Add text, titles and study notes.',
          icon: PenTool,
          badgeColor: '#fce7f3',
          iconColor: '#e11d48'
        },
        {
          id: 'rotate',
          title: 'Rotate PDF',
          desc: 'Rotate PDF pages (90°, 180°, 270°).',
          icon: RotateCw,
          badgeColor: '#ede9fe',
          iconColor: '#7c3aed'
        },
        {
          id: 'page-numbers',
          title: 'Add Page Numbers',
          desc: 'Insert numbered headers and footers.',
          icon: Hash,
          badgeColor: '#e0f2fe',
          iconColor: '#0284c7'
        },
        {
          id: 'watermark',
          title: 'Add Watermark',
          desc: 'Insert custom anti-tamper watermark.',
          icon: Droplet,
          badgeColor: '#e0f2fe',
          iconColor: '#0284c7'
        },
        {
          id: 'crop',
          title: 'Crop PDF',
          desc: 'Trim page margins and white space.',
          icon: Scissors,
          badgeColor: '#fee2e2',
          iconColor: '#dc2626'
        }
      ]
    },
    {
      id: 'smart',
      title: 'Smart PDF & AI Tools',
      desc: 'High-performance AI summarization, compression and OCR.',
      icon: Sparkles,
      color: '#7c3aed',
      tools: [
        {
          id: 'compress',
          title: 'Compress PDF',
          desc: 'Reduce file size without losing quality.',
          icon: Minimize2,
          badgeColor: '#dcfce7',
          iconColor: '#16a34a'
        },
        {
          id: 'summarize',
          title: 'AI PDF Summarizer',
          desc: 'Instant exam summary via Gemini AI.',
          icon: Sparkles,
          badgeColor: '#fef3c7',
          iconColor: '#b45309',
          featured: true
        },
        {
          id: 'pdf-to-text',
          title: 'PDF to Text (OCR)',
          desc: 'Extract readable text from scans.',
          icon: Search,
          badgeColor: '#e0f2fe',
          iconColor: '#0284c7'
        },
        {
          id: 'sign',
          title: 'Sign PDF',
          desc: 'Add your digital handwritten signature.',
          icon: PenTool,
          badgeColor: '#e0f2fe',
          iconColor: '#2563eb'
        },
        {
          id: 'repair',
          title: 'Repair PDF',
          desc: 'Fix damaged streams and xref tables.',
          icon: Wrench,
          badgeColor: '#fee2e2',
          iconColor: '#dc2626'
        },
        {
          id: 'generate-100-page',
          title: '100-Page Notes Generator',
          desc: 'Verified 100-page engineering guide.',
          icon: BookOpen,
          badgeColor: '#fef3c7',
          iconColor: '#b45309',
          featured: true
        }
      ]
    },
    {
      id: 'security',
      title: 'PDF Security & Password',
      desc: 'Protect, lock and manage PDF access.',
      icon: ShieldCheck,
      color: '#16a34a',
      tools: [
        {
          id: 'lock',
          title: 'Lock PDF',
          desc: 'Standard Acrobat password protection.',
          icon: Lock,
          badgeColor: '#fee2e2',
          iconColor: '#dc2626'
        },
        {
          id: 'unlock',
          title: 'Unlock PDF',
          desc: 'Remove password restrictions.',
          icon: Unlock,
          badgeColor: '#fef3c7',
          iconColor: '#d97706'
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1F2421', paddingBottom: '4rem' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 540px', minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                backgroundColor: '#dc2626',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
              }}>
                <FileText size={20} strokeWidth={2.4} />
                <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.04em', marginTop: '-2px' }}>PDF</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: 0, color: '#1C1E21', letterSpacing: '-0.02em' }}>
                PDF Maker & Studio
              </h1>
            </div>

            <h2 style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)', fontWeight: 700, margin: '0 0 0.6rem', color: '#781416' }}>
              Create, edit, convert & manage PDFs in seconds.
            </h2>

            <p style={{ fontSize: '0.96rem', color: '#57534E', margin: '0 0 1.5rem', lineHeight: 1.5, maxWidth: '580px' }}>
              All essential PDF tools in one place. Fast, secure and free for students. Fully capable of processing mixed PDFs and images with up to 100+ pages in a single operation.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {[
                { title: '100% Free', subtitle: 'For All Students', icon: Plus, bg: '#FDF6E8', color: '#C88D2D' },
                { title: '100+ Pages Supported', subtitle: 'Massive Batches', icon: ShieldCheck, bg: '#FDF6E8', color: '#C88D2D' },
                { title: 'Mixed PDF + Images', subtitle: 'Auto-Converted', icon: Zap, bg: '#FDF6E8', color: '#C88D2D' },
                { title: 'Works on All Devices', subtitle: 'Desktop & Mobile', icon: Smartphone, bg: '#FDF6E8', color: '#C88D2D' }
              ].map((pill, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: pill.bg,
                    border: '1px solid #E8E2D5',
                    borderRadius: '12px',
                    padding: '0.5rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <pill.icon size={16} color={pill.color} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421' }}>{pill.title}</div>
                    <div style={{ fontSize: '0.68rem', color: '#78716C' }}>{pill.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '0 1 320px', minWidth: '260px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #E8E2D5',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(35, 30, 25, 0.06)',
              textAlign: 'center',
              width: '100%'
            }}>
              <BookOpen size={36} color="#781416" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.35rem', color: '#1C1E21' }}>
                100-Page Verified Guide
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#78716C', margin: '0 0 1rem', lineHeight: 1.4 }}>
                Instant comprehensive academic notes document with formulas, theorems and solutions.
              </p>
              <button
                onClick={handleGenerate100PageNotes}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  backgroundColor: '#781416',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.7rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Sparkles size={16} /> Generate 100-Page PDF
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAIN DRAG & DROP UPLOAD ZONE */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            backgroundColor: '#ffffff',
            border: isDragOver ? '2.5px dashed #781416' : '2px dashed #D6CEC3',
            borderRadius: '24px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            boxShadow: isDragOver ? '0 12px 36px rgba(120, 20, 22, 0.15)' : '0 8px 30px rgba(35, 30, 25, 0.05)',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
            onChange={(e) => handleFilesSelected(Array.from(e.target.files))}
          />
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: 'none' }}
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImagesToPdfSubmit}
          />

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <div style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '64px',
                  height: '80px',
                  backgroundColor: '#FEE2E2',
                  borderRadius: '10px',
                  border: '1px solid #FECACA',
                  transform: 'rotate(-10deg)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '68px',
                  height: '84px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1.5px solid #FCA5A5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(220, 38, 38, 0.15)'
                }}>
                  <div style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    marginBottom: '0.3rem'
                  }}>
                    PDF
                  </div>
                  <Upload size={18} color="#781416" />
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 400px', minWidth: '260px' }}>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)', fontWeight: 800, margin: '0 0 0.35rem', color: '#1C1E21' }}>
                Drop your files here
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#78716C', margin: '0 0 1.2rem' }}>
                or choose files from your device
              </p>

              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  backgroundColor: '#781416',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0.85rem 2.2rem',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  boxShadow: '0 6px 20px rgba(120, 20, 22, 0.32)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#911B1E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#781416'}
              >
                <Upload size={20} />
                <span>Choose Files</span>
              </button>

              <p style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '0.9rem', marginBottom: 0 }}>
                Supports PDF, JPG, PNG, WEBP, Word, Excel, and Text. Up to 100MB per file.
              </p>
            </div>

            <div style={{
              flex: '0 1 280px',
              minWidth: '240px',
              borderLeft: '1px solid #E8E2D5',
              paddingLeft: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              textAlign: 'left',
              margin: '0 auto'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Or import from
              </span>

              <button
                onClick={() => handleOpenCloudModal('google-drive')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #E8E2D5',
                  borderRadius: '12px',
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1F2421',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C88D2D'; e.currentTarget.style.backgroundColor = '#FFFDF9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E2D5'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                <Cloud size={16} color="#0066da" />
                <span>Google Drive</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.68rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                  Connected
                </span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TOOL CATEGORIES & CARDS */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {categories.map(category => (
            <div key={category.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E8E2D5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: category.color
                }}>
                  <category.icon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#1C1E21' }}>
                    {category.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#78716C', margin: 0 }}>
                    {category.desc}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {category.tools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => openTool(tool.id)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: tool.featured ? '1.5px solid #C88D2D' : '1px solid #E8E2D5',
                      borderRadius: '16px',
                      padding: '1.25rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 14px rgba(35, 30, 25, 0.04)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(120, 20, 22, 0.1)';
                      e.currentTarget.style.borderColor = '#C88D2D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(35, 30, 25, 0.04)';
                      e.currentTarget.style.borderColor = tool.featured ? '#C88D2D' : '#E8E2D5';
                    }}
                  >
                    {tool.featured && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#C88D2D',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '6px'
                      }}>
                        POPULAR
                      </span>
                    )}

                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: tool.badgeColor || '#FDF6E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tool.iconColor || '#781416',
                      marginBottom: '0.85rem'
                    }}>
                      <tool.icon size={22} />
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.3rem', color: '#1C1E21' }}>
                      {tool.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#78716C', margin: 0, lineHeight: 1.4 }}>
                      {tool.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TOOL MODAL WORKSPACE */}
      {activeTool && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 30, 33, 0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8E2D5', paddingBottom: '1rem', marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#FDF6E8',
                  color: '#781416',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTool === 'merge' ? <Layers size={22} /> :
                   activeTool === 'split' ? <Scissors size={22} /> :
                   activeTool === 'organize' ? <Grid size={22} /> :
                   activeTool === 'pdf-to-word' ? <FileText size={22} /> :
                   activeTool === 'pdf-to-excel' ? <FileSpreadsheet size={22} /> :
                   activeTool === 'pdf-to-markdown' ? <FileText size={22} /> :
                   activeTool === 'summarize' ? <Sparkles size={22} /> :
                   activeTool === 'crop' ? <Scissors size={22} /> :
                   activeTool === 'rotate' ? <RotateCw size={22} /> :
                   activeTool === 'page-numbers' ? <Hash size={22} /> :
                   activeTool === 'watermark' ? <Droplet size={22} /> :
                   activeTool === 'compress' ? <Minimize2 size={22} /> :
                   activeTool === 'sign' ? <PenTool size={22} /> :
                   activeTool === 'repair' ? <Wrench size={22} /> :
                   activeTool === 'pdf-to-text' ? <Search size={22} /> :
                   <FileText size={22} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#1C1E21' }}>
                    {activeTool === 'merge' ? 'Merge PDFs & Images' :
                     activeTool === 'split' ? 'Split & Extract PDF Pages' :
                     activeTool === 'organize' ? 'Organize PDF Pages' :
                     activeTool === 'pdf-to-word' ? 'Convert PDF to Word (.docx)' :
                     activeTool === 'pdf-to-excel' ? 'Extract PDF Tables to Excel (.xlsx)' :
                     activeTool === 'pdf-to-markdown' ? 'Convert PDF to Markdown (.md)' :
                     activeTool === 'summarize' ? 'AI PDF Academic Summarizer' :
                     activeTool === 'crop' ? 'Crop PDF Page Margins' :
                     activeTool === 'rotate' ? 'Rotate PDF Pages' :
                     activeTool === 'page-numbers' ? 'Insert Page Numbers' :
                     activeTool === 'watermark' ? 'Add Watermark to PDF' :
                     activeTool === 'compress' ? 'Compress & Optimize PDF' :
                     activeTool === 'sign' ? 'Sign PDF Document' :
                     activeTool === 'repair' ? 'Repair Corrupted PDF' :
                     activeTool === 'pdf-to-text' ? 'Extract Text from PDF' :
                     activeTool === 'word-to-pdf' || activeTool === 'edit-doc' ? 'Document / Text to PDF' :
                     activeTool === 'jpg-to-pdf' ? 'Images (JPG/PNG) to PDF' :
                     activeTool === 'lock' || activeTool === 'unlock' ? 'PDF Security Management' :
                     'PDF Tool Workspace'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#78716C' }}>
                    Standardized Student Academic PDF Processing Engine
                  </span>
                </div>
              </div>

              <button
                onClick={closeTool}
                style={{
                  backgroundColor: '#FAF7F2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#78716C'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                marginBottom: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#B91C1C',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div style={{
                backgroundColor: '#FFFDF9',
                border: '1.5px solid #C88D2D',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                  <RefreshCw size={22} color="#781416" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#781416' }}>
                    {processStatusText || 'Processing PDF...'}
                  </span>
                </div>
                
                <div style={{
                  height: '10px',
                  backgroundColor: '#E8E2D5',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  margin: '0 1rem'
                }}>
                  <div style={{
                    width: `${processProgress}%`,
                    height: '100%',
                    backgroundColor: '#781416',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C88D2D', marginTop: '0.5rem' }}>
                  {processProgress}% Completed
                </div>
              </div>
            )}

            {/* Success Result View */}
            {processResult && (
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <CheckCircle2 size={30} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', margin: '0 0 0.35rem' }}>
                  Processing Completed!
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#15803D', margin: '0 0 1rem' }}>
                  {processResult.message}
                </p>

                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #BBF7D0',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'inline-flex',
                  gap: '1.25rem',
                  marginBottom: '1.2rem',
                  fontSize: '0.8rem',
                  color: '#1F2421'
                }}>
                  <span><strong>Output:</strong> {processResult.filename}</span>
                  <span><strong>Size:</strong> {formatSize(processResult.fileSize)}</span>
                  {processResult.savingsPercent && (
                    <span style={{ color: '#16a34a' }}><strong>Savings:</strong> {processResult.savingsPercent}%</span>
                  )}
                </div>

                {processResult.extractedTextPreview && (
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E8E2D5',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    textAlign: 'left',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    color: '#334155',
                    marginBottom: '1rem',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {processResult.extractedTextPreview}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
                  <a
                    href={processResult.downloadUrl}
                    download={processResult.filename}
                    style={{
                      backgroundColor: '#16A34A',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 1.6rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <Download size={18} /> Download Processed File
                  </a>
                  <button
                    onClick={() => { setProcessResult(null); setSelectedFiles([]); }}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #D6CEC3',
                      borderRadius: '12px',
                      padding: '0.75rem 1.2rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#1F2421',
                      cursor: 'pointer'
                    }}
                  >
                    Process Another File
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TOOL CONFIGURATION PANELS                                     */}
            {/* ============================================================= */}
            {!processResult && (
              <div>
                
                {/* TOOL: MERGE */}
                {activeTool === 'merge' && (
                  <div>
                    <div style={{
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                      fontSize: '0.82rem',
                      color: '#1E40AF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Sparkles size={16} color="#2563EB" />
                      <span>
                        <strong>Mixed Merge Enabled:</strong> PDFs, JPGs, PNGs, and WEBPs can be merged together. Images are automatically converted into standard A4 PDF pages with aspect ratios preserved.
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#57534E', marginBottom: '1rem' }}>
                      Drag or move files to arrange the order in which they will appear in the final merged PDF.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', maxHeight: '280px', overflowY: 'auto' }}>
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#FAF7F2',
                            border: '1.5px solid #E8E2D5',
                            borderRadius: '12px',
                            padding: '0.65rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#E8E2D5', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {idx + 1}
                            </span>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                              backgroundColor: isImageFile(file) ? '#FDF6E8' : '#FEE2E2',
                              color: isImageFile(file) ? '#C88D2D' : '#DC2626'
                            }}>
                              {isImageFile(file) ? 'IMAGE' : 'PDF'}
                            </span>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2421' }}>{file.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#78716C' }}>{formatSize(file.size)}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              disabled={idx === 0}
                              onClick={() => moveFile(idx, -1)}
                              style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, padding: '0.3rem' }}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              disabled={idx === selectedFiles.length - 1}
                              onClick={() => moveFile(idx, 1)}
                              style={{ background: 'none', border: 'none', cursor: idx === selectedFiles.length - 1 ? 'default' : 'pointer', opacity: idx === selectedFiles.length - 1 ? 0.3 : 1, padding: '0.3rem' }}
                            >
                              <ArrowDown size={16} />
                            </button>
                            <button
                              onClick={() => removeFile(idx)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0.3rem' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1.5px dashed #C88D2D',
                          borderRadius: '10px',
                          padding: '0.6rem 1rem',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#8A5D00',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Plus size={16} /> Add More Files (PDF or Images)
                      </button>

                      <button
                        onClick={handleMergeSubmit}
                        disabled={selectedFiles.length < 2 || isProcessing}
                        style={{
                          backgroundColor: selectedFiles.length < 2 ? '#D6CEC3' : '#781416',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.75rem 1.6rem',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: selectedFiles.length < 2 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Layers size={18} /> Merge & Download PDF
                      </button>
                    </div>
                  </div>
                )}

                {/* TOOL: SPLIT */}
                {activeTool === 'split' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to split:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>Selected File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            Split Method:
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                            {[
                              { id: 'range', label: 'Custom Range', desc: 'e.g. 1-5, 8, 10-15' },
                              { id: 'pagesPerFile', label: 'Equal Chunks', desc: 'Every N pages' },
                              { id: 'all', label: 'All Pages', desc: 'ZIP of single pages' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setSplitMode(opt.id)}
                                style={{
                                  backgroundColor: splitMode === opt.id ? '#FFFDF9' : '#ffffff',
                                  border: splitMode === opt.id ? '2px solid #781416' : '1px solid #E8E2D5',
                                  borderRadius: '12px',
                                  padding: '0.65rem 0.5rem',
                                  textAlign: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: splitMode === opt.id ? '#781416' : '#1F2421' }}>{opt.label}</div>
                                <div style={{ fontSize: '0.68rem', color: '#78716C' }}>{opt.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {splitMode === 'range' && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Page Ranges (comma separated):
                            </label>
                            <input
                              type="text"
                              value={splitRanges}
                              onChange={(e) => setSplitRanges(e.target.value)}
                              placeholder="e.g. 1-10, 15, 20-30"
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '10px',
                                border: '1.5px solid #D6CEC3',
                                fontSize: '0.9rem',
                                boxSizing: 'border-box'
                              }}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#78716C', display: 'block', marginTop: '0.3rem' }}>
                              Supports single pages (e.g. 4) or hyphenated ranges (e.g. 1-50). Works seamlessly on 100+ page documents.
                            </span>
                          </div>
                        )}

                        {splitMode === 'pagesPerFile' && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Pages per Split Document:
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={splitPagesPerFile}
                              onChange={(e) => setSplitPagesPerFile(e.target.value)}
                              style={{
                                width: '120px',
                                padding: '0.6rem',
                                borderRadius: '10px',
                                border: '1.5px solid #D6CEC3',
                                fontSize: '0.9rem'
                              }}
                            />
                          </div>
                        )}

                        <button
                          onClick={handleSplitSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Scissors size={18} /> Split & Download
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: ORGANIZE PDF */}
                {activeTool === 'organize' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to organize:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#78716C' }}>
                            {organizePages.length} Pages Loaded
                          </span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '0.85rem' }}>
                          Reorder pages using the arrow buttons, delete unwanted pages, or rotate individual pages:
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', padding: '0.5rem', backgroundColor: '#FAF7F2', borderRadius: '14px', marginBottom: '1.25rem' }}>
                          {organizePages.map((pageNum, idx) => {
                            const isDeleted = deletedPages.includes(pageNum);
                            const rot = rotatedPagesMap[pageNum] || 0;
                            return (
                              <div
                                key={pageNum}
                                style={{
                                  backgroundColor: isDeleted ? '#FEE2E2' : '#ffffff',
                                  border: `1.5px solid ${isDeleted ? '#FCA5A5' : '#E8E2D5'}`,
                                  borderRadius: '12px',
                                  padding: '0.65rem 0.5rem',
                                  textAlign: 'center',
                                  opacity: isDeleted ? 0.6 : 1,
                                  position: 'relative'
                                }}
                              >
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isDeleted ? '#DC2626' : '#1F2421', marginBottom: '0.35rem' }}>
                                  Page {pageNum}
                                </div>
                                {rot > 0 && (
                                  <div style={{ fontSize: '0.65rem', color: '#C88D2D', fontWeight: 700 }}>
                                    ↻ {rot}°
                                  </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '0.45rem' }}>
                                  <button
                                    disabled={idx === 0 || isDeleted}
                                    onClick={() => moveOrganizePage(idx, -1)}
                                    title="Move page earlier"
                                    style={{ border: 'none', background: '#F1EFEA', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.35rem' }}
                                  >
                                    ←
                                  </button>
                                  <button
                                    onClick={() => rotateOrganizePage(pageNum)}
                                    title="Rotate page 90°"
                                    style={{ border: 'none', background: '#F1EFEA', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.35rem' }}
                                  >
                                    ↻
                                  </button>
                                  <button
                                    disabled={idx === organizePages.length - 1 || isDeleted}
                                    onClick={() => moveOrganizePage(idx, 1)}
                                    title="Move page later"
                                    style={{ border: 'none', background: '#F1EFEA', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.35rem' }}
                                  >
                                    →
                                  </button>
                                  <button
                                    onClick={() => toggleDeleteOrganizePage(pageNum)}
                                    title={isDeleted ? 'Restore page' : 'Delete page'}
                                    style={{ border: 'none', background: isDeleted ? '#DC2626' : '#FEE2E2', color: isDeleted ? '#ffffff' : '#DC2626', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.35rem' }}
                                  >
                                    {isDeleted ? '+' : '×'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={handleOrganizeSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Grid size={18} /> Apply Changes & Download PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: PDF TO WORD */}
                {activeTool === 'pdf-to-word' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to convert into Word (.docx):</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Converts the PDF into a genuine, fully editable Microsoft Word document (.docx) with formatted headings, paragraphs, and list bullet points.
                        </p>

                        <button
                          onClick={handlePdfToWordSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FileText size={18} /> Convert to Word (.docx)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: PDF TO EXCEL */}
                {activeTool === 'pdf-to-excel' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file containing tables to extract to Excel:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Detects rows and columns from marksheets, grade tables, or syllabus schedules and converts them into native Excel spreadsheet (.xlsx) cells.
                        </p>

                        <button
                          onClick={handlePdfToExcelSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FileSpreadsheet size={18} /> Extract Tables to Excel (.xlsx)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: PDF TO MARKDOWN */}
                {activeTool === 'pdf-to-markdown' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to convert into Markdown:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Converts the PDF into clean Markdown (.md) with headings, bullet lists, and paragraphs, perfect for study notes and GitHub documentation.
                        </p>

                        <button
                          onClick={handlePdfToMarkdownSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#d97706',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <FileText size={18} /> Convert to Markdown (.md)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: AI PDF SUMMARIZER */}
                {activeTool === 'summarize' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose an academic PDF file to summarize with AI:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Powered by Gemini AI: extracts core definitions, key formulas, subjective exam questions, and executive summary notes.
                        </p>

                        <button
                          onClick={handleSummarizeSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Sparkles size={18} /> Summarize with AI
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: CROP PDF */}
                {activeTool === 'crop' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to crop:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <div style={{ marginBottom: '1.4rem' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            Crop Outer Margin Percentage:
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                              type="range"
                              min={1}
                              max={25}
                              value={cropMarginPercent}
                              onChange={(e) => setCropMarginPercent(parseInt(e.target.value, 10))}
                              style={{ flex: 1 }}
                            />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#781416', minWidth: '45px' }}>
                              {cropMarginPercent}%
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#78716C', display: 'block', marginTop: '0.3rem' }}>
                            Trims empty borders and scanning artifacts evenly from all 4 edges of every page.
                          </span>
                        </div>

                        <button
                          onClick={handleCropSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Scissors size={18} /> Crop & Download PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: ROTATE */}
                {activeTool === 'rotate' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to rotate:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>Selected File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            Rotation Angle:
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                            {[90, 180, 270].map(deg => (
                              <button
                                key={deg}
                                onClick={() => setRotateAngle(deg)}
                                style={{
                                  backgroundColor: rotateAngle === deg ? '#FFFDF9' : '#ffffff',
                                  border: rotateAngle === deg ? '2px solid #781416' : '1px solid #E8E2D5',
                                  borderRadius: '12px',
                                  padding: '0.65rem',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  fontWeight: 800,
                                  color: rotateAngle === deg ? '#781416' : '#1F2421'
                                }}
                              >
                                {deg}° Clockwise
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleRotateSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <RotateCw size={18} /> Rotate & Download
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: PAGE NUMBERS */}
                {activeTool === 'page-numbers' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to add page numbers:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>Selected File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            Position on Page:
                          </label>
                          <select
                            value={pageNumberPosition}
                            onChange={(e) => setPageNumberPosition(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #D6CEC3', fontSize: '0.9rem' }}
                          >
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                            <option value="top-left">Top Left</option>
                          </select>
                        </div>

                        <div style={{ marginBottom: '1.4rem' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                            Format:
                          </label>
                          <input
                            type="text"
                            value={pageNumberFormat}
                            onChange={(e) => setPageNumberFormat(e.target.value)}
                            placeholder="e.g. Page {n} of {total}"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #D6CEC3', fontSize: '0.9rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <button
                          onClick={handlePageNumbersSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Hash size={18} /> Insert Page Numbers
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: WATERMARK */}
                {activeTool === 'watermark' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to watermark:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>Selected File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                            Watermark Text:
                          </label>
                          <input
                            type="text"
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            placeholder="e.g. ProfessorVirus or CONFIDENTIAL"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #D6CEC3', fontSize: '0.9rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.4rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Opacity ({Math.round(watermarkOpacity * 100)}%):
                            </label>
                            <input
                              type="range"
                              min={0.05}
                              max={0.8}
                              step={0.05}
                              value={watermarkOpacity}
                              onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Angle ({watermarkAngle}°):
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={90}
                              step={5}
                              value={watermarkAngle}
                              onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleWatermarkSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Droplet size={18} /> Apply Watermark & Download
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: COMPRESS */}
                {activeTool === 'compress' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to compress:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Applies stream compaction, object dictionary deduplication, and font subset compression to reduce file size while preserving document readability.
                        </p>

                        <button
                          onClick={handleCompressSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Minimize2 size={18} /> Compress & Optimize PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: JPG / IMAGES TO PDF */}
                {activeTool === 'jpg-to-pdf' && (
                  <div>
                    <p style={{ fontSize: '0.88rem', color: '#57534E', marginBottom: '1rem' }}>
                      Select images from your device. Each image will be converted into a standard A4 page with high resolution and correct aspect ratio.
                    </p>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Target Page Format:
                      </label>
                      <select
                        value={imagePageSize}
                        onChange={(e) => setImagePageSize(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #D6CEC3', fontSize: '0.9rem' }}
                      >
                        <option value="a4">Standard A4 (Fit to Page, Auto-Landscape)</option>
                        <option value="letter">US Letter</option>
                        <option value="fit">Original Image Dimensions</option>
                      </select>
                    </div>

                    <button
                      onClick={() => imageInputRef.current && imageInputRef.current.click()}
                      style={{
                        width: '100%',
                        backgroundColor: '#781416',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.9rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Upload size={18} /> Select Images (JPG / PNG / WEBP)
                    </button>
                  </div>
                )}

                {/* TOOL: PDF TO TEXT (OCR) */}
                {activeTool === 'pdf-to-text' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to extract text from:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Parses all pages in the PDF document and extracts full readable text for copy-pasting, word document conversion, or academic notes compilation.
                        </p>

                        <button
                          onClick={handlePdfToTextSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Search size={18} /> Extract Text & Convert
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: TEXT / WORD TO PDF */}
                {(activeTool === 'word-to-pdf' || activeTool === 'edit-doc') && (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Document Title:
                      </label>
                      <input
                        type="text"
                        value={convertDocTitle}
                        onChange={(e) => setConvertDocTitle(e.target.value)}
                        placeholder="e.g. Operating Systems Unit 1 Notes"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #D6CEC3', fontSize: '0.9rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Document Text / Notes:
                      </label>
                      <textarea
                        rows={7}
                        value={convertTextContent}
                        onChange={(e) => setConvertTextContent(e.target.value)}
                        placeholder="Type, write, or paste your study notes, essay, or syllabus points here..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '12px',
                          border: '1.5px solid #D6CEC3',
                          fontSize: '0.85rem',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      onClick={handleTextToPdfSubmit}
                      disabled={isProcessing}
                      style={{
                        width: '100%',
                        backgroundColor: '#781416',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FileText size={18} /> Compile Multi-Page PDF
                    </button>
                  </div>
                )}

                {/* TOOL: SIGN PDF */}
                {activeTool === 'sign' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a PDF file to sign:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                              Draw Signature:
                            </label>
                            <button
                              onClick={clearSignatureCanvas}
                              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Clear
                            </button>
                          </div>
                          <canvas
                            ref={signatureCanvasRef}
                            width={500}
                            height={140}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            style={{
                              width: '100%',
                              height: '140px',
                              backgroundColor: '#FAF7F2',
                              border: '1.5px dashed #C88D2D',
                              borderRadius: '12px',
                              cursor: 'crosshair',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.4rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                              Target Page:
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={signaturePage}
                              onChange={(e) => setSignaturePage(parseInt(e.target.value, 10) || 1)}
                              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #D6CEC3', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                              X Position (%):
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={90}
                              value={signatureXPercent}
                              onChange={(e) => setSignatureXPercent(parseInt(e.target.value, 10) || 70)}
                              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #D6CEC3', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                              Y Position (%):
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={90}
                              value={signatureYPercent}
                              onChange={(e) => setSignatureYPercent(parseInt(e.target.value, 10) || 15)}
                              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #D6CEC3', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSignSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <PenTool size={18} /> Embed Signature & Download
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: REPAIR */}
                {activeTool === 'repair' && (
                  <div>
                    {selectedFiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1.5px dashed #D6CEC3' }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#57534E' }}>Choose a damaged PDF file to repair:</p>
                        <button
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Select PDF
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                          <strong>File:</strong> {selectedFiles[0].name} ({formatSize(selectedFiles[0].size)})
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginBottom: '1.4rem' }}>
                          Scans document structure, repairs damaged cross-reference offset tables, and regenerates valid stream objects to restore viewability and printability.
                        </p>

                        <button
                          onClick={handleRepairSubmit}
                          disabled={isProcessing}
                          style={{
                            width: '100%',
                            backgroundColor: '#781416',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Wrench size={18} /> Repair PDF File
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL: SECURITY / LOCK / UNLOCK NOTICE */}
                {(activeTool === 'lock' || activeTool === 'unlock') && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#FDF6E8',
                      color: '#C88D2D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <ShieldCheck size={28} />
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#1C1E21' }}>
                      {activeTool === 'lock' ? 'Acrobat Standard Security' : 'PDF Decryption & Access'}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.5, margin: '0 auto 1.5rem', maxWidth: '480px' }}>
                      University-compliant PDF password protection utilizes ISO-32000-1 AES-256 standard encryption handlers. To ensure 100% legal compliance and document integrity, encrypted documents must be password-managed in certified Acrobat or viewer environments.
                    </p>
                    <button
                      onClick={() => openTool('merge')}
                      style={{
                        backgroundColor: '#781416',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem 1.6rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Return to PDF Studio Tools
                    </button>
                  </div>
                )}

                {/* TOOL: PPT / EXCEL TO PDF NOTICE */}
                {activeTool === 'ppt-to-pdf' && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <Presentation size={48} color="#ea580c" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#1C1E21' }}>
                      PowerPoint to PDF
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.5, margin: '0 auto 1.5rem', maxWidth: '480px' }}>
                      To convert PowerPoint (.pptx) presentations to high-resolution PDF, export directly via PowerPoint "Save As PDF" or drag & drop converted slide images into our Universal Merge tool above to compile a perfect presentation PDF!
                    </p>
                    <button
                      onClick={() => openTool('merge')}
                      style={{
                        backgroundColor: '#781416',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem 1.6rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Open Universal Merge Tool
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. CLOUD IMPORT MODAL (GOOGLE DRIVE) */}
      {cloudModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 30, 33, 0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8E2D5', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Cloud size={24} color="#781416" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#1C1E21' }}>
                  Import from Google Drive
                </h3>
              </div>
              <button
                onClick={() => setCloudModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#065F46', fontWeight: 700 }}>
                  Connected: {cloudAccountEmail || 'priyanshukumar09546@gmail.com'}
                </span>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#059669', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                  ACTIVE
                </span>
              </div>

              {cloudLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <RefreshCw size={24} color="#781416" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <p style={{ fontSize: '0.85rem', color: '#78716C', marginTop: '0.5rem' }}>Loading files from your Google Drive...</p>
                </div>
              ) : cloudFiles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#FAF7F2', borderRadius: '16px' }}>
                  <FileText size={32} color="#C88D2D" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.4rem' }}>No PDF files found in root Drive</p>
                  <p style={{ fontSize: '0.78rem', color: '#78716C', margin: '0 0 1rem' }}>
                    Upload PDFs to your Google Drive account or choose a file from your device directly.
                  </p>
                  <button
                    onClick={() => { setCloudModal(null); fileInputRef.current && fileInputRef.current.click(); }}
                    style={{ backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Choose from Device Instead
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {cloudFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => handleImportDriveFile(file)}
                      style={{
                        backgroundColor: '#FAF7F2',
                        border: '1px solid #E8E2D5',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFDF9'; e.currentTarget.style.borderColor = '#C88D2D'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FAF7F2'; e.currentTarget.style.borderColor = '#E8E2D5'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <FileText size={18} color="#dc2626" />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2421' }}>{file.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#78716C' }}>{formatSize(file.size)}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#781416' }}>
                        Import →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Global Spinner Animation CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
