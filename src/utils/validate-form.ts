import { InputType } from 'src/types/models';

export class DataFormatter {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Formate les données en fonction du type défini dans `inputType`.
   * @param data Les données à formater.
   * @param inputType Le type des données (structure de l'interface `InputType`).
   * @returns Les données formatées.
   * @throws Une erreur si une clé n'est pas convertible dans son type.
   */
  public formatData(data: any, inputType: InputType[]): any {
    const formattedData: any = {};

    for (const input of inputType) {
      const { proprety, type, isOptional } = input;

      // Vérifie si la clé existe dans les données
      if (!(proprety in data)) {
        if (isOptional) {
          continue; // Ignore les champs optionnels manquants
        } else {
          throw new Error(`Le champ "${proprety}" est requis.`);
        }
      }

      const value = data[proprety];

      // Gestion des types de base
      switch (type) {
        case 'text':
          formattedData[proprety] = this.convertToString(value, proprety);
          break;
        case 'number':
          formattedData[proprety] = this.convertToNumber(value, proprety);
          break;
        case 'float':
          formattedData[proprety] = this.convertToFloat(value, proprety);
          break;
        case 'boolean':
          formattedData[proprety] = this.convertToBoolean(value, proprety);
          break;
        case 'date':
          formattedData[proprety] = this.convertToDate(value, proprety);
          break;
        case 'select':
        case 'multi-select':
          formattedData[proprety] = this.convertToSelect(
            value,
            input,
            proprety,
          );
          break;
        case 'children':
          formattedData[proprety] = {
            create: this.handleChildren(value, inputType, proprety),
          };
          break;
        default:
          throw new Error(`Type non supporté pour la clé "${proprety}".`);
      }
    }

    return formattedData;
  }

  /**
   * Convertit une valeur en chaîne de caractères.
   * @param value La valeur à convertir.
   * @param key La clé associée (pour les messages d'erreur).
   * @returns La valeur convertie en chaîne de caractères.
   * @throws Une erreur si la conversion échoue.
   */
  private convertToString(value: any, key: string): string {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    throw new Error(
      `La valeur de "${key}" ne peut pas être convertie en texte.`,
    );
  }

  /**
   * Convertit une valeur en nombre.
   * @param value La valeur à convertir.
   * @param key La clé associée (pour les messages d'erreur).
   * @returns La valeur convertie en nombre.
   * @throws Une erreur si la conversion échoue.
   */
  private convertToNumber(value: any, key: string): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }
    throw new Error(
      `La valeur de "${key}" ne peut pas être convertie en nombre.`,
    );
  }

  /**
   * Convertit une valeur en nombre flottant.
   * @param value La valeur à convertir.
   * @param key La clé associée (pour les messages d'erreur).
   * @returns La valeur convertie en flottant.
   * @throws Une erreur si la conversion échoue.
   */
  private convertToFloat(value: any, key: string): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }
    throw new Error(
      `La valeur de "${key}" ne peut pas être convertie en flottant.`,
    );
  }

  /**
   * Convertit une valeur en booléen.
   * @param value La valeur à convertir.
   * @param key La clé associée (pour les messages d'erreur).
   * @returns La valeur convertie en booléen.
   * @throws Une erreur si la conversion échoue.
   */
  private convertToBoolean(value: any, key: string): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    throw new Error(
      `La valeur de "${key}" ne peut pas être convertie en booléen.`,
    );
  }

  /**
   * Convertit une valeur en date.
   * @param value La valeur à convertir.
   * @param key La clé associée (pour les messages d'erreur).
   * @returns La valeur convertie en date.
   * @throws Une erreur si la conversion échoue.
   */
  private convertToDate(value: any, key: string): Date {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    throw new Error(
      `La valeur de "${key}" ne peut pas être convertie en date.`,
    );
  }

  /**
   * Convertit une valeur en sélection (select ou multi-select).
   * @param value La valeur à convertir.
   * @param input Le type d'entrée (InputType).
   * @param key La clé associée (pour les messages d'erreur).
   * @returns La valeur convertie.
   * @throws Une erreur si la conversion échoue.
   */
  private convertToSelect(value: any, input: InputType, key: string): any {
    if (input.type === 'select') {
      if (input.options?.some((opt) => opt.value === value)) {
        return value;
      }
    } else if (input.type === 'multi-select') {
      if (
        Array.isArray(value) &&
        value.every((v) => input.options?.some((opt) => opt.value === v))
      ) {
        return value;
      }
    }
    throw new Error(
      `La valeur de "${key}" ne correspond pas aux options disponibles.`,
    );
  }

  /**
   * Gère les valeurs imbriquées (children).
   * @param value La valeur à convertir.
   * @param input Le type d'entrée (InputType).
   * @param key La clé associée (pour les messages d'erreur).
   * @returns Les valeurs imbriquées formatées.
   * @throws Une erreur si la conversion échoue.
   */
  private handleChildren(value: any, input: InputType[], key: string): any {
    if (!Array.isArray(value)) {
      throw new Error(`La valeur de "${key}" doit être un tableau.`);
    }

    // Si des types sont définis pour les enfants, on les utilise, sinon on utilise le type du parent
    const childInputType = input;

    return value.map((childData) => ({
      ...this.formatData(childData, childInputType),
      createdBy: this.userId,
    }));
  }
}
