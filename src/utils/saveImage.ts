const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Assurez-vous d'avoir installé le package uuid avec npm install uuid

export default function saveImage(uploadPath, file) {
  // Assurez-vous que le chemin se termine par un slash pour éviter les problèmes
  uploadPath = `public/${uploadPath}`;
  if (!uploadPath.endsWith(path.sep)) {
    uploadPath += path.sep;
  }

  // Vérifiez si le répertoire existe, sinon créez-le
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Générer un nom de fichier unique avec UUID
  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(uploadPath, fileName);

  // Enregistrer le fichier sur le disque
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      console.error("Erreur lors de l'enregistrement du fichier:", err);
      throw err;
    }
    console.log(`Fichier enregistré avec succès à ${filePath}`);
  });

  // Retourner le chemin du fichier
  return `image/${filePath.split('/').slice(1).join('/')}`;
}
