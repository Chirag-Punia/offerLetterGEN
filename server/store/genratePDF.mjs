import puppeteer from "puppeteer";

const generatePDF = async (htmlContent, pdfOptions = { format: "A4" }) => {
  let browser;
  try {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    
    browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: executablePath,
    });
    
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf(pdfOptions);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default generatePDF;
