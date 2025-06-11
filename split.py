import os

# Configuraciones
input_file = r"C:\Users\nnznn\OneDrive\Documentos\Truthlens\ipa-dict-master\ipa-dict-master\data\es_MX.txt"
output_folder = r"C:\Users\nnznn\OneDrive\Documentos\Truthlens\ipa-dict-master\salida"
max_bytes = 1520000  # 1.5 MB

# Crear carpeta de salida si no existe
os.makedirs(output_folder, exist_ok=True)

# Variables de control
part_number = 1
current_size = 0
current_lines = []

# Procesar línea por línea
with open(input_file, "r", encoding="utf-8") as infile:
    for line in infile:
        encoded_line = line.encode("utf-8")
        line_size = len(encoded_line)

        if current_size + line_size > max_bytes:
            output_path = os.path.join(output_folder, f"es_MX_parte_{part_number:03}.txt")
            with open(output_path, "w", encoding="utf-8") as outfile:
                outfile.writelines(current_lines)
            part_number += 1
            current_lines = []
            current_size = 0

        current_lines.append(line)
        current_size += line_size

# Guardar la última parte
if current_lines:
    output_path = os.path.join(output_folder, f"es_MX_parte_{part_number:03}.txt")
    with open(output_path, "w", encoding="utf-8") as outfile:
        outfile.writelines(current_lines)

print(f"Archivo dividido en {part_number} partes en: {output_folder}")
