import html2canvas from 'html2canvas'

if (typeof window !== 'undefined' && !window.html2canvas) {
  window.html2canvas = html2canvas
}
