import xml.etree.ElementTree as ET
from pathlib import Path

# Ruta de la carpeta con los txt
data_dir = Path(r"C:\Users\nnznn\OneDrive\Documentos\Truthlens\ipa-dict-master\ipa-dict-master\data")

# Procesar cada archivo .txt
for txt_file in data_dir.glob("*.txt"):
    output_file = txt_file.with_suffix(".pls")
    seen = set()
    
    # Crear estructura XML
    lexicon = ET.Element("lexicon", {
        "version": "1.0",
        "xmlns": "http://www.w3.org/2005/01/pronunciation-lexicon"
    })
    
    try:
        with txt_file.open("r", encoding="utf-8") as f:
            for line in f:
                if '\t' not in line:
                    continue
                grapheme, phoneme = line.strip().split('\t', 1)
                key = (grapheme.lower(), phoneme)
                if not grapheme or not phoneme or key in seen:
                    continue
                seen.add(key)
                lexeme = ET.SubElement(lexicon, "lexeme")
                ET.SubElement(lexeme, "grapheme").text = grapheme
                ET.SubElement(lexeme, "phoneme").text = phoneme
        
        # Guardar el archivo XML final
        tree = ET.ElementTree(lexicon)
        tree.write(output_file, encoding="utf-8", xml_declaration=True)
        print(f"✅ Generado: {output_file.name}")
    
    except Exception as e:
        print(f"❌ Error con {txt_file.name}: {e}")
