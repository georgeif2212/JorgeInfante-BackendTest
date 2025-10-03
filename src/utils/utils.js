// Importamos módulos nativos de Node
import path from 'path';
import { fileURLToPath } from 'url';

// Convierte la URL del módulo actual en una ruta de archivo normal
const __filename = fileURLToPath(import.meta.url);

// Obtenemos la carpeta donde está el archivo actual
// Esto recrea __dirname en ES Modules, que no existe por defecto
export const __dirname = path.dirname(__filename);
