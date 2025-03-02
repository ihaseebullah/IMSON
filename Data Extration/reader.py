import argparse
import pytesseract
from PIL import Image
import pdf2image
import os


def extract_text_from_pdf(pdf_path, output_dir):
    # Convert PDF to images
    images = pdf2image.convert_from_path(pdf_path)
    extracted_text = ''

    # Extract text from each image using Tesseract
    for i, image in enumerate(images):
        # Perform OCR
        text = pytesseract.image_to_string(image)
        extracted_text += f'Page {i+1} text:\n{text}\n\n'
        print(f'Page {i+1} processed')

    # Write extracted text to a file
    output_file_path = os.path.join(output_dir, 'output.txt')
    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        output_file.write(extracted_text)

    print(f'Extracted text saved to {output_file_path}')

def main():
    # Create argument parser
    parser = argparse.ArgumentParser(description='Extract text from a PDF file using OCR Developed by Haseeb Ullah')
    parser.add_argument('pdf_path', type=str, help='Path to the PDF file')
    parser.add_argument('-o', '--output-dir', type=str, default='extracted_data', help='Output directory for extracted text')
    
    # Parse command-line arguments
    args = parser.parse_args()

    # Create the output directory if it doesn't exist
    os.makedirs(args.output_dir, exist_ok=True)

    # Call function to extract text from PDF
    extract_text_from_pdf(args.pdf_path, args.output_dir)

if __name__ == "__main__":
    main()
