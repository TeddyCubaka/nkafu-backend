import * as bcrypt from 'bcrypt';

export class Utils {
  validateRequestBody(
    body: { [key: string]: any },
    types: { [key: string]: string | string[] },
  ): {
    isFailed: Boolean;
    missedKeys: string[];
    badFormatedKeys: { key: string; message: string }[];
  } {
    let missedKeys: string[] = [];
    let badFormatedKeys: { key: string; message: string }[] = [];

    for (let field in types) {
      if (!(field in body)) {
        missedKeys.push(field);
      } else {
        let fieldTypeIsCorrect = false;

        if (Array.isArray(types[field])) {
          fieldTypeIsCorrect = (types[field] as string[]).some(
            (type) => typeof body[field] === type,
          );
        } else {
          fieldTypeIsCorrect = typeof body[field] === types[field];
        }

        if (!fieldTypeIsCorrect) {
          badFormatedKeys.push({
            key: field,
            message: `Le champ ${field} doit être de type ${Array.isArray(types[field]) ? types[field].join(' ou ') : types[field]}.`,
          });
        }
      }
    }

    return {
      missedKeys,
      badFormatedKeys,
      isFailed: missedKeys.length > 0 && badFormatedKeys.length > 0,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
