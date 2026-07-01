from docx import Document

doc = Document('proposal_bp_final_rapi_BAB.docx')

print("=== BAB III CONTENT ===")
for i in range(130, 180):
    para = doc.paragraphs[i]
    text = para.text.strip()
    if text and len(text) < 100:
        print(f"[{i}] {text}")
