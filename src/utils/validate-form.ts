import { InputType } from 'src/types/models';

/**
 * Fonction pour valider un objet basé sur un formulaire
 * @param form - Tableau de champs définissant le formulaire
 * @param data - Objet JSON à valider
 * @returns {boolean | string[]} - Retourne `true` si tout est valide, sinon retourne un tableau d'erreurs
 */
export function validateForm(
  form: InputType[],
  data: Record<string, any>,
): boolean | string[] {
  const errors: string[] = [];

  form.forEach((field) => {
    const value = data[field.key];

    // Vérification des champs requis
    if (
      !field.isOptional &&
      (value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === ''))
    ) {
      errors.push(`Le champ "${field.verbose}" (${field.key}) est requis.`);
      return;
    }

    // Validation uniquement si le champ est présent
    if (value !== undefined && value !== null) {
      switch (field.type) {
        case 'text':
          if (typeof value !== 'string' || value.trim() === '') {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) doit être une chaîne de caractères non vide.`,
            );
          }
          break;
        case 'number':
          if (typeof value !== 'number') {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) doit être un nombre.`,
            );
          }
          break;
        case 'float':
          if (typeof value !== 'number') {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) doit être un nombre décimal.`,
            );
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) doit être un booléen.`,
            );
          }
          break;
        case 'select':
          if (!field.options?.some((opt) => opt.value === value)) {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) contient une valeur non valide.`,
            );
          }
          break;
        case 'multi-select':
          if (!Array.isArray(value)) {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) doit être un tableau.`,
            );
          } else if (
            !value.every((v) => field.options?.some((opt) => opt.value === v))
          ) {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) contient des valeurs non valides.`,
            );
          }
          break;
        case 'date':
          if (isNaN(Date.parse(value))) {
            errors.push(
              `Le champ "${field.verbose}" (${field.key}) doit être une date valide.`,
            );
          }
          break;
        case 'childrens':
          if (Array.isArray(field.childrens)) {
            const childErrors = validateForm(field.childrens, value || {});
            if (childErrors !== true && Array.isArray(childErrors)) {
              errors.push(...childErrors);
            }
          }
          break;
        default:
          errors.push(
            `Type de champ inconnu pour "${field.verbose}" (${field.key}).`,
          );
          break;
      }
    }
  });

  return errors.length === 0 ? true : errors;
}
