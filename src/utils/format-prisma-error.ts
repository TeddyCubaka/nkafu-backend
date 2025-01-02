// utils/prismaErrorFormatter.ts
type PrismaError = {
  code?: string;
  message?: string;
  meta?: any;
  clientVersion?: string;
  [key: string]: any;
};

interface FormattedError {
  code: number;
  message: string;
  details: Record<string, any>;
  meta?: any;
}

export function formatPrismaError(error: PrismaError): FormattedError {
  let formattedError: FormattedError = {
    code: 400,
    message: "Une erreur s'est produite",
    details: {},
  };

  switch (error.code) {
    case 'P2002':
      formattedError = {
        code: 409,
        message: 'Un élément avec une valeur unique existe déjà',
        details: {
          fields: error.meta?.target,
        },
      };
      break;

    case 'P2025':
      formattedError = {
        code: 404,
        message: "L'enregistrement demandé n'existe pas",
        details: {
          cause: error.meta?.cause,
        },
      };
      break;

    case 'P2011':
      formattedError = {
        code: 400,
        message: 'Champ requis manquant',
        details: {
          field: error.meta?.target,
        },
      };
      break;

    case 'P2006':
      formattedError = {
        code: 400,
        message: 'Type de données invalide',
        details: {
          field: error.meta?.target,
        },
      };
      break;

    case 'P2003':
      formattedError = {
        code: 400,
        message: 'Violation de contrainte de clé étrangère',
        details: {
          field: error.meta?.field_name,
        },
      };
      break;

    case 'P2019':
      formattedError = {
        code: 400,
        message: 'Erreur de format JSON',
        details: {
          input: error.meta?.input,
        },
      };
      break;

    case 'P2007':
      formattedError = {
        code: 400,
        message: 'Erreur de validation des données',
        details: {
          field: error.meta?.field,
        },
      };
      break;
    case 'P2020':
      formattedError = {
        code: 400,
        message: 'Valeur numérique invalide',
        details: {
          field: error.meta?.field,
        },
      };
      break;
    case 'P2000':
      formattedError = {
        code: 400,
        message: 'La longueur de la valeur dépasse la limite autorisée',
        details: {
          field: error.meta?.target,
        },
      };
      break;
    default:
      const errorMessage = error.message?.toLowerCase() || '';

      if (errorMessage.includes('invalid')) {
        formattedError = {
          code: 400,
          message: 'Données invalides',
          details: {
            originalError: error.message,
          },
        };
      } else if (errorMessage.includes('failed to parse')) {
        formattedError = {
          code: 400,
          message: 'Erreur de format de données',
          details: {
            originalError: error.message,
          },
        };
      } else if (errorMessage.includes('unable to fit')) {
        formattedError = {
          code: 400,
          message: 'Valeur hors limites',
          details: {
            originalError: error.message,
          },
        };
      }
      break;
  }

  return { ...formattedError, meta: { errorMessage: error.message } };
}
